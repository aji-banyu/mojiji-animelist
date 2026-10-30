const path = require("path");

// Muat .env root jika dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });

const TENRAI_BASE_URL = process.env.TENRAI_BASE_URL || "https://api.tenrai.org/v1";

/**
 * Antrian Rate Limiter (Token Bucket / Sliding Window)
 * Batas publik Tenrai API: Maksimal 4 permintaan per detik per IP
 */
class RateLimitedQueue {
  constructor(maxPerSecond = 4) {
    this.maxPerSecond = maxPerSecond;
    this.queue = [];
    this.running = false;
    this.timestamps = [];
  }

  async add(taskFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.running || this.queue.length === 0) return;
    this.running = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      // Bersihkan timestamp yang lebih lama dari 1 detik (1000ms)
      this.timestamps = this.timestamps.filter((t) => now - t < 1000);

      // Jika kuota 4 req/detik tercapai, tunggu jeda waktu sampai kuota tersedia kembali
      if (this.timestamps.length >= this.maxPerSecond) {
        const oldestTime = this.timestamps[0];
        const waitTime = Math.max(10, 1000 - (now - oldestTime) + 10);
        await new Promise((r) => setTimeout(r, waitTime));
        continue;
      }

      const item = this.queue.shift();
      this.timestamps.push(Date.now());

      try {
        const result = await item.taskFn();
        item.resolve(result);
      } catch (err) {
        item.reject(err);
      }
    }

    this.running = false;
  }
}

// Inisialisasi antrian global 4 request per detik
const queue = new RateLimitedQueue(4);

/**
 * Fungsi pembantu untuk memanggil endpoint Tenrai API
 */
async function fetchTenrai(endpointPath) {
  return queue.add(async () => {
    const targetUrl = `${TENRAI_BASE_URL}${endpointPath}`;
    
    try {
      // Timeout 8 detik untuk mencegah request menggantung jika Tenrai lambat
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "MOJIJI-AnimeList-Service/1.0",
        },
        signal: AbortSignal.timeout(8000),
      });

      // Tangani status HTTP 429 Too Many Requests dari Tenrai
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after") || "2";
        const error = new Error("Batas permintaan ke provider katalog tercapai. Silakan coba sebentar lagi.");
        error.code = "RATE_LIMITED";
        error.retryAfter = retryAfter;
        throw error;
      }

      // Jika 404 dari Tenrai (misal pencarian tidak ditemukan pada query tertentu)
      if (response.status === 404) {
        return { data: [], pagination: { items: { total: 0 } } };
      }

      // Jika provider mengalami error 5xx
      if (!response.ok) {
        const error = new Error(`Provider katalog mengembalikan error status ${response.status}`);
        error.code = "UPSTREAM_ERROR";
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (err.name === "TimeoutError") {
        const timeoutError = new Error("Koneksi ke provider katalog mengalami timeout.");
        timeoutError.code = "UPSTREAM_TIMEOUT";
        throw timeoutError;
      }
      throw err;
    }
  });
}

/**
 * Pencarian anime atau manga ke Tenrai API
 * @param {'anime' | 'manga'} type 
 * @param {string} query 
 * @param {number} page 
 * @param {number} limit 
 */
async function searchCatalog(type, query, page = 1, limit = 20) {
  const cleanQuery = encodeURIComponent(query.trim());
  const endpoint = `/${type}?q=${cleanQuery}&page=${page}&limit=${limit}&sfw`;
  return await fetchTenrai(endpoint);
}

module.exports = {
  searchCatalog,
  fetchTenrai,
};

