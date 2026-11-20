const express = require("express");
const path = require("path");

// Muat environment variables dari .env root saat dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
const PORT = process.env.PORT || process.env.PORT_NOTIFICATION || 4005;

// Standar keamanan: nonaktifkan header x-powered-by
app.disable("x-powered-by");

// Middleware parsing JSON
app.use(express.json());

// Endpoint health check (sesuai arsitektur microservices)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "notification-service",
    message: "Notification Service is running",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);
app.get("/api/notifications/health", healthHandler);
app.get("/api/notification/health", healthHandler);

// Handler 404 jika route belum diimplementasikan atau tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan pada Notification Service`,
      details: [],
    },
  });
});

// Handler error terpusat
app.use((err, req, res, next) => {
  console.error("[Notification Service Error]:", err.message);
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan internal pada Notification Service",
      details: [],
    },
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Notification Service] berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
