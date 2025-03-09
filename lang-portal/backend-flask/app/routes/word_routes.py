from flask import Blueprint, jsonify
from app.models import Word
from app.utils import get_pagination_params

word_bp = Blueprint('words', __name__)

@word_bp.route('/words', methods=['GET'])
def get_words():
    page, per_page = get_pagination_params()
    return jsonify(Word.get_all(page, per_page))

@word_bp.route('/words/<int:word_id>', methods=['GET'])
def get_word(word_id):
    word = Word.get_by_id(word_id)
    if not word:
        return jsonify({'error': 'Word not found'}), 404
    return jsonify(word)
