import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TestScreenshot {
  id: string;
  name: string;
  path: string;
  testName: string;
  timestamp: string;
}

const CypressTestViewer: React.FC = () => {
  const [screenshots, setScreenshots] = useState<Record<string, TestScreenshot[]>>({});
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="cypress-test-viewer">
      <h2 className="mb-6 text-2xl font-bold text-[#304CB2]">Cypress Test Screenshots</h2>

      {Object.entries(screenshots).length === 0 ? (
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
          <p className="text-gray-600">No test screenshots available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(screenshots).map(([testSuite, testImages]) => (
            <div key={testSuite} className="overflow-hidden rounded-lg border border-gray-200">
              <div
                className="flex cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 hover:bg-gray-100"
                onClick={() => toggleAccordion(testSuite)}
              >
                <h3 className="text-lg font-medium text-[#0054a6]">
                  {testSuite
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({testImages.length} {testImages.length === 1 ? 'screenshot' : 'screenshots'})
                  </span>
                </h3>
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
                          <h4 className="truncate font-medium text-gray-800">{image.name}</h4>
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
          ))}
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

export default CypressTestViewer;
