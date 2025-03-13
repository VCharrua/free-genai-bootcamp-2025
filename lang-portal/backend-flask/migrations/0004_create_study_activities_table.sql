CREATE TABLE IF NOT EXISTS study_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    preview_url TEXT NOT NULL,
    release_date TEXT NULL,
    average_duration INTEGER NULL,
    focus TEXT NULL
);
