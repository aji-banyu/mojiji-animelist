const pool = require("../config/db");
const {
  validateCreateTracker,
  validateGetTrackerQuery,
  validateUpdateStatus,
  validateTrackerId,
} = require("../validators/trackerValidator");
const { fetchCatalogMetadata } = require("../services/catalogClient");

/**
 * Mapping status dari API Contract ke enum constraint Database PostgreSQL (Tiket MJ-097 & MJ-067)
 * Database constraint: 'PLAN_TO_WATCH', 'WATCHING', 'COMPLETED', 'DROPPED', 'PAUSED'
 */
function toDbStatus(apiStatus) {
  if (!apiStatus) return "PLAN_TO_WATCH";
  const normalized = String(apiStatus).toLowerCase().trim();
  switch (normalized) {
    case "plan":
    case "planned":
    case "plan_to_watch":
      return "PLAN_TO_WATCH";
    case "watching":
    case "reading":
    case "in_progress":
      return "WATCHING";
    case "completed":
      return "COMPLETED";
    case "on_hold":
    case "paused":
      return "PAUSED";
    case "dropped":
      return "DROPPED";
    default:
      return apiStatus.toUpperCase();
  }
}

/**
 * Mapping status dari Database PostgreSQL ke format API Contract (Tiket MJ-097)
 * API Contract: 'plan', 'watching', 'reading', 'completed', 'on_hold', 'dropped'
 */
function toApiStatus(dbStatus, mediaType = "anime") {
  if (!dbStatus) return "plan";
  const normalized = String(dbStatus).toUpperCase().trim();
  switch (normalized) {
    case "PLAN_TO_WATCH":
    case "PLAN":
    case "PLANNED":
      return "plan";
    case "WATCHING":
      return mediaType === "manga" ? "reading" : "watching";
    case "READING":
      return "reading";
    case "COMPLETED":
      return "completed";
    case "PAUSED":
    case "ON_HOLD":
      return "on_hold";
    case "DROPPED":
      return "dropped";
    default:
      return String(dbStatus).toLowerCase();
  }
}

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
    status: toApiStatus(row.status, row.media_type),
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
    // 1. Ekstrak identitas pengguna dari header Gateway (Tiket MJ-064 & MJ-097)
    // Keamanan: user_id HANYA diambil dari header x-user-id yang telah disanitasi dan disuntikkan oleh Gateway
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
          details: [],
        },
      });
    }

    // 2. Validasi input request body (parameter userId dari body selalu diabaikan)
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
            details: [],
          },
        });
      }
      if (catalogErr.code === "GATEWAY_TIMEOUT") {
        return res.status(504).json({
          success: false,
          error: {
            code: "GATEWAY_TIMEOUT",
            message: "Catalog Service mengalami timeout saat memvalidasi metadata.",
            details: [],
          },
        });
      }
      return res.status(502).json({
        success: false,
        error: {
          code: "BAD_GATEWAY",
          message: "Gagal menghubungi Catalog Service untuk memverifikasi item.",
          details: [],
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
          details: [`Progres (${adjustedProgress}) tidak boleh melebihi total episode/chapter (${totalCount})`],
        },
      });
    }

    // Jika status completed tapi progress masih 0, otomatis samakan dengan total
    if (status === "completed" && totalCount > 0 && adjustedProgress === 0) {
      adjustedProgress = totalCount;
    }

    // Normalisasi status ke format constraint database PostgreSQL
    const dbStatus = toDbStatus(status);

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
      dbStatus,
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
          details: ["Item dengan mediaType dan malId tersebut sudah tersimpan di daftar pelacakan Anda."],
        },
      });
    }

    console.error("[Tracker Service] Error createTracker:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan internal saat menambahkan item tracker.",
        details: [],
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
          details: [],
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
      const targetDbStatus = toDbStatus(status);
      queryValues.push(targetDbStatus);
      queryValues.push(status.toLowerCase());

      // Jika filter 'reading', cocokkan dengan DB status 'WATCHING' dan media_type 'manga'
      if (status.toLowerCase() === "reading") {
        queryText += ` AND (status = $2 OR status = $3) AND media_type = 'manga'`;
      } else if (status.toLowerCase() === "watching") {
        // Jika filter 'watching', cocokkan dengan DB status 'WATCHING' dan media_type 'anime'
        queryText += ` AND (status = $2 OR status = $3) AND media_type = 'anime'`;
      } else {
        queryText += ` AND (status = $2 OR status = $3)`;
      }
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
        details: [],
      },
    });
  }
}

