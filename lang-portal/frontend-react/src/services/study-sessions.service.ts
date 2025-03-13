import { get, post } from './api.service';
import { 
  PaginatedResponse,
  StudySession,
  ResetResponse,
  Word
} from '../types/api.types';

/**
 * Study sessions API service functions
 */
export const studySessionsService = {
  getAll: (page = 1, sortBy = '', sortDirection = '') => {
    let url = `/api/study_sessions?page=${page}`;
    if (sortBy) {
      url += `&sort=${sortBy}&direction=${sortDirection}`;
    }
    return get<PaginatedResponse<StudySession>>(url);
  },
  
  getById: (id: number) => {
    return get<StudySession>(`/api/study_sessions/${id}`);
  },
  
  getSessionWords: (id: number, page = 1, sortBy = '', sortDirection = '') => {
    let url = `/api/study_sessions/${id}/words?page=${page}`;
    if (sortBy) {
      url += `&sort=${sortBy}&direction=${sortDirection}`;
    }
    return get<PaginatedResponse<Word>>(url);
  },

  resetHistory: () => {
    return post<ResetResponse>('/api/study_sessions/reset_history', {});
  }
};
