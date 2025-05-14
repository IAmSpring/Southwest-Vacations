import { getBasePath } from './apiConfig';

/**
 * Utility functions for loading markdown content
 */

/**
 * Load markdown content from a file path
 * @param path Path to the markdown file
 * @returns Promise with the markdown content as a string
 */
export const loadMarkdown = async (path: string): Promise<string> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load markdown from ${path}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading markdown from ${path}:`, error);
    return `# Error Loading Content\n\nFailed to load content from ${path}.\n\nPlease check the console for more information.`;
  }
};

/**
 * Get the path to a markdown file in the project
 * @param filename Name of the markdown file
 * @returns Full path to the markdown file
 */
export const getMarkdownPath = (filename: string): string => {
  // Get base path for GitHub Pages or other environments
  const basePath = getBasePath();

  // Return path with appropriate base path
  return `${basePath}/${filename}`;
};

/**
 * Load multiple markdown files and return their contents
 * @param files Object with key-value pairs of file label and filename
 * @returns Promise with object containing the markdown contents
 */
export const loadMarkdownFiles = async (
  files: Record<string, string>
): Promise<Record<string, string>> => {
  const contents: Record<string, string> = {};

  try {
    const promises = Object.entries(files).map(async ([key, filename]) => {
      const path = getMarkdownPath(filename);
      try {
        contents[key] = await loadMarkdown(path);
      } catch (error) {
        console.error(`Error loading ${key} (${filename}):`, error);
        contents[key] =
          `# Error Loading ${key}\n\nFailed to load content from ${filename}.\n\nPlease check the console for more information.`;
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error loading markdown files:', error);
  }

  return contents;
};
