import { io, Socket } from 'socket.io-client';
import EventEmitter from 'events';

export interface TestResult {
  id: string;
  type: 'cypress' | 'playwright';
  name: string;
  status: 'running' | 'passed' | 'failed' | 'pending';
  screenshot?: string;
  error?: string;
  duration?: number;
  startTime: Date;
  endTime?: Date;
}

class TestRunnerService extends EventEmitter {
  private socket: Socket | null = null;
  private testResults: Map<string, TestResult> = new Map();
  private isConnected: boolean = false;

  constructor() {
    super();
    this.initSocket();
  }

  private initSocket() {
    try {
      this.socket = io('http://localhost:3001');

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.emit('connection', { status: 'connected' });
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        this.emit('connection', { status: 'disconnected' });
      });

      this.socket.on('test:start', (test: TestResult) => {
        this.testResults.set(test.id, test);
        this.emit('testUpdate', { action: 'start', test });
      });

      this.socket.on('test:update', (test: TestResult) => {
        this.testResults.set(test.id, test);
        this.emit('testUpdate', { action: 'update', test });
      });

      this.socket.on('test:end', (test: TestResult) => {
        this.testResults.set(test.id, test);
        this.emit('testUpdate', { action: 'end', test });
      });

      this.socket.on('test:log', (data: { testId: string; message: string }) => {
        this.emit('testLog', data);
      });

      this.socket.on('test:screenshot', (data: { testId: string; screenshot: string }) => {
        const test = this.testResults.get(data.testId);
        if (test) {
          test.screenshot = data.screenshot;
          this.testResults.set(data.testId, test);
          this.emit('testUpdate', { action: 'screenshot', test });
        }
      });
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getAllTests(): TestResult[] {
    return Array.from(this.testResults.values());
  }

  public getTestById(id: string): TestResult | undefined {
    return this.testResults.get(id);
  }

  public runCypressTest(spec: string): Promise<string> {
    return this.runCommand(`cypress run --spec "${spec}"`);
  }

  public runPlaywrightTest(spec: string): Promise<string> {
    return this.runCommand(`playwright test "${spec}"`);
  }

  public runCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const commandId = Date.now().toString();
      this.socket.emit('command:run', { id: commandId, command });

      const handleCommandComplete = (data: { id: string; result: string }) => {
        if (data.id === commandId) {
          this.socket?.off('command:complete', handleCommandComplete);
          resolve(data.result);
        }
      };

      this.socket.on('command:complete', handleCommandComplete);

      // Timeout after 30 seconds
      setTimeout(() => {
        this.socket?.off('command:complete', handleCommandComplete);
        reject(new Error('Command timed out'));
      }, 30000);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Export as singleton instance
export const testRunnerService = new TestRunnerService();
export default testRunnerService;
