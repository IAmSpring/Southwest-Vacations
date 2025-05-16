/**
 * URL Utilities for handling GitHub Pages deployment
 */

/**
 * Check if the current environment is GitHub Pages
 */
export const isGitHubPages = (): boolean => {
  // Check for environment variable (set during build)
  if (import.meta.env.VITE_IS_GITHUB_PAGES === 'true') {
    return true;
  }

  // Check for specific path patterns in URL
  const url = window.location.href;
  return url.includes('github.io') || url.includes('/Southwest-Vacations/');
};

/**
 * Check if mock authentication should be used
 */
export const useMockAuth = (): boolean => {
  // Check for environment variable
  if (import.meta.env.VITE_MOCK_AUTH === 'true') {
    return true;
  }

  // Always use mock auth for GitHub Pages
  return isGitHubPages();
};

/**
 * Create a full path that works in both local and GitHub Pages environments
 */
export const createFullPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // For GitHub Pages, add the repository name to the path
  if (isGitHubPages()) {
    // The repository name used in GitHub Pages
    const repoName = 'Southwest-Vacations';
    return `/${repoName}/${cleanPath}`;
  }

  // For local development, just return the path with leading slash
  return `/${cleanPath}`;
};

/**
 * Get the base URL for assets (images, etc.)
 */
export const getAssetBaseUrl = (): string => {
  if (isGitHubPages()) {
    return '/Southwest-Vacations';
  }
  return '';
};

/**
 * Get the correct image URL that works in both local and GitHub Pages environments
 */
export const getImageUrl = (imagePath: string): string => {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

  // For GitHub Pages, add the repository name to the path
  if (isGitHubPages()) {
    // If the path already includes the repo name, return as is
    if (cleanPath.startsWith('Southwest-Vacations/')) {
      return `/${cleanPath}`;
    }
    return `/Southwest-Vacations/${cleanPath}`;
  }

  // For local development, just return the path with leading slash
  return `/${cleanPath}`;
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
