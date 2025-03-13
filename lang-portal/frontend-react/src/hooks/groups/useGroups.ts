import { groupsService } from '../../services/groups.service';
import { useApi } from '../useApi';
import { usePagination } from '../usePagination';

/**
 * Hook for fetching groups with pagination and sorting
 */
export function useGroups() {
  return usePagination(
    (page, sortBy, sortDirection) => groupsService.getAll(page, sortBy, sortDirection)
  );
}

/**
 * Hook for fetching a single group
 */
export function useGroup(id: number) {
  const { data, loading, error } = useApi(
    () => groupsService.getById(id),
    [id]
  );

  return {
    group: data,
    loading,
    error
  };
}

/**
 * Hook for fetching group words with pagination and sorting
 */
export function useGroupWords(id: number) {
  return usePagination(
    (page, sortBy, sortDirection) => groupsService.getWords(id, page, sortBy, sortDirection),
    { initialPage: 1 }
  );
}

/**
 * Hook for fetching group study sessions with pagination
 */
export function useGroupStudySessions(id: number) {
  return usePagination(
    (page) => groupsService.getStudySessions(id, page),
    { initialPage: 1 }
  );
}
