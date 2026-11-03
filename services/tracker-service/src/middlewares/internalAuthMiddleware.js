/**
 * Middleware untuk memvalidasi akses internal antar-layanan (microservices)
 * Memastikan panggilan ke Tracker Service berasal dari API Gateway atau layanan internal yang memiliki INTERNAL_KEY yang sah.
 * Tiket MJ-097: Perketat keamanan akses data
 */
function verifyInternalAccess(req, res, next) {
  const internalKey = req.headers["x-internal-key"];
  const expectedKey = process.env.INTERNAL_KEY;

  // Jika INTERNAL_KEY diset di environment, wajibkan header x-internal-key cocok
  if (expectedKey && internalKey !== expectedKey) {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Akses internal ditolak. Kunci internal tidak valid atau tidak disertakan.",
        details: [],
      },
    });
  }

  next();
}

module.exports = {
  verifyInternalAccess,
};

