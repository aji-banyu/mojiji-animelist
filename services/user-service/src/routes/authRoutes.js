const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, logout } = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../validators/authValidator");

const router = express.Router();

// Rate limiter khusus untuk login guna mencegah serangan brute force (menebak password)
// Membatasi maksimal 15 percobaan login per IP dalam jendela waktu 15 menit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Terlalu banyak percobaan login. Silakan coba lagi beberapa saat kemudian.",
    },
  },
});

// Endpoint Autentikasi
router.post("/register", validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/logout", logout);

module.exports = router;
