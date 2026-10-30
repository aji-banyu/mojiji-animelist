const express = require("express");
const path = require("path");

// Muat environment variables dari .env root saat dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const catalogRoutes = require("./routes/catalogRoutes");
const internalCatalogRoutes = require("./routes/internalCatalogRoutes");

const app = express();
const PORT = process.env.PORT || process.env.PORT_CATALOG || 4002;

// Standar keamanan: nonaktifkan header x-powered-by
app.disable("x-powered-by");

// Middleware parsing JSON
app.use(express.json());

// Endpoint health check (sesuai arsitektur dan deployment)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "catalog-service",
    message: "Catalog Service is running",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// Rute Publik (diteruskan oleh API Gateway)
app.use("/api/catalog", catalogRoutes);

// Rute Internal Microservice (akses privat antar-layanan, misal Tracker Service)
app.use("/internal/catalog", internalCatalogRoutes);

// Jalankan server
const server = app.listen(PORT, () => {
  console.log(`Catalog Service running on http://localhost:${PORT}`);
});

// Penanganan Graceful Shutdown saat menerima sinyal terminasi
function gracefulShutdown(signal) {
  console.log(`Menerima sinyal ${signal}. Menutup Catalog Service dengan rapi...`);
  server.close(() => {
    console.log("Catalog Service berhasil ditutup.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = app;
