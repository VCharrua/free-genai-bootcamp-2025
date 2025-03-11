# Frontend API Implementation

This document explains how the React frontend connects to the Flask backend API endpoints through the services layer.

## Architecture Overview

```
┌─────────────┐     ┌────────────┐     ┌─────────────┐     ┌─────────────┐
│  React UI   │────▶│   Hooks    │────▶│   Services  │────▶│  Flask API  │
│ Components  │◀────│            │◀────│             │◀────│  Endpoints  │
└─────────────┘     └────────────┘     └─────────────┘     └─────────────┘
```

The application uses a layered architecture:
1. **UI Components**: React components that render the UI
2. **Custom Hooks**: React hooks that handle data fetching, state management, and business logic
3. **Services**: Functions that make API calls to the backend
4. **API Endpoints**: Flask backend endpoints that provide data

## Configuration

API base URL is configured in `src/config/api.ts` with a default of `http://localhost:5000`. This can be overridden using environment variables:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
};
```

## API Services

Each feature area has its own service file that contains functions for making API calls to the corresponding backend endpoints:

### Dashboard

**Service File**: `src/services/dashboard.service.ts`

| Function | API Endpoint | Description |
|----------|-------------|-------------|
| `getLastStudySession` | GET `/api/dashboard/last_study_session` | Fetches information about the most recent study session |
| `getStudyProgress` | GET `/api/dashboard/study_progress` | Fetches study progress statistics |
| `getQuickStats` | GET `/api/dashboard/quick_stats` | Fetches quick overview statistics |
| `getPerformanceGraph` | GET `/api/dashboard/performance_graph` | Fetches performance statistics for graphing |
| `getContinueLearning` | GET `/api/study_sessions/continue_learning` | Fetches recent incomplete study sessions |
| `fullReset` | POST `/api/dashboard/full_reset` | Resets the entire database |

### Study Activities

**Service File**: `src/services/study-activities.service.ts`

| Function | API Endpoint | Description |
|----------|-------------|-------------|
| `getAll` | GET `/api/study-activities` | Fetches all available study activities |
| `getById` | GET `/api/study_activities/:id` | Fetches a single study activity by ID |
| `getLaunchData` | GET `/api/study_activities/:id/launch` | Fetches data needed to launch a study activity |
| `getStudySessions` | GET `/api/study_activities/:id/study_sessions` | Fetches study sessions for an activity |
| `startStudySession` | POST `/api/study_sessions` | Creates a new study session |

### Words

**Service File**: `src/services/words.service.ts`

| Function | API Endpoint | Description |
|----------|-------------|-------------|
| `getAll` | GET `/api/words` | Fetches all words with pagination and sorting |
| `getById` | GET `/api/words/:id` | Fetches a single word by ID |

### Groups

**Service File**: `src/services/groups.service.ts`

| Function | API Endpoint | Description |
|----------|-------------|-------------|
| `getAll` | GET `/api/groups` | Fetches all groups with pagination and sorting |
| `getById` | GET `/api/groups/:id` | Fetches a single group by ID |
| `getWords` | GET `/api/groups/:id/words` | Fetches words for a specific group |
| `getStudySessions` | GET `/api/groups/:id/study_sessions` | Fetches study sessions for a group |

### Study Sessions

**Service File**: `src/services/study-sessions.service.ts`

| Function | API Endpoint | Description |
|----------|-------------|-------------|
| `getAll` | GET `/api/study_sessions` | Fetches all study sessions with pagination and sorting |
| `resetHistory` | POST `/api/study_sessions/reset_history` | Resets study history |

## Custom Hooks

Each page in the application uses custom hooks to fetch data from the services. These hooks handle loading states, error handling, and data transformation.

### Dashboard

**Hook File**: `src/hooks/dashboard/useDashboardData.ts`

```typescript
// Usage example:
const {
  lastSession,
  studyProgress,
  quickStats,
  performanceGraph,
  continueLearning,
  isLoading,
  error
} = useDashboardData();
```

This hook aggregates data from multiple dashboard API endpoints and provides unified loading and error states.

### Study Activities

**Hook File**: `src/hooks/study-activities/useStudyActivities.ts`

```typescript
// List all study activities
const { activities, loading, error } = useStudyActivities();

