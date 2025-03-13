from flask import Blueprint, jsonify
from app.models import StudyActivity, StudySession
from app.utils import get_pagination_params

study_activity_bp = Blueprint('study_activities', __name__)

@study_activity_bp.route('/study_activities', methods=['GET'])
def get_study_activities():
    activities = StudyActivity.get_all()
    return jsonify(activities)

@study_activity_bp.route('/study_activities/<int:activity_id>', methods=['GET'])
def get_study_activity(activity_id):
    activity = StudyActivity.get_by_id(activity_id)
    if not activity:
        return jsonify({'error': 'Study activity not found'}), 404
    return jsonify(activity)

@study_activity_bp.route('/study_activities/<int:activity_id>/launch', methods=['GET'])
def launch_study_activity(activity_id):
    launch_info = StudyActivity.get_launch_info(activity_id)
    if not launch_info:
        return jsonify({'error': 'Study activity not found'}), 404
    return jsonify(launch_info)

@study_activity_bp.route('/study_activities/<int:activity_id>/study_sessions', methods=['GET'])
def get_activity_study_sessions(activity_id):
    page, per_page = get_pagination_params()
    return jsonify(StudySession.get_by_activity_id(activity_id, page, per_page))
