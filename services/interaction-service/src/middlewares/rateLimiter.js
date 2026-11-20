/**
 * Rate Limiter Khusus Komentar (Tiket MJ-118 - Anti-Spam Bot)
 * Membatasi maksimal 5 komentar per menit per pengguna.
 * Menggunakan memori in-memory sliding window yang hemat resource (VPS 2 GB RAM).
 */

const userCommentTimestamps = new Map();

// Pembersihan berkala setiap 5 menit agar tidak terjadi memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const WINDOW_MS = 60 * 1000; // 1 menit (60.000 ms)
const MAX_COMMENTS_PER_WINDOW = 5;

setInterval(() => {
  const now = Date.now();
  for (const [userId, timestamps] of userCommentTimestamps.entries()) {
    const validTimestamps = timestamps.filter((ts) => now - ts < WINDOW_MS);
    if (validTimestamps.length === 0) {
      userCommentTimestamps.delete(userId);
    } else {
      userCommentTimestamps.set(userId, validTimestamps);
    }
  }
}, CLEANUP_INTERVAL_MS).unref(); // unref agar tidak menahan proses Node.js saat shutdown

function commentRateLimiter(req, res, next) {
  const userId = req.user ? req.user.id : req.headers["x-user-id"] || req.ip;
  const now = Date.now();

  const userHistory = userCommentTimestamps.get(userId) || [];
  // Filter riwayat yang masih dalam jendela 1 menit terakhir
  const recentHistory = userHistory.filter((ts) => now - ts < WINDOW_MS);

  if (recentHistory.length >= MAX_COMMENTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Terlalu banyak komentar dalam waktu singkat. Silakan tunggu 1 menit.",
        details: [],
      },
    });
  }

  // Catat waktu komentar saat ini
  recentHistory.push(now);
  userCommentTimestamps.set(userId, recentHistory);

  next();
}

module.exports = {
  commentRateLimiter,
};
