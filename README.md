# Mojiji (AnimeList)

Aplikasi web responsif untuk mencatat dan melacak anime dan manga.
Tidak menyediakan streaming anime maupun pembaca manga.

## Teknologi
Next.js (frontend), Node.js + Express.js (backend, microservices),
PostgreSQL, Redis (Upstash), Tenrai API, Docker, GitHub Actions.

## Struktur repo
- apps/web: frontend
- services: backend microservices
- database: migration, seed, dokumentasi
- tests: tes API, integrasi, e2e
- infra: konfigurasi deployment
- docs: PRD, arsitektur, API, UI/UX, QA, deployment

## Mulai berkontribusi
Baca CONTRIBUTING.md. Papan kerja: GitHub Projects "Mojiji Kanban".
Branch dibuat dari develop; semua perubahan lewat Pull Request ke develop.
## Cara Menjalankan Lingkungan Development (Docker)

Sesuai dengan kesepakatan tim, jalankan perintah berikut untuk menyalakan Backend, Database (PostgreSQL), dan Redis secara bersamaan:

```bash
docker compose -f infra/compose/docker-compose.dev.yml up --build -d
```
- Backend (User Service) berjalan di: `http://localhost:4001/health`
- PostgreSQL berjalan di port: `5432`
- Redis berjalan di port: `6379`

Untuk mematikan semua layanan tanpa menghapus data database, jalankan:
```bash
docker compose -f infra/compose/docker-compose.dev.yml down
```
