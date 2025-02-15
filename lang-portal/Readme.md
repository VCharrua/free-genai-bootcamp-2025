# Lang-Portal Backend Component

> **Note**: The following text is going to change during the development of the next assignments and it's to be used as a simple workflow journal for the first week tasks.

## Steps used for API creation based on the Week1 assignment.

In order to complete the initial APIs used in the backend component of the solution, the next steps were taken in the following order.


### 1. Backend code Import  

The backend code files were copied from the [ExamProCo/free-genai-bootcamp-2025 repo](https://github.com/ExamProCo/free-genai-bootcamp-2025/tree/main) and didn't included the missing API code and definitions.

In order to facilitate the final deployment of the assignment code changes, a new branch was created as indicated in Issue [#4](https://github.com/VCharrua/free-genai-bootcamp-2025/issues/4).

### 2. API creation using AI Coding Assistants

During the evaluation phase, I used Cursor.Ai and GitHub Copilot for most of the API code creation tests.

I used `GitHub Copilot` due to the following factors: 
- Already used tool as principal resource for AI Code Assistants.
- Access to the PRO version of GitHub Copilot.
- Additional experience for future certification.

The model used was:
`Claude 3.5 Sonnet`

Using some concepts obtained from the Bootcamp Online Videos, the first tool I used was the Copilot Chat interface.

#### Context Analysis (API Endpoints)

```md
> does copilot use a rules file to help code flask?
```

The result was a `routes.yaml` file with the API structure including the endpoints, methods and paramenters for the first file.


```yaml
routes:
  study_sessions:
    - path: /api/study-sessions
      methods: 
        - POST
      description: Create a new study session
      parameters:
        - group_id: integer
        - activity_id: integer
      responses:
        200: 
          description: Study session created successfully
        500:
          description: Server error

    - path: /api/study-sessions/{id}/review
      methods:
        - POST
      description: Add review items to a study session
      parameters:
        - word_id: integer
        - correct: boolean
```

Based on the response, the following prompt was provided:

```md
> can you create a rules.yaml file with all the endpoints in the routes folder?
```

The Copilot displayed the following response:

```yaml
routes:
  study_sessions:
    - path: /api/study-sessions
      methods: 
        - GET
        - POST
      description: Get all study sessions or create new one
      parameters:
        get:
          - name: page
            type: integer
            default: 1
          - name: per_page
            type: integer
            default: 10
        post:
          - name: group_id
            type: integer
            required: true
          - name: activity_id
            type: integer
            required: true
      responses:
        200: 
          description: Success - Returns paginated list of sessions or creates new session
        500:
          description: Server error

    - path: /api/study-sessions/{id}
      methods:
        - GET
      description: Get specific study session details
      parameters:
        - name: id
          type: integer
          required: true
        - name: page
          type: integer
          default: 1
        - name: per_page
          type: integer
          default: 10
      responses:
        200:
          description: Returns session details with reviewed words
        404:
          description: Session not found
        500:
          description: Server error

    - path: /api/study-sessions/{id}/review
      methods:
        - POST
      description: Add review items to study session
      parameters:
        - name: id
          type: integer
          required: true
        - name: word_id
          type: integer
          required: true
        - name: correct
          type: boolean
          required: true
      responses:
        200:
          description: Review item added successfully
        404:
          description: Session not found
        500:
          description: Server error

    - path: /api/study-sessions/reset
      methods:
        - POST
      description: Reset all study sessions and review items
      responses:
        200:
          description: Study history cleared successfully
        500:
          description: Server error

database_schema:
  tables:
    study_sessions:
      - id: integer primary key
      - group_id: integer foreign key
      - study_activity_id: integer foreign key
      - created_at: datetime
    
    word_review_items:
      - id: integer primary key
      - study_session_id: integer foreign key
      - word_id: integer foreign key
      - correct: boolean
```

```
This YAML file defines:

- All endpoints from study_sessions.py
- Their HTTP methods
- URL parameters
- Request body parameters
- Expected responses
- Basic database schema

You can use this as a reference for both Copilot and development documentation.
```

#### API Creation

The next command invoked the creation for the first POST method as follows:

```md
> create code for the POST method of the study-sessions api
```

Result:

```python
def load(app):
  @app.route('/api/study-sessions', methods=['POST'])
  @cross_origin()
  def create_study_session():
    try:
      data = request.get_json()
      
      # Validate required fields
      if not data or 'group_id' not in data or 'activity_id' not in data:
        return jsonify({
          "error": "Missing required fields: group_id and activity_id"
        }), 400

      cursor = app.db.cursor()
      
      # Verify group exists
      cursor.execute('SELECT id FROM groups WHERE id = ?', (data['group_id'],))
      if not cursor.fetchone():
        return jsonify({"error": "Group not found"}), 404

      # Verify activity exists
      cursor.execute('SELECT id FROM study_activities WHERE id = ?', (data['activity_id'],))
      if not cursor.fetchone():
        return jsonify({"error": "Study activity not found"}), 404

      # Create new study session
      cursor.execute('''
        INSERT INTO study_sessions (group_id, study_activity_id, created_at)
        VALUES (?, ?, ?)
      ''', (data['group_id'], data['activity_id'], datetime.utcnow()))
      
      session_id = cursor.lastrowid
      app.db.commit()

      # Get the created session details
      cursor.execute('''
        SELECT 
          ss.id,
          ss.group_id,
          g.name as group_name,
          sa.id as activity_id,
          sa.name as activity_name,
          ss.created_at
        FROM study_sessions ss
        JOIN groups g ON g.id = ss.group_id
        JOIN study_activities sa ON sa.id = ss.study_activity_id
        WHERE ss.id = ?
      ''', (session_id,))
      
      session = cursor.fetchone()

      return jsonify({
        'id': session['id'],
        'group_id': session['group_id'],
        'group_name': session['group_name'],
        'activity_id': session['activity_id'],
        'activity_name': session['activity_name'],
        'start_time': session['created_at'],
        'end_time': session['created_at'],
        'review_items_count': 0
      }), 201

    except Exception as e:
      app.db.rollback()
      return jsonify({"error": str(e)}), 500

  # ...existing code...

```
```md
This implementation:

1. Validates required fields (group_id and activity_id).
2. Verifies that both group and activity exist.
3. Creates a new study session.
4. Returns the created session details.
5. Includes proper error handling and database transaction management.
6. Returns HTTP 201 on successful creation.
7. Maintains consistent response format with other endpoints.

To test this endpoint, you can use curl or Postman with:
```

```sh
curl -X POST http://localhost:5000/api/study-sessions \
  -H "Content-Type: application/json" \
  -d '{"group_id": 1, "activity_id": 1}'
```



From the resulting code, it was possible to identify that the provided function was returning the wrong data back to the API call.

This minor change was done with the following prompt:

```md
> Change implementation item 4 to return the session_id
```

And *voilà!*...

```python
def load(app):
  @app.route('/api/study-sessions', methods=['POST'])
  @cross_origin()
  def create_study_session():
    try:
      data = request.get_json()
      
      # Validate required fields
      if not data or 'group_id' not in data or 'activity_id' not in data:
        return jsonify({
          "error": "Missing required fields: group_id and activity_id"
        }), 400

      cursor = app.db.cursor()
      
      # Verify group exists
      cursor.execute('SELECT id FROM groups WHERE id = ?', (data['group_id'],))
      if not cursor.fetchone():
        return jsonify({"error": "Group not found"}), 404

      # Verify activity exists
      cursor.execute('SELECT id FROM study_activities WHERE id = ?', (data['activity_id'],))
      if not cursor.fetchone():
        return jsonify({"error": "Study activity not found"}), 404

      # Create new study session
      cursor.execute('''
        INSERT INTO study_sessions (group_id, study_activity_id, created_at)
        VALUES (?, ?, ?)
      ''', (data['group_id'], data['activity_id'], datetime.utcnow()))
      
      session_id = cursor.lastrowid
      app.db.commit()

      return jsonify({
        'session_id': session_id
      }), 201

    except Exception as e:
      app.db.rollback()
      return jsonify({"error": str(e)}), 500

  # ...existing code...
```
```md
The changes:

1. Simplified response to only return the *session_id*.
2. Maintains HTTP 201 status code for resource creation.
3. Keeps all validation and error handling.
4. More efficient since we don't need additional queries to fetch session details.

To test with curl:
```
```sh
curl -X POST http://localhost:5000/api/study-sessions \
  -H "Content-Type: application/json" \
  -d '{"group_id": 1, "activity_id": 1}'
```

<br/>
The same steps were made for all the assignment methods:

- POST /study_sessions
- POST /study_sessions/:id/review
- GET /groups/:id/words/raw


#### Creation of created methods API documentation

Finally, a `readme.md` file was created by the Code Assistant based on the actions taken by the GitHub Copilot:

- [API Methods documentation](https://github.com/VCharrua/free-genai-bootcamp-2025/lang-portal/backend-flask/routes/Readme.md)


### Branch Merge

In order to merge the Week 1 with the main branch, a pull request was created and the branch merged.