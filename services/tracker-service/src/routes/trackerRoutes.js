const express = require("express");
const {
  createTracker,
  getTrackers,
  updateTrackerStatus,
  incrementTrackerProgress,
  deleteTracker,
} = require("../controllers/trackerController");
const { verifyInternalAccess } = require("../middlewares/internalAuthMiddleware");

const router = express.Router();

// Lindungi seluruh endpoint tracker dengan verifikasi kunci internal (Tiket MJ-097)
router.use(verifyInternalAccess);

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
