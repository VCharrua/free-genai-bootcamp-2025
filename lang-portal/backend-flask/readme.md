# Language Learning Portal - Backend API

This backend API serves as the data management layer for a language learning portal focused on Portuguese, Kimbundu, and English vocabulary. It provides endpoints for managing vocabulary words, thematic groups, study sessions, and learning activities.

## Objectives

- Serve as an inventory for vocabulary that can be learned
- Act as a Learning Record Store (LRS) to track learning progress
- Provide unified access to different learning activities
- Expose RESTful API endpoints for the frontend application

## Tech Stack

- **Flask**: Lightweight web framework for Python
- **SQLite**: Serverless relational database 
- **Flask-CORS**: CORS support for handling cross-origin requests
- **Invoke**: Python task execution tool for database operations

## File Structure

```
backend-flask/
├── lib/                            # Core utilities
│   ├── __init__.py
│   └── db.py                       # Database connection and helpers
├── app/                            # Application code
│   ├── __init__.py                 # Flask app initialization
│   ├── models.py                   # Data models
│   ├── utils.py                    # Utility functions
│   └── routes/                     # API endpoint definitions
│       ├── __init__.py
│       ├── dashboard_routes.py     # Dashboard endpoints
│       ├── study_activity_routes.py # Learning activity endpoints
│       ├── word_routes.py          # Word vocabulary endpoints
│       ├── group_routes.py         # Word group endpoints
│       └── study_session_routes.py # Study session endpoints
├── migrations/                     # SQL database migration files
│   ├── 0001_create_words_table.sql
│   ├── 0002_create_groups_table.sql
│   ├── 0003_create_words_groups_table.sql
│   ├── 0004_create_study_activities_table.sql
│   ├── 0005_create_study_sessions_table.sql
│   └── 0006_create_word_review_items_table.sql
├── seeds/                          # Sample data for database seeding
│   ├── adjectives.json
│   ├── adverbs.json
│   ├── numbers.json
│   ├── study_activities.json
│   └── verbs.json
├── words.db                        # SQLite database (created on initialization)
├── config.py                       # Application configuration
├── tasks.py                        # Task runner commands
├── requirements.txt                # Project dependencies
└── run.py                          # Application entry point
```

## Database Schema

The database consists of the following tables:

- **words**: Vocabulary words in Portuguese, Kimbundu, and English
- **groups**: Thematic categories of words
- **words_groups**: Join table for many-to-many relationship between words and groups
- **study_activities**: Available learning activities
- **study_sessions**: Records of study sessions with timestamp
- **word_review_items**: Records of word practice attempts

## API Endpoints

### Dashboard Endpoints

- `GET /api/dashboard/last_study_session` - Get most recent study session
- `GET /api/dashboard/study_progress` - Get vocabulary study progress statistics
- `GET /api/dashboard/quick_stats` - Get overview statistics
- `POST /api/dashboard/full_reset` - Reset all user data

### Study Activities

- `GET /api/study_activities` - List all study activities
- `GET /api/study_activities/:id` - Get details of a specific study activity
- `GET /api/study_activities/:id/launch` - Get launch info including available groups
- `GET /api/study_activities/:id/study_sessions` - Get study sessions for an activity

### Words

- `GET /api/words` - List all vocabulary words (paginated)
- `GET /api/words/:id` - Get details of a specific word

### Groups

- `GET /api/groups` - List all word groups (paginated)
- `GET /api/groups/:id` - Get details of a specific group
- `GET /api/groups/:id/words` - Get words in a group (paginated)
- `GET /api/groups/:id/words/raw` - Get all words in a group without pagination
- `GET /api/groups/:id/study_sessions` - Get study sessions for a group

### Study Sessions

- `GET /api/study_sessions` - List all study sessions (paginated)
- `POST /api/study_sessions` - Create a new study session
- `GET /api/study_sessions/:id` - Get details of a specific study session
- `GET /api/study_sessions/:id/words` - Get words reviewed in a session
- `POST /api/study_sessions/:id/words/:word_id/review` - Record a word review
- `POST /api/study_sessions/reset_history` - Reset study history

## Setup and Deployment

### Prerequisites

- Python 3.6+
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd lang-portal/backend-flask
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up the database:
   ```
   python -m invoke setup
   ```

The setup process will initialize the database with essential data. If you want to include additional demo data (study sessions and word review items), you can set the `FLASK_DEMO` environment variable:

```bash
# To include demo data (study sessions and word review history)
export FLASK_DEMO=true
python -m invoke setup

# To setup without demo data (default)
python -m invoke setup
```

Demo data includes sample study sessions and word review records that simulate user activity, useful for testing dashboard statistics and learning progress features.

### Running the Application

Start the Flask development server:
```
python run.py
```

The API will be available at http://localhost:5000.

For production deployment, it's recommended to use a WSGI server like Gunicorn:
```
pip install gunicorn
gunicorn run:app
```

## Task Runner Commands

The following commands are available through the Invoke task runner:

- `python -m invoke init_database` - Initialize the SQLite database
- `python -m invoke migrate` - Run database migrations
- `python -m invoke seed` - Seed the database with sample data
- `python -m invoke setup` - Run all of the above commands in sequence
- `python -m invoke run` - Start the Flask development server

## Testing

### Manual Testing

You can test the API using tools like:
- cURL from the command line
- Postman or similar API testing tool
- Browser extensions like RESTer or similar

### Example API Requests

Get all vocabulary words:
```bash
curl -X GET http://localhost:5000/api/words
```

Create a new study session:
```bash
curl -X POST http://localhost:5000/api/study_sessions \
  -H "Content-Type: application/json" \
  -d '{"group_id": 1, "study_activity_id": 1}'
```

Record a word review:
```bash
curl -X POST http://localhost:5000/api/study_sessions/1/words/1/review \
  -H "Content-Type: application/json" \
  -d '{"correct": true}'
```

## Error Handling

The API uses standard HTTP status codes:
- 200 OK for successful requests
- 400 Bad Request for invalid input
- 404 Not Found for resources that don't exist
- 500 Internal Server Error for server-side issues

Errors are returned as JSON with an error message.

## Additional Notes

- The database is SQLite, which is file-based and doesn't require a separate server
- No authentication is implemented as per requirements (single user system)
- The API is CORS-enabled for cross-origin requests from the frontend

## Future Improvements

- Add automated tests
- Implement user authentication if multi-user support is needed
- Add more detailed analytics for learning progress
- Add caching for frequently accessed data

# Backend Flask API

## Testing the API Endpoints

This project includes a comprehensive test suite to ensure all API endpoints return expected responses.

### Running the Tests

1. Make sure all dependencies are installed:
```bash
pip install pytest pytest-cov
```

2. Run the test suite using the provided script:
```bash
./run_tests.sh
```

### What the Tests Cover

- **Automatic Route Discovery**: Tests automatically discover all defined routes
- **Response Status Validation**: Ensures endpoints return appropriate status codes (not 500)
- **JSON Response Validation**: Checks that JSON responses are properly formatted
- **Specific Endpoint Testing**: Detailed tests for critical endpoints

### Adding New Tests

When adding new API endpoints, the automatic discovery test will include them in basic testing. For endpoints that need more detailed verification, add specific test cases to `tests/test_specific_endpoints.py`.
