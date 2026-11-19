const express = require("express");
const { createComment } = require("../controllers/commentController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { commentRateLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

/**
 * Endpoint POST Komentar:
 * POST /api/comments/:mediaType/:malId
 * Tiket: MJ-118
 */
router.post("/:mediaType/:malId", requireAuth, commentRateLimiter, createComment);

// Alias rute jika diakses via prefix /api/interaction/comments/...
router.post("/comments/:mediaType/:malId", requireAuth, commentRateLimiter, createComment);

module.exports = router;
