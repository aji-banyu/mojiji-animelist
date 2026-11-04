const express = require("express");
const { getCurrentUser } = require("../controllers/authController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Endpoint Profil: GET /api/users/me (Wajib login / memiliki cookie sesi)
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;

