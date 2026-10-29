-- migrate:up
CREATE SCHEMA IF NOT EXISTS tracker_service;

CREATE TABLE IF NOT EXISTS tracker_service.trackers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    media_type VARCHAR(20) NOT NULL,
    mal_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    total INT DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    progress INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_media_mal UNIQUE (user_id, media_type, mal_id)
);

-- migrate:down
DROP TABLE IF EXISTS tracker_service.trackers;
DROP SCHEMA IF EXISTS tracker_service;