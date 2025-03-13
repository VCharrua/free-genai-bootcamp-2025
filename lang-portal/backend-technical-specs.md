# Backend Server Technical Specs

## Business Goal 

A language learning school wants to build a prototype of learning portal which will act as three things:
- Inventory of possible vocabulary that can be learned
- Act as a  Learning record store (LRS), providing correct and wrong score on practice vocabulary
- A unified launchpad to launch different learning apps

## Technical Requirements

- The backend will be build using Flask.
- The database will be SQLite3.
- The API will always return JSON.
- The API endpoint will get data from the database.
- There will be no authentication or authorization.
- Everything will be treated as a single user.
- The migration and seed tasks should be run using python `invoke`.
- Don't use any third-party libraries other than Flask, Flask-cors and Invoke.
- Try not to use specific versions of libraries.
- The `backend-flask` directory should be created inside the `lang-portal` directory.

## Directory Structure

```text
lang-portal/
└── backend-flask/
    ├── lib/
    │   ├── __init__.py
    │   ├── db.py
    ├── app/
    │   ├── __init__.py
    │   ├── models.py
    │   ├── routes/
    │   │   ├── __init__.py
    │   │   ├── dashboard_routes.py
    │   │   ├── study_activity_routes.py
    │   │   ├── word_routes.py
    │   │   ├── group_routes.py
    │   │   └── study_session_routes.py
    │   └── utils.py
    ├── migrations/
    │   ├── 000?_create_XXXX_table.sql
    │   └── ...
    ├── seeds/
    │   ├── words.json
    │   └── ...
    ├── words.db
    ├── config.py
    ├── tasks.py
    ├── requirements.txt
    └── run.py
```

## Database Schema

Our database will be a single sqlite database called `words.db` that will be in the root of the project folder of `backend-flask`.	

We have the following tables:
- words - stored vocabulary words
  - id - (Integer, Primary Key): Unique identifier for each word
  - portuguese - (String, Required): The word written in Portuguese
  - kimbundu - (String, Required): Kimbundu version of the word
  - english - (String, Required): English translation of the word
  - parts - (JSON, Required): Word components stored in JSON format
- words_groups - join table for words and groups many-to-many
  - id - (Integer, Primary Key): Unique identifier for each words_group record
  - word_id - (Integer, Foreign Key): References words.id
  - group_id - (Integer, Foreign Key): References groups.id
- groups - thematic groups of words
	- id - (Integer, Primary Key): Unique identifier for each group
	- name - (String, Required): Name of the group
	- words_count - (Integer, Default: 0): Counter cache for the number of words in the group
- study_sessions - records of study sessions grouping word_review_items
	- id - (Integer, Primary Key): Unique identifier for each session
	- group_id - (Integer, Foreign Key): References groups.id
	- study_activity_id - (Integer, Foreign Key): References study_activities.id
	- created_at - (Timestamp, Default: Current Time): When the session was created
- study_activities - a specific study activity, linking a study session to a group
	- id - (Integer, Primary Key): Unique identifier for each activity
	- name - (String, Required): Name of the activity (e.g., "Flashcards", "Quiz")
	- url - (String, Required): The full URL of the study activity
  - preview_url - (String, Required): The url to the preview image for the activity
- word_review_items - a record of word practice, determining if the word was correct or not
	- id - (Integer, Primary Key): Unique identifier for each review
	- word_id - (Integer, Foreign Key): References words.id
	- study_session_id - (Integer, Foreign Key): References study_sessions.id
	- correct - (Boolean, Required): Whether the answer was correct
	- created_at - (Timestamp, Default: Current Time): When the review occurred


## API Endpoints

### GET /api/dashboard/last_study_session
Returns information about the most recent study session.

#### JSON Response
```json
{
  "id": 1,
  "group_id": 1,
  "start_time": "2023-10-01T11:00:00Z",
  "end_time": "2023-10-01T12:00:00Z",
  "activity_name": "Flashcards",
  "group_name": "Basic Vocabulary",
  "correct_count": 20,
  "wrong_count": 4
}
```

### GET /api/dashboard/study_progress
Return study progress statistics.
Please note that the frontend will determine the progress bar based on the total words and the studied words.

