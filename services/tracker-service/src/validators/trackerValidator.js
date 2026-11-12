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

const updateTrackerStatusSchema = z.object({
  status: z.enum(ALLOWED_STATUSES, {
    errorMap: () => ({
      message: "Status tidak valid. Pilihan status: plan, watching, reading, completed, on_hold, dropped",
    }),
  }),
  progress: z
    .number({
      invalid_type_error: "Progres harus berupa angka bulat",
    })
    .int("Progres harus berupa bilangan bulat")
    .min(0, "Progres tidak boleh kurang dari 0")
    .optional(),
});

const uuidParamSchema = z
  .string({
    required_error: "ID tracker wajib diberikan",
    invalid_type_error: "ID tracker harus berupa string UUID",
  })
  .uuid("Format ID tracker tidak valid (harus berupa UUID)");

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

/**
 * Validasi body untuk update status tracker (PATCH /api/tracker/:id)
 */
function validateUpdateStatus(body) {
  if (!body || typeof body !== "object") {
    return {
      success: false,
      error: {
        issues: [{ message: "Request body tidak boleh kosong dan harus memuat properti 'status'" }],
      },
    };
  }

  return updateTrackerStatusSchema.safeParse(body);
}

/**
 * Validasi parameter ID tracker pada path URL (:id)
 */
function validateTrackerId(id) {
  return uuidParamSchema.safeParse(id);
}

module.exports = {
  validateCreateTracker,
  validateGetTrackerQuery,
  validateUpdateStatus,
  validateTrackerId,
  ALLOWED_STATUSES,
};
