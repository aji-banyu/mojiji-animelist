---
title: "Skenario Pengujian Sprint 2 (Komentar, Profil, Dark/Light Mode)"
sidebar_position: 6
tags: [qa, test-plan, sprint-2, komentar, profil, tema, acceptance-criteria]
---

# Skenario Pengujian Sprint 2 MOJIJI

> **Status:** Draft untuk Review Frontend & Backend (Menunggu Masukan di Tiket MJ-124)  
> **Dasar:** Mini PRD MOJIJI Revisi 4, Bab 13 & 14 (User Stories & Acceptance Criteria Sprint 2).  
> **Tiket:** MJ-123 | **Dependency:** MJ-112 | **Lokasi:** `docs/qa/skenario-sprint2.md`.  
> **Tanggal Penyusunan:** 26 November 2026 | **PIC:** QA (Nadia)  

---

## 1. Tujuan dan Ruang Lingkup

Dokumen ini menerjemahkan Kriteria Keberterimaan (*Acceptance Criteria / AC*) untuk fitur-fitur **Sprint 2 (Minggu 9 s/d Minggu 14)** menjadi skenario pengujian langkah demi langkah:
1. **US-005 — Fitur Komentar:** Menulis dan melihat komentar pada halaman detail anime/manga.
2. **US-010 — Halaman Profil:** Menampilkan informasi akun dan statistik ringkasan tracker pengguna.
3. **US-011 — Dark/Light Mode:** Toggle tema terang dan gelap dengan persistensi preferensi.

> [!NOTE]
> Skenario ini mencakup kasus positif (*happy path*), kasus batas (*boundary conditions*), validasi negatif, serta pengujian keamanan dasar pada antarmuka web dan API.

---

## 2. Ringkasan Matriks Skenario Sprint 2

| ID Test Case | User Story | Kategori | Skenario Pengujian | Tipe Tes |
|:--:|---|:---:|---|:---:|
| **TC-S2-01** | US-005 Komentar | Positive | Menulis komentar valid (1–500 karakter) pada halaman detail | Manual UI |
| **TC-S2-02** | US-005 Komentar | Positive | Kirim komentar via API endpoint `POST /api/interactions/comments` | Postman |
| **TC-S2-03** | US-005 Komentar | Negative | Pengunjung belum login mencoba menulis komentar | Manual UI |
| **TC-S2-04** | US-005 Komentar | Negative | Akses endpoint komentar tanpa cookie sesi otentikasi | Postman |
| **TC-S2-05** | US-005 Komentar | Negative | Validasi komentar kosong atau hanya berisi spasi | Manual UI & API |
| **TC-S2-06** | US-005 Komentar | Negative | Batasan panjang komentar melebihi 500 karakter (501 karakter) | Manual UI & API |
| **TC-S2-07** | US-010 Profil | Positive | Membuka halaman profil dengan sesi aktif (Info akun & statistik) | Manual UI |
| **TC-S2-08** | US-010 Profil | Negative | Akses langsung halaman profil `/profile` tanpa login | Manual UI |
| **TC-S2-09** | US-010 Profil | Security | Memastikan `password_hash` tidak terekspos di payload profil | Postman / DevTools |
| **TC-S2-10** | US-011 Dark/Light | Positive | Menukar tema antara Terang dan Gelap via tombol toggle navbar | Manual UI |
| **TC-S2-11** | US-011 Dark/Light | Positive | Persistensi tema di `localStorage` setelah halaman di-refresh | Manual UI |
| **TC-S2-12** | US-011 Dark/Light | Positive | Deteksi otomatis tema awal mengikuti preferensi sistem (OS/Browser) | Manual UI |

---

## 3. Rincian Skenario Pengujian Langkah Demi Langkah

### A. US-005 — Fitur Komentar di Halaman Detail

#### TC-S2-01 — Menulis Komentar Valid pada Halaman Detail (Manual UI)
* **User Story:** US-005 (Komentar — Positive).
* **Prasyarat:** Pengguna telah login dengan akun aktif dan berada di halaman detail anime/manga (misal: `/anime/20`).
* **Langkah Pengujian:**
  1. Gulir ke bawah menuju bagian **Komentar Komunitas**.
  2. Ketik opini valid pada textarea komentar (contoh: *"Anime klasik terbaik sepanjang masa!"*).
  3. Klik tombol **Kirim Komentar**.