#### JSON Response
```json
{
  "total_words": 100,
  "studied_words": 50,
  "studied_words_trend": 11
}
```

### GET /api/dashboard/quick_stats
Returns quick overview statistics.

#### JSON Response
```json
{
  "success_rate": 80.0,
  "success_rate_trend": 10.0,
  "total_study_sessions": 4,
  "total_active_groups": 3,
  "study_streak_days": 4
}
```

###  POST /api/dashboard/full_reset
Performs a full reset of the database.

#### JSON Response
```json
{
  "success": true,
  "message": "Full reset successfully"
}
```


### GET /api/dashboard/performance_graph
Returns performance statistics for the last 31 days.

#### JSON Response
```json
[
  {
    "id": 1,
    "start_time": "2023-10-01",
    "review_items_count": 24,
    "correct_count": 20,
    "wrong_count": 4
  },
  {
    "id": 2,
    "start_time": "2023-10-02",
    "review_items_count": 13,
    "correct_count": 10,
    "wrong_count": 3
  }
]
```



###  GET /api/study-activities
Returns a list of study activities.

#### JSON Response
```json
[
  {
    "id": 1,
    "name": "Flashcards",
    "description": "A study activity using flashcards to learn vocabulary.",
    "url": "https://example.com/flashcards",
    "preview_url": "http://example.com/flashcards/thumbnail"
  },
  {
    "id": 2,
    "name": "Quiz",
    "description": "A study activity using quizzes to test vocabulary knowledge.",
    "url": "https://example.com/quiz",
    "preview_url": "http://example.com/quiz/thumbnail"
  }
]
```

###  GET /api/study_activities/:id
Returns details of a specific study activity.

#### JSON Response
```json
{
  "id": 1,
  "name": "Flashcards",
  "description": "A study activity using flashcards to learn vocabulary.",
  "url": "https://example.com/flashcards",
  "preview_url": "http://example.com/flashcards/thumbnail"
}
```

###  GET /api/study_activities/:id/study_sessions
Returns a list of study sessions for a specific study activity.
- pagination with 100 items per page

#### JSON Response
```json
{
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 2,
    "total_pages": 1
  },
  "items": [
    {
      "id": 1,
      "activity_name": "Flashcards",
      "group_name": "Basic Vocabulary",
      "start_time": "2023-10-01T12:00:00Z",
      "end_time": "2023-10-01T12:05:00Z",
      "review_items_count": 20
    },
    {
      "id": 2,
      "activity_name": "Flashcards",
      "group_name": "Advanced Vocabulary",
      "start_time": "2023-10-02T12:00:00Z",
      "end_time": "2023-10-02T12:30:00Z",
      "review_items_count": 10
    }
  ]
}
```

###  GET /api/study_activities/:id/launch
Returns details of a specific study activity including all groups available for the activity.

#### JSON Response
```json
{
  "activity": {
    "id": 1,
    "name": "Flashcards",
    "description": "A study activity using flashcards to learn vocabulary.",
    "url": "http://example.com/activities/flashcards",
    "preview_url": "http://example.com/previews/flashcards.jpg"
  },
  "groups": [
    {
      "id": 1,
      "name": "Basic Vocabulary",
      "words_count": 50
    },
    {
      "id": 2,
      "name": "Travel Vocabulary",
      "words_count": 30
    },
    {
      "id": 3,
      "name": "Advanced Vocabulary",
      "words_count": 100
    }
  ]
}
```


###  GET /api/words
Returns a list of words.
- pagination with 100 items per page

#### JSON Response
```json
{
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 2,
    "total_pages": 1
  },
  "items": [
    {
      "id": 1,
      "portuguese": "água",
      "kimbundu": "maza",
      "english": "water",
      "correct_count": 10,
      "wrong_count": 2,
      "parts": {
        "portuguese": "ág",
        "kimbundu": "ma",
        "english": "water"
      }
    },
    {
      "id": 2,
      "portuguese": "escola",
      "kimbundu": "xikola",
      "english": "school",
      "correct_count": 5,
      "wrong_count": 1,
      "parts": {
        "portuguese": "escol",
        "kimbundu": "xikol",
        "english": "learn"
      }
    }
  ]
}
```

