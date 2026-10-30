const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

/**
 * 1. POST /api/auth/register (Tiket MJ-043)
 * Mendaftarkan akun baru dan menyimpan password dalam bentuk hash bcrypt
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.validatedData || req.body;

    // Periksa apakah email atau username sudah terdaftar
    const existingCheckQuery = `
      SELECT id, username, email 
      FROM user_service.users 
      WHERE email = $1 OR username = $2
      LIMIT 1;
    `;
    const existingResult = await pool.query(existingCheckQuery, [email, username]);

    if (existingResult.rows.length > 0) {
      const existingUser = existingResult.rows[0];
      const conflictDetails = [];

      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        conflictDetails.push("Email sudah digunakan");
      }
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        conflictDetails.push("Username sudah digunakan");
      }

      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT_ERROR",
          message: "Email atau username sudah digunakan",
          details: conflictDetails,
        },
      });
    }

    // Hash password menggunakan bcryptjs (salt cost = 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Simpan ke database
    const insertUserQuery = `
      INSERT INTO user_service.users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
    `;
    const insertResult = await pool.query(insertUserQuery, [username, email, passwordHash]);
    const newUser = insertResult.rows[0];

    return res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT_ERROR",
          message: "Email atau username sudah digunakan",
          details: ["Data akun dengan username atau email tersebut sudah terdaftar."],
        },
      });
    }

    console.error("Error pada register:", error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server saat memproses registrasi",
      },
    });
  }
}

/**
 * 2. POST /api/auth/login (Tiket MJ-044)
 * Memverifikasi kredensial dan menerbitkan cookie sesi JWT
 */
async function login(req, res) {
  try {
    const { email, password } = req.validatedData || req.body;

    // Cari user berdasarkan email
    const findUserQuery = `
      SELECT id, username, email, password_hash
      FROM user_service.users
      WHERE email = $1
      LIMIT 1;
    `;
    const userResult = await pool.query(findUserQuery, [email]);

    // Jika user tidak ditemukan
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Email atau password salah",
        },
      });
    }

    const user = userResult.rows[0];

    // Bandingkan password plaintext dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Email atau password salah",
        },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET belum dikonfigurasi di environment variables!");
      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Konfigurasi keamanan server belum lengkap.",
        },
      });
    }

    // Buat token JWT berlaku selama 7 hari
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Konfigurasi cookie sesi httpOnly sesuai panduan keamanan tim di PRD
    const cookieName = process.env.COOKIE_NAME || "mojiji_session";
    const isProduction = process.env.APP_ENV === "production" || process.env.APP_ENV === "staging";

    res.cookie(cookieName, token, {
      httpOnly: true, // Mencegah akses via JavaScript di browser (proteksi XSS)
      secure: isProduction, // Aktif hanya pada HTTPS (di staging & prod)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
      path: "/",
    });

    // Kembalikan data user non-sensitif (tanpa token di JSON dan tanpa password)
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error pada login:", error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server saat memproses login",
      },
    });
  }
}

/**
 * 3. POST /api/auth/logout (Tiket MJ-044)
 * Mengakhiri sesi pengguna dengan menghapus cookie sesi
 */
async function logout(req, res) {
  try {
    const cookieName = process.env.COOKIE_NAME || "mojiji_session";
    const isProduction = process.env.APP_ENV === "production" || process.env.APP_ENV === "staging";

    // Hapus cookie sesi
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      data: {
        message: "Logout berhasil",
      },
    });
  } catch (error) {
    console.error("Error pada logout:", error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server saat memproses logout",
      },
    });
  }
}

/**
 * 4. GET /api/users/me (Tiket MJ-044 & US-010)
 * Mengambil profil akun pengguna yang sedang login
 */
async function getCurrentUser(req, res) {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi tidak ditemukan atau tidak valid.",
        },
      });
    }

    const query = `
      SELECT id, username, email, created_at
      FROM user_service.users
      WHERE id = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Pengguna tidak ditemukan",
        },
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error pada getCurrentUser:", error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server saat mengambil data profil",
      },
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
