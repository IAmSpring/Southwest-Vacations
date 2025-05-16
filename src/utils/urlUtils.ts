// Repository name for GitHub Pages
export const REPOSITORY_NAME = 'Southwest-Vacations';

/**
 * Check if the application is running on GitHub Pages
 */
export const isGitHubPages = (): boolean => {
  return (
    import.meta.env.VITE_MOCK_AUTH === 'true' || 
    import.meta.env.VITE_IS_GITHUB_PAGES === 'true' ||
    window.location.hostname.includes('github.io') ||
    (!window.location.hostname.includes('localhost') && window.location.hostname !== '127.0.0.1')
  );
};

/**
 * Get the base path for the application
 * When using HashRouter on GitHub Pages, this is used for direct URL navigation
 */
export const getBasePath = (): string => {
  return isGitHubPages() ? `/${REPOSITORY_NAME}` : '';
};

/**
 * Create a full URL path including the repository path if on GitHub Pages
 * @param path - The path to append to the base path
 */
export const createFullPath = (path: string): string => {
  const base = getBasePath();
  
  // Handle root path specially
  if (path === '/') {
    return base ? `${base}/` : '/';
  }
  
  // Remove leading slash from path if base exists to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
};

// For TypeScript support
declare global {
  interface ImportMeta {
    env: {
      VITE_MOCK_AUTH?: string;
      VITE_IS_GITHUB_PAGES?: string;
    };
  }
} 