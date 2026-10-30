const express = require("express");
const { register } = require("../controllers/authController");
const { validateRegister } = require("../validators/authValidator");

const router = express.Router();

// Endpoint registrasi akun: POST /api/auth/register
router.post("/register", validateRegister, register);

module.exports = router;

