---
title: "Panduan Deployment, Operasional Server & Batasan Free Hosting"
sidebar_position: 5
tags: [infrastruktur, devops, deployment, rollback, logs, free-hosting, staging, production]
---

# Panduan Deployment, Operasional Server & Batasan Free Hosting (MJ-090)

Dokumen ini merupakan panduan operasional resmi bagi seluruh anggota tim pengembang **Mojiji AnimeList** (DevOps, Backend, DBA, Frontend, QA). Panduan ini memuat tata letak arsitektur server VPS, alur otomatisasi deployment, prosedur darurat (*rollback*), tata cara penelusuran log, serta inventarisasi batasan layanan hosting gratis (*free-tier*) beserta langkah mitigasinya.

---

## 1. Arsitektur Peladen (Server VPS) & Tata Letak Direktori

Peladen VPS Mojiji menggunakan sistem operasi **Ubuntu 22.04 LTS (x86_64)** dengan spesifikasi **2 vCPU Cores, 2 GB RAM fisik, dan 2 GB Swap**. Seluruh beban kerja aplikasi dijalankan di dalam kontainer Docker yang diisolasi per lingkungan (*staging* dan *production*).

### A. Kebijakan Keamanan Port Jaringan (Firewall UFW)
* **Port Publik Terbuka:** Hanya port **22** (SSH), **80** (HTTP), dan **443** (HTTPS).
* **Port Internal (Tertutup dari Internet):** Port microservices (`4000`, `4001`, `4002`, `4003`) **DILARANG KERAS** dipublikasikan ke internet (*no host binding*). Seluruh trafik luar wajib melewati **Caddy Reverse Proxy** melalui Docker network bridge internal (`mojiji_internal`).

### B. Struktur Direktori Server di Host VPS (`/opt/mojiji`)

```text
/opt/mojiji/
├── staging/                           # Lingkungan Staging (staging.mojiji.web.id)
│   ├── .env                           # Konfigurasi secret staging (chmod 600)
│   ├── docker-compose.server.yml      # Orkestrasi container staging
│   └── .last_good_tag                 # Catatan tag image stabil terakhir untuk rollback
│
├── production/                        # Lingkungan Production (mojiji.web.id)
│   ├── .env                           # Konfigurasi secret production (chmod 600)
│   ├── docker-compose.server.yml      # Orkestrasi container production
│   └── .last_good_tag                 # Catatan tag image rilis stabil terakhir
│
├── backups/                           # Repositori Backup Otomatis Database
│   ├── mojiji_prod_backup_YYYYMMDD_HHMMSS.sql
│   └── (Folder di luar repo git dengan hak akses ketat root/deploy)
│
└── caddy/
    ├── Caddyfile                      # Konfigurasi reverse proxy & SSL otomatis
    └── volumes/
        └── caddy_data/                # Volume persistent sertifikat SSL Let's Encrypt
                                       # (PERINGATAN: Dilarang menghapus volume ini!)
```

---

## 2. Alur Deployment Otomatis (CI/CD GitHub Actions)

Sesuai aturan baku PRD dan standar rekayasa tim:
> ⚠️ **PANTANGAN UTAMA:** Dilarang keras melakukan proses build image Docker (`docker build`) atau kompilasi frontend (`npm run build`) langsung di dalam VPS. Semua proses kompilasi dilakukan pada runner GitHub Actions.

### A. Deployment Lingkungan Staging (`staging.mojiji.web.id`)
1. **Pemicu (Trigger):** Setiap kali Pull Request di-merge ke branch **`develop`**.
2. **Tahapan di GitHub Actions (`deploy-staging.yml`):**
   * Linting dan verifikasi build seluruh paket monorepo.
   * Pembuatan Docker Image backend dengan tag commit (`staging-<short-sha>`).
   * Ekspor frontend Next.js statis (`output: "export"`).
   * Pengiriman berkas rilis ke server VPS melalui jalur aman SSH.
3. **Eksekusi di Peladen VPS (oleh Runner Pipeline):**
   * Migrasi skema database dijalankan otomatis terlebih dahulu:
     ```bash
     docker compose --env-file .env -f infra/compose/docker-compose.server.yml run --rm -e DATABASE_URL="$STAGING_DATABASE_URL" migrate --migrations-dir /db/migrations up
     ```
   * Jika migrasi berhasil, container aplikasi diperbarui:
     ```bash
     docker compose -p mojiji-staging --env-file /opt/mojiji/staging/.env -f /opt/mojiji/staging/docker-compose.server.yml up -d --remove-orphans
     ```
   * Penukaran file web statis di folder `/srv/staging`.
   * Verifikasi kesehatan layanan (*healthcheck*) `/api/health`.

