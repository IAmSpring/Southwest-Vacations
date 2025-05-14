import React, { useState } from 'react';
import CypressTestViewer from '../components/CypressTestViewer';

const TestingDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cypress' | 'playwright' | 'unit'>('cypress');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-[#304CB2]">
          Southwest Vacations Testing Dashboard
        </h1>
        <p className="text-gray-600">
          View test results, screenshots, and reports from various testing frameworks.
        </p>
      </div>

      {/* Tabs for different test types */}
      <div className="mb-6 border-b border-gray-200">
        <div className="-mb-px flex">
          <button
            className={`mr-1 px-4 py-2 font-medium ${
              activeTab === 'cypress'
                ? 'border-b-2 border-[#0054a6] text-[#0054a6]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('cypress')}
          >
            Cypress Tests
          </button>
          <button
            className={`mr-1 px-4 py-2 font-medium ${
              activeTab === 'playwright'
                ? 'border-b-2 border-[#0054a6] text-[#0054a6]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('playwright')}
          >
            Playwright Tests
          </button>
          <button
            className={`mr-1 px-4 py-2 font-medium ${
              activeTab === 'unit'
                ? 'border-b-2 border-[#0054a6] text-[#0054a6]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('unit')}
          >
            Unit Tests
          </button>
        </div>
      </div>

      {/* Test content based on active tab */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        {activeTab === 'cypress' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Cypress Test Results</h2>
              <div>
                <a
                  href="/run-cypress-tests.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2 rounded-md bg-[#0054a6] px-4 py-2 text-white transition-colors hover:bg-[#003b73]"
                >
                  Run Tests
                </a>
                <a
                  href="/cypress/reports/html/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-[#0054a6] px-4 py-2 text-[#0054a6] transition-colors hover:bg-[#0054a6] hover:text-white"
                >
                  View Full Report
                </a>
              </div>
            </div>

            <CypressTestViewer />
          </div>
        )}

        {activeTab === 'playwright' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Playwright Test Results</h2>
              <div>
                <a
                  href="/run-playwright-tests.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2 rounded-md bg-[#0054a6] px-4 py-2 text-white transition-colors hover:bg-[#003b73]"
                >
                  Run Tests
                </a>
                <a
                  href="/playwright-report/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-[#0054a6] px-4 py-2 text-[#0054a6] transition-colors hover:bg-[#0054a6] hover:text-white"
                >
                  View Report
                </a>
              </div>
            </div>

            <div className="py-8 text-center text-gray-500">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p>Playwright test viewer coming soon.</p>
              <p className="mt-2">Please use the report link to view test results.</p>
            </div>
          </div>
        )}

        {activeTab === 'unit' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Unit Test Results</h2>
              <div>
                <a
                  href="/run-unit-tests.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2 rounded-md bg-[#0054a6] px-4 py-2 text-white transition-colors hover:bg-[#003b73]"
                >
                  Run Tests
                </a>
                <a
                  href="/coverage/lcov-report/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-[#0054a6] px-4 py-2 text-[#0054a6] transition-colors hover:bg-[#0054a6] hover:text-white"
                >
                  View Coverage
                </a>
              </div>
            </div>

            <div className="py-8 text-center text-gray-500">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Unit test viewer coming soon.</p>
              <p className="mt-2">Please use the coverage report to view test results.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestingDashboardPage;
