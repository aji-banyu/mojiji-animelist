const { z } = require("zod");

// Skema validasi untuk request registrasi sesuai AC US-007 & skema database
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

// Middleware helper untuk memvalidasi body request menggunakan schema Zod
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

  // Simpan data yang sudah tervalidasi dan di-sanitize ke req.validatedData
  req.validatedData = result.data;
  next();
}

module.exports = {
  validateRegister,
  registerSchema,
};
