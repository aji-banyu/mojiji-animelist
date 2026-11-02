const { redisClient, isRedisReady } = require("../config/redis");

const TTL_SEARCH = 3600; // 1 jam untuk hasil pencarian
const TTL_DETAIL = 86400; // 24 jam untuk metadata detail anime/manga
const TTL_STALE = 604800; // 7 hari untuk salinan cadangan saat upstream down

/**
 * Mengambil data dari cache Redis
 * @param {string} key 
 */
async function getCache(key) {
  if (!redisClient || !isRedisReady()) return null;
  try {
    const raw = await redisClient.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[Cache Warning] Gagal membaca cache key '${key}':`, err.message);
    return null;
  }
}

/**
 * Menyimpan data ke cache Redis dengan TTL serta menyimpan salinan stale
 * Hemat perintah Upstash: Hanya memanggil SET dengan EX
 * @param {string} key 
 * @param {object} data 
 * @param {number} ttlSeconds 
 */
async function setCache(key, data, ttlSeconds) {
  if (!redisClient || !isRedisReady()) return;
  try {
    const serialized = JSON.stringify(data);
    // 1. Simpan cache aktif dengan batas waktu TTL
    await redisClient.set(key, serialized, "EX", ttlSeconds);
    // 2. Simpan salinan cadangan stale (TTL 7 hari) sebagai penyelamat saat Tenrai down
    await redisClient.set(`${key}:stale`, serialized, "EX", TTL_STALE);
  } catch (err) {
    console.warn(`[Cache Warning] Gagal menulis cache key '${key}':`, err.message);
  }
}

/**
 * Mengambil salinan stale ketika upstream Tenrai bermasalah (fallback)
 * @param {string} key 
 */
async function getStaleCache(key) {
  if (!redisClient || !isRedisReady()) return null;
  try {
    const raw = await redisClient.get(`${key}:stale`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

/**
 * Membuat kunci cache terstandarisasi untuk pencarian katalog
 */
function generateSearchKey(type, query, page, limit) {
  const cleanQuery = encodeURIComponent(query.toLowerCase().trim());
  return `catalog:search:${type}:${cleanQuery}:${page}:${limit}`;
}

/**
 * Membuat kunci cache terstandarisasi untuk detail katalog
 */
function generateDetailKey(type, malId) {
  return `catalog:detail:${type}:${malId}`;
}

module.exports = {
  getCache,
  setCache,
  getStaleCache,
  generateSearchKey,
  generateDetailKey,
  TTL_SEARCH,
  TTL_DETAIL,
};

