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
