import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import { loadMarkdownFiles } from '../utils/markdownLoader';

// Define markdown files to load
const markdownFileMap = {
  README: 'README.md',
  'Testing Guide': 'README-testing.md',
  'Implementation Plan': 'IMPLEMENTATION_PLAN.md',
  Recommendations: 'RECOMMENDATIONS.md',
  'Playwright Tests': 'PLAYWRIGHT_TESTS.md',
  Testing: 'TESTING.md',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const AIDPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [markdownContent, setMarkdownContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all markdown content
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const content = await loadMarkdownFiles(markdownFileMap);
        setMarkdownContent(content);
      } catch (error) {
        console.error('Error loading markdown files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Southwest Vacations Application Interface Document (AID)
        </h1>

        <div className="mb-6">
          <p className="text-lg text-gray-700">
            This page contains comprehensive documentation about the Southwest Vacations booking
            application, including architecture, testing methodology, implementation details, and
            recommendations.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <span className="ml-3 text-lg text-gray-700">Loading documentation...</span>
          </div>
        ) : (
          <div className="w-full px-2 py-4 sm:px-0">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                {Object.keys(markdownFileMap).map(category => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-[#0054a6] text-white shadow'
                          : 'text-blue-100 hover:bg-[#0054a6]/70 hover:text-white'
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {Object.keys(markdownFileMap).map((category, idx) => (
                  <Tab.Panel
                    key={idx}
                    className={classNames(
                      'rounded-xl bg-white p-3',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
                    )}
                  >
                    <div className="prose prose-blue max-w-none dark:prose-invert">
                      {markdownContent[category] ? (
                        <ReactMarkdown>{markdownContent[category]}</ReactMarkdown>
                      ) : (
                        <p className="py-4 text-center">Content not available.</p>
                      )}
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        )}

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">About this Document</h2>
          <p className="text-gray-600">
            This Application Interface Document (AID) provides a comprehensive overview of the
            Southwest Vacations booking application. It includes details about the application
            architecture, testing methodology, implementation plans, and recommendations for future
            development.
          </p>
          <p className="mt-2 text-gray-600">
            This documentation is meant to serve as a reference for developers, testers, and project
            stakeholders to understand the technical aspects of the application and its development
            process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIDPage;
