/**
 * API response types for the language portal
 */

// Common pagination type used across paginated responses
export interface PaginationData {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  pagination: PaginationData;
  items: T[];
}

// Dashboard
export interface LastStudySessionResponse {
  id: number;
  group_id: number;
  start_time: string;
  end_time: string;
  activity_name: string;
  group_name: string;
  correct_count: number;
  wrong_count: number;
}

export interface StudyProgressResponse {
  total_words: number;
  studied_words: number;
  studied_words_trend: number;
}

export interface QuickStatsResponse {
  success_rate: number;
  success_rate_trend: number;
  total_study_sessions: number;
  total_active_groups: number;
  study_streak_days: number;
}

export interface PerformanceGraphDataPoint {
  id: number;
  start_time: string;
  review_items_count: number;
  correct_count: number;
  wrong_count: number;
}

export interface ContinueLearningSession {
  id: number;
  activity_id: number;
  group_id: number;
  group_name: string;
  review_items_count: number;
  total_words_count: number;
}

// Study Activities
export interface StudyActivity {
  id: number;
  name: string;
  description: string;
  url: string;
  preview_url: string;
}

export interface StudyActivityLaunchResponse {
  activity: StudyActivity;
  groups: GroupSummary[];
}

export interface StudySession {
  id: number;
  activity_name: string;
  group_name: string;
  start_time: string;
  end_time: string;
  review_items_count: number;
}

export interface GroupStudySession {
  id: number;
  group_id: number;
  study_activity_id: number;
  created_at: string;
  activity_name: string;
  group_name: string;
}

// Words
export interface WordParts {
  portuguese: string;
  kimbundu: string;
  english: string;
}

export interface Word {
  id: number;
  portuguese: string;
  kimbundu: string;
  english: string;
  correct_count: number;
  wrong_count: number;
  parts: WordParts;
}

export interface WordDetail extends Omit<Word, 'correct_count' | 'wrong_count'> {
  stats: {
    correct_count: number;
    wrong_count: number;
  };
  groups: GroupSummary[];
}

// Groups
export interface GroupSummary {
  id: number;
  name: string;
  words_count: number;
}

export interface GroupDetail {
  id: number;
  name: string;
  stats: {
    total_words_count: number;
  };
}

// Reset responses
export interface ResetResponse {
  success: boolean;
  message: string;
}
