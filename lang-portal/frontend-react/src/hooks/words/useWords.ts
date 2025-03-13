import { wordsService } from '../../services/words.service';
import { useApi } from '../useApi';
import { usePagination } from '../usePagination';

/**
 * Hook for fetching words with pagination and sorting
 */
export function useWords() {
  return usePagination(
    (page, sortBy, sortDirection) => wordsService.getAll(page, sortBy, sortDirection)
  );
}

/**
 * Hook for fetching a single word
 */
export function useWord(id: number) {
  const { data, loading, error } = useApi(
    () => wordsService.getById(id),
    [id]
  );

  return {
    word: data,
    loading,
    error
  };
}
