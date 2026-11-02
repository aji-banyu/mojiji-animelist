-- migrate:up
SET search_path TO tracker_service, public;

-- 1. Check constraint: progress tidak boleh negatif
ALTER TABLE tracker_service.trackers 
ADD CONSTRAINT chk_trackers_progress_non_negative CHECK (progress >= 0);

-- 2. Check constraint: status hanya boleh 5 nilai valid
ALTER TABLE tracker_service.trackers 
ADD CONSTRAINT chk_trackers_status_valid CHECK (status IN ('PLAN_TO_WATCH', 'WATCHING', 'COMPLETED', 'DROPPED', 'PAUSED'));

-- 3. Composite Index untuk pencarian dashboard (user_id, status)
CREATE INDEX IF NOT EXISTS idx_trackers_user_status ON tracker_service.trackers (user_id, status);

-- migrate:down
SET search_path TO tracker_service, public;

DROP INDEX IF EXISTS tracker_service.idx_trackers_user_status;
ALTER TABLE tracker_service.trackers DROP CONSTRAINT IF EXISTS chk_trackers_status_valid;
ALTER TABLE tracker_service.trackers DROP CONSTRAINT IF EXISTS chk_trackers_progress_non_negative;