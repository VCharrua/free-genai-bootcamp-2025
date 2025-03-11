import json
from lib.db import query_db, execute_db

class Word:
    @staticmethod
    def get_all(page=1, per_page=100):
        offset = (page - 1) * per_page
        words = query_db("""
            SELECT w.*, 
                   (SELECT COUNT(*) FROM word_review_items WHERE word_id = w.id AND correct = 1) as correct_count,
                   (SELECT COUNT(*) FROM word_review_items WHERE word_id = w.id AND correct = 0) as wrong_count
            FROM words w
            LIMIT ? OFFSET ?
        """, (per_page, offset))
        
        total = query_db("SELECT COUNT(*) as count FROM words", one=True)['count']
        
        for word in words:
            if 'parts' in word and word['parts']:
                word['parts'] = json.loads(word['parts'])
        
        return {
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            },
            'items': words
        }
    
    @staticmethod
    def get_by_id(word_id):
        word = query_db("SELECT * FROM words WHERE id = ?", (word_id,), one=True)
        if not word:
            return None
        
        if 'parts' in word and word['parts']:
            word['parts'] = json.loads(word['parts'])
        
        stats = {
            'correct_count': query_db(
                "SELECT COUNT(*) as count FROM word_review_items WHERE word_id = ? AND correct = 1",
                (word_id,), one=True
            )['count'],
            'wrong_count': query_db(
                "SELECT COUNT(*) as count FROM word_review_items WHERE word_id = ? AND correct = 0",
                (word_id,), one=True
            )['count']
        }
        
        groups = query_db("""
            SELECT g.id, g.name 
            FROM groups g
            JOIN words_groups wg ON g.id = wg.group_id
            WHERE wg.word_id = ?
        """, (word_id,))
        
        word['stats'] = stats
        word['groups'] = groups
        
        return word

class Group:
    @staticmethod
    def get_all(page=1, per_page=100):
        offset = (page - 1) * per_page
        groups = query_db("SELECT * FROM groups LIMIT ? OFFSET ?", (per_page, offset))
        total = query_db("SELECT COUNT(*) as count FROM groups", one=True)['count']
        
        return {
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            },
            'items': groups
        }
    
    @staticmethod
    def get_by_id(group_id):
        group = query_db("SELECT * FROM groups WHERE id = ?", (group_id,), one=True)
        if not group:
            return None
        
        stats = {
            'total_words_count': group['words_count']
        }
        
        group['stats'] = stats
        return group
    
    @staticmethod
    def get_words(group_id, page=1, per_page=100, raw=False):
        offset = (page - 1) * per_page if not raw else 0
        limit = per_page if not raw else -1
        
        words = query_db("""
            SELECT w.*, 
                   (SELECT COUNT(*) FROM word_review_items WHERE word_id = w.id AND correct = 1) as correct_count,
                   (SELECT COUNT(*) FROM word_review_items WHERE word_id = w.id AND correct = 0) as wrong_count
            FROM words w
            JOIN words_groups wg ON w.id = wg.word_id
            WHERE wg.group_id = ?
            LIMIT ? OFFSET ?
        """, (group_id, limit, offset))
        
        for word in words:
            if 'parts' in word and word['parts']:
                word['parts'] = json.loads(word['parts'])
        
        if raw:
            return words
        
        total = query_db(
            "SELECT COUNT(*) as count FROM words_groups WHERE group_id = ?", 
            (group_id,), one=True
        )['count']
        
        return {
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            },
            'items': words
        }

class StudyActivity:
    @staticmethod
    def get_all():
        return query_db("SELECT * FROM study_activities")
    
    @staticmethod
    def get_by_id(activity_id):
        return query_db("SELECT * FROM study_activities WHERE id = ?", (activity_id,), one=True)
    
    @staticmethod
    def get_launch_info(activity_id):
        activity = StudyActivity.get_by_id(activity_id)
        if not activity:
            return None
        
        groups = query_db("SELECT id, name, words_count FROM groups")
        
        return {
            'activity': activity,
            'groups': groups
        }

