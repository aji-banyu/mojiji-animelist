---
title: "Panduan Docker Dev Lokal & Konvensi Peran Tim (MJ-051)"
sidebar_position: 2
tags: [infrastruktur, devops, docker, docker-compose, local-dev, panduan-tim]
---

# Panduan Docker Dev Lokal & Konvensi Peran Tim (MJ-051)

Dokumen ini merupakan pedoman resmi pengoperasian Docker Compose di lingkungan lokal (*development*) bagi seluruh anggota tim pengembang **Mojiji AnimeList** sesuai tiket **MJ-051**.

---

## 1. Arsitektur Jaringan Docker Lokal

Pada lingkungan pengembangan lokal, seluruh layanan backend dan database diorkestrasikan menggunakan berkas `infra/compose/docker-compose.dev.yml`:

```mermaid
flowchart TD
    subgraph CLIENT ["Akses Pengembang"]
        Browser["Web Browser (http://localhost:3000)"]
        Postman["Postman API Client (http://localhost:4000)"]
    end

    subgraph DOCKER_DEV ["Docker Network: mojiji_dev_net"]
        Web["apps/web (Next.js Dev :3000)"]
        Gateway["api-gateway (:4000)"]
        UserSvc["user-service (:4001)"]
        CatalogSvc["catalog-service (:4002)"]
        TrackerSvc["tracker-service (:4003)"]
        DB[("PostgreSQL 16 (:5432)\nDatabase: mojiji_dev")]
        Redis[("Redis 7 (:6379)\nCache & Session")]
    end

    Browser --> Web
    Browser --> Gateway
    Postman --> Gateway
    Web -.-> Gateway
    Gateway --> UserSvc
    Gateway --> CatalogSvc
    Gateway --> TrackerSvc
    UserSvc --> DB
    CatalogSvc --> DB
    TrackerSvc --> DB
    Gateway --> Redis
    CatalogSvc --> Redis
    TrackerSvc --> Redis
```

---

## 2. Aturan Emas Konfigurasi: Flag `--env-file .env`

> [!IMPORTANT]
> **ATURAN WAJIB DOCKER COMPOSE TIM MOJIJI:**  
> Berkas konfigurasi Docker dev berada di subfolder `infra/compose/docker-compose.dev.yml`, sedangkan berkas `.env` berada di **root repositori**. Jika Anda menjalankan perintah tanpa flag `--env-file .env`, Docker akan mencari file `.env` di dalam folder `compose/` dan terminal Anda akan dipenuhi puluhan baris *warning* variabel kosong.
>
> **Sintaks Baku Eksekusi:**
> ```bash
> docker compose --env-file .env -f infra/compose/docker-compose.dev.yml <perintah>
> ```

---

## 3. Catatan Kritis: Hostname Database & Redis di `.env`

Nilai variabel `DATABASE_URL` dan `REDIS_URL` pada file `.env` lokal Anda harus disesuaikan dengan metode kerja Anda:

| Metode Kerja Pengembang | Hostname Database | Hostname Redis | Kapan Digunakan |
| :--- | :--- | :--- | :--- |
| **A. Full Docker (DevOps / Testing)** | `postgres://postgres:postgres@db:5432/mojiji_dev` | `redis://redis:6379` | Saat seluruh service Node.js dijalankan di dalam container Docker. |
| **B. Hybrid / Native Node (Backend Dev)** | `postgres://postgres:postgres@localhost:5432/mojiji_dev` | `redis://localhost:6379` | Saat container hanya menyalakan DB & Redis, sedangkan Express/Next.js dijalankan via `npm run dev` di laptop. |

---

## 4. Panduan Eksekusi Sesuai Peran Anggota Tim

### 🎨 A. UI/UX Designer (Ichsan) & 🕵️‍♀️ QA Tester (Nadia)
* **Kebutuhan Docker:** **TIDAK PERLU** menginstal atau menjalankan Docker di laptop.
* **Fokus Kerja:**
  * **UI/UX:** Merancang antarmuka di Figma dan meninjau konsistensi komponen visual.
  * **QA Tester:** Melakukan pengujian fungsional langsung pada URL Staging (`https://staging.mojiji.web.id`) dan menjalankan koleksi Postman API ke endpoint staging.

