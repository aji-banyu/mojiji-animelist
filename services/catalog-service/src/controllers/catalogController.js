const { z } = require("zod");
const { searchCatalog } = require("../services/tenraiClient");
const { normalizeList } = require("../adapters/catalogAdapter");

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

/**
 * GET /api/catalog/search
 * Mencari anime atau manga melalui Tenrai API
 */
async function search(req, res) {
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

    // 2. Panggil Tenrai API melalui client yang sudah memiliki rate limiter
    const rawResponse = await searchCatalog(type, q, page, limit);

    // 3. Normalisasi data hasil pencarian
    const normalizedData = normalizeList(rawResponse.data, type);

    // 4. Kembalikan response 200 OK
    return res.status(200).json({
      success: true,
      data: normalizedData,
      meta: {
        page: page,
        limit: limit,
        total: rawResponse.pagination?.items?.total ?? normalizedData.length,
      },
    });
  } catch (error) {
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

module.exports = {
  search,
  searchSchema,
};

