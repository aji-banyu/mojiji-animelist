const { z } = require("zod");

const ALLOWED_STATUSES = ["plan", "watching", "reading", "completed", "on_hold", "dropped"];

const createTrackerSchema = z.object({
  mediaType: z.enum(["anime", "manga"], {
    errorMap: () => ({ message: "Parameter 'mediaType' atau 'type' wajib bernilai 'anime' atau 'manga'" }),
  }),
  malId: z.coerce
    .number({
      required_error: "Parameter 'malId' wajib diisi",
      invalid_type_error: "Parameter 'malId' harus berupa angka",
    })
    .int("Parameter 'malId' harus berupa bilangan bulat")
    .positive("Parameter 'malId' harus berupa angka positif"),
  status: z
    .enum(ALLOWED_STATUSES, {
      errorMap: () => ({
        message: "Status tidak valid. Pilihan status: plan, watching, reading, completed, on_hold, dropped",
      }),
    })
    .optional()
    .default("plan"),
  progress: z.coerce
    .number({ invalid_type_error: "Parameter 'progress' harus berupa angka" })
    .int("Parameter 'progress' harus berupa bilangan bulat")
    .min(0, "Progres minimal 0")
    .optional()
    .default(0),
});

const getTrackerQuerySchema = z.object({
  status: z
    .enum(ALLOWED_STATUSES, {
      errorMap: () => ({
        message: "Filter status tidak valid. Pilihan: plan, watching, reading, completed, on_hold, dropped",
      }),
    })
    .optional(),
});

/**
 * Normalisasi dan validasi body untuk pembuatan tracker
 */
function validateCreateTracker(body) {
  if (!body || typeof body !== "object") {
    return {
      success: false,
      error: {
        issues: [{ message: "Request body tidak boleh kosong dan harus berupa JSON object" }],
      },
    };
  }

  const rawInput = {
    mediaType: body.mediaType || body.type,
    malId: body.malId !== undefined ? body.malId : body.mal_id,
    status: body.status,
    progress: body.progress !== undefined ? body.progress : 0,
  };

  return createTrackerSchema.safeParse(rawInput);
}

/**
 * Validasi query params untuk pencarian daftar tracker
 */
function validateGetTrackerQuery(query) {
  return getTrackerQuerySchema.safeParse(query);
}

module.exports = {
  validateCreateTracker,
  validateGetTrackerQuery,
  ALLOWED_STATUSES,
};

