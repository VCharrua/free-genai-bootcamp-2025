import { get } from './api.service';
import { 
  PaginatedResponse,
  GroupSummary,
  GroupDetail,
  Word,
  GroupStudySession
} from '../types/api.types';

/**
 * Groups API service functions
 */
export const groupsService = {
  getAll: (page = 1, sortBy = '', sortDirection = '') => {
    let url = `/api/groups?page=${page}`;
    if (sortBy) {
      url += `&sort=${sortBy}&direction=${sortDirection}`;
    }
    return get<PaginatedResponse<GroupSummary>>(url);
  },
  
  getById: (id: number) => {
    return get<GroupDetail>(`/api/groups/${id}`);
  },
  
  getWords: (id: number, page = 1, sortBy = '', sortDirection = '') => {
    let url = `/api/groups/${id}/words?page=${page}`;
    if (sortBy) {
      url += `&sort=${sortBy}&direction=${sortDirection}`;
    }
    return get<PaginatedResponse<Word>>(url);
  },
  
  getStudySessions: (id: number, page = 1) => {
    return get<PaginatedResponse<GroupStudySession>>(`/api/groups/${id}/study_sessions?page=${page}`);
  }
};
