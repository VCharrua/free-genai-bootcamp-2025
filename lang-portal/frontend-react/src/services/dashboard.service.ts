import { get, post } from './api.service';
import { 
  LastStudySessionResponse, 
  StudyProgressResponse, 
  QuickStatsResponse,
  PerformanceGraphDataPoint,
  ContinueLearningSession,
  ResetResponse
} from '../types/api.types';

/**
 * Dashboard API service functions
 */
export const dashboardService = {
  getLastStudySession: () => {
    return get<LastStudySessionResponse>('/api/dashboard/last_study_session');
  },
  
  getStudyProgress: () => {
    return get<StudyProgressResponse>('/api/dashboard/study_progress');
  },
  
  getQuickStats: () => {
    return get<QuickStatsResponse>('/api/dashboard/quick_stats');
  },
  
  getPerformanceGraph: () => {
    return get<PerformanceGraphDataPoint[]>('/api/dashboard/performance_graph');
  },
  
  getContinueLearning: () => {
    return get<ContinueLearningSession[]>('/api/study_sessions/continue_learning');
  },
  
  fullReset: () => {
    return post<ResetResponse>('/api/dashboard/full_reset', {});
  }
};
