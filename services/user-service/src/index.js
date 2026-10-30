const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

// Muat environment variables dari .env root saat dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 4001;

// Standar keamanan: nonaktifkan header x-powered-by
app.disable("x-powered-by");

// Middleware untuk mem-parsing body JSON
app.use(express.json());

// Middleware untuk mem-parsing Cookie HTTP
app.use(cookieParser());

// Endpoint health check (sesuai arsitektur dan deployment)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "user-service",
    message: "User Service is running",
  });
});

// Registrasi routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Jalankan server
const server = app.listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});

// Penanganan Graceful Shutdown saat menerima sinyal terminasi
function gracefulShutdown(signal) {
  console.log(`Menerima sinyal ${signal}. Menutup server dan koneksi database dengan rapi...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log("Koneksi database PostgreSQL berhasil ditutup.");
      process.exit(0);
    } catch (err) {
      console.error("Gagal menutup koneksi database:", err.message);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = app;
