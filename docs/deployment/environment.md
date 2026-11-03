---
title: "Peta Environment & Manajemen Rahasia (MJ-035)"
sidebar_position: 1
tags: [infrastruktur, devops, environment, secrets, config, staging, production]
---

# Peta Lingkungan & Manajemen Rahasia (MJ-035)

Dokumen ini memetakan seluruh lingkungan komputasi (*environments*), topologi isolasi infrastruktur, kamus variabel konfigurasi, serta tata kelola pengelolaan rahasia (*secret management*) untuk proyek **Mojiji AnimeList** sesuai tiket **MJ-035**.

---

## 1. Topologi Arsitektur Tiga Lingkungan

Aplikasi Mojiji beroperasi dalam tiga zona lingkungan yang terisolasi secara ketat: **Lokal (*Development*)**, **Staging (*Pre-Production*)**, dan **Production (*Live Public*)**.

```mermaid
flowchart LR
    subgraph LOCAL ["1. Lingkungan Lokal (Dev)"]
        A1["Docker Desktop / Laptop"] --> A2["PostgreSQL Container :5432"]
        A1 --> A3["Redis Container :6379"]
        A1 --> A4["Next.js Dev :3000"]
    end

    subgraph STAGING ["2. Lingkungan Staging (develop)"]
        B1["VPS Host (Ubuntu 24.04 - Xeon Shared)"] --> B2["Supabase DB (mojiji-staging)"]
        B1 --> B3["Upstash Redis (mojiji_staging:)"]
        B1 --> B4["Caddy -> staging.mojiji.web.id"]
    end

    subgraph PROD ["3. Lingkungan Production (main)"]
        C1["VPS Host (Ubuntu 24.04 - Xeon Shared)"] --> C2["Supabase DB (mojiji-production)"]
        C1 --> C3["Upstash Redis (mojiji_prod:)"]
        C1 --> C4["Caddy -> mojiji.web.id"]
    end
```

---

## 2. Matriks Pemetaan Lingkungan Komputasi

Seluruh nilai rahasia, koneksi database, dan domain publik wajib dipisahkan agar aktivitas pengujian tidak mencemari data produksi:

| Parameter Konfigurasi | Lingkungan Lokal (*Dev*) | Lingkungan Staging (*develop*) | Lingkungan Production (*main*) |
| :--- | :--- | :--- | :--- |
| **Lokasi Peladen** | Komputer / Laptop Pengembang | Host VPS Ubuntu (`/opt/mojiji/staging`) | Host VPS Ubuntu (`/opt/mojiji/production`) |
| **Pemicu Rilis (CI/CD)** | Manual (`npm run dev` / Compose) | Otomatis saat PR di-merge ke `develop` | Otomatis saat PR di-merge ke `main` |
| **Alamat URL Publik** | `http://localhost:3000` | `https://staging.mojiji.web.id` | `https://mojiji.web.id` |
| **Database PostgreSQL** | Kontainer Docker Lokal (`postgres:16`) | Supabase Project 1 (`mojiji-staging`) | Supabase Project 2 (`mojiji-production`) |
| **Cache & Session (Redis)** | Kontainer Docker Lokal (`redis:7`) | Upstash Cloud (`mojiji_staging:`) | Upstash Cloud (`mojiji_prod:`) |
| **Nama Cookie Sesi** | `mojiji_dev_session` | `mojiji_session` | `mojiji_session` |
| **Logging Level** | `debug` (verbose di terminal) | `info` (tercatat di Docker logs) | `warn` / `error` (tercatat di Docker logs) |

> [!NOTE]
> Meskipun Staging dan Production berbagi satu peladen fisik VPS (Shared VPS 2 GB RAM), kedua lingkungan tersebut diisolasi secara total menggunakan Docker Compose Project terpisah (`mojiji-staging` dan `mojiji-prod`), jaringan internal terpisah, serta berkas `.env` yang berlainan.

---

## 3. Kamus Variabel Konfigurasi (`.env.example`)

Seluruh repositori wajib memiliki berkas `.env.example` di tingkat *root* dan sub-layanan tanpa memuat nilai rahasia asli:

