import { get } from './api.service';
import { 
  PaginatedResponse,
  Word,
  WordDetail
} from '../types/api.types';

/**
 * Words API service functions
 */
export const wordsService = {
  getAll: (page = 1, sortBy = '', sortDirection = '') => {
    let url = `/api/words?page=${page}`;
    if (sortBy) {
      url += `&sort=${sortBy}&direction=${sortDirection}`;
    }
    return get<PaginatedResponse<Word>>(url);
  },
  
  getById: (id: number) => {
    return get<WordDetail>(`/api/words/${id}`);
  }
};
