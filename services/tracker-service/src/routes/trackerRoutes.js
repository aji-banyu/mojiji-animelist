const express = require("express");
const {
  createTracker,
  getTrackers,
  updateTrackerStatus,
  incrementTrackerProgress,
  deleteTracker,
} = require("../controllers/trackerController");

const router = express.Router();

// GET /api/tracker?status=...
router.get("/", getTrackers);

// POST /api/tracker
router.post("/", createTracker);

// PATCH /api/tracker/:id/status dan PATCH /api/tracker/:id
router.patch("/:id/status", updateTrackerStatus);
router.patch("/:id", updateTrackerStatus);

// POST /api/tracker/:id/increment
router.post("/:id/increment", incrementTrackerProgress);

// DELETE /api/tracker/:id
router.delete("/:id", deleteTracker);

module.exports = router;
