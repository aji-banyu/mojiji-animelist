const pool = require("../config/db");
const { validateCreateTracker, validateGetTrackerQuery } = require("../validators/trackerValidator");
const { fetchCatalogMetadata } = require("../services/catalogClient");

/**
 * Format baris data dari database ke format respons JSON API
 */
function formatTrackerItem(row) {
  return {
    id: row.id,
    userId: row.user_id,
    mediaType: row.media_type,
    malId: row.mal_id,
    title: row.title,
    imageUrl: row.image_url,
    total: row.total,
    status: row.status,
    progress: row.progress,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * POST /api/tracker
 * Menambahkan anime/manga ke daftar pelacakan pengguna
 */
async function createTracker(req, res) {
  try {
    // 1. Ekstrak identitas pengguna dari header Gateway (Tiket MJ-064)
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
        },
      });
    }

    // 2. Validasi input request body
    const parseResult = validateCreateTracker(req.body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || parseResult.error.errors || [];
      const details = issues.map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Data tracker tidak valid",
          details: details,
        },
      });
    }

    const { mediaType, malId, status, progress } = parseResult.data;

    // 3. Verifikasi ketersediaan item & ambil metadata dari Catalog Service internal
    let catalogItem;
    try {
      catalogItem = await fetchCatalogMetadata(mediaType, malId);
    } catch (catalogErr) {
      if (catalogErr.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Item ${mediaType} dengan ID ${malId} tidak ditemukan di katalog.`,
          },
        });
      }
      if (catalogErr.code === "GATEWAY_TIMEOUT") {
        return res.status(504).json({
          success: false,
          error: {
            code: "GATEWAY_TIMEOUT",
            message: "Catalog Service mengalami timeout saat memvalidasi metadata.",
          },
        });
      }
      return res.status(502).json({
        success: false,
        error: {
          code: "BAD_GATEWAY",
          message: "Gagal menghubungi Catalog Service untuk memverifikasi item.",
        },
      });
    }

    // 4. Validasi konsistensi progres terhadap total episode/chapter
    let adjustedProgress = progress;
    const totalCount = catalogItem.total || 0;
    if (totalCount > 0 && adjustedProgress > totalCount) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: `Progres (${adjustedProgress}) tidak boleh melebihi total yang diketahui (${totalCount}).`,
        },
      });
    }

    // Jika status completed tapi progress masih 0, otomatis samakan dengan total
    if (status === "completed" && totalCount > 0 && adjustedProgress === 0) {
      adjustedProgress = totalCount;
    }

    // 5. Simpan ke database PostgreSQL schema tracker_service
    const insertQuery = `
      INSERT INTO tracker_service.trackers 
        (user_id, media_type, mal_id, title, image_url, total, status, progress, created_at, updated_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, user_id, media_type, mal_id, title, image_url, total, status, progress, created_at, updated_at;
    `;

    const values = [
      userId,
      mediaType,
      malId,
      catalogItem.title,
      catalogItem.image,
      totalCount,
      status,
      adjustedProgress,
    ];

    const result = await pool.query(insertQuery, values);
    const createdItem = formatTrackerItem(result.rows[0]);

    return res.status(201).json({
      success: true,
      data: createdItem,
    });
  } catch (error) {
    // Penanganan error duplikasi (Unique Constraint Violation: unique_user_media_mal)
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "Item ini sudah ada di daftar pelacakan kamu.",
        },
      });
    }

    console.error("[Tracker Service] Error createTracker:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan internal saat menambahkan item tracker.",
      },
    });
  }
}

/**
 * GET /api/tracker?status=watching
 * Mengambil daftar item tracker milik pengguna yang sedang login
 */
async function getTrackers(req, res) {
  try {
    // 1. Ekstrak identitas pengguna dari header Gateway
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
        },
      });
    }

    // 2. Validasi query parameter filter status
    const parseResult = validateGetTrackerQuery(req.query);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || parseResult.error.errors || [];
      const details = issues.map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Parameter filter tidak valid",
          details: details,
        },
      });
    }

    const { status } = parseResult.data;

    // 3. Query data: WAJIB WHERE user_id = $1 agar isolasi data pengguna terjaga 100%
    const queryValues = [userId];
    let queryText = `
      SELECT id, user_id, media_type, mal_id, title, image_url, total, status, progress, created_at, updated_at
      FROM tracker_service.trackers
      WHERE user_id = $1
    `;

    if (status) {
      queryValues.push(status);
      queryText += ` AND status = $2`;
    }

    queryText += ` ORDER BY updated_at DESC`;

    const result = await pool.query(queryText, queryValues);
    const formattedData = result.rows.map(formatTrackerItem);

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("[Tracker Service] Error getTrackers:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan internal saat mengambil daftar tracker.",
      },
    });
  }
}

module.exports = {
  createTracker,
  getTrackers,
};

