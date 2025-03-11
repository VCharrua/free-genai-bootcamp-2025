import sqlite3
import json
import os
import logging
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('db')

def get_db_connection():
    """Establish a connection to the SQLite database."""
    try:
        conn = sqlite3.connect(Config.DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        return conn
    except sqlite3.Error as e:
        logger.error(f"Database connection error: {e}")
        raise Exception(f"Failed to connect to database: {e}")

def query_db(query, args=(), one=False):
    """Execute a query and fetch results."""
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(query, args)
        rv = cur.fetchall()
        conn.commit()
        return (dict(rv[0]) if rv else None) if one else [dict(x) for x in rv]
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        logger.error(f"Database query error: {e}, Query: {query}, Args: {args}")
        raise Exception(f"Database query failed: {e}")
    finally:
        if conn:
            conn.close()

def execute_db(query, args=()):
    """Execute a query without fetching results."""
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(query, args)
        last_id = cur.lastrowid
        conn.commit()
        return last_id
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        logger.error(f"Database execution error: {e}, Query: {query}, Args: {args}")
        raise Exception(f"Database execution failed: {e}")
    finally:
        if conn:
            conn.close()

def init_db():
    """Initialize the database."""
    try:
        if os.path.exists(Config.DATABASE_PATH):
            os.remove(Config.DATABASE_PATH)
        conn = sqlite3.connect(Config.DATABASE_PATH)
        conn.close()
        logger.info(f"Database initialized at {Config.DATABASE_PATH}")
        print(f"Database initialized at {Config.DATABASE_PATH}")
    except sqlite3.Error as e:
        logger.error(f"Database initialization error: {e}")
        raise Exception(f"Failed to initialize database: {e}")
    except OSError as e:
        logger.error(f"File system error during database initialization: {e}")
        raise Exception(f"File system error during database initialization: {e}")

def run_migrations():
    """Run all migration files."""
    conn = None
    try:
        conn = get_db_connection()
        migrations_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'migrations')
        
        if not os.path.exists(migrations_dir):
            logger.warning(f"Migrations directory not found: {migrations_dir}")
            raise Exception(f"Migrations directory not found: {migrations_dir}")
            
        # Get all migration files and sort them
        migration_files = sorted([f for f in os.listdir(migrations_dir) if f.endswith('.sql')])
        
        if not migration_files:
            logger.warning("No migration files found")
            print("No migration files found")
            return
            
        for migration_file in migration_files:
            try:
                with open(os.path.join(migrations_dir, migration_file), 'r') as f:
                    sql = f.read()
                    conn.executescript(sql)
                logger.info(f"Applied migration: {migration_file}")
                print(f"Applied migration: {migration_file}")
            except sqlite3.Error as e:
                conn.rollback()
                logger.error(f"Migration failed for {migration_file}: {e}")
                raise Exception(f"Migration failed for {migration_file}: {e}")
            except IOError as e:
                logger.error(f"Failed to read migration file {migration_file}: {e}")
                raise Exception(f"Failed to read migration file {migration_file}: {e}")
                
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        logger.error(f"Migration error: {e}")
        raise Exception(f"Migration failed: {e}")
    finally:
        if conn:
            conn.close()

def seed_data():
    """Seed the database with initial data."""
    conn = None
    try:
        seeds_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'seeds')
        
        if not os.path.exists(seeds_dir):
            logger.warning(f"Seeds directory not found: {seeds_dir}")
            raise Exception(f"Seeds directory not found: {seeds_dir}")
        
        # Seed study activities
        try:
            seed_study_activities(seeds_dir)
        except Exception as e:
            logger.error(f"Failed to seed study activities: {e}")
            raise
            
        # Seed word groups and words
        word_files = {
            'verbs.json': 'Verbs',
            'adjectives.json': 'Adjectives', 
            'numbers.json': 'Numbers',
            'adverbs.json': 'Adverbs'
        }
        
        for file_name, group_name in word_files.items():
            try:
                seed_word_group(seeds_dir, file_name, group_name)
            except Exception as e:
                logger.error(f"Failed to seed word group '{group_name}' from {file_name}: {e}")
                raise
                
    except Exception as e:
        logger.error(f"Seeding error: {e}")
        raise Exception(f"Seeding failed: {e}")

def seed_study_activities(seeds_dir):
    """Seed study activities from a JSON file."""
    study_activities_file = os.path.join(seeds_dir, 'study_activities.json')
    if not os.path.exists(study_activities_file):
        logger.warning(f"Study activities file not found: {study_activities_file}")
        print(f"Study activities file not found: {study_activities_file}")
        return
        
    try:
        with open(study_activities_file, 'r') as f:
            activities = json.load(f)
            for activity in activities:
                execute_db(
                    "INSERT INTO study_activities (name, description, url, preview_url) VALUES (?, ?, ?, ?)",
                    (activity['name'], activity['description'], activity['url'], activity['preview_url'])
                )
        logger.info("Seeded study activities")
        print("Seeded study activities")
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in study activities file: {e}")
        raise Exception(f"Invalid JSON in study activities file: {e}")
    except IOError as e:
        logger.error(f"Failed to read study activities file: {e}")
        raise Exception(f"Failed to read study activities file: {e}")
    except KeyError as e:
        logger.error(f"Missing required key in study activities data: {e}")
        raise Exception(f"Missing required key in study activities data: {e}")

def seed_word_group(seeds_dir, file_name, group_name):
    """Seed a word group and its words from a JSON file."""
    file_path = os.path.join(seeds_dir, file_name)
    if not os.path.exists(file_path):
        logger.warning(f"Word file not found: {file_path}")
        print(f"Word file not found: {file_path}")
        return
        
    conn = None
    try:
        conn = get_db_connection()
        
        # Create the group in a transaction
        with conn:
            cur = conn.cursor()
            cur.execute("INSERT INTO groups (name) VALUES (?)", (group_name,))
            group_id = cur.lastrowid
            
            # Add words from file
            with open(file_path, 'r') as f:
                words = json.load(f)
                for word in words:
                    parts_json = json.dumps(word['parts'])
                    cur.execute(
                        "INSERT INTO words (portuguese, kimbundu, english, parts) VALUES (?, ?, ?, ?)",
                        (word['portuguese'], word['kimbundu'], word['english'], parts_json)
                    )
                    word_id = cur.lastrowid
                    
                    # Link word to group
                    cur.execute(
                        "INSERT INTO words_groups (word_id, group_id) VALUES (?, ?)",
                        (word_id, group_id)
                    )
                
                # Update word count for group
                cur.execute(
                    "UPDATE groups SET words_count = (SELECT COUNT(*) FROM words_groups WHERE group_id = ?) WHERE id = ?",
                    (group_id, group_id)
                )
            
        logger.info(f"Seeded {len(words)} words in group '{group_name}'")
        print(f"Seeded {len(words)} words in group '{group_name}'")
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in word file {file_name}: {e}")
        raise Exception(f"Invalid JSON in word file {file_name}: {e}")
    except IOError as e:
        logger.error(f"Failed to read word file {file_name}: {e}")
        raise Exception(f"Failed to read word file {file_name}: {e}")
    except KeyError as e:
        logger.error(f"Missing required key in word data from {file_name}: {e}")
        raise Exception(f"Missing required key in word data from {file_name}: {e}")
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        logger.error(f"Database error while seeding words from {file_name}: {e}")
        raise Exception(f"Database error while seeding words from {file_name}: {e}")
    finally:
        if conn:
            conn.close()
