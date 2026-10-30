const express = require("express");
const { search } = require("../controllers/catalogController");

const router = express.Router();

// Endpoint Pencarian: GET /api/catalog/search?type=anime&q=naruto
router.get("/search", search);

module.exports = router;