/**
 * PATCH /api/tracker/:id dan PATCH /api/tracker/:id/status
 * Mengubah status item pelacakan milik pengguna
 */
async function updateTrackerStatus(req, res) {
  try {
    // 1. Verifikasi autentikasi dari header Gateway
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
          details: [],
        },
      });
    }

    // 2. Validasi parameter ID tracker (UUID)
    const idResult = validateTrackerId(req.params.id);
    if (!idResult.success) {
      const details = (idResult.error.issues || []).map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Parameter ID tracker tidak valid",
          details: details,
        },
      });
    }
    const trackerId = idResult.data;

    // 3. Validasi body status
    const bodyResult = validateUpdateStatus(req.body);
    if (!bodyResult.success) {
      const details = (bodyResult.error.issues || []).map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Data status tidak valid",
          details: details,
        },
      });
    }
    const newStatus = bodyResult.data.status;
    const reqProgress = bodyResult.data.progress;

    // 4. Verifikasi keberadaan dan kepemilikan data (Owner Verification)
    const checkQuery = `
      SELECT id, user_id, media_type, total, status, progress 
      FROM tracker_service.trackers 
      WHERE id = $1
    `;
    const checkResult = await pool.query(checkQuery, [trackerId]);
    if (checkResult.rows.length === 0 || checkResult.rows[0].user_id !== userId) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Item tracker tidak ditemukan atau bukan milik Anda.",
          details: [],
        },
      });
    }

    const currentTracker = checkResult.rows[0];
    let newProgress = typeof reqProgress === "number" ? reqProgress : currentTracker.progress;

    // Jika status diubah menjadi 'completed' dan total diketahui (> 0) serta progress masih 0 dan tidak diberikan progres eksplisit,
    // otomatis samakan progres ke total
    if (newStatus === "completed" && currentTracker.total > 0 && currentTracker.progress === 0 && typeof reqProgress !== "number") {
      newProgress = currentTracker.total;
    }

    const dbStatus = toDbStatus(newStatus);

    // 5. Update status di database (wajib WHERE id = $3 AND user_id = $4)
    const updateQuery = `
      UPDATE tracker_service.trackers
      SET status = $1, progress = $2, updated_at = NOW()
      WHERE id = $3 AND user_id = $4
      RETURNING id, user_id, media_type, mal_id, title, image_url, total, status, progress, created_at, updated_at;
    `;
    const updateResult = await pool.query(updateQuery, [dbStatus, newProgress, trackerId, userId]);

    return res.status(200).json({
      success: true,
      data: formatTrackerItem(updateResult.rows[0]),
    });
  } catch (error) {
    console.error("[Tracker Service] Error updateTrackerStatus:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan internal saat memperbarui status tracker.",
        details: [],
      },
    });
  }
}

/**
 * POST /api/tracker/:id/increment
 * Menambah progres tontonan/bacaan sebesar +1
 */
