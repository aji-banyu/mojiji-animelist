const express = require("express");
const { createTracker, getTrackers } = require("../controllers/trackerController");

const router = express.Router();

// GET /api/tracker?status=...
router.get("/", getTrackers);

// POST /api/tracker
router.post("/", createTracker);

module.exports = router;

