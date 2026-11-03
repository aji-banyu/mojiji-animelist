# Dokumentasi Konfigurasi Produksi Backend & Handoff DevOps — Mojiji AnimeList

## 1. Informasi Handoff

| Kolom | Nilai |
|---|---|
| **Proyek** | Mojiji AnimeList |
| **Tiket** | MJ-099 — Konfigurasi produksi backend |
| **Dari (Sender)** | Syafii — Backend |
| **Kepada (Receiver)** | Aji — DevOps (Tiket Dependen: MJ-106) |
| **Tembusan** | Ryan — DBA (Tiket Dependen: MJ-101) |
| **Status** | Diserahkan / Siap Deploy Production (UTS Minggu 8) |
| **Tanggal Handoff** | 3 November 2026 |

---

## 2. Ringkasan & Tujuan

Dokumen ini merupakan serah terima teknis (*HANDOFF*) konfigurasi lingkungan produksi (**Production Environment**) untuk seluruh microservices backend Mojiji AnimeList (`api-gateway`, `user-service`, `catalog-service`, dan `tracker-service`).

Tujuan dokumen ini adalah memastikan:
1. Seluruh variabel lingkungan produksi telah dipetakan secara akurat tanpa membawa nilai atau kredensial dari lingkungan *staging*.
2. Batasan sumber daya (*resource limits*) VPS 1 GB RAM ditaati secara ketat untuk mencegah server crash (*Out Of Memory*).
3. Tim DevOps (Aji) memiliki panduan siap pakai untuk membuat berkas `/opt/mojiji/production/.env` di VPS dengan izin file aman (`chmod 600`).

---

## 3. Matriks Perbedaan Konfigurasi Staging vs Production

Untuk memastikan isolasi total antara lingkungan staging dan produksi yang berbagi satu VPS 1 GB, seluruh nilai rahasia dan konfigurasi di bawah ini **wajib berbeda**:

| Variabel | Staging (develop) | Production (main) | Alasan & Keterangan |
|---|---|---|---|
| `APP_ENV` | `staging` | `production` | Penanda lingkungan aplikasi |
| `NODE_ENV` | `production` | `production` | Optimasi runtime Node.js |
| `DATABASE_URL` | Supabase Project 1 (`mojiji-staging`) | Supabase Project 2 (`mojiji-production`) | Database terpisah 100%, mencegah pencemaran data |
| `REDIS_KEY_PREFIX`| `stg:` | `prod:` | Menghindari tumpang tindih cache di Upstash |
| `COOKIE_NAME` | `mj_stg_session` | `mj_session` | Mencegah konflik cookie login pada browser |
| `JWT_SECRET` | Kunci rahasia staging | Kunci rahasia production baru | Dihasilkan dengan `openssl rand -hex 32` |
| `INTERNAL_KEY` | Kunci internal staging | Kunci internal production baru | Dihasilkan dengan `openssl rand -hex 32` |
| `TENRAI_BASE_URL` | `https://api.tenrai.org/v1` | `https://api.tenrai.org/v1` | Provider katalog anime/manga eksternal |
| Hostname / Domain | `staging.mojiji.web.id` | `mojiji.web.id` | HTTPS otomatis dikelola Caddy |
| Path Static Web | `/opt/mojiji/staging/web` | `/opt/mojiji/production/web` | File statis Next.js ekspor produksi |

---

## 4. Format Lengkap `/opt/mojiji/production/.env` di VPS

DevOps dapat membuat file ini di VPS menggunakan user `deploy`:
```bash
sudo mkdir -p /opt/mojiji/production
sudo nano /opt/mojiji/production/.env
sudo chmod 600 /opt/mojiji/production/.env
sudo chown deploy:deploy /opt/mojiji/production/.env
```

