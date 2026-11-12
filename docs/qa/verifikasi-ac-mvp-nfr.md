---
title: "Matriks Verifikasi Acceptance Criteria & NFR MVP"
sidebar_position: 3
tags: [qa, acceptance-criteria, nfr, quality-gate, verification]
---

# Matriks Verifikasi Acceptance Criteria (AC) dan NFR MVP

> **Status Dokumen:** **LULUS / QA SIGN-OFF (SIAP RELEASE TO PRODUCTION)**  
> **Environment:** MOJIJI Staging (`https://staging.mojiji.web.id`)  
> **Referensi:** Mini PRD Revisi 4 (v1.4) Bab 14 & 19; Skenario MVP (`docs/qa/skenario-mvp.md`); Laporan Regresi (`docs/qa/arsip-tiket/regression-m8.md`); Hasil Postman (`docs/qa/hasil-postman-mvp.md`)  
> **Tanggal:** 7 November 2026  

---

## 1. Ringkasan Eksekutif

Dokumen ini memverifikasi secara formal pemenuhan seluruh **Acceptance Criteria (AC)** untuk 7 User Story inti MVP serta standar **Non-Functional Requirements (NFR)** pada lingkungan MOJIJI Staging. 

Verifikasi ini merupakan gerbang kualitas (*Quality Gate*) wajib sebelum DevOps (Aji) mengeksekusi Pull Request release dari `develop` ke `main` (MJ-107) untuk peluncuran produk langsung (*Live Production*).

| Cakupan | Total Item | Lulus (PASS) | Gagal (FAIL) | Keterangan |
|---|:---:|:---:|:---:|---|
| **User Story MVP (AC Fungsional)** | 7 Story (16 Skenario) | **16** | 0 | 100% Memenuhi AC PRD |
| **Non-Functional Requirements (NFR)** | 5 Aspek Kunci | **5** | 0 | Memenuhi NFR PRD |
| **Rekomendasi QA** | — | — | — | **Lanjut ke PR Release `main` (MJ-107)** |

---

## 2. Tabel Verifikasi Acceptance Criteria (7 User Story MVP)

### 2.1 US-007 — Registrasi Akun Pengguna

| ID Skenario | Kriteria Keberterimaan (AC) | Hasil Pengujian Aktual | Bukti Uji (Test Evidence) | Status |
|---|---|---|---|:---:|
| **TC-001** | Pengunjung mendaftar dengan email unik, username, password $\ge$ 8 karakter $\rightarrow$ akun dibuat & redirect ke login/beranda. | HTTP 201 Created; form tersubmit lancar; akun tersimpan di DB Supabase; redirect sukses. | `regression-m8.md` Step 1; Postman `TC-R01-Register Valid` | **LULUS** |
| **TC-002** | Pendaftaran ditolak jika email sudah terdaftar $\rightarrow$ pesan error jelas. | HTTP 409 Conflict; pesan `"Email sudah terdaftar"`. | Postman `TC-R02-Register Duplicate` | **LULUS** |
| **TC-002b** | Pendaftaran ditolak jika password $< 8$ karakter $\rightarrow$ validasi format error. | HTTP 400 Bad Request; Zod validation error: `"Password minimal 8 karakter"`. | Postman `TC-R03 Register Short Password` | **LULUS** |

---

### 2.2 US-002 — Login dan Logout Pengguna

| ID Skenario | Kriteria Keberterimaan (AC) | Hasil Pengujian Aktual | Bukti Uji (Test Evidence) | Status |
|---|---|---|---|:---:|
| **TC-003** | Pengguna memasukkan email & password benar $\rightarrow$ login sukses, cookie sesi terpasang, UI navbar berubah aktif. | HTTP 200 OK; cookie `mojiji_session` (httpOnly, Secure, SameSite=Lax) terpasang; navbar menampilkan profil `qaregm8`. | `regression-m8.md` Step 2; Postman `TC-L01-Login Valid` | **LULUS** |
| **TC-004** | Login dengan password salah ditolak $\rightarrow$ tidak dapat sesi. | HTTP 401 Unauthorized; pesan `"Email atau kata sandi salah"`. | Postman `TC-L02 Login Password Salah` | **LULUS** |
| **TC-004b** | Logout mengakhiri sesi $\rightarrow$ cookie dihapus dan redirect ke mode publik. | HTTP 200 OK; cookie sesi dibersihkan; navbar kembali ke kondisi tamu ("Masuk/Daftar"). | `regression-m8.md` Step 8; Postman `TC-L03 Logout` | **LULUS** |