---

### 💻 B. Frontend Developer (Andika)
Frontend developer dapat memanfaatkan URL API Staging (`https://staging.mojiji.web.id`) sehingga tidak wajib menyalakan backend lokal. Namun jika membutuhkan backend lokal penuh:
* **Menyalakan Semua Layanan Lokal:**
  ```bash
  docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d
  ```
* **Mematikan Semua Layanan:**
  ```bash
  docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down
  ```
* **Menjalankan Web Frontend:** Masuk ke folder `apps/web`, lalu jalankan `npm run dev` (`http://localhost:3000`).

---

### ⚙️ C. Backend Developer (Syafii)
Backend developer wajib menggunakan Docker untuk database PostgreSQL dan Redis agar tidak perlu menginstal database service di Windows/macOS:
* **Menyalakan HANYA Database & Redis:**
  ```bash
  docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d db redis
  ```
* **Melihat Log Database:**
  ```bash
  docker compose --env-file .env -f infra/compose/docker-compose.dev.yml logs --tail 50 -f db
  ```
* **Jalankan Service via Terminal:** Jalankan `npm run dev` pada masing-masing folder microservices yang sedang dikembangkan untuk mendapatkan fitur *hot-reload*.

---

### 🗄️ D. Database Administrator / DBA (Ryan)
DBA menggunakan container `db` dan container alat migrasi `dbmate`:
* **Menyalakan Database:**
  ```bash
  docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d db
  ```
* **Menjalankan Migrasi Lokal:**
  ```bash
  docker compose --env-file .env -f infra/compose/docker-compose.dev.yml run --rm migrate up
  ```
* **Memeriksa Status Migrasi:**
  ```bash
  docker compose --env-file .env -f infra/compose/docker-compose.dev.yml run --rm migrate status
  ```

---

### 🚀 E. DevOps Engineer & Admin (Aji)
* **Menyalakan & Rebuild Seluruh Service Lokal:**
  ```bash
  docker compose --env-file .env -f infra/compose/docker-compose.dev.yml up -d --build
  ```
* **Memantau Konsumsi Resource Kontainer:**
  ```bash
  docker stats
  ```

---

## 5. Manajemen Siklus Hidup Kontainer (Shutdown & Cleaning)

```mermaid
flowchart LR
    A["Selesai Bekerja"] --> B{"Pilihan Pembersihan"}
    B -->|Jeda Cepat| C["docker compose stop\n(Data & Container Tetap Ada)"]
    B -->|Selesai Shift Harian| D["docker compose down\n(Container Hapus, Data DB Aman di Volume)"]
    B -->|Reset Total / Corrupt| E["docker compose down -v\n(PERINGATAN: Seluruh Data DB Lenyap)"]
```

### ⏸️ A. Jeda Sementara (*Stop*)
Hanya menghentikan eksekusi kontainer tanpa menghapus alokasi jaringan dan kontainer. Boot selanjutnya berlangsung instan:
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml stop
```

### 🛑 B. Matikan Standar (*Down*) — Paling Direkomendasikan
Menghapus kontainer dan jaringan bridge, **tetapi volume database tetap aman tersimpan**. Gunakan ini setelah selesai sesi bekerja untuk mengembalikan RAM laptop:
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down
```

### ☢️ C. Reset Total / Cuci Gudang (*Down with Volumes*)
> [!CAUTION]
> Perintah ini akan menghapus kontainer, jaringan, dan **SELURUH DATA POSTGRESQL DI DALAM VOLUME LOKAL SECARA PERMANEN**. Hanya gunakan perintah ini jika skema database lokal rusak fatal (*corrupt*):
```bash
docker compose --env-file .env -f infra/compose/docker-compose.dev.yml down -v
```

### 🧹 D. Pembersihan Storage Disk Laptop (*Prune*)
Membersihkan sisa cache build dan kontainer tak terpakai untuk membebaskan ruang disk:
```bash
docker system prune -f
```

---
*Dokumen ini disusun oleh Aji (DevOps Engineer) sebagai pemenuhan Acceptance Criteria tiket **MJ-051** (Minggu 5).*