* **Hasil yang Diharapkan:**
  - Komentar langsung muncul di daftar paling atas (atau sesuai urutan waktu terbaru).
  - Menampilkan nama pengguna, avatar, teks komentar, dan label waktu relatif (contoh: *"Baru saja"*).
  - Textarea input otomatis dikosongkan setelah pengiriman berhasil.

#### TC-S2-02 — Kirim Komentar via API Endpoint (Postman)
* **User Story:** US-005 (API Integration — Positive).
* **Method & URL:** `POST {{baseUrl}}/api/interactions/comments`
* **Headers:** `Content-Type: application/json`, Cookie sesi `mojiji_session` aktif.
* **Request Body:**
  ```json
  {
    "mediaType": "anime",
    "malId": 20,
    "content": "Pengujian otomatis komentar via Postman Sprint 2."
  }
  ```
* **Hasil yang Diharapkan:** HTTP 201 Created, `success: true`, mengembalikan objek komentar berisi `id`, `userId`, `content`, dan `createdAt`.

#### TC-S2-03 — Pengunjung Belum Login Mencoba Menulis Komentar (Manual UI)
* **User Story:** US-005 (Komentar — Negative).
* **Prasyarat:** Pengunjung dalam kondisi belum login (*guest / anonymous*).
* **Langkah Pengujian:**
  1. Buka halaman detail anime/manga apapun sebagai tamu.
  2. Periksa bagian formulir komentar.
* **Hasil yang Diharapkan:**
  - Kotak textarea dinonaktifkan (*disabled*) atau digantikan dengan banner ramah: *"Silakan masuk terlebih dahulu untuk ikut berkomentar."*
  - Terdapat tombol tautan cepat yang mengarahkan pengunjung ke halaman `/login`.

#### TC-S2-04 — Akses Endpoint Komentar Tanpa Sesi (Postman)
* **User Story:** US-005 (Security API — Negative).
* **Method & URL:** `POST {{baseUrl}}/api/interactions/comments` (Tanpa Cookie Sesi).
* **Hasil yang Diharapkan:** HTTP 401 Unauthorized, format error terstandarisasi:
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali."
    }
  }
  ```

#### TC-S2-05 — Validasi Komentar Kosong atau Hanya Spasi (Manual UI & API)
* **User Story:** US-005 (Validasi Input — Negative).
* **Langkah Pengujian:**
  1. Pengguna login mengosongkan textarea atau hanya mengetik spasi (`"   "`).
  2. Coba klik tombol Kirim.
* **Hasil yang Diharapkan:**
  - Pada UI: Tombol kirim tetap tidak aktif (*disabled*).
  - Pada API: Jika dikirim payload kosong, mengembalikan HTTP 400 Bad Request (`VALIDATION_ERROR: "Komentar tidak boleh kosong"`).

#### TC-S2-06 — Batasan Komentar Melebihi 500 Karakter (Manual UI & API)
* **User Story:** US-005 (Batas Input — Negative).
* **Langkah Pengujian:**
  1. Masukkan teks komentar sebanyak **501 karakter** ke dalam textarea.
  2. Perhatikan indikator counter karakter di bawah textarea.
* **Hasil yang Diharapkan:**
  - Counter karakter berubah warna merah (*501/500*) dan input dibatasi maksimal 500 karakter.
  - API menolak request jika melebihi batas dengan HTTP 400 Bad Request (`"Komentar maksimal 500 karakter"`).

---

### B. US-010 — Halaman Profil Pengguna

#### TC-S2-07 — Akses Halaman Profil dengan Sesi Aktif (Manual UI)
* **User Story:** US-010 (Profil — Positive).
* **Prasyarat:** Pengguna telah login dan memiliki beberapa judul di tracker.
* **Langkah Pengujian:**
  1. Klik menu avatar / profil di navbar, lalu pilih **Halaman Profil** (`/profile`).
  2. Amati data yang ditampilkan pada kartu profil.
* **Hasil yang Diharapkan:**
  - Menampilkan Username, Email terdaftar, dan Tanggal Bergabung (*Member since*).
  - Menampilkan ringkasan metrik statistik tracker: Total Judul, Sedang Ditonton (*Watching*), Sedang Dibaca (*Reading*), dan Selesai (*Completed*).
  - Tampilan rapi, kartu informasi konsisten dengan tema yang aktif.

#### TC-S2-08 — Akses Halaman Profil Tanpa Login (Manual UI)
* **User Story:** US-010 (Proteksi Rute — Negative).
* **Prasyarat:** Pengguna belum login (*guest*).
* **Langkah Pengujian:**
  1. Buka browser baru (mode penyamaran / Incognito).
  2. Ketik langsung URL `https://staging.mojiji.web.id/profile`.
