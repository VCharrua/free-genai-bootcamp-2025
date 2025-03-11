import { studyActivitiesService } from '../../services/study-activities.service';
import { useApi } from '../useApi';
import { usePagination } from '../usePagination';
import { StudyActivity } from '../../types/api.types';

/**
 * Hook for fetching study activities
 */
export function useStudyActivities() {
  const { data, loading, error } = useApi<StudyActivity[]>(
    () => studyActivitiesService.getAll()
  );

  return {
    activities: data || [],
    loading,
    error
  };
}

/**
 * Hook for fetching a single study activity
 */
export function useStudyActivity(id: number) {
  const { data, loading, error } = useApi<StudyActivity>(
    () => studyActivitiesService.getById(id),
    [id]
  );

  return {
    activity: data,
    loading,
    error
  };
}

/**
 * Hook for fetching study activity launch data
 */
export function useStudyActivityLaunch(id: number) {
  const { data, loading, error } = useApi(
    () => studyActivitiesService.getLaunchData(id),
    [id]
  );

  return {
    activity: data?.activity,
    groups: data?.groups || [],
    loading,
    error
  };
}

/**
 * Hook for fetching study activity sessions with pagination
 */
export function useStudyActivitySessions(id: number) {
  return usePagination(
    (page) => studyActivitiesService.getStudySessions(id, page),
    { initialPage: 1 }
  );
}
