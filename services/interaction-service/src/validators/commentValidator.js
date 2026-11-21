const { z } = require("zod");

/**
 * Skema validasi parameter URL: /api/comments/:mediaType/:malId
 * Tiket MJ-118 & Kontrak API US-005 (docs/api/interaction.md)
 */
const commentParamsSchema = z.object({
  mediaType: z
    .string()
    .refine((val) => val === "anime" || val === "manga", {
      message: "mediaType harus bernilai 'anime' atau 'manga'",
    }),
  malId: z
    .any()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && Number.isInteger(val) && val > 0, {
      message: "malId harus berupa bilangan bulat positif",
    }),
});

/**
 * Skema validasi query string paginasi: ?page=1&limit=20
 */
const commentQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("page harus berupa bilangan bulat")
    .positive("page harus bernilai minimal 1")
    .optional()
    .default(1),
  limit: z.coerce
    .number()
    .int("limit harus berupa bilangan bulat")
    .min(1, "limit minimal 1")
    .max(50, "limit maksimal 50")
    .optional()
    .default(20),
});

/**
 * Skema validasi request body: { "content": "..." }
 * Batasan:
 * - 1 s.d. 500 karakter setelah di-trim
 * - Dilarang whitespace kosong
 */
const commentBodySchema = z.object({
  content: z
    .string({
      required_error: "Konten komentar wajib diisi",
      invalid_type_error: "Konten komentar harus berupa teks string",
    })
    .transform((val) => (typeof val === "string" ? val.trim() : ""))
    .refine((val) => val.length >= 1 && val.length <= 500, {
      message: "Panjang komentar minimal 1 karakter dan maksimal 500 karakter",
    }),
});

/**
 * Fungsi pembantu untuk memvalidasi pembuatan komentar (POST)
 */
function validateCreateComment(params, body) {
  const errors = [];

  // 1. Validasi parameter path
  const paramsResult = commentParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    const issues = paramsResult.error.issues || [];
    issues.forEach((issue) => errors.push(issue.message));
  }

  // 2. Validasi request body
  let parsedContent = "";
  if (!body || typeof body !== "object") {
    errors.push("Request body harus berupa JSON object dan tidak boleh kosong");
  } else {
    const bodyResult = commentBodySchema.safeParse(body);
    if (!bodyResult.success) {
      const issues = bodyResult.error.issues || [];
      issues.forEach((issue) => errors.push(issue.message));
    } else {
      parsedContent = bodyResult.data.content;
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors: errors,
    };
  }

  return {
    success: true,
    data: {
      mediaType: paramsResult.data.mediaType,
      malId: paramsResult.data.malId,
      content: parsedContent,
    },
  };
}

/**
 * Fungsi pembantu untuk memvalidasi pengambilan komentar (GET)
 */
function validateGetComments(params, query = {}) {
  const errors = [];

  // Mendukung parameter path atau query fallback (?type=&malId=)
  const normalizedParams = {
    mediaType: params.mediaType || query.mediaType || query.type,
    malId: params.malId !== undefined ? params.malId : query.malId || query.mal_id,
  };

  const paramsResult = commentParamsSchema.safeParse(normalizedParams);
  if (!paramsResult.success) {
    const issues = paramsResult.error.issues || [];
    issues.forEach((issue) => errors.push(issue.message));
  }

  const queryResult = commentQuerySchema.safeParse(query);
  if (!queryResult.success) {
    const issues = queryResult.error.issues || [];
    issues.forEach((issue) => errors.push(issue.message));
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors: errors,
    };
  }

  return {
    success: true,
    data: {
      mediaType: paramsResult.data.mediaType,
      malId: paramsResult.data.malId,
      page: queryResult.data.page,
      limit: queryResult.data.limit,
    },
  };
}

module.exports = {
  commentParamsSchema,
  commentQuerySchema,
  commentBodySchema,
  validateCreateComment,
  validateGetComments,
};
