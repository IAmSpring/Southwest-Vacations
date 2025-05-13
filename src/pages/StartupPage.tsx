import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Define CSS for animations
const animationStyles = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes scale-in {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-success {
    animation: scale-in 0.5s ease-out forwards;
  }
`;

const StartupPage: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [services, setServices] = useState({
    frontend: { status: 'initializing', message: 'Starting frontend services...' },
    backend: { status: 'initializing', message: 'Starting backend services...' },
    testServer: { status: 'initializing', message: 'Starting test visualization server...' },
  });
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Starting application initialization...`,
  ]);

  useEffect(() => {
    // Configure logging
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    // Override console methods to capture logs
    console.log = (...args) => {
      originalConsoleLog(...args);
      addLog('LOG', args.join(' '));
    };
    console.error = (...args) => {
      originalConsoleError(...args);
      addLog('ERROR', args.join(' '));
    };
    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addLog('WARN', args.join(' '));
    };
    console.info = (...args) => {
      originalConsoleInfo(...args);
      addLog('INFO', args.join(' '));
    };

    const startupSequence = async () => {
      // Simulate frontend initialization
      addLog('INFO', 'Initializing frontend services...');
      await simulateServiceStartup('frontend', 'Starting React application', 500);
      await simulateServiceStartup('frontend', 'Loading components', 700);
      await simulateServiceStartup('frontend', 'Initializing context providers', 600);
      setServices(prev => ({
        ...prev,
        frontend: { status: 'ready', message: 'Frontend services ready' },
      }));
      addLog('SUCCESS', 'Frontend services ready ✅');

      // Simulate backend initialization
      addLog('INFO', 'Initializing backend services...');
      await simulateServiceStartup('backend', 'Connecting to backend API', 800);
      await simulateServiceStartup('backend', 'Loading data models', 900);
      await simulateServiceStartup('backend', 'Initializing mock data', 1000);
      setServices(prev => ({
        ...prev,
        backend: { status: 'ready', message: 'Backend services ready' },
      }));
      addLog('SUCCESS', 'Backend services ready ✅');

      // Simulate test server initialization
      addLog('INFO', 'Initializing test visualization server...');
      await simulateServiceStartup('testServer', 'Starting test server', 700);
      await simulateServiceStartup('testServer', 'Connecting to Cypress', 800);
      await simulateServiceStartup('testServer', 'Connecting to Playwright', 800);
      setServices(prev => ({
        ...prev,
        testServer: { status: 'ready', message: 'Test visualization server ready' },
      }));
      addLog('SUCCESS', 'Test visualization server ready ✅');

      // All services are ready - show success animation
      addLog('SUCCESS', 'Application initialization complete! Redirecting to home page...');

      // Begin transition sequence
      setFadeOut(true); // Start fade out animation

      // After fade out, show success checkmark
      setTimeout(() => {
        setShowSuccess(true);
      }, 800);

      // After showing success, redirect
      setTimeout(() => {
        setShowSuccess(false);
        setIsReady(true);
      }, 2500);
    };

    startupSequence();

    // Restore original console methods on cleanup
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
    };
  }, []);

  const addLog = (level: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    setLogs(prev => [...prev, logEntry]);
  };

  const simulateServiceStartup = async (service: string, statusMessage: string, delay: number) => {
    setServices(prev => ({
      ...prev,
      [service]: { status: 'initializing', message: statusMessage },
    }));

    addLog('INFO', `${service}: ${statusMessage}`);
    return new Promise<void>(resolve => setTimeout(resolve, delay));
  };

  // Redirect when ready
  if (isReady) {
    return <Navigate to="/home" replace />;
  }

  // Success checkmark screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-blue-800 text-white">
        <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
        <div className="animate-success text-center">
          <svg
            className="mx-auto h-32 w-32 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="mt-4 text-3xl font-bold">Ready!</h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen flex-col bg-gray-100 transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="flex flex-grow items-center justify-center p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
          <div className="bg-blue-800 p-6 text-white">
            <h1 className="text-3xl font-bold">Southwest Vacations</h1>
            <p className="mt-2 text-blue-100">Test Environment Initialization</p>
          </div>

          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">System Startup</h2>

            <div className="grid gap-4">
              {Object.entries(services).map(([key, service]) => (
                <div
                  key={key}
                  className="rounded-md border p-4 transition-all duration-300"
                  style={{
                    boxShadow:
                      service.status === 'ready' ? '0 0 0 2px rgba(16, 185, 129, 0.5)' : 'none',
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                    <div className="flex items-center">
                      {service.status === 'initializing' ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                          <span className="text-sm text-blue-600">Initializing</span>
                        </>
                      ) : service.status === 'ready' ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-pulse rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium text-green-600">Ready</span>
                        </>
                      ) : (
                        <>
                          <div className="mr-2 h-4 w-4 rounded-full bg-red-500"></div>
                          <span className="text-sm text-red-600">Error</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{service.message}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-medium">System Log</h3>
              <div className="h-40 overflow-y-auto rounded-md bg-gray-900 p-4 font-mono text-sm text-gray-100">
                {logs.map((log, index) => {
                  const isError = log.includes('[ERROR]');
                  const isWarning = log.includes('[WARN]');
                  const isSuccess = log.includes('[SUCCESS]');

                  return (
                    <div
                      key={index}
                      className={`mb-1 ${
                        isError
                          ? 'text-red-400'
                          : isWarning
                            ? 'text-yellow-400'
                            : isSuccess
                              ? 'text-green-400'
                              : ''
                      }`}
                    >
                      {log}
                    </div>
                  );
                })}
                {!isReady && !fadeOut && (
                  <div className="inline-block h-4 w-2 animate-pulse bg-gray-100"></div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {fadeOut
                    ? 'All services ready! Preparing application...'
                    : 'Please wait while services are starting up...'}
                </p>
              </div>

              <div className="h-2.5 w-40 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-blue-600 transition-all duration-500 ease-out"
                  style={{
                    width: `${
                      (Object.values(services).filter(s => s.status === 'ready').length /
                        Object.values(services).length) *
                      100
                    }%`,
                    animation: Object.values(services).every(s => s.status === 'ready')
                      ? 'pulse 1.5s infinite'
                      : 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t bg-white py-3 text-center text-sm text-gray-600">
        Southwest Vacations Test Environment &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default StartupPage;
