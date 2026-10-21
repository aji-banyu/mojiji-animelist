# 🐳 Panduan Penggunaan Docker Tim MOJIJI

Semua konfigurasi lokal menggunakan file: `infra/compose/docker-compose.dev.yml`
File ini mengambil rahasia (secret) dari file `.env` di root proyek.

---

## 🎨 1. UI/UX (Ican) & 🕵️‍♀️ 5. QA (Nadia)
Anda **TIDAK PERLU** menginstal atau menjalankan Docker.
- Kerjakan desain di Figma (UI/UX).
- Uji URL Staging di browser dan Postman (QA).

---

## 💻 2. Frontend (Dika)
Anda tidak diwajibkan menggunakan Docker jika URL API Staging/Mock sudah ada. Jika butuh lingkungan lokal secara penuh:
- **Menyalakan Semua:** `docker compose -f infra/compose/docker-compose.dev.yml up -d`
- **Mematikan Semua:** `docker compose -f infra/compose/docker-compose.dev.yml down`
- *Catatan:* Fokus pada `npm run dev` di folder `apps/web`. Biarkan port backend diurus Docker.

---

## ⚙️ 3. Backend (Syafii)
Anda **WAJIB** memakai Docker untuk Database (PostgreSQL) dan Cache (Redis). 
- **Menyalakan HANYA DB & Redis:** `docker compose -f infra/compose/docker-compose.dev.yml up -d db redis`
- **Melihat Log DB/Redis:** `docker compose -f infra/compose/docker-compose.dev.yml logs --tail 50 -f db`
- **Mematikan Layanan:** `docker compose -f infra/compose/docker-compose.dev.yml down`
- *Catatan:* Gunakan `process.env.PORT || 3000` di `index.js`. Jika port bentrok saat hot-reload lokal, matikan sementara container service tersebut (contoh: `docker stop mojiji_user_dev`).

---

## 🗄️ 4. DBA (Ryan)
Anda **WAJIB** memakai Docker untuk PostgreSQL dan alat migrasi (`dbmate`).
- **Menyalakan Database:** `docker compose -f infra/compose/docker-compose.dev.yml up -d db`
- **Menjalankan Migrasi:** `docker compose -f infra/compose/docker-compose.dev.yml run --rm migrate up`
- **Melihat Status Migrasi:** `docker compose -f infra/compose/docker-compose.dev.yml run --rm migrate status`
- **Mematikan Layanan:** `docker compose -f infra/compose/docker-compose.dev.yml down`
- *Catatan:* Dilarang migrasi production dari laptop. Selalu gunakan container `migrate` untuk uji lokal.

---

## 🚀 6. DevOps (Aji - Admin)
- **Menyalakan & Build ulang semua:** `docker compose -f infra/compose/docker-compose.dev.yml up -d --build`
- **Mematikan Semua:** `docker compose -f infra/compose/docker-compose.dev.yml down`
- **Cek RAM/CPU:** `docker stats`
- *Catatan:* Dilarang menggunakan perintah `build` pada konfigurasi VPS (`docker-compose.server.yml`).
