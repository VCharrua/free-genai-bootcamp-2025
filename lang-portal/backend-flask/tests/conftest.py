import pytest
import sys
import os

# Add the parent directory to sys.path to allow imports from the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Try to import the Flask app from different possible locations
try:
    # Option 1: Import from run.py (common pattern)
    from run import app as flask_app
except ImportError:
    try:
        # Option 2: The app might be created with a different name in app/__init__.py
        from app import create_app
        flask_app = create_app()
    except ImportError:
        # Option 3: Last resort - modify this to match your actual app structure
        raise ImportError(
            "Could not import the Flask application instance. "
            "Make sure your app is properly initialized and exported. "
            "Check app/__init__.py or run.py"
        )

# Make sure routes are registered for testing
# This ensures the health endpoint is available even if routes are registered
# after the app is exported in run.py
try:
    from app.routes import register_routes
    # Only register if the health endpoint isn't already registered
    if '/api/health' not in [rule.rule for rule in flask_app.url_map.iter_rules()]:
        register_routes(flask_app)
except ImportError:
    print("Warning: Could not import route registration function. Some tests may fail.")

@pytest.fixture
def app():
    """Create a Flask app fixture for testing."""
    flask_app.config['TESTING'] = True
    flask_app.config['DEBUG'] = False
    # You might want to use a test database here
    # flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    yield flask_app

@pytest.fixture
def client(app):
    """Create a test client for the Flask app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Create a test CLI runner for Flask commands."""
    return app.test_cli_runner()

@pytest.fixture
def auth_headers():
    """Provide mock authentication headers for protected endpoints."""
    return {'Authorization': 'Bearer test_token'}