* **Hasil yang Diharapkan:**
  - Halaman otomatis memblokir akses dan mengalihkan (*redirect*) pengunjung ke halaman `/login`.
  - Tidak ada data pribadi atau ringkasan profil yang bocor sekejap pun.

#### TC-S2-09 — Proteksi Password Hash pada Data Profil (Security Audit)
* **User Story:** US-010 (Keamanan Data — Negative).
* **Pengujian:** Periksa payload respons jaringan pada tab DevTools Network atau Postman saat memanggil `GET /api/users/me` atau endpoint profil.
* **Hasil yang Diharapkan:** Objek JSON **TIDAK MEMUAT** field `password_hash`, `salt`, atau informasi kriptografi sensitif lainnya.

---

### C. US-011 — Toggle Tema Terang/Gelap (Dark/Light Mode)

#### TC-S2-10 — Menukar Tema Terang dan Gelap (Manual UI)
* **User Story:** US-011 (Toggle Tema — Positive).
* **Langkah Pengujian:**
  1. Buka situs MOJIJI di halaman manapun (Beranda, Detail, Tracker).
  2. Klik tombol ikon **Toggle Tema (Matahari / Bulan)** di navbar.
* **Hasil yang Diharapkan:**
  - Tema berganti secara instan (0 ms) antara tema Gelap (*Dark*) dan Terang (*Light*).
  - Seluruh komponen UI (latar belakang, warna teks, border kartu, input form, navbar) beradaptasi seragam tanpa ada teks yang menjadi tidak terbaca (kontras warna memenuhi WCAG).

#### TC-S2-11 — Persistensi Preferensi Tema Setelah Refresh (Manual UI)
* **User Story:** US-011 (Persistensi — Positive).
* **Langkah Pengujian:**
  1. Ubah tema ke mode **Terang (Light Mode)**.
  2. Lakukan penyegaran halaman secara penuh (*Hard Refresh* / `Cmd+Shift+R` atau `Ctrl+F5`).
  3. Buka tab baru di browser dan akses kembali URL MOJIJI.
* **Hasil yang Diharapkan:**
  - Tema tetap berada pada mode **Terang**, tidak kembali (*reset*) ke tema gelap default.
  - Nilai tersimpan di `localStorage` browser pada key tema (misal `mojiji-theme: "light"`).

#### TC-S2-12 — Deteksi Otomatis Preferensi Sistem OS (Manual UI)
* **User Story:** US-011 (System Default — Positive).
* **Langkah Pengujian:**
  1. Hapus nilai `localStorage` di DevTools Application.
  2. Ubah preferensi tema sistem operasi komputer/HP (misal ubah OS ke Dark Mode).
  3. Muat ulang halaman web.
* **Hasil yang Diharapkan:** Aplikasi web otomatis mendeteksi dan menyesuaikan tema awal mengikuti pengaturan OS.

---

## 4. Tindak Lanjut & Handoff

Dokumen skenario ini diserahkan kepada tim pengembang untuk ditinjau:
- **Frontend (Dika):** Memastikan penamaan rute komponen (`/profile`, komponen komentar detail, tombol toggle tema) sesuai dengan arsitektur UI.
- **Backend (Syafii):** Memastikan payload kontrak API `interaction-service` kompatibel dengan kebutuhan pengujian komentar.
- **Review Tiket MJ-124:** Tiket berikutnya adalah review formal AC Sprint 2 bersama Frontend dan Backend.

