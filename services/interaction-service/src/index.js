const express = require("express");
const path = require("path");

// Muat environment variables dari .env root saat dijalankan lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || process.env.PORT_INTERACTION || 4004;

// Standar keamanan: nonaktifkan header x-powered-by
app.disable("x-powered-by");

// Middleware parsing JSON
app.use(express.json());

// Endpoint health check (sesuai arsitektur microservices)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "interaction-service",
    message: "Interaction Service is running",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);
app.get("/api/interaction/health", healthHandler);
app.get("/api/comments/health", healthHandler);

// Rute Komentar (Tiket MJ-118 - US-005)
const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);
app.use("/comments", commentRoutes);
app.use("/api/interaction", commentRoutes);

// Handler 404 jika route belum diimplementasikan atau tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan pada Interaction Service`,
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

  console.error("[Interaction Service Unhandled Error]", err);
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan internal pada server Interaction Service",
      details: [],
    },
  });
});

let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Interaction Service running on port ${PORT}`);
  });

  // Penutupan rapi saat SIGTERM / SIGINT (Graceful Shutdown)
  const gracefulShutdown = (signal) => {
    console.log(`Menerima sinyal ${signal}, menutup Interaction Service secara rapi...`);
    if (server) {
      server.close(async () => {
        try {
          await pool.end();
          console.log("Pool database Interaction Service berhasil ditutup.");
        } catch (err) {
          console.error("Gagal menutup pool database:", err.message);
        }
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

module.exports = app;
