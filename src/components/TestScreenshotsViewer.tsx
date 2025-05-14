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
  const [importantScreenshots, setImportantScreenshots] = useState<Record<string, boolean>>({});
  const [reviewedScreenshots, setReviewedScreenshots] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  // Load saved marked screenshots from localStorage
  useEffect(() => {
    const savedImportant = localStorage.getItem('swv_important_screenshots');
    const savedReviewed = localStorage.getItem('swv_reviewed_screenshots');

    if (savedImportant) {
      try {
        setImportantScreenshots(JSON.parse(savedImportant));
      } catch (err) {
        console.error('Error parsing saved important screenshots:', err);
      }
    }

    if (savedReviewed) {
      try {
        setReviewedScreenshots(JSON.parse(savedReviewed));
      } catch (err) {
        console.error('Error parsing saved reviewed screenshots:', err);
      }
    }
  }, []);

  // Save marked screenshots to localStorage when they change
  useEffect(() => {
    localStorage.setItem('swv_important_screenshots', JSON.stringify(importantScreenshots));
  }, [importantScreenshots]);

  useEffect(() => {
    localStorage.setItem('swv_reviewed_screenshots', JSON.stringify(reviewedScreenshots));
  }, [reviewedScreenshots]);

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

  const markAsImportant = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setImportantScreenshots(prev => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
  };

  const markAsReviewed = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setReviewedScreenshots(prev => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
  };

  const handleImageError = (
    imageId: string,
    path: string,
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const currentRetries = retryCount[imageId] || 0;

    if (currentRetries < 2) {
      // Try loading the image again up to 2 times
      setRetryCount(prev => ({
        ...prev,
        [imageId]: currentRetries + 1,
      }));

      // Add a cache-busting param to force reload
      const cacheBustUrl = `${path}?retry=${currentRetries + 1}`;
      (event.target as HTMLImageElement).src = cacheBustUrl;
    } else {
      // If still failing after retries, use placeholder
      (event.target as HTMLImageElement).src =
        'https://via.placeholder.com/640x360?text=Screenshot+Not+Found';
    }
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

  // Count screenshots by framework
  const getFrameworkCounts = () => {
    const counts = {
      cypress: 0,
      playwright: 0,
      other: 0,
      total: 0,
    };

    Object.entries(screenshots).forEach(([testSuite, images]) => {
      const framework = getFrameworkFromTestSuite(testSuite);
      counts[framework] += images.length;
      counts.total += images.length;
    });

    return counts;
  };

  const screenshotCounts = getFrameworkCounts();

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
              All Frameworks{' '}
              <span className="ml-1 text-xs font-bold">({screenshotCounts.total})</span>
            </button>
            <button
              onClick={() => setActiveFramework('cypress')}
              className={`px-1 py-2 ${
                activeFramework === 'cypress'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Cypress <span className="ml-1 text-xs font-bold">({screenshotCounts.cypress})</span>
            </button>
            <button
              onClick={() => setActiveFramework('playwright')}
              className={`px-1 py-2 ${
                activeFramework === 'playwright'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Playwright{' '}
              <span className="ml-1 text-xs font-bold">({screenshotCounts.playwright})</span>
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

            // Check if this test suite has any important screenshots
            const hasImportant = testImages.some(image => importantScreenshots[image.id]);

            return (
              <div key={testSuite} className="overflow-hidden rounded-lg border border-gray-200">
                <div
                  className={`flex cursor-pointer items-center justify-between ${getFrameworkBgColor(framework)} px-4 py-3 hover:bg-opacity-70 ${hasImportant ? 'border-l-4 border-l-yellow-500' : ''}`}
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
                          className={`cursor-pointer overflow-hidden rounded-lg border transition-shadow hover:shadow-md ${
                            importantScreenshots[image.id]
                              ? 'border-yellow-400 bg-yellow-50'
                              : reviewedScreenshots[image.id]
                                ? 'border-green-400 bg-green-50'
                                : 'border-gray-200'
                          }`}
                          onClick={() => openImageViewer(image.path)}
                        >
                          <div className="aspect-h-9 aspect-w-16 bg-gray-100">
                            <img
                              src={image.path}
                              alt={image.testName}
                              className="h-full w-full object-cover"
                              onError={e => handleImageError(image.id, image.path, e)}
                            />
                            {importantScreenshots[image.id] && (
                              <div className="absolute right-0 top-0 m-2 rounded-full bg-yellow-400 p-1">
                                <svg
                                  className="h-4 w-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <h4 className="truncate font-medium text-gray-800">{image.name}</h4>
                              <span className={`ml-1 text-xs font-medium ${frameworkColor}`}>
                                {framework}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-sm text-gray-500">{image.testName}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-xs text-gray-400">
                                {new Date(image.timestamp).toLocaleString()}
                              </p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={e => markAsImportant(image.id, e)}
                                  className={`rounded-full p-1 hover:bg-gray-100 ${
                                    importantScreenshots[image.id]
                                      ? 'text-yellow-500'
                                      : 'text-gray-400'
                                  }`}
                                  title="Mark as important"
                                >
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={e => markAsReviewed(image.id, e)}
                                  className={`rounded-full p-1 hover:bg-gray-100 ${
                                    reviewedScreenshots[image.id]
                                      ? 'text-green-500'
                                      : 'text-gray-400'
                                  }`}
                                  title="Mark as reviewed"
                                >
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
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