###  GET /api/words/:id
Returns details of a specific word.

#### JSON Response
```json
{
  "id": 1,
  "portuguese": "água",
  "kimbundu": "maza",
  "english": "water",
  "stats": {
    "correct_count": 10,
    "wrong_count": 2
  },
  "parts": {
    "portuguese": "ág",
    "kimbundu": "ma",
    "english": "water"
  },
  "groups": [
    {
      "id": 1,
      "name": "Basic Vocabulary"
    },
    {
      "id": 2,
      "name": "Travel Vocabulary"
    }
  ]
}
```



###  GET /api/groups
Returns a list of groups.
- pagination with 100 items per page

#### JSON Response
```json
{
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 2,
    "total_pages": 1
  },
  "items": [
    {
      "id": 1,
      "name": "Basic Vocabulary",
      "words_count": 50
    },
    {
      "id": 2,
      "name": "Advanced Vocabulary",
      "words_count": 100
    }
  ]
}
```

###  GET /api/groups/:id
Returns details of a specific group.

#### JSON Response
```json
{
  "id": 1,
  "name": "Basic Vocabulary",
  "stats": {
    "total_words_count": 50,
    "group_review_count": 120,          // Total review items for this group
    "total_review_count": 450,          // Total review items across all groups
    "reviewed_percentage": 26.7         // Percentage of all reviews from this group  
  }
}
```

###  GET /api/groups/:id/words
Returns a list of words in a specific group.
- pagination with 100 items per page

#### JSON Response
```json
{
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 2,
    "total_pages": 1
  },
  "items": [
    {
      "id": 1,
      "portuguese": "água",
      "kimbundu": "maza",
      "english": "water",
      "parts": {
        "portuguese": "ág",
        "kimbundu": "ma",
        "english": "water"
      },
      "correct_count": 20,
      "wrong_count": 4    
    },
    {
      "id": 2,
      "portuguese": "escola",
      "kimbundu": "xikola",
      "english": "school",
      "parts": {
        "portuguese": "escol",
        "kimbundu": "xikol",
        "english": "learn"
      },
      "correct_count": 10,
      "wrong_count": 2    
    }
  ]
}
```

###  GET /api/groups/:id/words/raw
Returns a list of words in a specific group without pagination.

#### JSON Response
```json
[
  {
    "id": 1,
    "portuguese": "água",
    "kimbundu": "maza",
    "english": "water",
    "parts": {
      "portuguese": "ág",
      "kimbundu": "ma",
      "english": "water"
    },
    "correct_count": 20,
    "wrong_count": 4    
  },
  {
    "id": 2,
    "portuguese": "escola",
    "kimbundu": "xikola",
    "english": "school",
    "parts": {
      "portuguese": "escol",
      "kimbundu": "xikol",
      "english": "learn"
    },
    "correct_count": 10,
    "wrong_count": 2    
  }
]
```

###  GET /api/groups/:id/study_sessions
Returns a list of study sessions for a specific group.
- pagination with 100 items per page

#### JSON Response
```json
{
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 2,
    "total_pages": 1
  },
  "items": [
    {
      "id": 1,
      "group_id": 1,
      "study_activity_id": 1,
      "created_at": "2023-10-01T12:00:00Z",
      "activity_name": "Flashcards",
      "group_name": "Basic Vocabulary"
    },
    {
      "id": 2,
      "group_id": 1,
      "study_activity_id": 2,
      "created_at": "2023-10-02T12:00:00Z",
      "activity_name": "Quiz",
      "group_name": "Basic Vocabulary"
    }
  ]
}
```



###  POST /api/study_sessions
Creates a new study session for a group and activity.
- required params: group_id, study_activity_id	

#### Request Params
- group_id integer
- study_activity_id integer

#### JSON Response
```json
{
  "id": 1,
  "group_id": 1,
  "study_activity_id": 1,
  "created_at": "2023-10-01T12:00:00Z",
  "activity_name": "Flashcards",
  "group_name": "Basic Vocabulary"
}
```

###  GET /api/study_sessions
Returns a list of study sessions.
- pagination with 100 items per page

