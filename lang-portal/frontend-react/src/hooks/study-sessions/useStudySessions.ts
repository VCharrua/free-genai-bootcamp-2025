import { studySessionsService } from '../../services/study-sessions.service';
import { usePagination } from '../usePagination';
import { useState } from 'react';

/**
 * Hook for fetching study sessions with pagination and sorting
 */
export function useStudySessions() {
  return usePagination(
    (page, sortBy, sortDirection) => studySessionsService.getAll(page, sortBy, sortDirection)
  );
}

/**
 * Hook for resetting history
 */
export function useResetHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const resetHistory = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await studySessionsService.resetHistory();
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    resetHistory,
    loading,
    error,
    success
  };
}
