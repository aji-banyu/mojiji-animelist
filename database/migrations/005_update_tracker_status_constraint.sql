-- migrate:up
ALTER TABLE tracker_service.trackers
DROP CONSTRAINT IF EXISTS chk_trackers_status_valid;

-- Normalisasi data lama sebelum memasang constraint baru
UPDATE tracker_service.trackers
SET status = CASE
    WHEN UPPER(status) = 'PAUSED' THEN 'on_hold'
    ELSE LOWER(status)
END;

ALTER TABLE tracker_service.trackers
ADD CONSTRAINT chk_trackers_status_valid CHECK (
    status IN ('plan_to_watch', 'watching', 'completed', 'dropped', 'on_hold', 'reading')
);

-- migrate:down
ALTER TABLE tracker_service.trackers
DROP CONSTRAINT IF EXISTS chk_trackers_status_valid;

UPDATE tracker_service.trackers
SET status = CASE
    WHEN LOWER(status) = 'on_hold' THEN 'PAUSED'
    WHEN LOWER(status) = 'reading' THEN 'WATCHING'
    ELSE UPPER(status)
END;

ALTER TABLE tracker_service.trackers
ADD CONSTRAINT chk_trackers_status_valid CHECK (
    status IN ('PLAN_TO_WATCH', 'WATCHING', 'COMPLETED', 'DROPPED', 'PAUSED')
);