class StudySession:
    @staticmethod
    def create(group_id, study_activity_id):
        session_id = execute_db(
            "INSERT INTO study_sessions (group_id, study_activity_id) VALUES (?, ?)",
            (group_id, study_activity_id)
        )
        
        return StudySession.get_by_id(session_id)
    
    @staticmethod
    def get_all(page=1, per_page=100):
        offset = (page - 1) * per_page
        sessions = query_db("""
            SELECT ss.*, 
                  sa.name as activity_name, 
                  g.name as group_name,
                  ss.created_at as start_time,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id) as review_items_count
            FROM study_sessions ss
            JOIN study_activities sa ON ss.study_activity_id = sa.id
            JOIN groups g ON ss.group_id = g.id
            ORDER BY ss.created_at DESC
            LIMIT ? OFFSET ?
        """, (per_page, offset))
        
        for session in sessions:
            session['end_time'] = session['start_time']  # Placeholder, in real app would calc based on last review
        
        total = query_db("SELECT COUNT(*) as count FROM study_sessions", one=True)['count']
        
        return {
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            },
            'items': sessions
        }
    
    @staticmethod
    def get_by_id(session_id):
        session = query_db("""
            SELECT ss.*,
                  sa.name as activity_name,
                  g.name as group_name,
                  ss.created_at as start_time,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id) as review_items_count
            FROM study_sessions ss
            JOIN study_activities sa ON ss.study_activity_id = sa.id
            JOIN groups g ON ss.group_id = g.id
            WHERE ss.id = ?
        """, (session_id,), one=True)
        
        if session:
            session['end_time'] = session['start_time']  # Placeholder
        
        return session
    
    @staticmethod
    def get_by_activity_id(activity_id, page=1, per_page=100):
        offset = (page - 1) * per_page
        sessions = query_db("""
            SELECT ss.*, 
                  sa.name as activity_name, 
                  g.name as group_name,
                  ss.created_at as start_time,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id) as review_items_count
            FROM study_sessions ss
            JOIN study_activities sa ON ss.study_activity_id = sa.id
            JOIN groups g ON ss.group_id = g.id
            WHERE sa.id = ?
            ORDER BY ss.created_at DESC
            LIMIT ? OFFSET ?
        """, (activity_id, per_page, offset))
        
        for session in sessions:
            session['end_time'] = session['start_time']  # Placeholder
        
        total = query_db(
            "SELECT COUNT(*) as count FROM study_sessions WHERE study_activity_id = ?", 
            (activity_id,), one=True
        )['count']
        
        return {
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            },
            'items': sessions
        }

    @staticmethod
    def get_by_group_id(group_id, page=1, per_page=100):
        offset = (page - 1) * per_page
        sessions = query_db("""
            SELECT ss.*, 
                  sa.name as activity_name, 
                  g.name as group_name,
                  ss.created_at as start_time,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id) as review_items_count
            FROM study_sessions ss
            JOIN study_activities sa ON ss.study_activity_id = sa.id
            JOIN groups g ON ss.group_id = g.id
            WHERE g.id = ?
            ORDER BY ss.created_at DESC
            LIMIT ? OFFSET ?
        """, (group_id, per_page, offset))
        
        for session in sessions:
            session['end_time'] = session['start_time']  # Placeholder
        
        total = query_db(
            "SELECT COUNT(*) as count FROM study_sessions WHERE group_id = ?", 
            (group_id,), one=True
        )['count']
        
        return {
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            },
            'items': sessions
        }
    
    @staticmethod
    def get_session_words(session_id, page=1, per_page=100):
        offset = (page - 1) * per_page
        words = query_db("""
            SELECT w.id, w.portuguese, w.kimbundu, w.english,
                   (SELECT COUNT(*) FROM word_review_items WHERE word_id = w.id AND correct = 1) as correct_count,
                   (SELECT COUNT(*) FROM word_review_items WHERE word_id = w.id AND correct = 0) as wrong_count
            FROM words w
            JOIN word_review_items wri ON w.id = wri.word_id
            WHERE wri.study_session_id = ?
            GROUP BY w.id
            LIMIT ? OFFSET ?
        """, (session_id, per_page, offset))
        
        total = query_db(
            "SELECT COUNT(DISTINCT word_id) as count FROM word_review_items WHERE study_session_id = ?", 
            (session_id,), one=True
        )['count']
        
        return {
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            },
            'items': words
        }
    
    @staticmethod
    def record_word_review(session_id, word_id, correct):
        review_id = execute_db(
            "INSERT INTO word_review_items (word_id, study_session_id, correct) VALUES (?, ?, ?)",
            (word_id, session_id, 1 if correct else 0)
        )
        
        review = query_db(
            "SELECT * FROM word_review_items WHERE id = ?", 
            (review_id,), one=True
        )
        
        return {
            'success': True,
            'id': review['id'],
            'word_id': review['word_id'],
            'study_session_id': review['study_session_id'],
            'correct': review['correct'] == 1,
            'created_at': review['created_at']
        }
    
    @staticmethod
    def reset_history():
        execute_db("DELETE FROM word_review_items")
        execute_db("DELETE FROM study_sessions")
        return {'success': True, 'message': 'History reset successfully'}
    
    @staticmethod
    def get_continue_learning():
        """
        Returns a list of 3 study sessions where the words reviewed are less than the total words in the group.
        """
        try:
            query = """
            SELECT 
                ss.id,
                ss.study_activity_id AS activity_id,
                ss.group_id,
                g.name AS group_name,
                COUNT(DISTINCT wri.word_id) AS review_items_count,
                g.words_count AS total_words_count
            FROM 
                study_sessions ss
            JOIN 
                groups g ON ss.group_id = g.id
            LEFT JOIN 
                word_review_items wri ON ss.id = wri.study_session_id
            GROUP BY 
                ss.id
            HAVING 
                review_items_count < total_words_count
            ORDER BY 
                ss.created_at DESC
            LIMIT 3
            """
            
            result = query_db(query)
            return result  # This already returns the exact format specified in the documentation
        except Exception as e:
            raise Exception(f"Error fetching continue learning sessions: {str(e)}")