---

### 2.3 US-001 — Pencarian Anime dan Manga di Katalog

| ID Skenario | Kriteria Keberterimaan (AC) | Hasil Pengujian Aktual | Bukti Uji (Test Evidence) | Status |
|---|---|---|---|:---:|
| **TC-005** | Pencarian kata kunci dengan jeda mengetik (debounce) $\rightarrow$ menampilkan daftar judul anime & manga yang relevan. | Debounce aktif; pencarian "Naruto" mengembalikan judul anime & manga relevan lengkap dengan poster, skor, dan tipe. | `regression-m8.md` Step 3; `hasil-catalog.md` TC-005a/b | **LULUS** |
| **TC-006** | Kata kunci tanpa hasil $\rightarrow$ menampilkan state kosong yang ramah tanpa error sistem. | HTTP 200 OK; data array kosong `[]`; UI menampilkan state ramah "Tidak ada anime/manga yang cocok". | `hasil-catalog.md` TC-006; Postman `TC-006` | **LULUS** |
| **TC-007** | Ketahanan saat provider upstream (Tenrai) lambat/down $\rightarrow$ aplikasi tidak crash & fallback aktif. | HTTP 200 / 502 terkendali; sistem menangani timeout upstream dengan format pesan seragam. | `hasil-catalog.md` TC-007; Postman `TC-007` | **LULUS** |

---

### 2.4 US-008 — Halaman Detail Anime dan Manga

| ID Skenario | Kriteria Keberterimaan (AC) | Hasil Pengujian Aktual | Bukti Uji (Test Evidence) | Status |
|---|---|---|---|:---:|
| **TC-008** | Menampilkan informasi lengkap judul: judul, poster, skor, sinopsis, episode/chapter, dan tombol tracker. | Data lengkap tampil rapi; layout desktop & mobile responsif; tombol aksi tracker tersedia. | `regression-m8.md` Step 4; `hasil-catalog.md` TC-008a/b | **LULUS** |
| **TC-009** | Detail ID tidak ditemukan $\rightarrow$ pesan ramah 404 NOT_FOUND. | HTTP 404 NOT_FOUND; pesan `"Data anime/manga tidak ditemukan"`. | `hasil-catalog.md` TC-009; Postman `TC-009` | **LULUS** |
| **TC-010** | Detail ID invalid (misal 0 atau angka negatif) ditolak $\rightarrow$ HTTP 400. | HTTP 400 Bad Request; validasi parameter ID positif bekerja. | `hasil-catalog.md` TC-010; Postman `TC-010` | **LULUS** |

---

### 2.5 US-003 — Pengelolaan Status Tontonan/Bacaan di Tracker

| ID Skenario | Kriteria Keberterimaan (AC) | Hasil Pengujian Aktual | Bukti Uji (Test Evidence) | Status |
|---|---|---|---|:---:|
| **TC-011** | Tambah & ubah status tracker (Watching, Completed, Plan, dsb.) $\rightarrow$ tersimpan persisten di akun pengguna. | HTTP 201 (tambah) & HTTP 200 (patch status); item tersimpan di Supabase; status terupdate di UI. | `regression-m8.md` Step 5; Postman `TC-011a/b` | **LULUS** |
| **TC-012** | Pengunjung belum login mencoba tambah/ubah tracker $\rightarrow$ ditolak dan diarahkan ke login. | HTTP 401 Unauthorized; browser mengalihkan user secara otomatis ke halaman `/login`. | `regression-m8.md` Step 8; Postman `TC-012` | **LULUS** |

---

### 2.6 US-004 — Penambahan Progres (+1 Episode/Chapter)

| ID Skenario | Kriteria Keberterimaan (AC) | Hasil Pengujian Aktual | Bukti Uji (Test Evidence) | Status |
|---|---|---|---|:---:|
| **TC-013** | Tombol `+1` langsung menaikkan angka di layar (Optimistic UI) & tersimpan di backend. | Angka langsung bertambah seketika di layar; request `POST /api/tracker/:id/increment` sukses; angka persisten saat di-refresh. | `regression-m8.md` Step 6; Postman `TC-013` | **LULUS** |
| **TC-014** | Rollback saat backend offline/gagal $\rightarrow$ angka kembali ke semula dengan toast pesan ramah. | Logika catch error & rollback terverifikasi di komponen `TrackerList.js`; toast alert ditampilkan. | Komponen `TrackerList.js` baris 250-272; unit test | **LULUS** |
| **TC-014b** | Batasan episode maksimal $\rightarrow$ tombol +1 nonaktif saat progres mencapai total episode. | Tombol dinonaktifkan dan menampilkan notifikasi batas tercapai; tidak bisa overflow. | Komponen `TrackerList.js` baris 195-202 | **LULUS** |

