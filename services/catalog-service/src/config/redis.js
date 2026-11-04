const Redis = require("ioredis");
const path = require("path");

// Muat environment variables dari .env root saat dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });

let redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Fallback jika berjalan di host Windows lokal di luar Docker
if (redisUrl.includes("@redis:6379") || redisUrl === "redis://redis:6379") {
  if (process.platform === "win32") {
    redisUrl = redisUrl.replace("redis://redis:6379", "redis://localhost:6379");
  }
}

const keyPrefix = process.env.REDIS_KEY_PREFIX || "mojiji_local:";

let redisClient = null;
let isConnected = false;

try {
  redisClient = new Redis(redisUrl, {
    keyPrefix: keyPrefix,
    enableOfflineQueue: false, // Jangan biarkan antrean menumpuk jika Redis terputus
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      // Reconnect otomatis dengan batas jeda 3 detik
      return Math.min(times * 100, 3000);
    },
    tls: redisUrl.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
  });

  redisClient.on("connect", () => {
    isConnected = true;
    console.log(`[Redis] Terhubung ke Redis dengan prefix '${keyPrefix}'`);
  });

  redisClient.on("ready", () => {
    isConnected = true;
  });

  redisClient.on("error", (err) => {
    isConnected = false;
    // Log peringatan tanpa membuat service crash (graceful degradation)
    console.warn("[Redis Warning] Koneksi Redis terganggu:", err.message);
  });

  redisClient.on("close", () => {
    isConnected = false;
  });
} catch (err) {
  console.warn("[Redis Error] Gagal menginisialisasi Redis client:", err.message);
}

module.exports = {
  redisClient,
  isRedisReady: () => isConnected,
  keyPrefix,
};

