/**
 * authMock.js — Data tiruan untuk endpoint autentikasi & profil pengguna.
 *
 * Format respons mengikuti kontrak resmi di docs/api/api-contract-mvp.md:
 * - Sukses : { success: true, data: {...} }
 * - Error  : { success: false, error: { code, message } }
 *
 * Endpoint yang dicakup:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/users/me
 */

// ============================================================
// REGISTER
// ============================================================

/** Respons sukses registrasi (201 Created) */
export const mockRegisterSuccess = {
  success: true,
  data: {
    id: "usr_mock_123",
    username: "dika_dev",
    email: "dika@mojiji.com",
  },
};

/** Respons error: email sudah terdaftar (409 Conflict) */
export const mockRegisterConflict = {
  success: false,
  error: {
    code: "CONFLICT",
    message: "Email sudah terdaftar",
    details: [],
  },
};

/** Respons error: validasi input gagal (400 Bad Request) */
export const mockRegisterValidationError = {
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Request validation failed",
    details: [
      { field: "password", message: "Password minimal 8 karakter" },
    ],
  },
};

// ============================================================
// LOGIN
// ============================================================

/** Respons sukses login (200 OK) */
export const mockLoginSuccess = {
  success: true,
  data: {
    id: "usr_mock_123",
    username: "dika_dev",
    email: "dika@mojiji.com",
  },
};

/** Respons error: kredensial salah (401 Unauthorized) */
export const mockLoginUnauthorized = {
  success: false,
  error: {
    code: "UNAUTHORIZED",
    message: "Email atau password salah",
    details: [],
  },
};

// ============================================================
// LOGOUT
// ============================================================

/** Respons sukses logout (200 OK) */
export const mockLogoutSuccess = {
  success: true,
  data: null,
};

// ============================================================
// GET CURRENT USER (GET /api/users/me)
// ============================================================

/** Respons sukses ambil profil (200 OK) */
export const mockMeSuccess = {
  success: true,
  data: {
    id: "usr_mock_123",
    username: "dika_dev",
    email: "dika@mojiji.com",
  },
};

/** Respons error: belum login / sesi kadaluarsa (401 Unauthorized) */
export const mockMeUnauthorized = {
  success: false,
  error: {
    code: "UNAUTHORIZED",
    message: "Belum login atau sesi tidak valid",
    details: [],
  },
};

