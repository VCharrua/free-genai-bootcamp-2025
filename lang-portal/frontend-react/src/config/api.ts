/**
 * API configuration for the language portal
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
};

/**
 * Helper function to build API URLs
 */
export const buildApiUrl = (path: string): string => {
  return `${API_CONFIG.BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
