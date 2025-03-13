import { get, post } from './api.service';
import { 
  StudyActivity,
  StudyActivityLaunchResponse,
  PaginatedResponse,
  StudySession
} from '../types/api.types';

/**
 * Study activities API service functions
 */
export const studyActivitiesService = {
  getAll: () => {
    return get<StudyActivity[]>('/api/study_activities');
  },
  
  getById: (id: number) => {
    return get<StudyActivity>(`/api/study_activities/${id}`);
  },
  
  getLaunchData: (id: number) => {
    return get<StudyActivityLaunchResponse>(`/api/study_activities/${id}/launch`);
  },
  
  getStudySessions: (id: number, page = 1) => {
    return get<PaginatedResponse<StudySession>>(`/api/study_activities/${id}/study_sessions?page=${page}`);
  },
  
  startStudySession: (studyActivityId: number, groupId: number) => {
    return post('/api/study_sessions', { 
      study_activity_id: studyActivityId,
      group_id: groupId
    });
  }
};
