const jwt = require("jsonwebtoken");

/**
 * Middleware untuk membersihkan header identitas dari request klien eksternal.
 * Mencegah serangan spoofing (pemalsuan) identitas seperti menyuntikkan x-user-id palsu dari luar.
 */
function sanitizeHeaders(req, res, next) {
  delete req.headers["x-user-id"];
  delete req.headers["x-user-name"];
  delete req.headers["x-user-email"];
  delete req.headers["x-internal-key"];
  next();
}

/**
 * Middleware untuk mengekstrak dan memverifikasi sesi login (JWT) pengguna.
 * Memeriksa cookie sesi (mojiji_session) atau header Authorization: Bearer <token>.
 * Jika token valid, informasi pengguna disimpan pada req.user.
 */
function extractSession(req, res, next) {
  const cookieName = process.env.COOKIE_NAME || "mojiji_session";
  let token = req.cookies ? req.cookies[cookieName] : null;

  // Mendukung header Authorization: Bearer <token> (untuk Postman / Mobile / API Client)
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    req.user = null;
    return next();
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("[API Gateway] JWT_SECRET belum dikonfigurasi di environment!");
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // { id, username, email, iat, exp }
  } catch (err) {
    // Sesi kedaluwarsa atau token tidak valid
    req.user = null;
    req.authError = err.name; // e.g. 'TokenExpiredError', 'JsonWebTokenError'
  }

  next();
}

/**
 * Middleware untuk memproteksi endpoint privat/terlindungi (AC Tiket MJ-064).
 * Menolak permintaan tanpa login atau dengan sesi kedaluwarsa dengan HTTP 401 Unauthorized.
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
      },
    });
  }
  next();
}

module.exports = {
  sanitizeHeaders,
  extractSession,
  requireAuth,
};

