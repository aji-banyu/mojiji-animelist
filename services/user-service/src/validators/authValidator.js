const { z } = require("zod");

// Skema validasi untuk request registrasi (MJ-043)
const registerSchema = z.object({
  username: z
    .string({ required_error: "Username wajib diisi" })
    .trim()
    .min(3, "Username minimal terdiri dari 3 karakter")
    .max(50, "Username maksimal terdiri dari 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh memuat huruf, angka, dan garis bawah (_)"),
  email: z
    .string({ required_error: "Email wajib diisi" })
    .trim()
    .email("Format email tidak valid")
    .max(255, "Email maksimal terdiri dari 255 karakter"),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(8, "Password minimal terdiri dari 8 karakter"),
});

// Skema validasi untuk request login (MJ-044)
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .trim()
    .email("Format email tidak valid"),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(1, "Password tidak boleh kosong"),
});

// Middleware helper untuk validasi register
function validateRegister(req, res, next) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const details = issues.map((issue) => issue.message);
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validasi input gagal",
        details: details,
      },
    });
  }

  req.validatedData = result.data;
  next();
}

// Middleware helper untuk validasi login
function validateLogin(req, res, next) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const details = issues.map((issue) => issue.message);
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validasi input gagal",
        details: details,
      },
    });
  }

  req.validatedData = result.data;
  next();
}

module.exports = {
  registerSchema,
  loginSchema,
  validateRegister,
  validateLogin,
};
