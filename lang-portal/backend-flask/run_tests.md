# Flask API Endpoint Testing Solution

This document provides guidance on how to test the API endpoints in the `backend-flask` component to ensure they return expected responses.

## Overview

The testing framework is designed to automatically discover and test all API endpoints defined in the `lang-portal/backend-flask/app/routes` directory. It verifies that endpoints:

- Return appropriate HTTP status codes (not 500 errors)
- Return properly formatted JSON responses
- Handle invalid inputs correctly
- Include required response headers

## Setup

### Prerequisites

1. Install testing dependencies:
   ```bash
   pip install pytest pytest-cov
   ```
   
   > **Note**: The `run_tests.sh` script will attempt to install `pytest-cov` automatically if it's missing. If installation fails, it will run tests without coverage reporting.

2. Ensure your Flask application is properly configured for testing in `tests/conftest.py`.

## Running Tests

### Using the Test Script

The simplest way to run all tests is using the included bash script:

```bash
# Make sure the script is executable
chmod +x run_tests.sh

# Run all tests
./run_tests.sh
```

### Manual Test Execution

You can also run tests manually with pytest:

```bash
# Run all tests
python -m pytest tests/ -v

# Run with coverage reporting
python -m pytest tests/ -v --cov=app/routes --cov-report=term-missing

# Run a specific test file
python -m pytest tests/test_specific_endpoints.py -v

# Run a specific test function
python -m pytest tests/test_route_discovery.py::test_discover_and_print_routes -v
```

## What Gets Tested

### Automatic Route Discovery

The testing framework automatically discovers all routes defined in your Flask application using the `get_all_routes()` function in `test_route_discovery.py`. It then:

1. Replaces any dynamic path parameters (e.g., `<id>`) with test values
2. Sends appropriate test data for POST/PUT/PATCH requests
3. Adds authentication headers for protected endpoints
4. Makes the request and validates the response

### Validation Checks

For each endpoint, the framework validates:

- **Status Codes**: Ensures no 500 (server error) responses
- **JSON Format**: Validates that JSON responses contain valid objects or arrays
- **Headers**: Checks that appropriate Content-Type headers are included
- **Pagination Format**: Verifies that endpoints expected to return paginated results use the correct format

### Pagination Testing

The testing framework includes dedicated tests to validate the format of paginated responses using a flexible validation approach that supports various pagination structures:

- Supports multiple response formats:
  - `{"items": [...], "pagination": {...}}` 
  - `{"results": [...], "meta": {...}}`
  - `{"data": [...], "meta": {...}}`
  - Direct array responses for non-paginated collections

- Validates common pagination metadata across different naming conventions:
  - Page number (supports: `page`, `current_page`, `page_num`, `pageNum`)
  - Items per page (supports: `per_page`, `limit`, `page_size`, `pageSize`)
  - Total item count (supports: `total_items`, `count`, `total`, `totalItems`)
  - Total pages (supports: `total_pages`, `pages`, `num_pages`, `pageCount`, `totalPages`)
  - Optional navigation links (supports multiple formats)

- Tests pagination across different endpoint types:
  - Main resource endpoints (e.g., `/api/words`)
  - Group-specific endpoints (e.g., `/api/groups/{group_id}/words`)
  - Activity-specific endpoints (e.g., `/api/study_activities/{activity_id}/study_sessions`)

- Validates both default pagination and custom page size requests (`?page=1&per_page=5`)

### Specific Endpoint Testing

For critical endpoints, detailed tests in `test_specific_endpoints.py` verify:

- Health check endpoint returns "status": "ok"
- Error handling for invalid requests
- Response header correctness

## Test Structure

- **conftest.py**: Sets up test fixtures including the Flask app and test client
- **test_route_discovery.py**: Handles automatic route discovery and testing, now using the shared pagination validation
- **test_specific_endpoints.py**: Contains detailed tests for critical endpoints
- **test_pagination.py**: Contains flexible pagination validation that supports multiple formats and naming conventions

## Adding New Tests

### For New API Endpoints

New API endpoints are automatically included in testing via route discovery. However:

1. If your new endpoint requires special handling, modify the route discovery test to accommodate it
2. For critical endpoints, add specific test cases in `test_specific_endpoints.py`

### Example: Adding a Specific Test

```python
def test_my_new_endpoint(client):
    """Test my new endpoint behavior."""
    # Setup any needed test data
    test_data = {"key": "value"}
    
    # Make the request
    response = client.post('/api/my-endpoint', 
                          data=json.dumps(test_data),
                          content_type='application/json')
    
    # Assert expected behavior
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'id' in data
    assert data['message'] == 'Resource created'
```

## Understanding Test Results

- **Passed tests** are marked with `.`
- **Failed tests** are marked with `F` and include details about what failed
- **Coverage report** shows which parts of your code were exercised by tests

### Example Output

```
Running Flask API tests...
============================= test session starts ==============================
Discovered 7 tests in tests/
test_route_discovery.py::test_discover_and_print_routes PASSED
test_route_discovery.py::test_all_routes_return_valid_response PASSED
test_specific_endpoints.py::test_health_endpoint PASSED
test_specific_endpoints.py::test_api_error_handling PASSED
test_specific_endpoints.py::test_api_response_headers PASSED
============================= 5 passed in 1.25s ===============================

---------- coverage: platform linux, python 3.8.10-final-0 -----------
Name                                  Stmts   Miss  Cover   Missing
-------------------------------------------------------------------
app/routes/__init__.py                    5      0   100%
app/routes/dashboard_routes.py           25      3    88%   45-48
app/routes/group_routes.py               40      2    95%   72-73
app/routes/study_activity_routes.py      35      0   100%
app/routes/study_session_routes.py       60      5    92%   103-109
app/routes/word_routes.py                20      0   100%
-------------------------------------------------------------------
TOTAL                                   185     10    95%

Tests completed!
```

## Troubleshooting

### 1. Tests Cannot Import from App

Ensure the app directory is in the Python path. Check that `conftest.py` adds the parent directory to `sys.path`.

### 2. Missing pytest-cov Package

If you see an error about unrecognized arguments `--cov=app/routes --cov-report=term-missing`, it means the pytest-cov package is not installed. Install it using:

```bash
pip install pytest-cov
```

Or simply run the `run_tests.sh` script which will attempt to install it for you.

### 3. Mock Authentication Fails

If your application has authentication, ensure the mock auth headers in the fixture match what your application expects.

### 4. API Routes with Special Requirements

For endpoints with special requirements (file uploads, complex input validation), you may need to modify the automatic testing in `test_route_discovery.py` or add specific tests.

### 5. Pagination Validation Failures

If pagination validation fails, check:
- That your endpoint returns the expected structure (see Pagination Testing section)
- That pagination metadata fields are present with one of the supported naming conventions
- That values are consistent (e.g., page numbers start at 1, not 0)
