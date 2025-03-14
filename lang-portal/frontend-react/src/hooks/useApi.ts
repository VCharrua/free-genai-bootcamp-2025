import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void; // Add refresh method to the interface
}

/**
 * Generic hook for making API calls with loading and error states
 */
export function useApi<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
    refresh: () => {} // Initial placeholder
  });

  // Create the refresh function using useCallback to maintain reference stability
  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const data = await fetchFn();
      setState(prev => ({ ...prev, data, loading: false, error: null }));
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error as Error }));
    }
  }, [fetchFn]);

  // Update the refresh function reference in state
  useEffect(() => {
    setState(prev => ({ ...prev, refresh }));
  }, [refresh]);

  // Initial data fetch
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }));
      
      try {
        const data = await fetchFn();
        if (isMounted) {
          setState(prev => ({ ...prev, data, loading: false, error: null }));
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({ ...prev, data: null, loading: false, error: error as Error }));
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
