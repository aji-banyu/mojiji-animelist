const bcrypt = require("bcryptjs");
const pool = require("../config/db");

/**
 * Controller untuk registrasi akun baru (POST /api/auth/register)
 * Sesuai Acceptance Criteria US-007 & API Contract MJ-042
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.validatedData || req.body;

    // 1. Periksa apakah email atau username sudah terdaftar sebelumnya
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

    // 2. Hash password menggunakan bcryptjs (salt cost = 10 sesuai PRD)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Simpan data user ke database PostgreSQL tabel user_service.users
    const insertUserQuery = `
      INSERT INTO user_service.users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
    `;
    const insertResult = await pool.query(insertUserQuery, [username, email, passwordHash]);
    const newUser = insertResult.rows[0];

    // 4. Kembalikan response 201 Created sesuai kontrak MJ-042 (tanpa password/hash)
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
    // Tangani PostgreSQL Unique Constraint Violation (kode 23505) seandainya terjadi race condition
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

    console.error("Error pada proses register user:", error.message);

    // Response 500 Internal Server Error tanpa membocorkan stack trace
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server saat memproses registrasi",
      },
    });
  }
}

module.exports = {
  register,
};

