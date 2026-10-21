# Mojiji (AnimeList)

Aplikasi web responsif untuk mencatat dan melacak anime dan manga.
Tidak menyediakan streaming anime maupun pembaca manga.

## Teknologi

Next.js (frontend), Node.js + Express.js (backend, microservices),
PostgreSQL, Redis (Upstash), Tenrai API, Docker, GitHub Actions.

## Struktur repo

* `apps/web`: frontend

* `services`: backend microservices

* `database`: migration, seed, dokumentasi

* `tests`: tes API, integrasi, e2e

* `infra`: konfigurasi deployment

* `docs`: PRD, arsitektur, API, UI/UX, QA, deployment

## Mulai berkontribusi

Baca `CONTRIBUTING.md`. Papan kerja: GitHub Projects "Mojiji Kanban".
Branch dibuat dari `develop`; semua perubahan lewat Pull Request ke `develop`.

## 🚀 Cara Menjalankan Lingkungan Development (Docker)

**⚠️ WAJIB BACA UNTUK SELURUH TIM:**
Untuk mengetahui layanan spesifik yang perlu Anda nyalakan sesuai *role* (Frontend, Backend, DBA) dan solusi jika terjadi bentrok *port*, silakan buka file:
👉 [**docs/deployment/panduan-docker-tim.md**](docs/deployment/panduan-docker-tim.md)

### 💻 Lingkungan Lokal (Development)

Pastikan Anda telah menyalin file `.env.example` menjadi `.env` di root proyek dan mengisi kredensial lokal.

**1. Menyalakan Layanan (Build & Run):**

```
docker compose -f infra/compose/docker-compose.dev.yml up --build -d

```

Layanan akan berjalan di:

* API Gateway: `http://localhost:4000/health`

* User Service: `http://localhost:4001/health`

* Catalog Service: `http://localhost:4002/health`

* Tracker Service: `http://localhost:4003/health`

* PostgreSQL: `5432` | Redis: `6379`

**2. Mematikan Layanan:**
*(Data database tetap aman dan tidak akan terhapus)*

```
docker compose -f infra/compose/docker-compose.dev.yml down

```

**3. Menjalankan Migrasi Database (Khusus DBA):**

```
docker compose -f infra/compose/docker-compose.dev.yml run --rm migrate up

```

## 🌐 Lingkungan Server (VPS RAM 1GB)

Digunakan khusus saat deployment di VPS. Sangat ringan karena mengambil image langsung dari GitHub Container Registry tanpa proses `build`.

**1. Menyalakan Server (Pull & Run):**

```
docker compose -f infra/compose/docker-compose.server.yml pull
docker compose -f infra/compose/docker-compose.server.yml up -d

```

**2. Mematikan Server:**

```
docker compose -f infra/compose/docker-compose.server.yml down

```