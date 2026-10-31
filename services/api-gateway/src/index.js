const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { sanitizeHeaders, extractSession, requireAuth } = require("./middlewares/authMiddleware");

// Muat environment variables dari .env root saat dijalankan secara lokal
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
const PORT = process.env.PORT || process.env.PORT_GATEWAY || 4000;

// Standar keamanan: nonaktifkan header x-powered-by
app.disable("x-powered-by");

// CORS: Izinkan frontend Next.js lokal (http://localhost:3000) dengan credentials: true
const isProduction = process.env.APP_ENV === "production" || process.env.APP_ENV === "staging";
if (!isProduction) {
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true,
    })
  );
}

// Parsing Cookie sesi untuk verifikasi autentikasi di tingkat Gateway
app.use(cookieParser());

// Bersihkan header spoofing dari request eksternal
app.use(sanitizeHeaders);

// Ekstrak sesi login (JWT) pada setiap request (jika ada cookie / token)
app.use(extractSession);

// Endpoint health check
const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api-gateway",
    message: "API Gateway is running",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// Menentukan alamat internal microservices
let userServiceUrl = process.env.USER_SERVICE_URL;
if (!userServiceUrl) {
  userServiceUrl = process.platform === "win32" ? "http://localhost:4001" : "http://user-service:4001";
}

let catalogServiceUrl = process.env.CATALOG_SERVICE_URL;
if (!catalogServiceUrl) {
  catalogServiceUrl = process.platform === "win32" ? "http://localhost:4002" : "http://catalog-service:4002";
}

let trackerServiceUrl = process.env.TRACKER_SERVICE_URL;
if (!trackerServiceUrl) {
  trackerServiceUrl = process.platform === "win32" ? "http://localhost:4003" : "http://tracker-service:4003";
}

// Handler event proxy umum
const createServiceProxyOptions = (serviceName, targetUrl) => ({
  target: targetUrl,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Keamanan: Hapus header identitas bawaan dari klien eksternal
      proxyReq.removeHeader("x-user-id");
      proxyReq.removeHeader("x-user-name");
      proxyReq.removeHeader("x-user-email");
      proxyReq.removeHeader("x-internal-key");

      // Jika pengguna terautentikasi oleh Gateway, teruskan identitas terverifikasi ke downstream microservice (Tiket MJ-064)
      if (req.user) {
        proxyReq.setHeader("x-user-id", String(req.user.id));
        if (req.user.username) {
          proxyReq.setHeader("x-user-name", String(req.user.username));
        }
        if (req.user.email) {
          proxyReq.setHeader("x-user-email", String(req.user.email));
        }

        const internalKey = process.env.INTERNAL_KEY;
        if (internalKey) {
          proxyReq.setHeader("x-internal-key", internalKey);
        }
      }
    },
    error: (err, req, res) => {
      console.error(`[Gateway Proxy Error] Gagal meneruskan ke ${serviceName}:`, err.message);
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          error: {
            code: "BAD_GATEWAY",
            message: `${serviceName} tidak dapat dihubungi atau sedang offline.`,
          },
        });
      }
    },
  },
});

// Proteksi endpoint terlindungi di level API Gateway (Tiket MJ-064)
// Endpoint /api/users/me wajib login
app.use("/api/users/me", requireAuth);

// Daftarkan rute proxy ke User Service
app.use(
  "/api/auth",
  createProxyMiddleware(createServiceProxyOptions("User Service", `${userServiceUrl}/api/auth`))
);

app.use(
  "/api/users",
  createProxyMiddleware(createServiceProxyOptions("User Service", `${userServiceUrl}/api/users`))
);

// Daftarkan rute proxy ke Catalog Service
app.use(
  "/api/catalog",
  createProxyMiddleware(createServiceProxyOptions("Catalog Service", `${catalogServiceUrl}/api/catalog`))
);

// Daftarkan rute proxy ke Tracker Service (dilindungi autentikasi gateway)
app.use(
  "/api/tracker",
  requireAuth,
  createProxyMiddleware(createServiceProxyOptions("Tracker Service", `${trackerServiceUrl}/api/tracker`))
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
  console.log(`Routing /api/catalog to ${catalogServiceUrl}`);
  console.log(`Routing /api/tracker to ${trackerServiceUrl}`);
});

module.exports = app;
