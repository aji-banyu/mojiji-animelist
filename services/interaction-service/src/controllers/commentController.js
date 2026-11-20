const crypto = require("crypto");
const pool = require("../config/db");
const { validateCreateComment } = require("../validators/commentValidator");

/**
 * Penyimpanan in-memory cadangan jika PostgreSQL lokal sedang offline (Dev Fallback)
 */
const inMemoryComments = [];

/**
 * Sanitasi string sederhana untuk mencegah XSS (Cross-Site Scripting)
 */
function sanitizeContent(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Pastikan skema dan tabel comments siap digunakan (Resilient Microservice)
 */
let isDbInitialized = false;
async function ensureTableExists() {
  if (isDbInitialized) return;
  const initSql = `
    CREATE SCHEMA IF NOT EXISTS interaction_service;

    CREATE TABLE IF NOT EXISTS interaction_service.comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        username VARCHAR(50) NOT NULL,
        media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('anime', 'manga')),
        mal_id INTEGER NOT NULL,
        content VARCHAR(500) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_comments_media_mal_created 
    ON interaction_service.comments (media_type, mal_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_comments_user_id 
    ON interaction_service.comments (user_id);
  `;
  try {
    await pool.query(initSql);
    isDbInitialized = true;
  } catch (err) {
    // Tidak melempar error agar mode dev fallback tetap dapat melayani request
    if (err.code !== "ECONNREFUSED") {
      console.error("[Interaction Service] Gagal inisialisasi tabel comments:", err.message);
    }
  }
}

/**
 * POST /api/comments/:mediaType/:malId
 * Menambahkan komentar baru pada judul anime atau manga (Tiket MJ-118)
 */
async function createComment(req, res) {
  try {
    // 1. Ekstrak data user dari middleware autentikasi
    const userId = req.user.id;
    const username = req.user.username;

    // 2. Validasi parameter URL dan request body
    const validation = validateCreateComment(req.params, req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validasi komentar gagal",
          details: validation.errors,
        },
      });
    }

    const { mediaType, malId, content } = validation.data;

    // 3. Sanitasi konten komentar dari potensi serangan injeksi XSS
    const sanitizedContent = sanitizeContent(content);

    // 4. Coba simpan ke PostgreSQL terlebih dahulu
    try {
      await ensureTableExists();

      const insertQuery = `
        INSERT INTO interaction_service.comments (user_id, username, media_type, mal_id, content)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING 
          id, 
          user_id AS "userId", 
          username, 
          media_type AS "mediaType", 
          mal_id AS "malId", 
          content, 
          created_at AS "createdAt", 
          updated_at AS "updatedAt"
      `;

      const values = [userId, username, mediaType, malId, sanitizedContent];
      const { rows } = await pool.query(insertQuery, values);
      const newComment = rows[0];

      return res.status(201).json({
        success: true,
        data: newComment,
      });
    } catch (dbError) {
      // Jika database offline / ECONNREFUSED di lingkungan lokal, gunakan in-memory fallback
      const isConnectionError =
        dbError.code === "ECONNREFUSED" ||
        dbError.code === "ENOTFOUND" ||
        (dbError.errors && dbError.errors.some((e) => e.code === "ECONNREFUSED")) ||
        String(dbError.message).includes("ECONNREFUSED");

      if (isConnectionError) {
        const fallbackComment = {
          id: crypto.randomUUID(),
          userId: userId,
          username: username,
          mediaType: mediaType,
          malId: malId,
          content: sanitizedContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        inMemoryComments.push(fallbackComment);

        return res.status(201).json({
          success: true,
          data: fallbackComment,
        });
      }

      // Jika error SQL constraint / syntax lain, teruskan ke catch luar
      throw dbError;
    }
  } catch (error) {
    console.error("[Create Comment Error]", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server saat menyimpan komentar",
        details: [error.message],
      },
    });
  }
}

module.exports = {
  createComment,
  ensureTableExists,
};
