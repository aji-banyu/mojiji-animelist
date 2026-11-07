# Laporan Pengujian MJ-102 — Regression Penuh Alur Inti MVP (Minggu 8)

> **Tiket:** MJ-102 | **Minggu:** 8 | **Role:** QA (Nadia)  
> **Environment:** MOJIJI Staging (`https://staging.mojiji.web.id`)  
> **Tools:** Browser (Chrome Desktop & Mobile DevTools / HP), Postman  
> **Referensi:** Mini PRD Revisi 4, Skenario MVP (`docs/qa/skenario-mvp.md`), API Contract MVP (`docs/api/api-contract-mvp.md`)  
> **Status:** In Progress  
> **Tanggal Eksekusi:** 6 November 2026  

---

## 1. Informasi Sesi Pengujian

| Item | Keterangan |
|---|---|
| **Tester** | Nadia (QA) |
| **Environment** | Staging (`https://staging.mojiji.web.id`) |
| **Device / Viewport** | 1. Desktop (Chrome, lebar > 1024px)<br>2. Mobile / HP (Viewport 375px–390px) |
| **Lingkup Alur** | Register → Login → Cari → Detail → Tracker (status, +1) → Dashboard → Logout |
| **Prasyarat** | Tiket MJ-094, MJ-095, MJ-097 telah merged ke `develop` |

---

## 2. Matriks Pengujian Regression E2E (Alur Inti MVP)

| No | Tahap / Skenario | Langkah Pengujian | Hasil yang Diharapkan | Hasil Desktop | Hasil Mobile (HP) | Status |
|:--:|:---|:---|:---|:---:|:---:|:---:|
| 1 | **Register** | Buka `/register`, isi email baru, username, password valid | Akun berhasil dibuat, dialihkan ke Login atau langsung sesi aktif | HTTP 201 / Berhasil redirect ke login/beranda | Form responsif, submit lancar | **PASS** |
| 2 | **Login** | Buka `/login`, masukkan email & password akun yang baru dibuat | Login sukses, cookie sesi terpasang, redirect ke Dashboard/Beranda | Berhasil login, navbar update dengan username aktif, redirect sukses | Form login rapi, redirect sukses | **PASS** |
| 3 | **Cari (Search)** | Buka `/search`, ketik "Naruto" pada tab Anime & Manga | Hasil muncul setelah jeda mengetik (debounce), data relevan tampil | Debounce lancar, hasil Anime & Manga Naruto tampil lengkap | Grid kartu satu kolom rapi, tab responsif | **PASS** |
| 4 | **Detail** | Klik salah satu judul (misal Naruto ID 20) | Halaman detail memuat sinopsis, skor, status, poster dengan rapi | Metadata lengkap (poster, skor, sinopsis, episode), layout rapi | Konten tersusun vertikal, tidak ada overflow horizontal | **PASS** |
| 5 | **Tambah Tracker** | Di halaman detail, klik "Tambah ke Tracker", pilih status `Watching` | Item tersimpan di tracker, status berubah menjadi Watching | Berhasil ditambahkan dengan status Watching, toast/indikator sukses | Dialog/dropdown status mudah ditekan (*touch friendly*) | **PASS** |
| 6 | **Progres +1** | Klik tombol `+1` pada progres episode/chapter | Progres bertambah +1 (Optimistic UI), tidak rollback error | Angka bertambah instan, tidak rollback, persisten setelah refresh | Tombol +1 reaktif seketika di layar HP | **PASS** |
| 7 | **Dashboard Tracker** | Buka `/tracker` / Dashboard, cek daftar judul & coba filter status | Judul Naruto tampil, filter status berfungsi, data sinkron | Naruto tampil dengan badge status/full episode sesuai, filter All/Completed aktif | Statistik cepat & filter status rapi di layar kecil | **PASS** |
| 8 | **Logout** | Klik tombol Logout di navbar/menu akun | Sesi berakhir, cookie terhapus, redirect ke login/beranda publik | Logout sukses, cookie terhapus, akses langsung ke /tracker dialihkan ke /login | Menu mobile / tombol logout bekerja aman | **PASS** |

---

## 3. Catatan Temuan Bug & Observasi

| ID Bug | Halaman / Fitur | Tingkat (Severity) | Langkah Mengulang | Hasil Aktual | Hasil Diharapkan | Status |
|---|---|:---:|---|---|---|:---:|
| — | — | — | Tidak ada bug baru yang ditemukan selama alur regresi penuh MVP | Seluruh alur berfungsi sesuai kriteria | Alur inti MVP stabil dan aman | **CLEAN** |

---

## 4. Kesimpulan Akhir
*Status: **DONE / SIGN-OFF QA***. Seluruh 8 tahap alur inti MVP (Register → Login → Cari → Detail → Tambah Tracker → Progres +1 → Dashboard & Filter → Logout) telah diuji secara menyeluruh di environment **Staging**, baik pada perangkat **Desktop** maupun **Mobile (HP)** tanpa menemukan blocker atau error. Alur dinyatakan stabil dan siap untuk verifikasi AC MVP & NFR (MJ-103).

