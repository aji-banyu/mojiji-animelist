const express = require("express");
const { getDetail } = require("../controllers/catalogController");
const { verifyInternalKey } = require("../middlewares/internalAuthMiddleware");

const router = express.Router();

// Lindungi seluruh endpoint internal dengan middleware verifikasi kunci internal
router.use(verifyInternalKey);

// GET /internal/catalog/:type/:malId
router.get("/:type/:malId", getDetail);

module.exports = router;

