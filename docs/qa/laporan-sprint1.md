# Laporan Pengujian Sprint 1 dan Status Bug Terbuka (Milestone UTS MVP)

> **Tiket:** MJ-105 | **Minggu:** 8 (Sprint 1 MVP) | **Role:** QA (Nadia)  
> **Environment:** MOJIJI Staging (`https://staging.mojiji.web.id`) & Production (`https://mojiji.web.id`)  
> **Periode:** Minggu 3 s/d Minggu 8  
> **Referensi:** Mini PRD Revisi 4 (v1.4), Skenario MVP (`docs/qa/skenario-mvp.md`), Laporan Regresi (`docs/qa/regression-m8.md`), Bukti Postman (`docs/qa/bukti-postman/`), Verifikasi AC (`docs/qa/verifikasi-ac-mvp-nfr.md`)  
> **Status:** **FINAL / QA SIGN-OFF SPRINT 1**  
> **Tanggal:** 10 November 2026  

---

## 1. Ringkasan Eksekutif Sprint 1

Sprint 1 berfokus pada pembangunan fondasi produk dan penyelesaian seluruh alur inti **Minimum Viable Product (MVP)** MOJIJI:
1. Autentikasi Pengguna (Register, Login dengan Cookie HttpOnly, Logout)
2. Katalog Anime & Manga (Pencarian dengan Debounce, Cache Redis Upstash, Detail Judul)
3. Tracker Pribadi (Tambah Judul, Ubah Status, Progres $+1$ dengan Optimistic UI, Dashboard Filter, Isolasi Data)

Berdasarkan seluruh rangkaian pengujian dari level API, integrasi, regresi penuh E2E, hingga verifikasi kriteria keberterimaan (AC & NFR), **Sprint 1 dinyatakan sukses 100% memenuhi target kriteria peluncuran MVP untuk evaluasi UTS**.

| Metrik Kualitas | Target PRD | Hasil Aktual Sprint 1 | Status |
|---|:---:|:---:|:---:|
| **User Story MVP Selesai** | 7 User Story | **7 User Story (100%)** | **TERPENUHI** |
| **Skenario AC Fungsional** | 16 Skenario | **16 Lulus (100% PASS)** | **TERPENUHI** |
| **Eksekusi Postman Core API** | Staging & Production | **12/12 PASS (Staging & Prod)** | **TERPENUHI** |
| **Alur Inti E2E (Desktop & HP)** | Alur 8 Tahap Tanpa Error | **8/8 PASS di Desktop & Mobile** | **TERPENUHI** |
| **Latensi Cache Hit (NFR)** | $< 300$ ms | **68 ms – 266 ms** | **TERPENUHI** |
| **Bug Blocker / High Terbuka** | 0 Bug | **0 Bug Terbuka (Clean)** | **TERPENUHI** |

---

## 2. Rekapitulasi Pengujian per Tiket QA (Minggu 3 – Minggu 8)

| Minggu | Tiket ID | Nama Pengujian / Aktivitas | Artefak Dokumen | Hasil Akhir |
|:---:|:---:|---|---|:---:|
| **M3** | MJ-013 & 014 | Setup QA, Template Test Case, Review AC PRD | `docs/qa/test-case-template.md` | Selesai |
| **M4** | MJ-030 & 032 | Penyusunan Skenario Tes 7 US MVP & Rencana Env | `docs/qa/skenario-mvp.md`, `rencana-environment.md` | Selesai |
| **M5** | MJ-048 & 050 | Test Case Rinci Auth & Smoke Test Skeleton | `docs/qa/test-case-auth.md`, `smoke-skeleton.md` | Selesai |
| **M6** | MJ-068 & 069 | Pengujian Fungsional Auth & Catalog Staging | `docs/qa/hasil-auth.md`, `hasil-catalog.md` | Selesai |
| **M6** | MJ-070 | Setup Monitoring Bug & Prosedur Retest | `docs/qa/monitoring-bug.md` | Selesai |
| **M7** | MJ-085 & 086 | Pengujian Tracker, Regression Awal, & Cache Redis | `docs/qa/hasil-tracker.md`, `hasil-regression.md` | Selesai |
| **M7** | MJ-087 | Pengujian Postman Core API Staging Awal | `docs/qa/hasil-postman-mvp.md` | Selesai |
| **M8** | MJ-102 | Regression Penuh Alur Inti MVP (Desktop & HP) | `docs/qa/regression-m8.md` | **8/8 PASS** |
| **M8** | MJ-103 | Verifikasi Formal Seluruh AC MVP dan NFR | `docs/qa/verifikasi-ac-mvp-nfr.md` | **16/16 PASS** |
| **M8** | MJ-104 | Bukti Uji Postman Core API di Staging & Production | `docs/qa/bukti-postman/` | **12/12 PASS** |
| **M8** | MJ-105 | Laporan Komprehensif Sprint 1 & Analisis Risiko | `docs/qa/laporan-sprint1.md` | **FINAL** |

