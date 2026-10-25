# 🐳 Panduan Penggunaan Docker Tim MOJIJI

Semua konfigurasi lokal menggunakan file: `infra/compose/docker-compose.dev.yml`
File ini mengambil rahasia (secret) dari file `.env` di root proyek.

---

### 💡 ATURAN WAJIB: Flag `--env-file .env`
Saat Anda menjalankan perintah `docker compose` dengan flag `-f infra/compose/...`, Docker otomatis akan mencari file konfigurasi `.env` **di dalam folder `compose` tersebut**, bukan di root proyek. 
Jika Docker tidak menemukan `.env` di sana, terminal Anda akan dipenuhi oleh peringatan: `WARN[0000] The "PORT_USER" variable is not set.`

**Solusi Mutlak:**
Pastikan file `.env` berada di **root proyek**, dan **selalu tambahkan flag `--env-file .env`** tepat setelah `docker compose`. Ini memaksa Docker menarik variabel dari root folder.

### 📝 Catatan Penting Mengenai Redis
Di lingkungan Production/Staging, kita menggunakan **Upstash Redis** (Serverless). Namun, untuk lokal (Development), kita **wajib** menggunakan Redis dari Docker. 
*   **Alasan:** Menghemat kuota Upstash bulanan, tidak butuh internet saat coding, dan latensi lokal (0ms).
*   **Cara kerja:** Pastikan file `.env` di laptop Anda menunjuk ke localhost: `REDIS_URL=redis://localhost:6379`.

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
- *Catatan:* Fokus pada `npm run dev` di folder `apps/web`. Biarkan port backend diurus Docker.

---

## ⚙️ 3. Backend (Syafii)
Anda **WAJIB** memakai Docker untuk Database (PostgreSQL) dan Cache (Redis). 
- **Menyalakan HANYA DB & Redis:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d db redis`
- **Melihat Log DB/Redis:** `docker compose --env-file .env -f infra/compose/docker-compose.dev.yml logs --tail 50 -f db`
- *Catatan:* Gunakan `process.env.PORT || 3000` di `index.js`. Jika port bentrok saat hot-reload lokal, matikan sementara container service tersebut (contoh: `docker stop mojiji_user_dev`).

---

## 🗄️ 4. DBA (Ryan)
Anda **WAJIB** memakai Docker untuk PostgreSQL dan alat migrasi (`dbmate`/`migrate`).
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

Mengetahui cara mematikan Docker dengan benar sangat penting agar Anda tidak kehilangan data *testing* atau menghabiskan kapasitas *storage* laptop. Pilih perintah yang sesuai dengan kebutuhan Anda:

### ⏸️ A. Jeda Sementara (Stop)
Gunakan ini jika Anda ingin mematikan layanan sementara (misalnya saat laptop akan dimatikan atau *restart*) tetapi ingin proses *start* berikutnya berjalan jauh lebih cepat. Perintah ini **hanya menghentikan proses**, tanpa menghapus *container* atau *network* sama sekali.
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml stop
```

### 🛑 B. Matikan Standar (Down) - *Paling Sering Digunakan*
Perintah ini akan menghapus *container* dan *network* dari sistem Docker Anda, tetapi **mempertahankan data database (Volume)**. Gunakan ini saat Anda selesai bekerja pada hari itu untuk membebaskan RAM laptop sepenuhnya. Saat dijalankan lagi keesokan harinya, data pengguna dan anime di PostgreSQL lokal Anda akan tetap utuh.
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down
```

### ☢️ C. Reset Total / Cuci Gudang (Down with Volumes)
**PERINGATAN BAHAYA!** Perintah ini akan menghapus *container*, *network*, beserta **seluruh data di dalam PostgreSQL dan Redis Anda tanpa tersisa**. Gunakan HANYA jika *database* Anda mengalami *corrupt*, struktur tabel hancur akibat salah migrasi, atau Anda memang sengaja ingin mereset aplikasi ke kondisi benar-benar kosong dari nol.
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down -v
```

### 🧹 D. Pembersihan Storage Laptop (Prune)
Jika laptop Anda tiba-tiba kehabisan ruang penyimpanan (SSD/HDD penuh) karena terlalu sering melakukan `build`, jalankan perintah pembersihan massal ini. Docker akan menghapus semua sisa-sisa *image*, *container* mati, dan *cache build* usang yang sudah tidak lagi terpakai oleh sistem.
```bash
docker system prune -a --volumes
```