// Get a single study activity
const { activity, loading, error } = useStudyActivity(id);

// Get launch data
const { activity, groups, loading, error } = useStudyActivityLaunch(id);

// Get study sessions for an activity
const {
  items,
  pagination,
  loading,
  error,
  page,
  sortBy,
  sortDirection,
  handlePageChange,
  handleSort
} = useStudyActivitySessions(id);
```

### Words

**Hook File**: `src/hooks/words/useWords.ts`

```typescript
// List all words with pagination and sorting
const {
  items,
  pagination,
  loading,
  error,
  page,
  sortBy,
  sortDirection,
  handlePageChange,
  handleSort
} = useWords();

// Get a single word
const { word, loading, error } = useWord(id);
```

### Groups

**Hook File**: `src/hooks/groups/useGroups.ts`

```typescript
// List all groups with pagination and sorting
const {
  items,
  pagination,
  loading,
  error,
  page,
  sortBy,
  sortDirection,
  handlePageChange,
  handleSort
} = useGroups();

// Get a single group
const { group, loading, error } = useGroup(id);

// Get words for a group
const {
  items,
  pagination,
  loading,
  error,
  page,
  sortBy,
  sortDirection,
  handlePageChange,
  handleSort
} = useGroupWords(id);

// Get study sessions for a group
const {
  items,
  pagination,
  loading,
  error,
  page,
  handlePageChange
} = useGroupStudySessions(id);
```

### Study Sessions

**Hook File**: `src/hooks/study-sessions/useStudySessions.ts`

```typescript
// List all study sessions
const {
  items,
  pagination,
  loading,
  error,
  page,
  sortBy,
  sortDirection,
  handlePageChange,
  handleSort
} = useStudySessions();

// Reset history
const {
  resetHistory,
  loading,
  error,
  success
} = useResetHistory();
```

## Page Implementations

### Dashboard Page

The Dashboard page connects to multiple API endpoints to show a comprehensive overview:

```typescript
// In the Dashboard component
function Dashboard() {
  const {
    lastSession,
    studyProgress,
    quickStats,
    performanceGraph,
    continueLearning,
    isLoading,
    error
  } = useDashboardData();

  // Render components using the fetched data
  return (
    <div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <LastStudySessionComponent data={lastSession} />
          <StudyProgressComponent data={studyProgress} />
          <QuickStatsComponent data={quickStats} />
          <PerformanceGraphComponent data={performanceGraph} />
          <ContinueLearningComponent data={continueLearning} />
        </>
      )}
    </div>
  );
}
```

### Study Activities Page

```typescript
// In the StudyActivities component
function StudyActivities() {
  const { activities, loading, error } = useStudyActivities();

  return (
    <div>
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map(activity => (
            <ActivityCard 
              key={activity.id} 
              activity={activity}
              onLaunch={() => navigate(`/study_activities/${activity.id}/launch`)}
              onView={() => navigate(`/study_activities/${activity.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Word Index Page

```typescript
// In the WordIndex component
function WordIndex() {
  const {
    items: words,
    pagination,
    loading,
    error,
    page,
    sortBy,
    sortDirection,
    handlePageChange,
    handleSort
  } = useWords();

  return (
    <div>
      {loading ? <LoadingSpinner /> : (
        <>
          <Table
            data={words}
            columns={columns}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <Pagination
            currentPage={page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
```

## Error Handling

The API service functions and custom hooks include comprehensive error handling:

1. **API Service Level**: The `fetchApi` function in `api.service.ts` handles HTTP errors and parses error messages from the response.

2. **Hook Level**: Each hook captures and processes errors, making them available to components.

3. **Component Level**: Components can display appropriate error messages based on the error state provided by hooks.

## Pagination and Sorting

The `usePagination` hook provides a standardized way to handle pagination and sorting for list views:

```typescript
const {
  items,
  pagination,
  loading,
  error,
  page,
  sortBy,
  sortDirection,
  handlePageChange,
  handleSort
} = usePagination(fetchFunction);
```

This ensures consistent behavior across all list pages in the application.

## Environment Variables

API URL configuration can be customized through environment variables:

```
# .env file
VITE_API_BASE_URL=http://localhost:5000
```

For production deployments, this value can be changed to point to the production API server.
