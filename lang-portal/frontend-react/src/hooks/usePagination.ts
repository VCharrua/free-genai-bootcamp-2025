import { useState, useCallback } from 'react';
import { PaginatedResponse } from '../types/api.types';
import { useApi } from './useApi';

interface UsePaginationOptions {
  initialPage?: number;
  initialSortBy?: string;
  initialSortDirection?: 'ASC' | 'DESC';
}

/**
 * Hook for handling paginated API responses with sorting
 */
export function usePagination<T>(
  fetchFn: (page: number, sortBy: string, sortDirection: string) => Promise<PaginatedResponse<T>>,
  options: UsePaginationOptions = {}
) {
  const {
    initialPage = 1,
    initialSortBy = '',
    initialSortDirection = 'ASC'
  } = options;

  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  const apiCall = useCallback(
    () => fetchFn(page, sortBy, sortDirection),
    [fetchFn, page, sortBy, sortDirection]
  );

  const { data, loading, error } = useApi<PaginatedResponse<T>>(apiCall, [page, sortBy, sortDirection]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSort = useCallback((column: string) => {
    setSortBy(column);
    setSortDirection(prev => (sortBy === column && prev === 'ASC' ? 'DESC' : 'ASC'));
  }, [sortBy]);

  return {
    items: data?.items || [],
    pagination: data?.pagination || { page: 1, per_page: 100, total: 0, total_pages: 1 },
    loading,
    error,
    page,
    sortBy,
    sortDirection,
    handlePageChange,
    handleSort
  };
}
