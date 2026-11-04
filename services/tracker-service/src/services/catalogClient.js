const path = require("path");

// Muat environment variables dari .env root saat dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });

let defaultCatalogUrl = process.env.CATALOG_SERVICE_URL;
if (!defaultCatalogUrl) {
  defaultCatalogUrl = process.platform === "win32" ? "http://localhost:4002" : "http://catalog-service:4002";
}

/**
 * Mengambil metadata item anime/manga dari Catalog Service internal
 * @param {'anime' | 'manga'} mediaType 
 * @param {number} malId 
 */
async function fetchCatalogMetadata(mediaType, malId) {
  const catalogUrl = process.env.CATALOG_SERVICE_URL || defaultCatalogUrl;
  const targetUrl = `${catalogUrl}/internal/catalog/${mediaType}/${malId}`;
  const internalKey = process.env.INTERNAL_KEY;

  try {
    const headers = {
      Accept: "application/json",
      "User-Agent": "MOJIJI-Tracker-Service/1.0",
    };

    if (internalKey) {
      headers["x-internal-key"] = internalKey;
    }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: headers,
      signal: AbortSignal.timeout(5000), // Timeout 5 detik
    });

    if (response.status === 404) {
      const err = new Error(`Item ${mediaType} dengan ID ${malId} tidak ditemukan di katalog`);
      err.code = "NOT_FOUND";
      throw err;
    }

    if (!response.ok) {
      const err = new Error(`Catalog Service mengembalikan status ${response.status}`);
      err.code = "BAD_GATEWAY";
      throw err;
    }

    const json = await response.json();
    const itemData = json.data || {};

    return {
      title: itemData.title || "Untitled",
      image: itemData.image || null,
      total: itemData.totalEpisodes || itemData.totalChapters || 0,
    };
  } catch (err) {
    if (err.name === "TimeoutError") {
      const timeoutErr = new Error("Koneksi ke Catalog Service mengalami timeout");
      timeoutErr.code = "GATEWAY_TIMEOUT";
      throw timeoutErr;
    }
    throw err;
  }
}

module.exports = {
  fetchCatalogMetadata,
};

