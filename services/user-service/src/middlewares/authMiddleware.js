const jwt = require("jsonwebtoken");

/**
 * Middleware untuk memproteksi endpoint privat (seperti GET /api/users/me)
 * Mendukung autentikasi via Cookie sesi httpOnly (JWT) maupun header yang diteruskan oleh Gateway
 */
function requireAuth(req, res, next) {
  const cookieName = process.env.COOKIE_NAME || "mojiji_session";
  const token = req.cookies ? req.cookies[cookieName] : null;

  // 1. Metode Utama: Verifikasi Cookie Sesi JWT
  if (token) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET belum dikonfigurasi di environment variables!");
      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Konfigurasi keamanan server belum lengkap.",
        },
      });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded; // { id, username, email, iat, exp }
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali.",
        },
      });
    }
  }

  // 2. Metode Sekunder: Header dari Gateway (Tiket MJ-064)
  const gatewayUserId = req.headers["x-user-id"];
  const internalKey = req.headers["x-internal-key"];
  const expectedKey = process.env.INTERNAL_KEY;

  // Hanya izinkan header gateway jika internal key cocok (atau jika internal key belum diset)
  if (gatewayUserId && (!expectedKey || internalKey === expectedKey)) {
    req.user = {
      id: gatewayUserId,
      username: req.headers["x-user-name"] || null,
      email: req.headers["x-user-email"] || null,
    };
    return next();
  }

  // 3. Jika tidak ada kredensial sesi yang valid
  return res.status(401).json({
    success: false,
    error: {
      code: "UNAUTHORIZED",
      message: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
    },
  });
}

module.exports = {
  requireAuth,
};
