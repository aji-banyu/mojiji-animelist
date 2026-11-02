const { z } = require("zod");
const { searchCatalog, getCatalogDetail } = require("../services/tenraiClient");
const { normalizeList, normalizeItem } = require("../adapters/catalogAdapter");
const {
  getCache,
  setCache,
  getStaleCache,
  generateSearchKey,
  generateDetailKey,
  TTL_SEARCH,
  TTL_DETAIL,
} = require("../services/cacheService");

// Skema validasi query parameters untuk pencarian katalog
const searchSchema = z.object({
  type: z.enum(["anime", "manga"], {
    errorMap: () => ({ message: "Parameter 'type' wajib bernilai 'anime' atau 'manga'" }),
  }),
  q: z
    .string({ required_error: "Parameter 'q' (kata kunci pencarian) wajib diisi" })
    .trim()
    .min(1, "Kata kunci pencarian tidak boleh kosong"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(25).default(20),
});

// Skema validasi route parameters untuk detail katalog (:type/:malId)
const detailSchema = z.object({
  type: z.enum(["anime", "manga"], {
    errorMap: () => ({ message: "Parameter 'type' wajib bernilai 'anime' atau 'manga'" }),
  }),
  malId: z.coerce
    .number({
      required_error: "Parameter 'malId' wajib diisi",
      invalid_type_error: "Parameter 'malId' harus berupa angka",
    })
    .int("Parameter 'malId' harus berupa bilangan bulat")
    .positive("Parameter 'malId' harus berupa angka positif"),
});

/**
 * GET /api/catalog/search
 * Mencari anime atau manga melalui Tenrai API dengan Redis Caching
 */
async function search(req, res) {
  let cacheKey = null;
  try {
    // 1. Validasi query parameters
    const parseResult = searchSchema.safeParse(req.query);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || parseResult.error.errors || [];
      const details = issues.map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Parameter pencarian tidak valid",
          details: details,
        },
      });
    }

    const { type, q, page, limit } = parseResult.data;
    cacheKey = generateSearchKey(type, q, page, limit);

    // 2. Cek Cache Redis (Cache Hit: respon instan < 300 ms)
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(cachedData);
    }

    // 3. Jika Cache Miss, panggil Tenrai API melalui client
    const rawResponse = await searchCatalog(type, q, page, limit);

    // 4. Normalisasi data hasil pencarian
    const normalizedData = normalizeList(rawResponse.data, type);
    const responsePayload = {
      success: true,
      data: normalizedData,
      meta: {
        page: page,
        limit: limit,
        total: rawResponse.pagination?.items?.total ?? normalizedData.length,
      },
    };

    // 5. Simpan ke Redis Cache (TTL 1 jam)
    setCache(cacheKey, responsePayload, TTL_SEARCH).catch((err) => {
      console.warn("[Cache Error] Gagal menulis search cache:", err.message);
    });

    res.set("X-Cache", "MISS");
    return res.status(200).json(responsePayload);
  } catch (error) {
    // Jika provider mengembalikan 404 pada pencarian, kembalikan array kosong 200 OK
    if (error.code === "NOT_FOUND") {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      return res.status(200).json({
        success: true,
        data: [],
        meta: {
          page: page,
          limit: limit,
          total: 0,
        },
      });
    }

    // Penanganan Tenrai Down / Rate Limited: Gunakan salinan stale jika ada (AC Tiket MJ-079)
    if (cacheKey) {
      const staleData = await getStaleCache(cacheKey);
      if (staleData) {
        console.warn(`[Cache Fallback] Upstream Tenrai bermasalah (${error.code || error.message}). Menggunakan salinan stale dari Redis.`);
        res.set("X-Cache", "STALE");
        return res.status(200).json(staleData);
      }
    }

    // Penanganan pembatasan permintaan (429 dari upstream Tenrai)
    if (error.code === "RATE_LIMITED") {
      res.set("Retry-After", error.retryAfter || "2");
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Batas permintaan ke provider katalog tercapai. Silakan coba sebentar lagi.",
        },
      });
    }

    // Penanganan timeout
    if (error.code === "UPSTREAM_TIMEOUT") {
      return res.status(504).json({
        success: false,
        error: {
          code: "GATEWAY_TIMEOUT",
          message: "Provider katalog mengalami timeout. Silakan coba beberapa saat lagi.",
        },
      });
    }

    // Penanganan error upstream 5xx
    if (error.code === "UPSTREAM_ERROR") {
      return res.status(502).json({
        success: false,
        error: {
          code: "BAD_GATEWAY",
          message: "Provider katalog gagal memberikan respons yang valid.",
        },
      });
    }

    console.error("Error pada search catalog:", error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan internal pada Catalog Service",
      },
    });
  }
}

