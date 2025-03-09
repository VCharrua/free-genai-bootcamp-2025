from flask import Blueprint, jsonify
from app.models import Group
from app.utils import get_pagination_params

group_bp = Blueprint('groups', __name__)

@group_bp.route('/groups', methods=['GET'])
def get_groups():
    page, per_page = get_pagination_params()
    return jsonify(Group.get_all(page, per_page))

@group_bp.route('/groups/<int:group_id>', methods=['GET'])
def get_group(group_id):
    group = Group.get_by_id(group_id)
    if not group:
        return jsonify({'error': 'Group not found'}), 404
    return jsonify(group)

@group_bp.route('/groups/<int:group_id>/words', methods=['GET'])
def get_group_words(group_id):
    page, per_page = get_pagination_params()
    return jsonify(Group.get_words(group_id, page, per_page))

@group_bp.route('/groups/<int:group_id>/words/raw', methods=['GET'])
def get_group_words_raw(group_id):
    words = Group.get_words(group_id, raw=True)
    return jsonify(words)

@group_bp.route('/groups/<int:group_id>/study_sessions', methods=['GET'])
def get_group_study_sessions(group_id):
    from app.models import StudySession
    page, per_page = get_pagination_params()
    return jsonify(StudySession.get_by_group_id(group_id, page, per_page))
