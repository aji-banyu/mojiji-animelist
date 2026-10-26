# 🐳 Panduan Penggunaan Docker Tim MOJIJI

Semua konfigurasi lokal menggunakan file: `infra/compose/docker-compose.dev.yml`
File ini mengambil rahasia (secret) dari file `.env` di root proyek.

---

### 💡 ATURAN WAJIB: Flag `--env-file .env`
Saat Anda menjalankan perintah `docker compose` dengan flag `-f infra/compose/...`, Docker otomatis akan mencari file konfigurasi `.env` **di dalam folder `compose` tersebut**, bukan di root proyek.
Jika Docker tidak menemukan `.env` di sana, terminal Anda akan dipenuhi peringatan error.

**Solusi Mutlak:**
Pastikan file `.env` berada di **root proyek**, dan **selalu tambahkan flag `--env-file .env`** tepat setelah `docker compose`. Ini memaksa Docker menarik variabel dari root folder.

### 📝 Catatan Kritis: Hostname Database & Redis di `.env`
Nilai `DATABASE_URL` dan `REDIS_URL` di lokal bergantung pada cara Anda menjalankan layanan Node.js:
1. **Full Docker (Aji/DevOps):** Jika Anda menjalankan backend di dalam Docker Compose, gunakan nama internal container:
   `DATABASE_URL=postgres://postgres:postgres@db:5432/mojiji?sslmode=disable`
   `REDIS_URL=redis://redis:6379`
2. **Native Localhost (Syafii/Backend):** Jika Anda menyalakan container HANYA untuk DB & Redis, lalu menjalankan backend secara native lewat `npm run dev` di laptop, Anda **wajib** mengubahnya menjadi:
   `DATABASE_URL=postgres://postgres:postgres@localhost:5432/mojiji?sslmode=disable`
   `REDIS_URL=redis://localhost:6379`

---

## 🎨 1. UI/UX (Ican) & 🕵️‍♀️ 5. QA (Nadia)
Anda **TIDAK PERLU** menginstal atau menjalankan Docker.
- Kerjakan desain di Figma (UI/UX).
- Uji URL Staging di browser dan Postman (QA).

---

## 💻 2. Frontend (Dika)
Anda tidak diwajibkan menggunakan Docker jika URL API Staging/Mock sudah ada. Jika butuh lingkungan lokal secara penuh:
- **Menyalakan Semua:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d`
- **Mematikan Semua:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down`
- *Catatan:* Fokus pada `npm run dev` di folder `apps/web`. Biarkan port backend diurus Docker. Pastikan `.env` menggunakan host `db` dan `redis`.

---

## ⚙️ 3. Backend (Syafii)
Anda **WAJIB** memakai Docker untuk Database (PostgreSQL) dan Cache (Redis).
- **Menyalakan HANYA DB & Redis:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d db redis`
- **Melihat Log DB/Redis:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml logs --tail 50 -f db`
- *Catatan:* Jika port bentrok saat hot-reload lokal, matikan sementara container service tersebut. Pastikan host di `.env` adalah `localhost` jika Anda memakai `npm run dev` di terminal laptop.

---

## 🗄️ 4. DBA (Ryan)
Anda **WAJIB** memakai Docker untuk PostgreSQL dan alat migrasi (`dbmate`).
- **Menyalakan Database:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d db`
- **Menjalankan Migrasi:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml run --rm migrate up`
- **Melihat Status Migrasi:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml run --rm migrate status`
- *Catatan:* Dilarang migrasi production dari laptop. Selalu gunakan container `migrate` untuk uji lokal.

---

## 🚀 6. DevOps (Aji - Admin)
- **Menyalakan & Build ulang semua:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d --build`
- **Cek RAM/CPU:** `docker stats`
- *Catatan:* Dilarang menggunakan perintah `build` pada konfigurasi VPS (`docker-compose.server.yml`).

---

## 🧹 Manajemen Siklus Hidup (Mematikan & Membersihkan)

### ⏸️ A. Jeda Sementara (Stop)
Hanya menghentikan proses sementara agar boot selanjutnya lebih cepat.
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml stop
```

### 🛑 B. Matikan Standar (Down) - *Paling Sering Digunakan*
Menghapus container & network, tetapi **mempertahankan data database (Volume)**. Gunakan saat selesai bekerja untuk membebaskan RAM.
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down
```

### ☢️ C. Reset Total / Cuci Gudang (Down with Volumes)
**PERINGATAN BAHAYA!** Menghapus container, network, dan **seluruh data database tanpa tersisa**. Gunakan HANYA jika database corrupt.
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down -v
```

### 🧹 D. Pembersihan Storage Laptop (Prune)
Membersihkan semua sisa image, container mati, dan cache build usang.
```bash
docker system prune -a --volumes
```
