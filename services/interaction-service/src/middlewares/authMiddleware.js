/**
 * Middleware Autentikasi Pengguna untuk Interaction Service (Tiket MJ-118)
 * Memverifikasi keberadaan header identitas 'x-user-id' yang telah disanitasi
 * dan disuntikkan secara aman oleh API Gateway setelah verifikasi JWT sesi.
 */
function requireAuth(req, res, next) {
  const userId = req.headers["x-user-id"];
  const username = req.headers["x-user-name"];

  if (!userId || String(userId).trim() === "") {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Anda harus login terlebih dahulu untuk menulis komentar",
        details: [],
      },
    });
  }

  // Simpan data identitas pengguna ke req.user
  req.user = {
    id: String(userId).trim(),
    username: username ? String(username).trim() : "Pengguna",
  };

  next();
}

module.exports = {
  requireAuth,
};
