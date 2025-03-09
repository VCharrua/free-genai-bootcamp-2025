from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    
    # Register blueprints
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.study_activity_routes import study_activity_bp
    from app.routes.word_routes import word_bp
    from app.routes.group_routes import group_bp
    from app.routes.study_session_routes import study_session_bp
    
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(study_activity_bp, url_prefix='/api')
    app.register_blueprint(word_bp, url_prefix='/api')
    app.register_blueprint(group_bp, url_prefix='/api')
    app.register_blueprint(study_session_bp, url_prefix='/api')
    
    return app
