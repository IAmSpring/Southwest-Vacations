/**
 * API Configuration types and helpers
 */

export interface APIConfig {
  USE_STATIC_DATA?: boolean;
  BASE_PATH?: string;
  API_BASE_URL?: string;
  MOCK_DATA_PATH?: string;
}

// Added for TypeScript support
declare global {
  interface Window {
    API_CONFIG?: APIConfig;
  }
}

/**
 * Get the base path for assets and API calls
 * This helps with GitHub Pages deployment
 */
export const getBasePath = (): string => {
  // Use API_CONFIG if available
  if (window.API_CONFIG?.BASE_PATH) {
    return window.API_CONFIG.BASE_PATH;
  }

  // Detect GitHub Pages from hostname
  if (window.location.hostname.includes('github.io')) {
    // Extract repository name from the URL
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1) {
      return `/${pathParts[1]}`;
    }
  }

  // Default to empty base path for local development
  return '';
};
