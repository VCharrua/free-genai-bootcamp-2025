from invoke import task
from lib.db import init_db, run_migrations, seed_data

@task
def init_database(c):
    """Initialize the SQLite database."""
    init_db()
    print("Database initialized successfully.")

@task
def migrate(c):
    """Run database migrations."""
    run_migrations()
    print("Migrations completed successfully.")

@task
def seed(c):
    """Seed the database with initial data."""
    seed_data()
    print("Database seeded successfully.")

@task
def setup(c):
    """Initialize, migrate, and seed the database in one command."""
    init_database(c)
    migrate(c)
    seed(c)
    print("Database setup completed successfully.")

@task
def run(c):
    """Run the Flask application."""
    c.run("python run.py")
