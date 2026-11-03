---
title: "Inventaris Batasan Free Hosting & Mitigasi Risiko"
sidebar_position: 6
tags: [infrastruktur, devops, free-hosting, supabase, upstash, vps, quota]
---

# Inventaris Batasan Layanan Free Hosting (MJ-090 & MJ-164)

Dokumen ini mencatat batasan teknis (*quotas & limitations*) dari seluruh penyedia infrastruktur *free-tier* yang digunakan oleh proyek **Mojiji AnimeList**, serta prosedur mitigasi risiko agar layanan tetap beroperasi tanpa henti (*zero-downtime*).

---

## 1. Rangkuman Spesifikasi & Batasan Layanan

| Penyedia | Komponen | Kuota / Batasan Paket Gratis | Risiko Kegagalan | Tindakan Pencegahan / Prosedur Mitigasi |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | PostgreSQL Database (Multi-Schema) | • Maksimal **2 project aktif** per akun.<br>• Kuota penyimpanan database: **500 MB**.<br>• **Auto-Pause (Inaktivitas):** Proyek akan di-*pause* otomatis jika tidak ada kueri selama **7 hari** (1 minggu).<br>• Tidak ada automated point-in-time backup harian gratis. | • Jika proyek ter-*pause*, seluruh backend melempar error koneksi database saat demo.<br>• Risiko kehilangan data jika terjadi kegagalan skema fatal. | 1. **Pemanasan Pra-Demo:** DevOps memeriksa status project Supabase H-1 sebelum presentasi/demo dan melakukan *query test* jika status *paused*.<br>2. **Automated pg_dump:** DevOps menyetel skrip backup lokal di VPS sebelum setiap migrasi rilis production ke `/opt/mojiji/backups`.<br>3. **Connection Pool Management:** Batasi `max: 3` koneksi per backend service. |
| **Upstash** | Redis Cache & Session Store | • Kuota permintaan: **500.000 commands / bulan** (~10.000 - 16.000 commands / hari).<br>• Penyimpanan data memori: **256 MB**.<br>• Batas payload transfer: 100 MB per request. | Perintah `SET` atau `GET` akan ditolak jika kuota harian/bulanan terlampaui. | 1. **Cache TTL Eksplisit:** Wajib memasang masa berlaku (*TTL*) pada seluruh key Redis.<br>2. **Graceful Fallback:** Backend wajib mengimplementasikan *fallback* langsung ke PostgreSQL jika Redis melempar error `quota exceeded`.<br>3. Hindari *cache hammering* dengan strategi caching selektif. |
| **Peladen VPS** | Server Host (Ubuntu 22.04 LTS) | • RAM Fisik: **2 GB (2.048 MB)**.<br>• vCPU: **2 Cores**.<br>• Swap: **2 GB aktif**.<br>• Batas aman PRD: Konsumsi RAM host tidak boleh melampaui **75% (1.536 MB)**. | Risiko proses dihentikan oleh *Out-Of-Memory (OOM) Killer* jika terjadi lonjakan beban. | 1. **Hard Limit Docker:** Plafon `mem_limit: 96m` pada tiap service backend.<br>2. **Node.js Heap Capping:** Flag `NODE_OPTIONS="--max-old-space-size=64"`.<br>3. **Caddy Reverse Proxy Limit:** Plafon `mem_limit: 64m`.<br>4. Berdasarkan pengukuran live MJ-089, total konsumsi kontainer staging hanya **~92 MB**, sehingga Mode Staging beroperasi secara **Always-On**. |

---

## 2. Checklist Pemeriksaan Kuota Berkala (Maintenance)

Lakukan pemeriksaan kuota berkala dengan langkah berikut:
1. **Supabase:** Periksa dashboard `https://supabase.com/dashboard/project/<project-id>/settings/usage` untuk memastikan penggunaan database di bawah 500 MB.
2. **Upstash:** Periksa dashboard `https://console.upstash.com/` untuk memantau sisa kuota bulanan perintah (*commands*).
3. **VPS Server:** Jalankan perintah `df -h` (kapasitas disk) dan `free -m` (sisa RAM dan Swap).

---
*Dokumen ini merupakan bagian dari deliverables tiket **MJ-090** dan menjadi acuan pemantauan pada tiket **MJ-164**.*

