from flask import Blueprint, jsonify
from app.models import Dashboard

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/last_study_session', methods=['GET'])
def get_last_study_session():
    return jsonify(Dashboard.get_last_study_session())

@dashboard_bp.route('/study_progress', methods=['GET'])
def get_study_progress():
    return jsonify(Dashboard.get_study_progress())

@dashboard_bp.route('/quick_stats', methods=['GET'])
def get_quick_stats():
    return jsonify(Dashboard.get_quick_stats())

@dashboard_bp.route('/full_reset', methods=['POST'])
def full_reset():
    return jsonify(Dashboard.full_reset())
