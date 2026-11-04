/**
 * Middleware untuk memvalidasi akses internal antar-layanan (microservices)
 * Melindungi rute internal seperti /internal/catalog/* dari pemanggilan tidak sah.
 */
function verifyInternalKey(req, res, next) {
  const internalKey = req.headers["x-internal-key"];
  const expectedKey = process.env.INTERNAL_KEY;

  // Jika INTERNAL_KEY diset di environment, wajibkan header x-internal-key yang cocok
  if (expectedKey && internalKey !== expectedKey) {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Akses internal ditolak. Kunci internal tidak valid atau tidak disertakan.",
      },
    });
  }

  next();
}

module.exports = {
  verifyInternalKey,
};

