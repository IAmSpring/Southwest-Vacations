import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TestScreenshot {
  id: string;
  name: string;
  path: string;
  testName: string;
  timestamp: string;
  framework: 'cypress' | 'playwright' | 'other';
}

const TestScreenshotsViewer: React.FC = () => {
  const [screenshots, setScreenshots] = useState<Record<string, TestScreenshot[]>>({});
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFramework, setActiveFramework] = useState<'all' | 'cypress' | 'playwright'>('all');

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/test-screenshots');
        setScreenshots(response.data.screenshots || {});

        // Auto-expand the first test suite if available
        const testSuites = Object.keys(response.data.screenshots || {});
        if (testSuites.length > 0) {
          setExpandedTest(testSuites[0]);
        }
      } catch (err) {
        console.error('Failed to fetch screenshots:', err);
        setError('Failed to load test screenshots. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, []);

  const toggleAccordion = (testId: string) => {
    setExpandedTest(expandedTest === testId ? null : testId);
    setSelectedImage(null);
  };

  const openImageViewer = (path: string) => {
    setSelectedImage(path);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const getFrameworkFromTestSuite = (testSuite: string): 'cypress' | 'playwright' | 'other' => {
    if (testSuite.startsWith('cypress-')) return 'cypress';
    if (testSuite.startsWith('playwright-')) return 'playwright';
    return 'other';
  };

  const getFrameworkColor = (framework: 'cypress' | 'playwright' | 'other'): string => {
    switch (framework) {
      case 'cypress':
        return 'text-green-600';
      case 'playwright':
        return 'text-purple-600';
      default:
        return 'text-blue-600';
    }
  };

  const getFrameworkBgColor = (framework: 'cypress' | 'playwright' | 'other'): string => {
    switch (framework) {
      case 'cypress':
        return 'bg-green-50';
      case 'playwright':
        return 'bg-purple-50';
      default:
        return 'bg-blue-50';
    }
  };

  // Filter screenshots based on active framework
  const filteredScreenshots = Object.entries(screenshots).filter(([testSuite]) => {
    if (activeFramework === 'all') return true;
    const framework = getFrameworkFromTestSuite(testSuite);
    return framework === activeFramework;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#0054a6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="test-screenshots-viewer">
      <h2 className="mb-6 text-2xl font-bold text-[#304CB2]">Test Screenshots Viewer</h2>

      {/* Framework Selection Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveFramework('all')}
              className={`px-1 py-2 ${
                activeFramework === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              All Frameworks
            </button>
            <button
              onClick={() => setActiveFramework('cypress')}
              className={`px-1 py-2 ${
                activeFramework === 'cypress'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Cypress
            </button>
            <button
              onClick={() => setActiveFramework('playwright')}
              className={`px-1 py-2 ${
                activeFramework === 'playwright'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Playwright
            </button>
          </nav>
        </div>
      </div>

      {filteredScreenshots.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600">No test screenshots available for the selected framework.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredScreenshots.map(([testSuite, testImages]) => {
            const framework = getFrameworkFromTestSuite(testSuite);
            const frameworkColor = getFrameworkColor(framework);

            return (
              <div key={testSuite} className="overflow-hidden rounded-lg border border-gray-200">
                <div
                  className={`flex cursor-pointer items-center justify-between ${getFrameworkBgColor(framework)} px-4 py-3 hover:bg-opacity-70`}
                  onClick={() => toggleAccordion(testSuite)}
                >
                  <div>
                    <div className="flex items-center">
                      <span className={`mr-2 text-xs font-medium uppercase ${frameworkColor}`}>
                        {framework}
                      </span>
                      <h3 className="text-lg font-medium text-[#0054a6]">
                        {testSuite
                          .replace(`${framework}-`, '')
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </h3>
                    </div>
                    <span className="text-sm font-normal text-gray-500">
                      ({testImages.length} {testImages.length === 1 ? 'screenshot' : 'screenshots'})
                    </span>
                  </div>
                  <svg
                    className={`h-5 w-5 transform text-[#0054a6] transition-transform ${expandedTest === testSuite ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {expandedTest === testSuite && (
                  <div className="bg-white p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {testImages.map(image => (
                        <div
                          key={image.id}
                          className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
                          onClick={() => openImageViewer(image.path)}
                        >
                          <div className="aspect-h-9 aspect-w-16 bg-gray-100">
                            <img
                              src={image.path}
                              alt={image.testName}
                              className="h-full w-full object-cover"
                              onError={e => {
                                // If image fails to load, replace with placeholder
                                (e.target as HTMLImageElement).src =
                                  'https://via.placeholder.com/640x360?text=Screenshot+Not+Found';
                              }}
                            />
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <h4 className="truncate font-medium text-gray-800">{image.name}</h4>
                              <span className={`ml-1 text-xs font-medium ${frameworkColor}`}>
                                {framework}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-sm text-gray-500">{image.testName}</p>
                            <p className="mt-2 text-xs text-gray-400">
                              {new Date(image.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full-screen image viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closeImageViewer}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl rounded-lg bg-white p-2"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
              onClick={closeImageViewer}
            >
              <svg
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="max-h-[85vh] overflow-auto">
              <img
                src={selectedImage}
                alt="Test screenshot"
                className="h-auto w-full object-contain"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestScreenshotsViewer;
