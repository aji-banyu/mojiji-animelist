const { Pool } = require("pg");
const path = require("path");

// Muat environment variables dari .env root saat dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });

let connectionString = process.env.DATABASE_URL;

// Jika dijalankan di Windows host lokal, ganti @db:5432 menjadi @localhost:5432
if (connectionString && process.platform === "win32" && connectionString.includes("@db:5432")) {
  connectionString = connectionString.replace("@db:5432", "@localhost:5432");
}

// Batasan VPS 1 GB: max 3 koneksi per microservice
const pool = new Pool({
  connectionString: connectionString,
  max: 3,
});

pool.on("error", (err) => {
  console.error("Terjadi error tak terduga pada koneksi database PostgreSQL (Tracker Service):", err.message);
});

module.exports = pool;

