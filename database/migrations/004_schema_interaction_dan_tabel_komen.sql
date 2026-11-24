-- migrate:up
CREATE SCHEMA IF NOT EXISTS interaction_svc;

CREATE TABLE IF NOT EXISTS interaction_svc.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    username TEXT NOT NULL CHECK (char_length(btrim(username)) > 0),
    media_type TEXT NOT NULL CHECK (media_type IN ('anime', 'manga')),
    mal_id INT NOT NULL CHECK (mal_id > 0),
    content TEXT NOT NULL CHECK (
        char_length(btrim(content)) >= 1
        AND char_length(content) <= 500
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_media_mal_created
    ON interaction_svc.comments (media_type, mal_id, created_at DESC);

-- migrate:down
DROP TABLE IF EXISTS interaction_svc.comments;
DROP SCHEMA IF EXISTS interaction_svc;