async function incrementTrackerProgress(req, res) {
  try {
    // 1. Verifikasi autentikasi dari header Gateway
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
          details: [],
        },
      });
    }

    // 2. Validasi parameter ID tracker (UUID)
    const idResult = validateTrackerId(req.params.id);
    if (!idResult.success) {
      const details = (idResult.error.issues || []).map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Parameter ID tracker tidak valid",
          details: details,
        },
      });
    }
    const trackerId = idResult.data;

    // 3. Verifikasi keberadaan dan kepemilikan data (Owner Verification)
    const checkQuery = `
      SELECT id, user_id, media_type, total, status, progress 
      FROM tracker_service.trackers 
      WHERE id = $1
    `;
    const checkResult = await pool.query(checkQuery, [trackerId]);
    if (checkResult.rows.length === 0 || checkResult.rows[0].user_id !== userId) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Item tracker tidak ditemukan atau bukan milik Anda.",
          details: [],
        },
      });
    }

    const currentTracker = checkResult.rows[0];
    const total = currentTracker.total || 0;

    // 4. Validasi batas progres jika total diketahui (> 0)
    if (total > 0 && currentTracker.progress >= total) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: `Progres sudah mencapai batas maksimal total ${currentTracker.media_type === "manga" ? "chapter" : "episode"} (${total}).`,
          details: [`Progres tidak dapat ditambah karena sudah mencapai batas maksimal (${total})`],
        },
      });
    }

    const nextProgress = currentTracker.progress + 1;
    let nextDbStatus = currentTracker.status;

    // Jika progres mencapai total episode/chapter, otomatis ubah status ke 'COMPLETED'
    if (total > 0 && nextProgress >= total) {
      nextDbStatus = "COMPLETED";
    } else if (
      currentTracker.status === "PLAN_TO_WATCH" ||
      currentTracker.status === "plan" ||
      currentTracker.status === "planned"
    ) {
      // Jika sebelumnya plan dan progres mulai diisi, ubah ke WATCHING
      nextDbStatus = "WATCHING";
    }

    // 5. Update progres ke database (wajib WHERE id = $3 AND user_id = $4)
    const updateQuery = `
      UPDATE tracker_service.trackers
      SET progress = $1, status = $2, updated_at = NOW()
      WHERE id = $3 AND user_id = $4
      RETURNING id, user_id, media_type, mal_id, title, image_url, total, status, progress, created_at, updated_at;
    `;
    const updateResult = await pool.query(updateQuery, [nextProgress, nextDbStatus, trackerId, userId]);

    return res.status(200).json({
      success: true,
      data: formatTrackerItem(updateResult.rows[0]),
    });
  } catch (error) {
    console.error("[Tracker Service] Error incrementTrackerProgress:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan internal saat menambah progres tracker.",
        details: [],
      },
    });
  }
}

/**
 * DELETE /api/tracker/:id
 * Menghapus item pelacakan milik pengguna
 */
async function deleteTracker(req, res) {
  try {
    // 1. Verifikasi autentikasi dari header Gateway
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
          details: [],
        },
      });
    }

    // 2. Validasi parameter ID tracker (UUID)
    const idResult = validateTrackerId(req.params.id);
    if (!idResult.success) {
      const details = (idResult.error.issues || []).map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Parameter ID tracker tidak valid",
          details: details,
        },
      });
    }
    const trackerId = idResult.data;

    // 3. Eksekusi DELETE hanya jika id dan user_id cocok (Owner Enforcement)
    const deleteQuery = `
      DELETE FROM tracker_service.trackers
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const result = await pool.query(deleteQuery, [trackerId, userId]);

    // Jika tidak ada baris yang terhapus (ID tidak ada atau milik user lain)
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Item tracker tidak ditemukan atau bukan milik Anda.",
          details: [],
        },
      });
    }

    // 4. Sesuai API Contract: 204 No Content saat sukses menghapus
    return res.status(204).send();
  } catch (error) {
    console.error("[Tracker Service] Error deleteTracker:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan internal saat menghapus item tracker.",
        details: [],
      },
    });
  }
}

module.exports = {
  createTracker,
  getTrackers,
  updateTrackerStatus,
  incrementTrackerProgress,
  deleteTracker,
};
