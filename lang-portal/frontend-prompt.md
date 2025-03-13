# Front End Prompt

We would like to develop a front end for the language portal that allows users to interact with the language portal in a way that is easy to use and engaging.

The languages accepted for the language portal are:
- Portuguese
- Kimbundu

## Role / Profession

Frontend developer


## Project Description



### Project Brief

We are building a portuguese and kimbundu language learning web-app which serves the following purposes:
- A portal to launch study activities
- to store, group and explore portuguese and kimbundu vocabolary
- to review study progress

The web-app is intented for desktop and mobile users, so we will use a responsive design.

The web-app will connect with a python flask backend API that will serve data for the web-app
The backend API will be available at a default http://localhost:5000 url that should be included in a config file for easy deployment

### Technical Requirements
- React.js as the frontend library
- Tailwind CSS as the css framework
- Vite.js as the local development server
- Typescript for the programming language
- ShadCN for components

### Frontend Routes
This is a list of routes for our web-app we are building.
Each of these routes are a page and we'll describe them in more details under the page heading

- /dashboard
- /settings
- /study-activities
- /study_activities/:id
- /study_activities/:id/launch
- /words
- /words/:id
- /groups
- /groups/:id
- /study_sessions
- /study_sessions/:id

The default route should forward to `/dashboard`

### Global components

#### Navigation

There will be a vertical navigation bar with the following links:

- Dashboard
- Study Activities
- Words
- Word Groups
- Study Sessions
- Settings

The vertical navigation bar can be collapsed into a hamburger menu

#### Banner

There will be a banner at the top of the web-app which displays the name of the web-app with a background image or color.

The banner will be of a bigger height in the dashboard page than other pages

#### Breadcrumb

Beneath the banner will be a breadcrumb so users can easily see where they are in the web-app. Examples of breadcrumbs:

- Dashboard
- Study Activity > Adventure MUD
- Study Activity > Typing Tutor
- Words > Navegador
- Word Groups > Core verbs


## Pages

### PAGE: Dashboard (default page)

This page provides a summary of the student's progression.

- Last study session
    - shows last activity used
    - shows when last activity used
    - summarizes wrong vs correct from last activity
    - has link to the group

- Study Progress
    - total words 
        - across all study session show the total words studied out of all possible words in our database 
    - display a mastery progress eg. 0%

- Quick Stats
    - success rate eg. 80%
    - total study sessions eg. 4
    - total active groups eg. 3
    - study streak eg. 4 days

- Start Studying Button
    - goes to study activities page

- Continue Learning
    - Pick up where you left off
    - with a few recent incomplete study session information
        - group name
        - words remaining
        - a small progress bar showing how far you are in the study session (eg. 7/10 and bar)
    - has button to start a new study session that redirects to the study activity page

- Performance Graph
    - Shows Vocabulary Progress
    - monthly performance with three lines (correct, wrong and total reviews)
    - Should account that the results from the API call only include dates where there was activity.


#### Backend API calls for the Dashboard `Last study session` component

Returns information about the most recent study session.
- GET /api/dashboard/last_study_session

##### JSON Response
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

#### Backend API calls for the Dashboard `Study Progress` component
Return study progress statistics.
- GET /api/dashboard/study_progress

##### JSON Response
```json
{
  "total_words": 100,
  "studied_words": 50,
  "studied_words_trend": 10
}
```

#### Backend API calls for the Dashboard `Quick Stats` component
Returns quick overview statistics.
- GET /api/dashboard/quick_stats

##### JSON Response
```json
{
  "success_rate": 80.0,
  "success_rate_trend": 10.0,
  "total_study_sessions": 4,
  "total_active_groups": 3,
  "study_streak_days": 4
}
```

#### Backend API calls for the Dashboard `Performance Graph` component
Returns performance statistics.
- GET /api/dashboard/performance_graph

##### JSON Response
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

#### Backend API calls for the Dashboard `Continue Learning` component
Returns recent incomplete study sessions.
- GET /api/study_sessions/continue_learning

##### JSON Response
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




### PAGE: Study Activity Index

The route for this page /study-activities

This is a grade of cards which represent study activities.

A card has the following information:
- thumbnail
- title
- "Launch" button
- "View" button

The Launch button will open a new address in a new tab.
Study activities are their own apps, but in order for them to launch they need to be provided a group_id through an additional study activity launch page `/study_activities/:id/launch` where the user can select a group_id from available groups for the study activity


This page requires no pagination because there is unlikely to be more than 20 possible study activities.

The view button will go to the study activity show page.


#### Backend API calls for `Study Activity Index` cards
Cards will get data from the following endpoint:
- GET /api/study-activities

##### JSON Response
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


### PAGE: Study Activity Launch

The route for this page /study_activities/:id/launch

This page will allow users to select a group for the study activity. After selecting a group, the user will have to click a `launch` button to start the study session for this activity.

The launch button will start a new study session using the study_activity_id and group_id as parameters of the POST request and redirect the user to the study activity app page in a new tab, using the `url` field from the GET response.

After selection the group, the Launch button should be enabled and allow for the api call:
- POST /api/study_sessions
    - Request Params
        - group_id integer
        - study_activity_id integer

