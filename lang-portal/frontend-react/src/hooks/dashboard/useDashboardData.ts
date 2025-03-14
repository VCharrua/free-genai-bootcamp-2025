import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { 
  LastStudySessionResponse, 
  StudyProgressResponse, 
  QuickStatsResponse, 
  PerformanceGraphDataPoint,
  ContinueLearningSession,
  ResetResponse
} from '../../types/api.types';
import { useApi } from '../useApi';

/**
 * Hook for fetching all dashboard data
 */
export function useDashboardData() {
  const lastSession = useApi<LastStudySessionResponse>(() => 
    dashboardService.getLastStudySession()
  );
  
  const studyProgress = useApi<StudyProgressResponse>(() => 
    dashboardService.getStudyProgress()
  );
  
  const quickStats = useApi<QuickStatsResponse>(() => 
    dashboardService.getQuickStats()
  );
  
  const performanceGraph = useApi<PerformanceGraphDataPoint[]>(() => 
    dashboardService.getPerformanceGraph()
  );
  
  const continueLearning = useApi<ContinueLearningSession[]>(() => 
    dashboardService.getContinueLearning()
  );

  // Add states for reset functionality
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<Error | null>(null);

  // Function to refresh all data after reset
  const refreshAllData = useCallback(() => {
    lastSession.refresh();
    studyProgress.refresh();
    quickStats.refresh();
    performanceGraph.refresh();
    continueLearning.refresh();
  }, [lastSession, studyProgress, quickStats, performanceGraph, continueLearning]);

  // Full reset function that can be called from components
  const fullReset = useCallback(async () => {
    setIsResetting(true);
    setResetError(null);
    
    try {
      await dashboardService.fullReset();
      // Refresh all data after successful reset
      refreshAllData();
      return true;
    } catch (error) {
      setResetError(error instanceof Error ? error : new Error('Failed to reset data'));
      return false;
    } finally {
      setIsResetting(false);
    }
  }, [refreshAllData]);

  // Calculate if everything is loaded
  const isLoading = 
    lastSession.loading || 
    studyProgress.loading || 
    quickStats.loading || 
    performanceGraph.loading ||
    continueLearning.loading;
  
  // Aggregate any errors
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const errors = [
      lastSession.error,
      studyProgress.error,
      quickStats.error,
      performanceGraph.error,
      continueLearning.error
    ].filter(Boolean);
    
    if (errors.length > 0) {
      setError(errors[0]);
    } else {
      setError(null);
    }
  }, [
    lastSession.error,
    studyProgress.error,
    quickStats.error,
    performanceGraph.error,
    continueLearning.error
  ]);

  return {
    lastSession: lastSession.data,
    studyProgress: studyProgress.data,
    quickStats: quickStats.data,
    performanceGraph: performanceGraph.data,
    continueLearning: continueLearning.data,
    isLoading,
    error,
    // Add reset functionality to the return object
    fullReset,
    isResetting,
    resetError,
    refreshAllData
  };
}
