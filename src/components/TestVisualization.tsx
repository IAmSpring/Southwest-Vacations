import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface TestResult {
  id: string;
  name: string;
  status: 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
  screenshot?: string;
  framework: 'cypress' | 'playwright';
  timestamp: number;
}

interface TestVisualizationProps {
  height?: string;
}

const TestVisualization: React.FC<TestVisualizationProps> = ({ height = '500px' }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'cypress' | 'playwright'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'passed' | 'failed'>('all');

  useEffect(() => {
    // Connect to the test server on port 3333
    let socket: any;

    try {
      socket = io('http://localhost:3333');

      socket.on('connect', () => {
        console.log('Connected to test server');
        setConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from test server');
        setConnected(false);
      });

      socket.on('test:start', (test: TestResult) => {
        setTestResults(prev => {
          // Check if the test already exists (by ID)
          const index = prev.findIndex(t => t.id === test.id);
          if (index >= 0) {
            // Replace the existing test
            const updated = [...prev];
            updated[index] = test;
            return updated;
          }
          // Add new test
          return [...prev, test];
        });
      });

      socket.on('test:update', (test: TestResult) => {
        setTestResults(prev => {
          const updated = [...prev];
          const index = updated.findIndex(t => t.id === test.id);
          if (index >= 0) {
            updated[index] = { ...updated[index], ...test };
          }
          return updated;
        });
      });

      socket.on('test:end', (test: TestResult) => {
        setTestResults(prev => {
          const updated = [...prev];
          const index = updated.findIndex(t => t.id === test.id);
          if (index >= 0) {
            updated[index] = test;
          }
          return updated;
        });
      });

      socket.on('test:screenshot', (data: { testId: string; screenshot: string }) => {
        setTestResults(prev => {
          const updated = [...prev];
          const index = updated.findIndex(t => t.id === data.testId);
          if (index >= 0) {
            updated[index] = { ...updated[index], screenshot: data.screenshot };
          }
          return updated;
        });
      });
    } catch (error) {
      console.error('Failed to connect to test server:', error);
    }

    // Mock some test data for development
    if (process.env.NODE_ENV !== 'production') {
      setTimeout(() => {
        const mockTests: TestResult[] = [
          {
            id: '1',
            name: 'Login page should display form',
            status: 'passed',
            duration: 1200,
            framework: 'cypress',
            timestamp: Date.now() - 5000,
          },
          {
            id: '2',
            name: 'Should navigate to home page after login',
            status: 'running',
            framework: 'cypress',
            timestamp: Date.now() - 3000,
          },
          {
            id: '3',
            name: 'Should display error for invalid credentials',
            status: 'failed',
            duration: 850,
            error: 'Expected element to be visible but it was not found in DOM',
            framework: 'cypress',
            timestamp: Date.now() - 2000,
          },
          {
            id: '4',
            name: 'Flight search should return results',
            status: 'passed',
            duration: 3200,
            framework: 'playwright',
            timestamp: Date.now() - 1000,
          },
        ];
        setTestResults(mockTests);
      }, 1000);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const filteredTests = testResults
    .filter(test => filter === 'all' || test.framework === filter)
    .filter(test => statusFilter === 'all' || test.status === statusFilter)
    .sort((a, b) => b.timestamp - a.timestamp);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'running':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex h-full flex-col" style={{ height }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">Framework:</span>
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
              value={filter}
              onChange={e => setFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="cypress">Cypress</option>
              <option value="playwright">Playwright</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">Status:</span>
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="running">Running</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className={`mr-2 h-3 w-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
          ></div>
          <span className="text-sm text-gray-600">
            {connected ? 'Connected to Test Server' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden rounded-md border">
        <div className="w-1/2 overflow-y-auto border-r">
          <div className="divide-y">
            {filteredTests.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No test results to display</div>
            ) : (
              filteredTests.map(test => (
                <div
                  key={test.id}
                  className={`cursor-pointer p-4 hover:bg-gray-50 ${selectedTest?.id === test.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedTest(test)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="mb-1 flex items-center">
                        <span
                          className={`mr-2 inline-block h-3 w-3 rounded-full ${getStatusColor(test.status)}`}
                        ></span>
                        <span className="font-medium">{test.name}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2 rounded-full bg-gray-100 px-2 py-0.5 capitalize">
                          {test.framework}
                        </span>
                        {test.duration && <span>{(test.duration / 1000).toFixed(2)}s</span>}
                        {test.status === 'running' && (
                          <span className="ml-2 flex items-center">
                            <svg className="mr-1 h-3 w-3 animate-spin" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Running
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`rounded-full px-2 py-1 text-xs ${
                        test.status === 'passed'
                          ? 'bg-green-100 text-green-800'
                          : test.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : test.status === 'running'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-1/2 overflow-y-auto p-4">
          {selectedTest ? (
            <div>
              <h3 className="mb-2 text-lg font-semibold">{selectedTest.name}</h3>

              <div className="mb-4">
                <div className="mb-1 flex items-center">
                  <span className="mr-2 text-sm font-medium">Status:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-sm ${
                      selectedTest.status === 'passed'
                        ? 'bg-green-100 text-green-800'
                        : selectedTest.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : selectedTest.status === 'running'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {selectedTest.status.charAt(0).toUpperCase() + selectedTest.status.slice(1)}
                  </span>
                </div>

                <div className="mb-1 flex items-center">
                  <span className="mr-2 text-sm font-medium">Framework:</span>
                  <span className="text-sm capitalize">{selectedTest.framework}</span>
                </div>

                {selectedTest.duration && (
                  <div className="mb-1 flex items-center">
                    <span className="mr-2 text-sm font-medium">Duration:</span>
                    <span className="text-sm">{(selectedTest.duration / 1000).toFixed(2)}s</span>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">Time:</span>
                  <span className="text-sm">
                    {new Date(selectedTest.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {selectedTest.error && (
                <div className="mb-4">
                  <h4 className="mb-1 text-sm font-medium">Error:</h4>
                  <div className="whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 p-3 font-mono text-sm text-red-800">
                    {selectedTest.error}
                  </div>
                </div>
              )}

              {selectedTest.screenshot && (
                <div>
                  <h4 className="mb-1 text-sm font-medium">Screenshot:</h4>
                  <img
                    src={selectedTest.screenshot}
                    alt="Test screenshot"
                    className="h-auto max-w-full rounded-md border"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Select a test to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestVisualization;