#### Backend API calls for `Study Activity Launch Page`
This page will get data for the group selection from the following endpoint:
- GET /api/study_activities/:id/launch

##### JSON Response
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

### PAGE: Study Activity Show

The route for this page /study_activities/:id

This page will have a information section with the following information:
- thumbnail
- title
- description
- launch button

There will be a list of sessions for the study activity
A session item will contain the following information:
- Group Name: So you know which group the session is for
    - This will be a link to the Group Show Page 
- Start Time: When the session was created in YYYY-MM-DD HH:MM format (12 hours)
- End Time: When the last word_review item was created
- Number of Review Items: The number of word_review items in the session

#### Backend API calls for `Study Activity Show`
This page will use the :id route param to call the following endpoints:

##### calls for the information section
- GET /api/study_activities/:id

###### JSON Response
```json
{
  "id": 1,
  "name": "Flashcards",
  "description": "A study activity using flashcards to learn vocabulary.",
  "url": "https://example.com/wordsearch",  
  "preview_url": "http://example.com/flashcards/thumbnail"
}
```

##### calls for the list of sessions
- GET /api/study_activities/:id/study_sessions

###### JSON Response
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


### PAGE: Word Index

The route for this page /words

This page will have a table/list of words with the following cells:
- Portuguese: the portuguese word
    - this will also contain a small button to play the sound of the word
    - the portuguese word will be a link to the Word Show Page
- Kimbundu: the kimbundu version of the word
    - this will also contain a small button to play the sound of the word
- English: the english version of the word
- Correct Count: The number of times this word has been correctly reviewed
- Wrong Count: The number of times this word has been incorrectly reviewed

This page requires pagination because there could be more than 100 words in the database.
There should be only 100 words per page
- Previous button: grey out if you cannot go further back
- Page 1 of 3: with the current page bolded
- Next button: grey out if you cannot go further forward

All table headings should be sortable, if you click on a heading it will toggle between ascending and descending (ASC and DESC)
An ascii arrow should indicate direction and the column being sorted with ASC pointing down and DESC pointing up


#### Backend API calls for `Word Index`
Returns a list of words by calling the following endpoint:
- GET /api/words

##### JSON Response
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


### PAGE: Word Show

The route for this page /words/:id

This page will have a information section with the following information:
- Portuguese: the portuguese word
    - this will also contain a small button to play the sound of the word
- Kimbundu: the kimbundu version of the word
    - this will also contain a small button to play the sound of the word
- English: the english version of the word
- Study Statistics
    - correct count
    - wrong count
- Word Groups
    - show a series of pills eg. tags
    - when group name is clicked it will take us to the group show page


#### Backend API calls for `Word Show`
Returns details of a specific word by calling the following endpoint:
- GET /api/words/:id

##### JSON Response
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

### PAGE: Group Index

The route for this page /groups

This page will have a table/list of groups with the following cells:
- Group Name: the name of the group
    - this will be a link to the Group Show Page
- Words Count: the number of words that are associated with this group

This page contains the same sorting and pagination logic as the Word Index page

#### Backend API calls for `Group Index`
Returns a list of groups by calling the following endpoint:
- GET /api/groups

##### JSON Response
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

### PAGE: Group Show

The route for this page /groups/:id

This has the same components as Word Index but its scoped to only show words that are associated with this group

This page will have a information section with the following information:
- group name
- stats
    - word count


There will be a list of words for the group using the same column configuration as the Word Index page and sorting and pagination logic as the Word Index page

There will be a list of study sessions for the group using the same column configuration as the Study sessions index page and sorting and pagination logic as the Word Index page

Both lists will be under tabs that allow the user to switch between them


#### Backend API calls for the information section of `Group Show`
Returns details of a specific group by calling the following endpoint:
- GET /api/groups/:id

##### JSON Response
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

#### Backend API calls for the list of words in `Group Show`
Returns a list of words for the group by calling the following endpoint:
- GET /api/groups/:id/words

##### JSON Response
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

#### Backend API calls for the list of study sessions in `Group Show`
Returns a list of study sessions for the group by calling the following endpoint:
- GET /api/groups/:id/study_sessions

##### JSON Response
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


### PAGE: Study Session Index

The route for this page /study_sessions

This page will have a table/list of study sessions similar to the list in the study activity show page

This page contains the same sorting and pagination logic as the Word Index page

#### Backend API calls for `Study Session Index`
Returns a list of study sessions by calling the following endpoint:
- GET /api/study_sessions

##### JSON Response
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

### PAGE: Settings

The route for this page /settings

Reset History button: this will reset the study history, including study sessions and word reviews
- we need to confirm this action in a dialog and type the word `reset history` to confirm

Full Reset button: this will reset the entire database
- we need to confirm this action in a dialog and type the word `full reset` to confirm

Dark Mode Toggle: this is a toggle that changes from light to dark mode (theme)


#### Backend API calls for `Reset History Button`
Post a request to the following endpoint:
- POST /api/study_sessions/reset_history

##### JSON Response
```json
{
  "success": true,
  "message": "History reset successfully"
}
```

#### Backend API calls for `Full Reset Button`
Post a request to the following endpoint:
- POST /api/dashboard/full_reset

##### JSON Response
```json
{
  "success": true,
  "message": "Full reset successfully"
}
```