---

### 2.7 US-009 — Dashboard Tracker dan Penyaringan Status

| ID Skenario | Kriteria Keberterimaan (AC) | Hasil Pengujian Aktual | Bukti Uji (Test Evidence) | Status |
|---|---|---|---|:---:|
| **TC-015** | Dashboard menampilkan daftar judul milik pengguna dengan filter status akurat. | Halaman `/tracker` menampilkan daftar pribadi; filter status (Watching, Completed, All) berfungsi presisi. | `regression-m8.md` Step 7; Postman `TC-015` | **LULUS** |
| **TC-016** | Akses tracker milik orang lain ditolak $\rightarrow$ data pengguna lain tidak bocor. | HTTP 404 Not Found / Ditolak; database menggunakan query terisolasi `WHERE user_id = $1`. | Postman `TC-016`; kode Tracker Service | **LULUS** |

---

## 3. Verifikasi Standar Non-Functional Requirements (NFR)

| Aspek NFR | Standar PRD (Bab 19) | Hasil Evaluasi di Staging | Bukti Pengujian | Status |
|---|---|---|---|:---:|
| **Performa Cache Redis** | Waktu respons pencarian & detail saat **Cache HIT** $< 300$ ms. | Terverifikasi: Detail Anime 20 = **266 ms**, Detail Manga 11 = **72 ms** ($< 300$ ms). Header `X-Cache: HIT`. | `hasil-postman-mvp.md` Bab 5; Hasil Postman Staging | **MEMENUHI** |
| **Keamanan Password** | Password wajib di-hash menggunakan algoritma aman; hash tidak boleh bocor ke API. | Menggunakan **bcrypt** dengan salt rounds aman di DB; field `password_hash` di-exclude dari semua response JSON API. | Migrasi database `users`; API Contract `GET /api/users/me` | **MEMENUHI** |
| **Keamanan Sesi & Transport** | Sesi berbasis Cookie `httpOnly`, aman dari XSS, dan jalur transport HTTPS. | Seluruh request staging melalui **HTTPS** (Caddy); Cookie `mojiji_session` menggunakan flag `HttpOnly`, `Secure`, dan `SameSite=Lax`. | Caddyfile staging; Header `Set-Cookie` di browser | **MEMENUHI** |
| **Validasi & Format Error** | Format respon error seragam; validasi input di gateway & service. | Schema Zod memvalidasi seluruh request; respons seragam: `{ success: false, error: { code, message, details } }`. | `docs/api/api-contract-mvp.md`; Postman negative test | **MEMENUHI** |
| **Responsivitas Perangkat** | Tampilan antarmuka beradaptasi dengan baik pada Desktop dan Mobile (HP). | Seluruh alur (Search, Detail, Dashboard, Filter, Form Auth) rapi di layar 375px–390px tanpa horizontal scroll overflow. | `docs/qa/regression-m8.md` pengujian Desktop & Mobile | **MEMENUHI** |

---

## 4. Kesimpulan & Handoff Resmi ke DevOps

1. **Status Kualitas:** Seluruh 16 skenario dari 7 User Story MVP telah **LULUS (100% PASS)** dan seluruh 5 pilar NFR **MEMENUHI** standar PRD Revisi 4.
2. **Kesiapan Rilis:** Lingkungan Staging dinyatakan stabil, aman, dan siap untuk dipromosikan ke lingkungan Produksi.
3. **Pernyataan Handoff QA ke DevOps:**
   > **Kepada:** Aji (DevOps)  
   > **Dari:** Nadia (QA)  
   > **Perihal:** QA Sign-Off MVP Sprint 1 (Tiket MJ-103 Selesai)  
   > **Pesan:** *Seluruh Acceptance Criteria (AC) dan NFR MVP telah diverifikasi dan dinyatakan LULUS. Dengan ini, branch `develop` disetujui untuk di-merge ke branch `main` via PR Release MJ-107 untuk live deployment MVP di VPS Production.*

