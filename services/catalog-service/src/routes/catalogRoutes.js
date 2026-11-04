const express = require("express");
const { search, getDetail } = require("../controllers/catalogController");

const router = express.Router();

// Endpoint Pencarian: GET /api/catalog/search?type=anime&q=naruto
router.get("/search", search);

// Endpoint Detail: GET /api/catalog/:type/:malId
router.get("/:type/:malId", getDetail);

module.exports = router;