Isi file `/opt/mojiji/production/.env`:
```ini
# ==========================================
# PRODUCTION ENVIRONMENT - MOJIJI ANIMELIST
# ==========================================
APP_ENV=production
NODE_ENV=production

# Database Supabase Production (Session Pooler IPv4)
# Didapatkan dari DBA Ryan (Tiket MJ-101)
DATABASE_URL=postgres://postgres.<project-ref-prod>:<PASSWORD_PROD>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require

# Upstash Redis Cache Production (Isolasi Prefix prod:)
REDIS_URL=rediss://default:<UPSTASH_PASSWORD_PROD>@<UPSTASH_ENDPOINT_PROD>.upstash.io:6379
REDIS_KEY_PREFIX=prod:

# Provider Katalog Tenrai API v1
TENRAI_BASE_URL=https://api.tenrai.org/v1

# Keamanan Sesi & JWT Production (Generate: openssl rand -hex 32)
JWT_SECRET=b7c2e0f49832d19a4e76c1f885e3d74a2b910c5e3f48a1b2c3d4e5f6a7b8c9d0
COOKIE_NAME=mj_session

# Kunci Komunikasi Internal Antar-Service (Generate: openssl rand -hex 32)
INTERNAL_KEY=f5e4d3c2b1a09876543210fedcba9876543210fedcba9876543210fedcba9876

# Port Microservices Internal (Jaringan Docker)
PORT_GATEWAY=4000
PORT_USER=4001
PORT_CATALOG=4002
PORT_TRACKER=4003

# Internal Service Routing URLs
USER_SERVICE_URL=http://user-service:4001
CATALOG_SERVICE_URL=http://catalog-service:4002
TRACKER_SERVICE_URL=http://tracker-service:4003

# Batasan Memori Node.js Heap
NODE_OPTIONS=--max-old-space-size=64
```

---

## 5. Verifikasi Pembatasan Resource (Resource Limits)

Sesuai ketentuan **PRD Bagian 19 (Resource RAM)** dan **Panduan Server VPS 1 GB**:
1. **Container Memory Limit (`mem_limit`):**
   * Setiap service pada `docker-compose.server.yml` dibatasi maksimal **96 MB RAM** (`mem_limit: 96m`).
2. **Node.js Heap Limit (`NODE_OPTIONS`):**
   * Setiap Dockerfile dan container environment menetapkan `ENV NODE_OPTIONS="--max-old-space-size=64"`, membatasi pemakaian alokasi memori heap V8 maksimal 64 MB.
3. **Database Connection Pool:**
   * `services/user-service/src/config/db.js` dan `services/tracker-service/src/config/db.js` telah terkonfigurasi dengan `max: 3` koneksi per service (total maksimal 6 koneksi ke Supabase production).
4. **Port Isolation:**
   * Seluruh port internal microservices (`4000`, `4001`, `4002`, `4003`) tidak dipublikasikan ke internet; hanya Caddy yang mendengarkan port `80` dan `443`.

---

## 6. Prosedur Uji Kesehatan (Health Check Verifikasi)

Setelah DevOps menjalankan container production via Compose:
`docker compose -p mojiji-prod --env-file /opt/mojiji/production/.env -f /opt/mojiji/production/docker-compose.server.yml up -d`

Verifikasi bahwa seluruh service menjawab sehat:
```bash
# 1. API Gateway Health
curl -s http://localhost:4000/health | jq .
# Expected: {"status":"ok","service":"api-gateway","message":"API Gateway is running"}

# 2. User Service Health
curl -s http://localhost:4001/health | jq .
# Expected: {"status":"ok","service":"user-service","message":"User Service is running"}

# 3. Catalog Service Health
curl -s http://localhost:4002/health | jq .
# Expected: {"status":"ok","service":"catalog-service","message":"Catalog Service is running"}

# 4. Tracker Service Health
curl -s http://localhost:4003/health | jq .
# Expected: {"status":"ok","service":"tracker-service","message":"Tracker Service is running"}

# 5. Public Domain Caddy Health
curl -s https://mojiji.web.id/api/health | jq .
# Expected: {"status":"ok","service":"api-gateway","message":"API Gateway is running"}
```

---

## 7. Status Sign-Off
- [x] Variabel produksi bebas dari nilai/data staging.
- [x] Pool koneksi database terverifikasi maksimal 3 per service.
- [x] Batas memori Node heap 64 MB aktif di Dockerfile & Compose.
- [x] Template `.env.production.example` tersedia di repositori.
- [x] Handoff siap diserahkan kepada Aji (DevOps) untuk tiket `MJ-106`.

