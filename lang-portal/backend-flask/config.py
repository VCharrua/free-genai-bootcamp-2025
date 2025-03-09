import os

class Config:
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'words.db')
    DEBUG = True
    CORS_HEADERS = 'Content-Type'
