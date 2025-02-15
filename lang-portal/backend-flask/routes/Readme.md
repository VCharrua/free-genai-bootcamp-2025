# API Development Steps for Language Learning Portal

## Overview
This document outlines the development steps for three key API endpoints in our language learning portal backend.

## 1. POST /api/study-sessions
**Purpose**: Create new study sessions

### Implementation Steps:
1. Added route decorator with POST method and CORS support
2. Implemented validation for required fields:
   - group_id
   - activity_id
3. Added database checks:
   ```sql
   - SELECT id FROM groups WHERE id = ?
   - SELECT id FROM study_activities WHERE id = ?
   ```
4. Created INSERT query:
   ```sql
   INSERT INTO study_sessions (group_id, study_activity_id, created_at)
   VALUES (?, ?, ?)
   ```
5. Implemented response format:
   ```json
   {
     "session_id": 123
   }
   ```

## 2. POST /api/study-sessions/:id/review
**Purpose**: Add or update word review items for a study session

### Implementation Steps:
1. Added route with dynamic URL parameter
2. Implemented request validation:
   ```python
   required_fields = ['word_id', 'correct']
   ```
3. Created database checks:
   ```sql
   - SELECT id FROM study_sessions WHERE id = ?
   - SELECT id FROM words WHERE id = ?
   ```
4. Implemented upsert logic:
   ```sql
   # Check existing
   SELECT id FROM word_review_items 
   WHERE study_session_id = ? AND word_id = ?

   # Update or Insert based on result
   UPDATE/INSERT INTO word_review_items
   ```
5. Added response format:
   ```json
   {
     "message": "Review item processed successfully"
   }
   ```

## 3. GET /groups/:id/words/raw
**Purpose**: Retrieve all words for a group with their component parts

### Implementation Steps:
1. Added GET route with group ID parameter
2. Implemented group existence check:
   ```sql
   SELECT name FROM groups WHERE id = ?
   ```
3. Created JOIN query for words and parts:
   ```sql
   SELECT w.*, wp.parts
   FROM words w
   JOIN word_groups wg ON w.id = wg.word_id
   LEFT JOIN word_parts wp ON w.id = wp.word_id
   WHERE wg.group_id = ?
   ```
4. Added JSON deserialization for parts field
5. Implemented response format:
   ```json
   [
     {
       "id": 1,
       "kanji": "漢字",
       "romaji": "kanji",
       "english": "Chinese characters",
       "parts": [
         {
           "kanji": "漢",
           "meaning": "China"
         },
         {
           "kanji": "字",
           "meaning": "character"
         }
       ]
     }
   ]
   ```

## Testing Instructions

### Test POST /api/study-sessions:
```bash
curl -X POST http://localhost:5000/api/study-sessions \
  -H "Content-Type: application/json" \
  -d '{"group_id": 1, "activity_id": 1}'
```

### Test POST /api/study-sessions/:id/review:
```bash
curl -X POST http://localhost:5000/api/study-sessions/1/review \
  -H "Content-Type: application/json" \
  -d '{"word_id": 1, "correct": true}'
```

### Test GET /groups/:id/words/raw:
```bash
curl -X GET http://localhost:5000/groups/1/words/raw
```