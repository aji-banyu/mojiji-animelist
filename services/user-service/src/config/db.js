const { Pool } = require("pg");
const path = require("path");

// Muat environment variables dari .env root saat dijalankan secara lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });

let connectionString = process.env.DATABASE_URL;

// Jika dijalankan di lingkungan lokal host Windows (di luar Docker container),
// ganti hostname 'db' menjadi 'localhost' agar dapat terhubung ke Docker forwarded port 5432
if (connectionString && process.platform === "win32" && connectionString.includes("@db:5432")) {
  connectionString = connectionString.replace("@db:5432", "@localhost:5432");
}

// Pool database PostgreSQL
// Sesuai aturan PRD & Panduan Server VPS 1 GB: max 3 koneksi per service
const pool = new Pool({
  connectionString: connectionString,
  max: 3,
});

pool.on("error", (err) => {
  console.error("Terjadi error tak terduga pada koneksi database PostgreSQL:", err.message);
});

module.exports = pool;

