# Routes package initialization
from flask import jsonify

def register_routes(app):
    """Register all API routes with the Flask application."""
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Simple health check endpoint to verify the API is running."""
        return jsonify({"status": "ok"})
    
    # Import and register other routes
    # from .dashboard_routes import register_routes as register_dashboard_routes
    # register_dashboard_routes(app)
    
    # Return app for chaining if needed
    return app

# Make sure this line is added at the end of your app/__init__.py file:
# 
# from .routes import register_routes
# register_routes(app)
#
# Or ensure it's called in your run.py where the Flask app is created
