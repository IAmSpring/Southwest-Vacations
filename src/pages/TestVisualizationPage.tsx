import React, { useState } from 'react';
import TestVisualization from '../components/TestVisualization';

const TestVisualizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visualization' | 'commands'>('visualization');
  const [command, setCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandOutput, setCommandOutput] = useState<string>('');

  const handleRunCommand = () => {
    if (!command.trim()) return;

    setCommandHistory(prev => [...prev, command]);
    setCommandOutput(prev => `${prev ? prev + '\n\n' : ''}$ ${command}\nExecuting command...\n`);

    // Mock command execution
    setTimeout(() => {
      let output = '';

      if (command.includes('cypress')) {
        output = 'Starting Cypress...\nOpening test runner...\nFound 20 test files';
      } else if (command.includes('playwright')) {
        output =
          'Running Playwright tests...\nUsing browsers: chromium, firefox\nRunning 12 tests in 2 projects';
      } else if (command.startsWith('npm run')) {
        output =
          'npm info: Running script...\n> Starting development server\nCompiled successfully!';
      } else {
        output = 'Command executed successfully';
      }

      setCommandOutput(prev => `${prev}${output}`);
    }, 1500);

    setCommand('');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Test Runner Dashboard</h1>

      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`border-b-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'visualization'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('visualization')}
            >
              Visualization
            </button>
            <button
              className={`border-b-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'commands'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('commands')}
            >
              Command Runner
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'visualization' ? (
            <TestVisualization height="70vh" />
          ) : (
            <div className="flex h-[70vh] flex-col">
              <div className="mb-4">
                <h2 className="mb-2 text-lg font-semibold">Run Test Commands</h2>
                <div className="flex">
                  <input
                    type="text"
                    value={command}
                    onChange={e => setCommand(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRunCommand()}
                    placeholder="Enter command (e.g., npm run cypress)"
                    className="flex-grow rounded-l-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleRunCommand}
                    className="rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Run
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Popular commands:</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {[
                      'npm run cypress',
                      'npm run test:pw',
                      'npm run dev',
                      'npx cypress run --spec cypress/e2e/training-certification.cy.ts',
                    ].map(cmd => (
                      <button
                        key={cmd}
                        onClick={() => setCommand(cmd)}
                        className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-grow flex-col">
                <h3 className="mb-2 font-medium">Command Output</h3>
                <div className="flex-grow overflow-y-auto whitespace-pre-wrap rounded-md bg-black p-4 font-mono text-sm text-green-400">
                  {commandOutput ||
                    'No commands executed yet. Enter a command above to get started.'}
                </div>
              </div>

              {commandHistory.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-medium">Command History</h3>
                  <div className="max-h-32 divide-y overflow-y-auto rounded-md border">
                    {commandHistory.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="flex cursor-pointer items-center px-3 py-2 hover:bg-gray-50"
                        onClick={() => setCommand(cmd)}
                      >
                        <span className="mr-2 text-gray-500">$</span>
                        <span className="flex-grow truncate font-mono text-sm">{cmd}</span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setCommand(cmd);
                            handleRunCommand();
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Run
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold">System Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Frontend</h3>
              <div className="mb-2 flex items-center">
                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-600">React App: Running</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Port: 5173</p>
                <p>Uptime: 10m 23s</p>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Backend</h3>
              <div className="mb-2 flex items-center">
                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-600">API Server: Error</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Port: 3000</p>
                <p className="text-red-600">See logs for details</p>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Test Frameworks</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-600">Cypress: Ready</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-600">Playwright: Ready</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 inline-block h-3 w-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm text-gray-600">Jest: Not initialized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestVisualizationPage;
