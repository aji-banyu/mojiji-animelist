---
title: "Pengukuran RAM & Kebijakan Alokasi Memori (MJ-089)"
sidebar_position: 4
tags: [infrastruktur, devops, memory, ram, vps, staging]
---

# Laporan Pengukuran RAM & Kebijakan Alokasi Memori

Dokumen ini mencatat hasil pengukuran penggunaan memori (RAM & Swap), penetapan batas konsumsi resource (*resource limit*) per container, serta penentuan resmi mode lingkungan Staging untuk proyek **Mojiji AnimeList** sesuai tiket **MJ-089**.

---

## 1. Spesifikasi Server VPS

Berdasarkan provisioning aktual peladen VPS Ubuntu:
* **vCPU Cores:** 2 Cores
* **Total RAM Fisik:** 2.048 MB (2 GB)
* **Virtual Memory (Swap):** 2.048 MB (2 GB) aktif dengan `vm.swappiness=10`
* **Sistem Operasi:** Ubuntu 22.04 / 24.04 LTS (x86_64)

---

## 2. Anggaran & Hasil Pengukuran Memori (Memory Budget)

Pengukuran dilakukan pada peladen VPS saat lingkungan berjalan dengan 4 microservices backend, reverse proxy Caddy, dan file statis frontend:

| Komponen / Service | Batas Memori (`mem_limit`) | Heap Limit Node.js | Penggunaan Rata-rata (Idle) | Penggunaan Beban Kerja Normal |
| :--- | :---: | :---: | :---: | :---: |
| **Sistem Operasi (OS) + Docker + SSH** | - | - | ~280 MB | ~340 MB |
| **Caddy Web Server (Reverse Proxy)** | 64 MB | - | ~25 MB | ~35 MB |
| **API Gateway (Staging)** | 96 MB | 64 MB | ~45 MB | ~55 MB |
| **User Service (Staging)** | 96 MB | 64 MB | ~50 MB | ~60 MB |
| **Catalog Service (Staging)** | 96 MB | 64 MB | ~50 MB | ~60 MB |
| **Tracker Service (Staging)** | 96 MB | 64 MB | ~50 MB | ~60 MB |
| **Subtotal Staging (4 Services)** | **384 MB** | - | **~195 MB** | **~235 MB** |
| **Subtotal Production (4 Services)** | **384 MB** | - | **~195 MB** | **~235 MB** |
| **TOTAL KESELURUHAN (Staging + Prod + Edge + OS)** | **~832 MB** | - | **~695 MB** | **~845 MB** |

---

## 3. Analisis Beban terhadap Batas Keamanan PRD

* **Kapasitas RAM Fisik VPS:** 2.048 MB
* **Batas Keamanan PRD (Maksimal 75%):**  
  $$75\% \times 2.048\text{ MB} = 1.536\text{ MB}$$
* **Proyeksi Penggunaan Nyata (Staging + Production Aktif):** $\approx 845\text{ MB}$ ($\approx 41,2\%$)
* **Sisa Ruang Bebas (*Headroom*):** $\approx 1.203\text{ MB}$ ($\approx 58,8\%$)

---

## 4. Keputusan Mode Staging (Acceptance Criteria Tiket MJ-089)

Sesuai aturan keputusan pada PRD dan panduan server tim:
> *"Bila RAM terpakai lebih dari 75% saat dua lingkungan menyala, staging diubah menjadi mode on-demand. Bila di bawah 75%, staging diperbolehkan mode Always-On."*

### 🟢 KEPUTUSAN RESMI: **MODE A (ALWAYS-ON)**
1. **Status:** Lingkungan **Staging dan Production dapat menyala bersamaan secara permanen (*Always-On*)**.
2. **Justifikasi:** Penggunaan memori total hanya mencapai $\approx 41,2\%$, jauh di bawah batas peringatan 75% (1.536 MB). 
3. **Keuntungan:** Tim QA (Nadia) dan Developer (Dika, Syafii) dapat menguji fitur di URL Staging kapan saja tanpa perlu menyalakan atau mematikan container secara manual.

*(Catatan: Mode B / On-Demand tetap disiapkan skripnya pada tiket MJ-091 sebagai prosedur darurat jika di masa mendatang terjadi lonjakan beban trafik tak terduga).*

---

## 5. Kebijakan Proteksi Memori & Anti-Crash (Pencegahan OOM)

Untuk memastikan tidak ada container yang mati mendadak akibat *Out Of Memory (OOM Killer)*:
1. **Hard Limit Docker (`mem_limit: 96m`):** Setiap microservice backend di `docker-compose.server.yml` dibatasi maksimal 96 MB RAM.
2. **Node.js Heap Management (`NODE_OPTIONS: "--max-old-space-size=64"`):** Memaksa *V8 garbage collector* membersihkan memori sebelum konsumsi heap melewati 64 MB.
3. **Caddy Reverse Proxy Limit (`mem_limit: 64m`):** Menjaga proses web server tetap hemat dan terkendali.
4. **Sabuk Pengaman Swap 2 GB:** Partisi swap aktif sebagai penyangga lonjakan proses sesaat.
5. **Database Connection Pooling:** Pool koneksi PostgreSQL pada setiap service dibatasi maksimal 3 koneksi (`max: 3`) untuk mencegah kebocoran memori dari sisi koneksi database.
6. **Rotasi Log Docker:** Mencegah log file membengkak dan memenuhi disk (`max-size: 10m`, `max-file: 3`).

---

## 6. Perintah Pemantauan Harian DevOps

Untuk memantau kondisi memori aktual di VPS:
```bash
# 1. Cek ringkasan RAM dan Swap fisik
free -m

# 2. Cek konsumsi memori per container secara real-time
docker stats --no-stream
```

