const express = require("express");
const { getComments, createComment } = require("../controllers/commentController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { commentRateLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

/**
 * Endpoint Publik: Membaca Komentar (US-005)
 * Mendukung path /:mediaType/:malId atau query string (?type=&malId=)
 */
router.get("/:mediaType/:malId", getComments);
router.get("/comments/:mediaType/:malId", getComments);
router.get("/", getComments);
router.get("/comments", getComments);

/**
 * Endpoint Privat (Wajib Login): Menulis Komentar (US-005)
 * POST /api/comments/:mediaType/:malId
 */
router.post("/:mediaType/:malId", requireAuth, commentRateLimiter, createComment);
router.post("/comments/:mediaType/:malId", requireAuth, commentRateLimiter, createComment);

module.exports = router;
