from flask import Blueprint, jsonify, request
from app.models import StudySession
from app.utils import get_pagination_params
from lib.db import query_db

study_session_bp = Blueprint('study_sessions', __name__)

@study_session_bp.route('/study_sessions', methods=['GET'])
def get_study_sessions():
    page, per_page = get_pagination_params()
    return jsonify(StudySession.get_all(page, per_page))

@study_session_bp.route('/study_sessions', methods=['POST'])
def create_study_session():
    if not request.json or 'group_id' not in request.json or 'study_activity_id' not in request.json:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    group_id = request.json.get('group_id')
    study_activity_id = request.json.get('study_activity_id')
    
    session = StudySession.create(group_id, study_activity_id)
    return jsonify(session)

@study_session_bp.route('/study_sessions/<int:session_id>', methods=['GET'])
def get_study_session(session_id):
    session = StudySession.get_by_id(session_id)
    if not session:
        return jsonify({'error': 'Study session not found'}), 404
    return jsonify(session)

@study_session_bp.route('/study_sessions/<int:session_id>/words', methods=['GET'])
def get_session_words(session_id):
    page, per_page = get_pagination_params()
    return jsonify(StudySession.get_session_words(session_id, page, per_page))

@study_session_bp.route('/study_sessions/<int:session_id>/words/<int:word_id>/review', methods=['POST'])
def record_word_review(session_id, word_id):
    if not request.json or 'correct' not in request.json:
        return jsonify({'error': 'Missing required parameter "correct"'}), 400
    
    correct = request.json.get('correct', False)
    result = StudySession.record_word_review(session_id, word_id, correct)
    return jsonify(result)

@study_session_bp.route('/study_sessions/reset_history', methods=['POST'])
def reset_history():
    return jsonify(StudySession.reset_history())

@study_session_bp.route('/continue_learning', methods=['GET'])
def get_continue_learning():
    """
    Returns a list of 3 study sessions where the words reviewed are less than the total words in the group.
    """
    return jsonify(StudySession.get_continue_learning())