### B. Deployment Lingkungan Production (`mojiji.web.id`)
1. **Pemicu (Trigger):** Setelah seluruh Acceptance Criteria diverifikasi oleh QA (Nadia) di Staging, dibuat Pull Request resmi dari `develop` ke **`main`**. Merge ke `main` memicu `deploy-production.yml`.
2. **Prosedur Pengamanan Tambahan Production:**
   * **Backup Otomatis Wajib (`pg_dump`):** Sebelum migrasi dieksekusi, pipeline secara otomatis melakukan dump database production ke `/opt/mojiji/backups/`. Jika backup gagal atau ukuran file kosong (0 byte), deploy langsung dibatalkan demi keamanan data.
   * Eksekusi migrasi database `migrate up` pada database production.
   * Container aplikasi beralih ke tag rilis baru secara bertahap (*zero-downtime*).

---

## 3. Panduan Pemantauan & Pengecekan Log (Perintah Harian DevOps)

Seluruh anggota tim yang memiliki akses ke server dapat memeriksa status sistem menggunakan perintah-perintah standar berikut:

### A. Melihat Status Container
```bash
# Cek apakah container berjalan normal atau crash (restarting)
docker compose -p mojiji-staging ps
```

### B. Memeriksa Log Aplikasi (Troubleshooting Error)
Gunakan opsi `--tail 100` dan `-f` (*follow*) untuk memantau log secara real-time tanpa membebani terminal:
```bash
# Log API Gateway
docker compose -p mojiji-staging logs --tail 100 -f gateway

# Log User Service
docker compose -p mojiji-staging logs --tail 100 -f user-service

# Log Catalog Service
docker compose -p mojiji-staging logs --tail 100 -f catalog-service

# Log Tracker Service
docker compose -p mojiji-staging logs --tail 100 -f tracker-service

# Log Reverse Proxy Caddy
docker compose -p mojiji-staging logs --tail 100 -f caddy
```

### C. Memeriksa Konsumsi Memori & Kesehatan Server
```bash
# Cek statistik penggunaan RAM dan CPU per container
docker stats --no-stream

# Cek ketersediaan memori fisik & swap server host
free -m

# Cek sisa ruang penyimpanan disk VPS
df -h
```

### D. Merestart Container yang Mengalami Kendala
Jika salah satu service mengalami *deadlock* atau *unresponsive*:
```bash
docker compose -p mojiji-staging restart <nama_service>
```

---

## 4. Prosedur Tanggap Darurat: Rollback Versi Aplikasi

Jika rilis terbaru menimbulkan bug kritis di lingkungan Staging maupun Production:

### A. Prosedur Rollback Aplikasi & Web Statis
1. Salin tag rilis stabil sebelumnya dari berkas `.last_good_tag`:
   ```bash
   PREV_TAG=$(cat /opt/mojiji/staging/.last_good_tag)
   ```
2. Jalankan deployment ulang menggunakan tag stabil tersebut:
   ```bash
   APP_TAG=$PREV_TAG docker compose -p mojiji-staging --env-file /opt/mojiji/staging/.env -f /opt/mojiji/staging/docker-compose.server.yml up -d
   ```
3. Kembalikan folder web statis ke versi build dari tag lama.
4. Verifikasi endpoint `/api/health` kembali merespons status `200 OK`.

### B. ⚠️ Filosofi Penanganan Database: Tidak Ada Rollback Skema Otomatis
* **Aturan Emas:** Skrip deployment **DILARANG** menjalankan perintah `dbmate down` secara otomatis saat terjadi kegagalan aplikasi.
* **Alasan:** Menjalankan rollback skema otomatis (`DROP COLUMN` atau `DROP TABLE`) dapat melenyapkan data pengguna yang baru saja masuk secara permanen.
* **Standar Rekayasa Tim:** Seluruh migrasi DDL wajib bersifat *backward-compatible* (menambahkan kolom baru bersifat `NULLABLE` atau dengan `DEFAULT`). Jika terjadi kesalahan rancangan skema, solusinya adalah membuat tiket perbaikan cepat (*hotfix*) dengan file migrasi baru (*forward-fix migration*).

---

## 5. Batasan Layanan Hosting Gratis (Free-Tier Limits) & Mitigasi