#### JSON Response
```json
{
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 2,
    "total_pages": 1
  },
  "items": [
    {
      "id": 1,
      "activity_name": "Flashcards",
      "group_name": "Basic Vocabulary",
      "start_time": "2023-10-01T12:00:00Z",
      "end_time": "2023-10-01T12:05:00Z",
      "review_items_count": 20
    },
    {
      "id": 2,
      "activity_name": "Quiz",
      "group_name": "Advanced Vocabulary",
      "start_time": "2023-10-02T12:00:00Z",
      "end_time": "2023-10-02T12:30:00Z",
      "review_items_count": 10
    }
  ]
}
```

###  GET /api/study_sessions/:id
Returns details of a specific study session.

#### JSON Response
```json
{
  "id": 1,
  "activity_name": "Flashcards",
  "group_name": "Basic Vocabulary",
  "start_time": "2023-10-01T12:00:00Z",
  "end_time": "2023-10-01T12:05:00Z",
  "review_items_count": 20
}
```

###  GET /api/study_sessions/continue_learning
Returns a list of 3 study sessions that the user should continue learning, where the words reviewed are less than the number of words in the group.

#### JSON Response
```json
[
  {
    "id": 1,
    "activity_id": 1,
    "group_id": 1,
    "group_name": "Basic Vocabulary",
    "review_items_count": 7,
    "total_words_count": 10
  },
  {
    "id": 2,
    "activity_id": 1,
    "group_id": 2,
    "group_name": "Advanced Vocabulary",
    "review_items_count": 2,
    "total_words_count": 7
  }
]
```


###  GET /api/study_sessions/:id/words
Returns a list of words reviewed in a specific study session.
- pagination with 100 items per page

#### JSON Response
```json
{
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 2,
    "total_pages": 1
  },
  "items": [
    {
      "id": 1,
      "portuguese": "água",
      "kimbundu": "maza",
      "english": "water",
      "correct_count": 10,
      "wrong_count": 2
    },
    {
      "id": 2,
      "portuguese": "escola",
      "kimbundu": "xikola",
      "english": "school",
      "correct_count": 5,
      "wrong_count": 1
    }
  ]
}
```

###  POST /api/study_sessions/reset_history
Resets the study history, including study sessions and word reviews.

#### JSON Response
```json
{
  "success": true,
  "message": "History reset successfully"
}
```

###  POST /api/study_sessions/:id/words/:word_id/review
Records a review of a word in a study session.
- required params: correct

#### Request
- id (study_session_id) integer
- word_id integer
- correct boolean
#### Request Payload
```json
{
  "correct": true
}
```

#### JSON Response
```json
{
  "success": true,
  "id": 1,
  "word_id": 1,
  "study_session_id": 1,
  "correct": true,
  "created_at": "2023-10-01T12:00:00Z"
}
```





## Task Runner Tasks

Lets list out possible tasks we need for our portal

### Initialize Database
This task will initialize the sqlite database called `words.db`.

### Migrate Database
This task will run a series of migrations sql files on the database.

Migrations will be in the `migrations` folder.
The migration file will be run in order of their file name.
The file names should look like this:

```sql
0001_init.sql
0002_create_verbs_table.sql
000?_create_XXXX_table.sql
```

### Seed Data
This task will import json files and transform them into target data for our database.

All seed files live in the `seeds` folder.

In our task we should have a domain-specific-language (DSL) to specify each seed file and its expected group word name.

The file groups should include:
- verbs
- adjectives
- numbers
- adverbs

There will also be a file for the `study_activities` table.

When seeding, the groups should be created based on the json files.

```json
[
  {
    "portuguese": "bom",
    "kimbundu": "uambote",
    "english": "good",
    "parts": {
      "portuguese": "bo",
      "kimbundu": "uambo", 
      "english": "good"
    }
  },
  {
    "portuguese": "água", 
    "kimbundu": "maza",
    "english": "water",
    "parts": {
      "portuguese": "ág",
      "kimbundu": "ma",
      "english": "water"
    }
  },
  ...
]
```

The migration and seed tasks should be run in the same task runner task using python `invoke` command on a single file `db.py`.
