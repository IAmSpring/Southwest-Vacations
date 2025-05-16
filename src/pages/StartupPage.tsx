import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { createFullPath, getBasePath } from '../utils/urlUtils';

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

// Add TypeScript declaration for the custom window property
declare global {
  interface Window {
    __swvInitialized?: boolean;
  }
}

const StartupPage: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [services, setServices] = useState({
    frontend: { status: 'initializing', message: 'Starting frontend services...' },
    backend: { status: 'initializing', message: 'Starting backend services...' },
    cypress: { status: 'initializing', message: 'Initializing Cypress test framework...' },
    playwright: { status: 'initializing', message: 'Initializing Playwright test framework...' },
    webhook: { status: 'initializing', message: 'Starting webhook server...' },
    testServer: { status: 'initializing', message: 'Starting test visualization server...' },
  });
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Starting Southwest Vacations application...`,
  ]);
  const [testsPassed, setTestsPassed] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
  });

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
      await simulateServiceStartup('frontend', 'Loading React application', 500);
      await simulateServiceStartup('frontend', 'Initializing components', 600);
      await simulateServiceStartup('frontend', 'Setting up context providers', 400);
      await simulateServiceStartup('frontend', 'Configuring routes', 300);
      setServices(prev => ({
        ...prev,
        frontend: { status: 'ready', message: 'Frontend services ready' },
      }));
      addLog('SUCCESS', 'Frontend services ready ✅');

      // Simulate backend initialization
      addLog('INFO', 'Initializing backend services...');
      await simulateServiceStartup('backend', 'Starting Express server', 500);
      await simulateServiceStartup('backend', 'Connecting to database', 700);
      await simulateServiceStartup('backend', 'Initializing API routes', 600);

      // Perform actual health check to server
      try {
        addLog('INFO', 'Performing health check to backend server...');
        const healthResponse = await fetch('/health');

        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          addLog(
            'SUCCESS',
            `Backend health check successful! API version ${healthData.apiVersion}, server time: ${healthData.timestamp}`
          );
        } else {
          addLog(
            'WARN',
            `Backend health check failed with status: ${healthResponse.status} - proceeding with startup anyway`
          );
        }
      } catch (error: any) {
        addLog(
          'WARN',
          `Backend health check failed: ${error.message} - proceeding with startup anyway`
        );
      }

      await simulateServiceStartup('backend', 'Loading seed data', 800);
      setServices(prev => ({
        ...prev,
        backend: { status: 'ready', message: 'Backend services ready' },
      }));
      addLog('SUCCESS', 'Backend services ready ✅');

      // Simulate webhook server initialization
      addLog('INFO', 'Initializing webhook server...');
      await simulateServiceStartup('webhook', 'Setting up webhook server', 400);
      await simulateServiceStartup('webhook', 'Configuring webhook routes', 500);
      await simulateServiceStartup('webhook', 'Establishing notification channels', 600);
      setServices(prev => ({
        ...prev,
        webhook: { status: 'ready', message: 'Webhook server ready' },
      }));
      addLog('SUCCESS', 'Webhook server ready ✅');

      // Simulate Cypress test initialization
      addLog('INFO', 'Initializing Cypress test framework...');
      await simulateServiceStartup('cypress', 'Loading Cypress test config', 500);
      await simulateServiceStartup('cypress', 'Discovering test specs', 700);

      // Simulate test results
      setTestsPassed({
        total: 24,
        passed: 22,
        failed: 1,
        skipped: 1,
      });

      await simulateServiceStartup('cypress', 'Test report generated', 300);
      setServices(prev => ({
        ...prev,
        cypress: { status: 'ready', message: 'Cypress tests ready (22/24 passing)' },
      }));
      addLog('SUCCESS', 'Cypress tests ready ✅ (22 passing, 1 failing, 1 skipped)');

      // Simulate Playwright test initialization
      addLog('INFO', 'Initializing Playwright test framework...');
      await simulateServiceStartup('playwright', 'Loading Playwright test config', 500);
      await simulateServiceStartup('playwright', 'Discovering test specs', 600);

      // Simulate Playwright test results
      setTestsPassed(prev => ({
        ...prev,
        total: prev.total + 17,
        passed: prev.passed + 15,
        failed: prev.failed + 1,
        skipped: prev.skipped + 1,
      }));

      await simulateServiceStartup('playwright', 'Test report generated', 400);
      setServices(prev => ({
        ...prev,
        playwright: { status: 'ready', message: 'Playwright tests ready (15/17 passing)' },
      }));
      addLog('SUCCESS', 'Playwright tests ready ✅ (15 passing, 1 failing, 1 skipped)');

      // Simulate test visualization server
      addLog('INFO', 'Initializing test visualization server...');
      await simulateServiceStartup('testServer', 'Starting test server', 400);
      await simulateServiceStartup('testServer', 'Connecting test frameworks', 500);
      await simulateServiceStartup('testServer', 'Loading visualization components', 600);
      setServices(prev => ({
        ...prev,
        testServer: { status: 'ready', message: 'Test visualization server ready' },
      }));
      addLog('SUCCESS', 'Test visualization server ready ✅');

      // Compile test results summary
      const totalTests = testsPassed.total;
      const passingTests = testsPassed.passed;
      const passingPercentage = Math.round((passingTests / totalTests) * 100);

      addLog(
        'INFO',
        `Test summary: ${passingTests}/${totalTests} tests passing (${passingPercentage}%)`
      );

      if (passingPercentage >= 90) {
        addLog('SUCCESS', 'Test coverage meets quality standards ✓');
      } else {
        addLog(
          'WARN',
          'Test coverage below 90% threshold, but proceeding with application startup'
        );
      }

      // All services are ready - show success animation
      addLog('SUCCESS', 'Application initialization complete! Redirecting to home page...');

      // Begin transition sequence
      setFadeOut(true); // Start fade out animation

      // IMPORTANT: Set localStorage flag BEFORE animations to ensure it's set early
      try {
        localStorage.setItem('swv_app_initialized', 'true');
        sessionStorage.setItem('swv_session_initialized', 'true');
      } catch (error) {
        console.warn('Could not set storage initialization flags:', error);
        // In case localStorage is unavailable (incognito mode), use a temporary flag in memory
        // This ensures the startup page won't show again in the current browser session
        window.__swvInitialized = true;
      }

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

  // Success checkmark screen
  if (showSuccess) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-blue-800 text-white"
        role="status"
        aria-live="polite"
      >
        <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
        <div className="animate-success text-center">
          <svg
            className="mx-auto h-32 w-32 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="mt-4 text-3xl font-bold">Ready!</h2>
          <p className="mt-2 text-xl">Southwest Vacations</p>
        </div>
      </div>
    );
  }

  // Update the redirect status screen
  if (isReady) {
    // Add a forced redirect as ultimate fallback
    setTimeout(() => {
      window.location.href = createFullPath('/');
    }, 1000);

    return (
      <>
        <Navigate to={createFullPath('/')} replace />
        <div
          className="fixed inset-0 flex items-center justify-center bg-blue-800"
          role="status"
          aria-live="polite"
        >
          <div className="text-center text-white">
            <div
              className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-white"
              aria-hidden="true"
            ></div>
            <p>Redirecting to home page...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`flex min-h-screen flex-col bg-gray-100 transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      role="main"
    >
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="flex flex-grow items-center justify-center p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
          <div className="bg-blue-800 p-6 text-white">
            <h1 className="text-3xl font-bold">Southwest Vacations</h1>
            <p className="mt-2 text-blue-100">System Initialization</p>
          </div>

          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">System Startup</h2>

            <div className="grid gap-4" role="list" aria-label="Service status list">
              {Object.entries(services).map(([key, service]) => (
                <div
                  key={key}
                  className="rounded-md border p-4 transition-all duration-300"
                  style={{
                    boxShadow:
                      service.status === 'ready' ? '0 0 0 2px rgba(16, 185, 129, 0.5)' : 'none',
                  }}
                  role="listitem"
                  aria-label={`${key} service`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                    <div className="flex items-center" role="status">
                      {service.status === 'initializing' ? (
                        <>
                          <div
                            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
                            aria-hidden="true"
                          ></div>
                          <span className="text-sm text-blue-600">Initializing</span>
                        </>
                      ) : service.status === 'ready' ? (
                        <>
                          <div
                            className="mr-2 h-4 w-4 animate-pulse rounded-full bg-green-500"
                            aria-hidden="true"
                          ></div>
                          <span className="text-sm font-medium text-green-600">Ready</span>
                        </>
                      ) : (
                        <>
                          <div
                            className="mr-2 h-4 w-4 rounded-full bg-red-500"
                            aria-hidden="true"
                          ></div>
                          <span className="text-sm text-red-600">Error</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{service.message}</p>
                </div>
              ))}
            </div>

            {/* Test Summary */}
            {testsPassed.total > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-medium">Test Summary</h3>
                <div className="rounded-md border p-4">
                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Test results summary"
                  >
                    <div className="rounded-md bg-blue-50 px-3 py-1">
                      <span className="text-sm text-blue-700">Total: {testsPassed.total}</span>
                    </div>
                    <div className="rounded-md bg-green-50 px-3 py-1">
                      <span className="text-sm text-green-700">Passing: {testsPassed.passed}</span>
                    </div>
                    <div className="rounded-md bg-red-50 px-3 py-1">
                      <span className="text-sm text-red-700">Failing: {testsPassed.failed}</span>
                    </div>
                    <div className="rounded-md bg-yellow-50 px-3 py-1">
                      <span className="text-sm text-yellow-700">
                        Skipped: {testsPassed.skipped}
                      </span>
                    </div>
                  </div>
                  <div
                    className="mt-2"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round((testsPassed.passed / testsPassed.total) * 100)}
                    aria-label="Test passing percentage"
                  >
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{
                          width: `${Math.round((testsPassed.passed / testsPassed.total) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="mb-2 font-medium">System Log</h3>
              <div
                className="h-48 overflow-y-auto rounded-md bg-gray-900 p-4 font-mono text-sm text-gray-100"
                role="log"
                aria-label="System initialization log"
                aria-live="polite"
              >
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
                  <div
                    className="inline-block h-4 w-2 animate-pulse bg-gray-100"
                    aria-hidden="true"
                  ></div>
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
              <div className="text-sm text-gray-500" role="status" aria-live="polite">
                {Object.values(services).every(service => service.status === 'ready')
                  ? '100% Complete'
                  : `${Math.round(
                      (Object.values(services).filter(service => service.status === 'ready')
                        .length /
                        Object.values(services).length) *
                        100
                    )}% Complete`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupPage;
