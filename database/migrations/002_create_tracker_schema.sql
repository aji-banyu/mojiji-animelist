-- Migration 002: Tracker Service Schema
CREATE SCHEMA IF NOT EXISTS tracker_service;

CREATE TABLE IF NOT EXISTS tracker_service.trackers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('anime', 'manga')),
    mal_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    total INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Plan', 'Watching', 'Reading', 'Completed', 'On Hold', 'Dropped')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_user_media_mal UNIQUE (user_id, media_type, mal_id)
);

CREATE INDEX IF NOT EXISTS idx_trackers_user_id ON tracker_service.trackers(user_id);
CREATE INDEX IF NOT EXISTS idx_trackers_user_status ON tracker_service.trackers(user_id, status);
