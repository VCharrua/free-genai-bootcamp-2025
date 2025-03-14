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
        
        # Count of review items for this group
        group_review_count = query_db("""
            SELECT COUNT(*) as count 
            FROM word_review_items wri
            JOIN words_groups wg ON wri.word_id = wg.word_id
            WHERE wg.group_id = ?
        """, (group_id,), one=True)['count']
        
        # Total count of review items across all groups
        total_review_count = query_db("""
            SELECT COUNT(*) as count 
            FROM word_review_items
        """, one=True)['count']
        
        # Calculate the percentage
        reviewed_percentage = 0
        if total_review_count > 0:
            reviewed_percentage = (group_review_count / total_review_count) * 100
        
        stats = {
            'total_words_count': group['words_count'],
            'group_review_count': group_review_count,
            'total_review_count': total_review_count,
            'reviewed_percentage': round(reviewed_percentage, 1)  # Round to 1 decimal place
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
                  g.id as group_id,
                  g.name as group_name,
                  ss.created_at as start_time,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id) as review_items_count,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 1) as correct_count,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 0) as wrong_count
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
                  g.id as group_id,
                  g.name as group_name,
                  ss.created_at as start_time,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id) as review_items_count,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 1) as correct_count,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 0) as wrong_count
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
                  g.id as group_id,
                  g.name as group_name,
                  ss.created_at as start_time,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id) as review_items_count,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 1) as correct_count,
                  (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 0) as wrong_count
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
            SELECT ss.id, ss.group_id, 
                   ss.created_at as start_time, 
                   COALESCE(
                       (SELECT MAX(created_at) FROM word_review_items WHERE study_session_id = ss.id),
                       ss.created_at
                   ) as end_time,
                   sa.name as activity_name,
                   g.name as group_name,
                   (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 1) as correct_count,
                   (SELECT COUNT(*) FROM word_review_items WHERE study_session_id = ss.id AND correct = 0) as wrong_count
            FROM study_sessions ss
            JOIN study_activities sa ON ss.study_activity_id = sa.id
            JOIN groups g ON ss.group_id = g.id
            ORDER BY ss.created_at DESC
            LIMIT 1
        """, one=True)
        
        return session or {
            'id': None,
            'group_id': None,
            'start_time': None,
            'end_time': None,
            'activity_name': None,
            'group_name': None,
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
        
        # Calculate studied words trend as a percentage
        # Get the latest session ID
        latest_session = query_db("""
            SELECT id FROM study_sessions 
            ORDER BY created_at DESC 
            LIMIT 1
        """, one=True)
        
        studied_words_trend = 0
        if latest_session:
            # Count new words learned in the latest session (not seen before)
            new_words_count = query_db("""
                SELECT COUNT(DISTINCT word_id) as count
                FROM word_review_items
                WHERE study_session_id = ? 
                AND word_id NOT IN (
                    SELECT DISTINCT word_id 
                    FROM word_review_items 
                    WHERE study_session_id != ?
                )
            """, (latest_session['id'], latest_session['id']), one=True)['count']
            
            # Calculate trend as percentage of total studied words
            if studied_words > 0:
                studied_words_trend = round((new_words_count / studied_words) * 100, 1)
        
        return {
            'total_words': total_words,
            'studied_words': studied_words,
            'studied_words_trend': studied_words_trend
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
        
        # Calculate success rate trend
        # Get the latest session ID
        latest_session = query_db("""
            SELECT id FROM study_sessions 
            ORDER BY created_at DESC 
            LIMIT 1
        """, one=True)
        
        success_rate_trend = 0
        if latest_session:
            # Calculate success rate for previous sessions
            previous_stats = query_db("""
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct
                FROM word_review_items
                WHERE study_session_id != ?
            """, (latest_session['id'],), one=True)
            
            # Calculate success rate for the latest session
            latest_stats = query_db("""
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct
                FROM word_review_items
                WHERE study_session_id = ?
            """, (latest_session['id'],), one=True)
            
            previous_rate = 0
            if previous_stats['total'] > 0:
                previous_rate = (previous_stats['correct'] / previous_stats['total']) * 100
                
            latest_rate = 0
            if latest_stats['total'] > 0:
                latest_rate = (latest_stats['correct'] / latest_stats['total']) * 100
                
            # Calculate trend (difference between latest and previous rates)
            success_rate_trend = latest_rate - previous_rate

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
        
        # Calculate study streak (consecutive days with sessions up to yesterday)
        import datetime
        import sqlite3
        
        today = datetime.date.today()
        yesterday = today - datetime.timedelta(days=1)
        yesterday_str = yesterday.strftime('%Y-%m-%d')
        
        try:
            # Try advanced SQL approach with window functions (SQLite >= 3.25.0)
            study_streak_query = """
            WITH session_dates AS (
                -- Get distinct dates with sessions
                SELECT DISTINCT DATE(created_at) as session_date
                FROM study_sessions
                WHERE DATE(created_at) <= ?  -- Only consider up to yesterday
            ),
            streak_dates AS (
                SELECT 
                    session_date,
                    -- Calculate difference between row number and date
                    -- This will be constant for consecutive dates
                    julianday(session_date) - ROW_NUMBER() OVER (ORDER BY session_date DESC) as group_id
                FROM session_dates
            )
            SELECT CASE 
                -- Check if there was a session yesterday
                WHEN EXISTS (SELECT 1 FROM session_dates WHERE session_date = ?) THEN
                    -- Count dates in the current streak group
                    (SELECT COUNT(*) FROM streak_dates 
                     WHERE group_id = (SELECT group_id FROM streak_dates WHERE session_date = ?))
                ELSE 0
            END as streak_days
            """
            
            study_streak = query_db(study_streak_query, (yesterday_str, yesterday_str, yesterday_str), one=True)['streak_days']
            
        except sqlite3.OperationalError:
            # Fallback for older SQLite versions that don't support window functions
            # First check if there was a study session yesterday
            had_session_yesterday = query_db(
                "SELECT EXISTS(SELECT 1 FROM study_sessions WHERE DATE(created_at) = ?) as exists_flag",
                (yesterday_str,), one=True
            )['exists_flag']
            
            study_streak = 0
            if had_session_yesterday:
                # Get all dates with sessions, sorted in descending order
                dates_query = """
                    SELECT DISTINCT DATE(created_at) as session_date
                    FROM study_sessions
                    ORDER BY session_date DESC
                """
                dates = [row['session_date'] for row in query_db(dates_query)]
                
                # Calculate streak by checking consecutive days
                streak_date = yesterday
                for date_str in dates:
                    date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                    if date == streak_date:
                        study_streak += 1
                        streak_date = streak_date - datetime.timedelta(days=1)
                    else:
                        break
        
        return {
            'success_rate': round(success_rate, 1),
            'success_rate_trend': round(success_rate_trend, 1),
            'total_study_sessions': total_sessions,
            'total_active_groups': active_groups,
            'study_streak_days': study_streak
        }
    
    @staticmethod
    def full_reset():
        # Delete in order of dependency to avoid foreign key constraint violations
        
        # Start with tables that have foreign keys to other tables
        execute_db("DELETE FROM word_review_items")  # References words and study_sessions
        
        # Then delete from tables with fewer dependencies
        execute_db("DELETE FROM words_groups")  # Junction table between words and groups
        execute_db("DELETE FROM study_sessions")  # References groups and study_activities
        
        # Finally delete from primary tables
        execute_db("DELETE FROM words")
        execute_db("DELETE FROM groups")
        execute_db("DELETE FROM study_activities")  # Including this as requested
        
        return {'success': True, 'message': 'Full database reset completed successfully'}
    
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
