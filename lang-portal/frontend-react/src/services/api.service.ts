import { buildApiUrl } from '../config/api';

/**
 * Generic fetch function with error handling
 */
async function fetchApi<T>(
  path: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(path);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Helper function for GET requests
 */
export function get<T>(path: string): Promise<T> {
  return fetchApi<T>(path);
}

/**
 * Helper function for POST requests
 */
export function post<T>(path: string, data: any): Promise<T> {
  return fetchApi<T>(path, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