Aplikasi Mojiji mengandalkan arsitektur *Zero-Cost Infrastructure* dengan memanfaatkan kuota gratis dari penyedia layanan cloud. Berikut adalah batasan kritis yang wajib dipahami oleh seluruh tim:

| Penyedia Layanan | Komponen / Peran | Batasan Paket Gratis (*Free Tier Limit*) | Dampak Risiko | Tindakan Pencegahan / Mitigasi Tim |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | Database PostgreSQL (Multi-Schema) | • Maksimal **2 projects** aktif per organisasi.<br>• Kuota penyimpanan DB: **500 MB**.<br>• **Auto-Pause (Hibernasi)** jika tidak ada akses selama **1 minggu** (7 hari).<br>• Tidak ada fitur Automated Backup harian gratis. | • Jika hibernasi saat jadwal demo dosen, aplikasi akan melempar *Network Error*.<br>• Kehilangan data jika skema rusak tanpa backup. | 1. **Pemanasan Pra-Demo:** DevOps wajib membuka aplikasi 1 hari sebelum presentasi untuk memastikan status Supabase *Active*.<br>2. **Automated pg_dump:** DevOps menyetel pencadangan mandiri ke `/opt/mojiji/backups` di VPS sebelum setiap migrasi rilis.<br>3. **Koneksi Hemat:** Pool koneksi diatur `max: 3` per service agar tidak kehabisan kuota direct connection. |
| **Upstash** | Cache & Session Store (Redis Serverless) | • Kuota permintaan: **500.000 commands / bulan** (~10.000 - 15.000 commands / hari).<br>• Kapasitas memori: **256 MB**.<br>• Maksimal transfer data: 100 MB / request. | Jika kuota bulanan habis, Redis akan menolak perintah *SET/GET* (error `ERR max daily request limit exceeded`). | 1. **Cache TTL Eksplisit:** Setiap *key* cache wajib memiliki TTL (misal: anime detail 24 jam, search result 1 jam).<br>2. **Graceful Fallback di Backend:** Jika Redis error/overlimit, Backend wajib menangkap error (*try-catch*) dan langsung mengambil data dari PostgreSQL/API pihak ketiga tanpa membuat server *crash*.<br>3. Gunakan Redis hanya untuk data yang sering diakses berulang. |
| **Peladen VPS** | Ubuntu Server (Host Docker & Caddy) | • RAM Fisik: **2 GB (2.048 MB)**.<br>• vCPU: **2 Cores**.<br>• Swap: **2 GB aktif** (`vm.swappiness=10`).<br>• Batas aman PRD: Konsumsi RAM tidak boleh melebihi **75% (1.536 MB)**. | Risiko *Out-Of-Memory (OOM)* jika container Node.js mengalami kebocoran memori (*memory leak*). | 1. **Hard Limit Docker:** Plafon `mem_limit: 96m` di setiap backend service.<br>2. **Node Heap Capping:** Flag `NODE_OPTIONS: "--max-old-space-size=64"` pada container.<br>3. **Caddy Limit:** Plafon memori Caddy dibatasi `mem_limit: 64m`.<br>4. Berdasarkan pengukuran live MJ-089, total konsumsi kontainer hanya **~92 MB**, sehingga Mode Staging aman beroperasi **Always-On**. |

---

## 6. Tindak Lanjut Kolaborasi Tim (Handoff ke Backend & DBA)

Untuk menjaga kesinambungan antar-peran, rekan tim pengembang dimohon meninjau poin-poin berikut:
1. **Untuk Tim Backend (Dika & Syafii):**
   * Pastikan setiap pemanggilan Redis dibungkus blok *try-catch* agar kegagalan cache tidak mematikan service.
   * Pastikan konfigurasi *database pool* di backend klien (misal: pg / Prisma / Kysely) dibatasi maksimal 3 koneksi per instans.
2. **Untuk Tim DBA (Ryan):**
   * Seluruh berkas migrasi SQL baru di `database/migrations/` wajib memakai nama skema eksplisit (*fully qualified name*) seperti `tracker_service.trackers` dan dilarang menyertakan perintah `SET search_path`.
   * Skema baru harus kompatibel dengan versi aplikasi sebelumnya (*zero downtime compatibility*).
3. **Untuk Tim QA (Nadia):**
   * Verifikasi pengujian Staging dapat dilakukan kapan saja di `https://staging.mojiji.web.id` tanpa perlu meminta DevOps menyalakan server secara manual.

---
*Dokumen ini disusun oleh Aji (DevOps Engineer) sebagai pemenuhan Acceptance Criteria tiket **MJ-090** (Minggu 7 - Sprint 1).*

