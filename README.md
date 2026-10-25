<div align="center">
  <h1>🌟 Mojiji (AnimeList)</h1>
  <p><strong>Platform Pencatatan dan Pelacakan Anime & Manga Terpadu</strong></p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-Microservices-339933?logo=node.js&logoColor=white)](#)
  [![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?logo=next.js&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](#)
  [![Docker](https://img.shields.io/badge/Docker-Container-2496ED?logo=docker&logoColor=white)](#)
</div>

---

## 📖 Tentang Proyek

Mojiji adalah aplikasi web responsif modern yang dirancang untuk membantu para penggemar kultur pop Jepang mencatat, melacak, dan mengelola daftar tontonan anime serta bacaan manga mereka. 

*Catatan: Aplikasi ini murni berfokus pada fitur pelacakan (tracker) dan komunitas, serta **tidak** mendistribusikan atau menyediakan layanan streaming/membaca secara ilegal.*

## 🛠️ Tumpukan Teknologi (Tech Stack)

Proyek ini dibangun menggunakan arsitektur *Microservices* untuk skalabilitas dan performa tinggi.

*   **Frontend:** Next.js (React), Tailwind CSS
*   **Backend Services:** Node.js, Express.js
*   **Database & Cache:** PostgreSQL, Redis (via Upstash untuk Production)
*   **API Pihak Ketiga:** Tenrai API (Katalog Data Anime)
*   **Infrastruktur & CI/CD:** Docker, Docker Compose, GitHub Actions, Ubuntu VPS

## 📂 Arsitektur Repositori

Repositori ini menggunakan pendekatan *monorepo* untuk mengelola seluruh ekosistem aplikasi:

```text
mojiji-animelist/
├── apps/web/          # Aplikasi Frontend (Next.js)
├── services/          # Kumpulan Backend Microservices (Node.js)
│   ├── api-gateway/   # Resepsionis dan Routing Utama
│   ├── catalog-service/ # Manajemen Data Anime/Manga
│   ├── tracker-service/ # Logika Pelacakan (Watchlist)
│   └── user-service/  # Autentikasi dan Manajemen Profil
├── database/          # Skrip Migrasi, Seeder, dan Skema DB
├── tests/             # Unit, Integration, dan E2E Testing
├── infra/             # File Konfigurasi Docker dan Deployment
└── docs/              # PRD, Arsitektur, API, dan Panduan
```

---

## 🚀 Panduan Memulai (Development)

**⚠️ PERHATIAN TIM:** 
Sebelum memulai, wajib membaca [**docs/deployment/panduan-docker-tim.md**](docs/deployment/panduan-docker-tim.md) untuk memahami perintah spesifik berdasarkan *role* Anda (Frontend/Backend/DBA).

### Persiapan Awal
1. Kloning repositori ini.
2. Salin `infra/compose/.env.example` menjadi `.env` dan letakkan di **root proyek**.
3. Isi kredensial lokal pada file `.env` tersebut.

### Menjalankan Lingkungan Lokal

Kami menggunakan Docker untuk memastikan konsistensi lingkungan pengembangan. Selalu gunakan flag `--env-file .env` agar sistem membaca kredensial dari root proyek.

```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up --build -d
```

**Daftar Akses Layanan Lokal:**
*   API Gateway: `http://localhost:4000/health`
*   User Service: `http://localhost:4001/health`
*   Catalog Service: `http://localhost:4002/health`
*   Tracker Service: `http://localhost:4003/health`
*   PostgreSQL: `localhost:5432`
*   Redis: `localhost:6379`

### Menghentikan Layanan
Gunakan perintah ini untuk mematikan layanan tanpa menghapus data database Anda:
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down
```

---

## 🌐 Deployment (VPS Staging/Production)

Lingkungan server dioptimalkan untuk VPS (RAM 1GB/2GB). Proses ini menggunakan *image* bawaan dari GitHub Container Registry tanpa proses `build` lokal untuk menghemat memori.

```bash
# Menarik image terbaru dari registry
docker compose --env-file .env -f infra/compose/docker-compose.server.yml pull

# Menjalankan server di background
docker compose --env-file .env -f infra/compose/docker-compose.server.yml up -d
```

## 🤝 Kontribusi

Kami menyambut kontribusi dari seluruh anggota tim. Harap ikuti aturan berikut:
1. Baca **`CONTRIBUTING.md`** sebelum menulis kode.
2. Cek papan kerja di **GitHub Projects "Mojiji Kanban"**.
3. Selalu buat *branch* baru dari `develop`.
4. *Push* kode Anda dan buat **Pull Request (PR)** menuju `develop` (Direct push tidak diizinkan).
