const express = require("express");
const cors = require("cors");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Muat environment variables dari .env root saat dijalankan secara lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
const PORT = process.env.PORT || process.env.PORT_GATEWAY || 4000;

// Standar keamanan: nonaktifkan header x-powered-by
app.disable("x-powered-by");

// CORS: Izinkan frontend Next.js lokal (http://localhost:3000) dengan credentials: true
// Di staging dan production, Frontend dan API berada di satu domain lewat Caddy (/api) sehingga CORS tidak diperlukan
const isProduction = process.env.APP_ENV === "production" || process.env.APP_ENV === "staging";
if (!isProduction) {
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true,
    })
  );
}

// Endpoint health check (sesuai spesifikasi deployment dan Caddy)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api-gateway",
    message: "API Gateway is running",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// Menentukan alamat internal user-service
let userServiceUrl = process.env.USER_SERVICE_URL;
if (!userServiceUrl) {
  // Jika dijalankan di lingkungan host lokal Windows (di luar Docker container)
  if (process.platform === "win32") {
    userServiceUrl = "http://localhost:4001";
  } else {
    // Di dalam jaringan container Docker Linux Compose
    userServiceUrl = "http://user-service:4001";
  }
}

// Handler event proxy untuk User Service
const proxyOptions = {
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Keamanan: Hapus header identitas x-user-id dari request luar agar tidak bisa dipalsukan (PRD MJ-064)
      proxyReq.removeHeader("x-user-id");
    },
    error: (err, req, res) => {
      console.error(`[Gateway Proxy Error] Gagal meneruskan request ke User Service:`, err.message);
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          error: {
            code: "BAD_GATEWAY",
            message: "User Service tidak dapat dihubungi atau sedang offline.",
          },
        });
      }
    },
  },
};

// Daftarkan rute proxy ke User Service
// Mount path /api/auth dipadukan dengan target URL agar path tetap utuh saat sampai di user-service
app.use(
  "/api/auth",
  createProxyMiddleware({
    ...proxyOptions,
    target: `${userServiceUrl}/api/auth`,
  })
);

app.use(
  "/api/users",
  createProxyMiddleware({
    ...proxyOptions,
    target: `${userServiceUrl}/api/users`,
  })
);

// Handler 404 jika route tidak ditemukan di gateway
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan di API Gateway`,
    },
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log(`Routing /api/auth and /api/users to ${userServiceUrl}`);
});

module.exports = app;