/**
 * GET /api/catalog/:type/:malId
 * Mengambil detail satu anime atau manga berdasarkan MAL ID dengan Redis Caching
 */
async function getDetail(req, res) {
  let cacheKey = null;
  try {
    // 1. Validasi route parameters (:type, :malId)
    const parseResult = detailSchema.safeParse(req.params);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || parseResult.error.errors || [];
      const details = issues.map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Parameter detail katalog tidak valid",
          details: details,
        },
      });
    }

    const { type, malId } = parseResult.data;
    cacheKey = generateDetailKey(type, malId);

    // 2. Cek Cache Redis (Cache Hit: respon instan < 300 ms)
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(cachedData);
    }

    // 3. Jika Cache Miss, panggil Tenrai API melalui client
    const rawResponse = await getCatalogDetail(type, malId);

    if (!rawResponse || !rawResponse.data) {
      const typeLabel = type === "anime" ? "Anime" : "Manga";
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `${typeLabel} dengan ID ${malId} tidak ditemukan`,
        },
      });
    }

    // 4. Normalisasi data objek menggunakan adapter
    const normalizedData = normalizeItem(rawResponse.data, type);
    const responsePayload = {
      success: true,
      data: normalizedData,
    };

    // 5. Simpan ke Redis Cache (TTL 24 jam)
    setCache(cacheKey, responsePayload, TTL_DETAIL).catch((err) => {
      console.warn("[Cache Error] Gagal menulis detail cache:", err.message);
    });

    res.set("X-Cache", "MISS");
    return res.status(200).json(responsePayload);
  } catch (error) {
    const typeLabel = req.params?.type === "anime" ? "Anime" : "Manga";
    const idLabel = req.params?.malId || "";

    // Penanganan 404 Not Found jika judul memang tidak ada di database Tenrai
    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `${typeLabel} dengan ID ${idLabel} tidak ditemukan`,
        },
      });
    }

    // Penanganan Tenrai Down / Timeout / Error Upstream: Gunakan salinan stale jika ada (AC Tiket MJ-079)
    if (cacheKey) {
      const staleData = await getStaleCache(cacheKey);
      if (staleData) {
        console.warn(`[Cache Fallback] Upstream Tenrai bermasalah (${error.code || error.message}). Menggunakan salinan stale dari Redis.`);
        res.set("X-Cache", "STALE");
        return res.status(200).json(staleData);
      }
    }

    // Penanganan pembatasan permintaan (429 dari upstream Tenrai)
    if (error.code === "RATE_LIMITED") {
      res.set("Retry-After", error.retryAfter || "2");
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Batas permintaan ke provider katalog tercapai. Silakan coba sebentar lagi.",
        },
      });
    }

    // Penanganan timeout
    if (error.code === "UPSTREAM_TIMEOUT") {
      return res.status(504).json({
        success: false,
        error: {
          code: "GATEWAY_TIMEOUT",
          message: "Provider katalog mengalami timeout. Silakan coba beberapa saat lagi.",
        },
      });
    }

    // Penanganan error upstream 5xx
    if (error.code === "UPSTREAM_ERROR") {
      return res.status(502).json({
        success: false,
        error: {
          code: "BAD_GATEWAY",
          message: "Provider katalog gagal memberikan respons yang valid.",
        },
      });
    }

    console.error("Error pada getDetail catalog:", error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan internal pada Catalog Service",
      },
    });
  }
}

module.exports = {
  search,
  getDetail,
};
