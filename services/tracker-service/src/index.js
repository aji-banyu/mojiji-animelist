const express = require("express");
const path = require("path");

// Muat environment variables dari .env root saat dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const pool = require("./config/db");
const trackerRoutes = require("./routes/trackerRoutes");

const app = express();
const PORT = process.env.PORT || process.env.PORT_TRACKER || 4003;

// Standar keamanan: nonaktifkan header x-powered-by
app.disable("x-powered-by");

// Middleware parsing JSON
app.use(express.json());

// Endpoint health check (sesuai arsitektur microservices)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "tracker-service",
    message: "Tracker Service is running",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// Registrasi endpoint tracker
app.use("/api/tracker", trackerRoutes);

// Handler 404 jika route tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan pada Tracker Service`,
      details: [],
    },
  });
});

// Handler error terpusat (Global Error Handler)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Format JSON pada request body tidak valid",
        details: ["Sintaks JSON tidak dapat diparsing"],
      },
    });
  }

  console.error("[Tracker Service Unhandled Error]", err);
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan internal pada Tracker Service",
      details: [],
    },
  });
});

// Jalankan server HTTP
const server = app.listen(PORT, () => {
  console.log(`Tracker Service running on http://localhost:${PORT}`);
});

// Penanganan Graceful Shutdown
function gracefulShutdown(signal) {
  console.log(`Menerima sinyal ${signal}. Menutup Tracker Service dengan rapi...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log("Koneksi database PostgreSQL Tracker Service berhasil ditutup.");
    } catch (err) {
      console.error("Error saat menutup pool database:", err.message);
    }
    process.exit(0);
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = app;
