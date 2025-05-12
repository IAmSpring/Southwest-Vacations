import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn } from 'child_process';
import { createReadStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3001;
const BASE_DIR = path.join(__dirname, '..');

// Create HTTP server and Socket.IO instance
const httpServer = createServer((req, res) => {
  // Serve a simple status page
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Runner Server</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
            .online { background-color: #d4edda; color: #155724; }
            .info { background-color: #d1ecf1; color: #0c5460; }
          </style>
        </head>
        <body>
          <h1>Test Runner Server</h1>
          <div class="status online">Server is running on port ${PORT}</div>
          <div class="status info">Connect to this server from your visualization component to see test results in real-time.</div>
          <p>For documentation and integration instructions, see the repository README.</p>
        </body>
      </html>
    `);
  } else if (req.url?.startsWith('/screenshots/')) {
    // Serve screenshot files
    const screenshotPath = path.join(BASE_DIR, req.url);
    try {
      const stream = createReadStream(screenshotPath);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      stream.pipe(res);
    } catch (error) {
      res.writeHead(404);
      res.end('Screenshot not found');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Track active test runs
const activeTests = new Map();
let nextTestId = 1;

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current active tests to the new client
  activeTests.forEach(test => {
    socket.emit('test:start', test);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Handle command execution request
  socket.on('command:run', async (data) => {
    const { id, command } = data;
    console.log(`Executing command: ${command}`);
    
    try {
      const result = await executeCommand(command, socket);
      socket.emit('command:complete', { id, result });
    } catch (error) {
      socket.emit('command:complete', { id, result: `Error: ${error.message}` });
    }
  });
});

// Execute a shell command and capture output
function executeCommand(command, socket) {
  return new Promise((resolve, reject) => {
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    
    let output = '';
    const process = spawn(cmd, args, { 
      cwd: BASE_DIR,
      shell: true
    });
    
    // Generate a unique test ID if this is a test command
    const isTestCommand = command.includes('cypress') || command.includes('playwright');
    let testId = null;
    
    if (isTestCommand) {
      testId = `test-${nextTestId++}`;
      const testName = extractTestName(command);
      const testType = command.includes('cypress') ? 'cypress' : 'playwright';
      
      const testInfo = {
        id: testId,
        type: testType,
        name: testName,
        status: 'running',
        startTime: new Date(),
      };
      
      activeTests.set(testId, testInfo);
      socket.emit('test:start', testInfo);
      io.emit('test:start', testInfo);
    }
    
    process.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      
      if (testId) {
        socket.emit('test:log', { testId, message: chunk });
        io.emit('test:log', { testId, message: chunk });
        
        // Check for screenshot paths in Cypress output
        if (chunk.includes('Screenshot captured')) {
          const match = chunk.match(/Screenshot captured at "(.*?)"/);
          if (match && match[1]) {
            const screenshotPath = match[1];
            const relativePath = path.relative(BASE_DIR, screenshotPath);
            const url = `/screenshots/${relativePath}`;
            
            socket.emit('test:screenshot', { testId, screenshot: url });
            io.emit('test:screenshot', { testId, screenshot: url });
          }
        }
        
        // Check for test status updates
        if (chunk.includes('✓') || chunk.includes('Test Passed')) {
          updateTestStatus(testId, 'passed', socket);
        } else if (chunk.includes('✗') || chunk.includes('Test Failed')) {
          updateTestStatus(testId, 'failed', socket);
        }
      }
    });
    
    process.stderr.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      
      if (testId) {
        socket.emit('test:log', { testId, message: chunk });
        io.emit('test:log', { testId, message: chunk });
        
        // Check for error indicators
        if (chunk.includes('Error:') || chunk.includes('Failed')) {
          const testInfo = activeTests.get(testId);
          if (testInfo) {
            testInfo.error = chunk;
            testInfo.status = 'failed';
            socket.emit('test:update', testInfo);
            io.emit('test:update', testInfo);
          }
        }
      }
    });
    
    process.on('close', (code) => {
      if (testId) {
        const testInfo = activeTests.get(testId);
        if (testInfo) {
          testInfo.endTime = new Date();
          testInfo.duration = testInfo.endTime.getTime() - testInfo.startTime.getTime();
          
          // If status hasn't been set already, set based on exit code
          if (testInfo.status === 'running') {
            testInfo.status = code === 0 ? 'passed' : 'failed';
          }
          
          socket.emit('test:end', testInfo);
          io.emit('test:end', testInfo);
        }
      }
      
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      if (testId) {
        updateTestStatus(testId, 'failed', socket, error.message);
      }
      reject(error);
    });
  });
}

// Update the status of a test
function updateTestStatus(testId, status, socket, error = null) {
  const testInfo = activeTests.get(testId);
  if (testInfo) {
    testInfo.status = status;
    if (error) {
      testInfo.error = error;
    }
    socket.emit('test:update', testInfo);
    io.emit('test:update', testInfo);
  }
}

// Extract test name from command
function extractTestName(command) {
  const specArgIndex = command.indexOf('--spec');
  if (specArgIndex !== -1) {
    const specPath = command.slice(specArgIndex + 7).split(' ')[0].replace(/"/g, '');
    return path.basename(specPath);
  }
  
  const quotedPaths = command.match(/"([^"]+)\.spec\.ts"/);
  if (quotedPaths) {
    return path.basename(quotedPaths[1]);
  }
  
  return 'Unknown Test';
}

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Test Runner Server started on port ${PORT}`);
});

// Listen for process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 