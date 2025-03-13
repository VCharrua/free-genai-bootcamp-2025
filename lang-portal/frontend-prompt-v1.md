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

The web-app is intented for desktop only, so we don't have to be concerned with mobile layouts.


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
- /study_activities
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

### Dashboard

This page provides a summary of the student's progression.

- Last study session

### Study Activity Index

The route for this page /study_activities

This is a grade of cards which represent study activities.

A card has the following information:
- thumbnail
- title
- "Launch" button
- "View" button

The Launch button will open a new address in a new tab.
Study activities are their own apps, but in order for them to launch they need to be provided a group_id

eg. ?group_id=4

This page requires no pagination because there is unlikely to be more than 20 possible study activities.

The view button will go to the study activity show page.

### Study Activity Show

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


### Word Index

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

### Word Show

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



### Group Index

The route for this page /groups

This page will have a table/list of groups with the following cells:
- Group Name: the name of the group
    - this will be a link to the Group Show Page
- Words Count: the number of words that are associated with this group

This page contains the same sorting and pagination logic as the Word Index page

### Group Show

The route for this page /groups/:id

This has the same components as Word Index but its scoped to only show words that are associated with this group


### Study Session Index

The route for this page /study_sessions

This page will have a table/list of study sessions similar to the list in the study activity show page

This page contains the same sorting and pagination logic as the Word Index page



### Settings

The route for this page /settings

Reset History button: this will reset the study history, including study sessions and word reviews
- we need to confirm this action in a dialog and type the word `reset history` to confirm

Full Reset button: this will reset the entire database
- we need to confirm this action in a dialog and type the word `full reset` to confirm

Dark Mode Toggle: this is a toggle that changes from light to dark mode (theme)