class Dashboard:
    @staticmethod
    def get_last_study_session():
        session = query_db("""
            SELECT ss.id, ss.group_id, ss.created_at, sa.name as activity_name,
                   (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 1) as correct_count,
                   (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 0) as wrong_count
            FROM study_sessions ss
            JOIN study_activities sa ON ss.study_activity_id = sa.id
            ORDER BY ss.created_at DESC
            LIMIT 1
        """, one=True)
        
        return session or {
            'id': None,
            'group_id': None,
            'created_at': None,
            'activity_name': None,
            'correct_count': 0,
            'wrong_count': 0
        }
    
    @staticmethod
    def get_study_progress():
        total_words = query_db("SELECT COUNT(*) as count FROM words", one=True)['count']
        studied_words = query_db(
            "SELECT COUNT(DISTINCT word_id) as count FROM word_review_items", 
            one=True
        )['count']
        
        return {
            'total_words': total_words,
            'studied_words': studied_words
        }
    
    @staticmethod
    def get_quick_stats():
        # Calculate success rate
        review_stats = query_db("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct
            FROM word_review_items
        """, one=True)
        
        success_rate = 0
        if review_stats['total'] > 0:
            success_rate = (review_stats['correct'] / review_stats['total']) * 100
        
        # Get session count
        total_sessions = query_db(
            "SELECT COUNT(*) as count FROM study_sessions", 
            one=True
        )['count']
        
        # Get active groups count
        active_groups = query_db("""
            SELECT COUNT(DISTINCT group_id) as count 
            FROM study_sessions
        """, one=True)['count']
        
        # Calculate study streak (simplified - just return days of current date)
        import datetime
        today = datetime.date.today()
        study_streak = today.day
        
        return {
            'success_rate': round(success_rate, 1),
            'total_study_sessions': total_sessions,
            'total_active_groups': active_groups,
            'study_streak_days': study_streak
        }
    
    @staticmethod
    def full_reset():
        execute_db("DELETE FROM word_review_items")
        execute_db("DELETE FROM study_sessions")
        return {'success': True, 'message': 'Full reset successfully'}
    
    @staticmethod
    def get_performance_graph():
        """
        Returns performance statistics for the last 31 days.
        """
        try:
            # Calculate date 31 days ago
            import datetime
            thirty_one_days_ago = (datetime.datetime.now() - datetime.timedelta(days=31)).strftime('%Y-%m-%d')
            
            query = """
            SELECT 
                ss.id,
                DATE(ss.created_at) as start_time,
                COUNT(wri.id) as review_items_count,
                SUM(CASE WHEN wri.correct = 1 THEN 1 ELSE 0 END) as correct_count,
                SUM(CASE WHEN wri.correct = 0 THEN 1 ELSE 0 END) as wrong_count
            FROM 
                study_sessions ss
            LEFT JOIN 
                word_review_items wri ON ss.id = wri.study_session_id
            WHERE 
                DATE(ss.created_at) >= ?
            GROUP BY 
                ss.id, DATE(ss.created_at)
            ORDER BY 
                DATE(ss.created_at) ASC
            """
            
            return query_db(query, (thirty_one_days_ago,))
        except Exception as e:
            raise Exception(f"Error fetching performance graph data: {str(e)}")