```ini
# ==============================================================================
# Mojiji AnimeList - Environment Variable Template (.env.example)
# DILARANG MENYIMPAN NILAI RAHASIA / KREDENSIAL ASLI DI BERKAS INI!
# ==============================================================================

# Identitas Lingkungan (development | staging | production)
APP_ENV=development
NODE_ENV=development

# Port Microservices (Internal)
PORT_GATEWAY=4000
PORT_USER=4001
PORT_CATALOG=4002
PORT_TRACKER=4003

# URL Layanan Database PostgreSQL (Multi-Schema)
# Format: postgresql://[user]:[password]@[host]:[port]/[database]—sslmode=require
DATABASE_URL=postgresql://postgres:password@localhost:5432/mojiji_dev

# URL Cache & Penyimpanan Sesi Redis (Upstash Serverless)
# Format: rediss://default:[password]@[endpoint]:[port]
REDIS_URL=redis://localhost:6379
REDIS_KEY_PREFIX=mojiji_dev:

# Integrasi Eksternal API Katalog Anime (Tenrai Provider)
TENRAI_BASE_URL=https://api.tenrai.org/v1

# Keamanan Sesi & Kunci Kriptografi
# Hasilkan kunci aman dengan: openssl rand -hex 32
JWT_SECRET=rahasia_jwt_wajib_diubah_pada_lingkungan_live
INTERNAL_KEY=kunci_autentikasi_internal_antar_layanan_microservices
COOKIE_NAME=mojiji_session

# Alokasi Maksimal Memori Node.js Runtime (V8 Heap Limit)
NODE_OPTIONS="--max-old-space-size=64"
```

---

## 4. Kebijakan Manajemen Rahasia (*Secret Management Policy*)

Untuk menjamin keamanan kredensial dan mencegah kebocoran data (*credential leak*):

```mermaid
flowchart TD
    A["Sumber Nilai Rahasia"] --> B["1. Komputer Lokal: .env (Masuk .gitignore)"]
    A --> C["2. GitHub Actions: Repository Secrets (Enkripsi Asimetris)"]
    A --> D["3. Server VPS: /opt/mojiji/*/.env (Hak Akses chmod 600)"]
    
    B --> E["Dilarang Keras Commit ke Git Repo"]
    C --> F["Diinjeksi saat Pipeline Build / Deploy SSH"]
    D --> G["Hanya User 'deploy' dan root yang Dapat Membaca"]
```

### A. Aturan Ketat Repositori Git
* **Pantangan Mutlak:** Dilarang keras menaruh kata sandi, URL database asli, kunci JWT, atau private key SSH di dalam file kode (`.js`, `.yml`, `.json`, dll.).
* **Proteksi `.gitignore`:** Berkas `.env`, `.env.local`, `.env.*.local`, serta berkas kunci `.pem` / `.key` wajib terdaftar di `.gitignore`.

### B. Penyimpanan Rahasia di GitHub Secrets
Rahasia yang dibutuhkan saat proses CI/CD disimpan di panel **GitHub Repository Settings > Secrets and variables > Actions**:
1. `HOST_VPS`: Alamat IP Publik peladen VPS Ubuntu.
2. `USERNAME_VPS`: Akun pengguna server (`deploy`).
3. `SSH_PRIVATE_KEY`: Kunci privat SSH (Ed25519) untuk otentikasi aman tanpa kata sandi.
4. `STAGING_DATABASE_URL`: Connection string PostgreSQL Supabase Staging.
5. `STAGING_REDIS_URL`: Connection string Upstash Redis Staging.
6. `STAGING_JWT_SECRET`: Token enkripsi JWT Staging.

### C. Keamanan Berkas di Peladen VPS Host
Di peladen VPS, berkas konfigurasi disimpan pada direktori terlindungi dengan hak akses terbatas:
```bash
# Mengunci izin berkas agar hanya bisa dibaca oleh user deploy
chmod 600 /opt/mojiji/staging/.env
chmod 600 /opt/mojiji/production/.env
```

---
*Dokumen ini disusun oleh Aji (DevOps Engineer) sebagai pemenuhan Acceptance Criteria tiket **MJ-035** (Minggu 4).*