---

## 3. Status Bug dan Siklus Perbaikan (Defect Lifecycle)

Seluruh bug yang ditemukan selama Sprint 1 telah melalui siklus pelaporan, perbaikan oleh role terkait, dan verifikasi ulang (*retest*) oleh QA:

| Bug ID | Deskripsi Masalah | Severity | Role PIC | Solusi / PR Perbaikan | Status Akhir |
|:---:|---|:---:|:---:|---|:---:|
| **BUG-001** | `user-service` offline / crash mengembalikan HTTP 502 Bad Gateway saat login/register di VPS Staging. | High (Blocker) | DevOps (Aji) & Backend (Syafii) | Perbaikan Docker network `compose_default` dan alokasi memori container (PR #256). | **CLOSED / RESOLVED** |
| **BUG-002** | `GET /api/catalog/anime/999999999` melempar HTTP 500 alih-alih HTTP 404 NOT_FOUND. | Medium | Backend (Syafii) | Penambahan penanganan respon null/404 dari provider Tenrai di `catalogController.js` (PR #198). | **CLOSED / RESOLVED** |
| **BUG-003** | Tampilan navbar berantakan di mobile dan static build turbopack gagal karena impor font. | Low | Frontend (Dika) | Penyesuaian layout CSS responsif dan perbaikan konfigurasi font static (PR #258 & #259). | **CLOSED / RESOLVED** |
| **BUG-004** | Nilai `baseUrl` kosong di konfigurasi environment Postman staging & production. | Low | QA (Nadia) | Pengisian URL resmi staging dan production di file environment (PR #240 & MJ-104). | **CLOSED / RESOLVED** |

> **Status Bug Terbuka Saat Ini:** **0 BUG TERBUKA (NOL DEFECT)**. Tidak ada bug tertunda yang dibawa ke peluncuran MVP UTS.

---

## 4. Analisis Risiko Menuju Sprint 2 (Risk Assessment)

Berdasarkan hasil pengujian Sprint 1, berikut adalah potensi risiko teknis yang harus diantisipasi oleh tim saat memasuki Sprint 2 (Minggu 9 s/d Minggu 14):

| No | Kategori Risiko | Deskripsi Risiko | Dampak | Rekomendasi Mitigasi untuk Sprint 2 |
|:--:|---|---|:---:|---|
| 1 | **Kapasitas RAM VPS (1 GB)** | Penambahan 2 service baru di Sprint 2 (Interaction Service & Notification Service) dapat membebani memori VPS yang terbatas. | Sedang | DevOps wajib menerapkan `mem_limit` ketat pada container baru dan mengaktifkan fitur staging on-demand jika RAM $> 75\%$. |
| 2 | **Stabilitas Upstream Tenrai API** | Ketergantungan pada API publik pihak ketiga untuk data katalog berpotensi terkena rate limit jika trafik demo meningkat. | Sedang | Backend wajib memaksimalkan pemanfaatan Redis Cache (Upstash) dan memastikan fallback graceful error tetap aktif. |
| 3 | **Migrasi Skema Database Bertahap** | Sprint 2 menambahkan skema interaksi (`comments`) dan notifikasi (`reminders`). Migrasi otomatis tidak boleh merusak tabel pengguna & tracker. | Tinggi | DBA (Ryan) wajib menguji migrasi lokal dan staging secara teliti, serta memastikan `pg_dump` otomatis berjalan sebelum migrasi production. |
| 4 | **Izin Web Push Notification** | Fitur Reminder (US-006) membutuhkan izin browser pengguna dan dukungan HTTPS service worker yang ketat di berbagai browser. | Rendah | Frontend & QA perlu menyusun skenario uji izin notifikasi yang ramah pengguna sejak awal Sprint 2 (Minggu 9). |

---

## 5. Kesimpulan dan Rekomendasi QA

1. **Kelayakan Rilis MVP (UTS):** MOJIJI versi MVP dinyatakan **SANGAT LAYAK (PRODUCTION READY)** untuk dirilis dan dipresentasikan pada evaluasi UTS Minggu 8.
2. **Kesiapan Sprint 2:** Seluruh dokumentasi, test case, dan baseline API siap menjadi acuan regresi untuk pengembangan fitur interaksi sosial (Komentar, Profil, Toggle Tema) dan Reminder di Sprint 2.
3. **Apresiasi Tim:** Kolaborasi antara Frontend, Backend, DBA, DevOps, dan QA berjalan solid dalam menyelesaikan seluruh blocker tepat waktu.

