---
title: "Product Requirement Document (PRD): MOJIJI"
sidebar_position: 1
tags: [prd, requirements, user-stories, acceptance-criteria, plan-vs-actual]
---

# Product Requirement Document (PRD): MOJIJI

Dokumen ini merupakan intisari spesifikasi kebutuhan produk yang diselaraskan 100% dengan **Mini PRD: MOJIJI (Web Tracking Anime & Manga) Revisi 4 (Versi 1.4, Minggu 3)**. Berkas dokumen induk lengkap dalam format OpenXML tersedia di [Mini_PRD_MOJIJI.docx](file:///s:/kuliah/mojiji-animelist/docs/prd/Mini_PRD_MOJIJI.docx).

---

## 1. Identitas Produk
* **Nama Aplikasi:** MOJIJI (Web Tracking Anime & Manga)
* **Mata Kuliah:** Pemrograman Web Framework (Semester 5, STMIK Bina Patria)
* **Dosen Pengampu:** Joni Rodito, S.Kom
* **Fungsi Utama:** Jurnal pelacak pribadi untuk memantau status dan progres episode tontonan anime serta chapter bacaan manga dengan 1–2 klik.

---

## 2. Matriks User Story (Berdasarkan PRD Bagian 13)

Format penulisan User Story: *Sebagai [user], saya ingin [kebutuhan], sehingga [manfaat].*

| ID | User Story | Kategori MoSCoW | Sprint Rilis | Status Ketercapaian |
| :--- | :--- | :---: | :---: | :---: |
| **US-001** | Sebagai pengguna, saya ingin mencari anime atau manga, sehingga saya dapat menemukan informasinya. | **Must Have** | Sprint 1 (UTS) | 🟢 **Selesai 100%** |
| **US-002** | Sebagai pengguna, saya ingin login dan logout, sehingga data tracker saya aman dan tersimpan di akun saya. | **Must Have** | Sprint 1 (UTS) | 🟢 **Selesai 100%** |
| **US-003** | Sebagai pengguna, saya ingin mengubah status (Plan, Watching/Reading, Completed, On Hold, Dropped), sehingga saya tahu progres saya. | **Must Have** | Sprint 1 (UTS) | 🟢 **Selesai 100%** |
| **US-004** | Sebagai pengguna, saya ingin menambah progres dengan tombol "+1", sehingga pencatatan lebih cepat. | **Must Have** | Sprint 1 (UTS) | 🟢 **Selesai 100%** |
| **US-005** | Sebagai pengguna, saya ingin menulis komentar, sehingga saya dapat membagikan opini saya. | Should Have | Sprint 2 | ⏳ Backlog Sprint 2 |
| **US-006** | Sebagai pengguna, saya ingin mengatur pengingat manual, sehingga saya tidak lupa jadwal menonton atau membaca. | Could Have | Sprint 2 | ⏳ Backlog Sprint 2 |
| **US-007** | Sebagai pengunjung, saya ingin mendaftar akun, sehingga saya dapat memakai fitur tracker. | **Must Have** | Sprint 1 (UTS) | 🟢 **Selesai 100%** |
| **US-008** | Sebagai pengguna, saya ingin melihat detail anime/manga, sehingga saya tahu sinopsis, skor, dan jumlah episode/chapter. | **Must Have** | Sprint 1 (UTS) | 🟢 **Selesai 100%** |
| **US-009** | Sebagai pengguna, saya ingin melihat daftar tracker saya, sehingga saya dapat memantau semua progres di satu tempat. | **Must Have** | Sprint 1 (UTS) | 🟢 **Selesai 100%** |
| **US-010** | Sebagai pengguna, saya ingin melihat profil saya, sehingga saya tahu informasi akun saya. | Should Have | Sprint 2 | ⏳ Backlog Sprint 2 |
| **US-011** | Sebagai pengguna, saya ingin mengganti tema terang atau gelap, sehingga tampilan nyaman di mata. | Should Have | Sprint 2 | ⏳ Backlog Sprint 2 |

---

## 3. Acceptance Criteria MVP (Berdasarkan PRD Bagian 14)

### US-007: Register
* **Positive:** Given pengunjung belum punya akun; When mengisi username, email, dan password (minimal 8 karakter) dengan benar; Then akun dibuat dan pengguna diarahkan ke halaman login.
* **Negative:** Given email sudah terdaftar; When pengunjung mendaftar dengan email itu; Then sistem menolak dan menampilkan pesan error.

### US-002: Login & Logout
* **Positive:** Given user memiliki akun; When user memasukkan email dan password yang benar; Then user berhasil masuk ke dashboard (sesi tersimpan via Cookie HttpOnly).
* **Negative:** Given password yang dimasukkan salah; When user mencoba login; Then sistem menolak login dan menampilkan pesan error.

### US-001: Pencarian (Catalog Search)
* **Positive:** Given pengguna berada di halaman pencarian; When mengetik judul (misal: "Naruto") dan memilih tipe; Then daftar hasil dari Tenrai API tampil cepat via Redis cache (< 300 ms).
* **Negative:** Given kata kunci tidak ada hasilnya atau Tenrai tidak bisa dihubungi; When pengguna mencari; Then tampil pesan yang jelas ("Tidak ada hasil") dan aplikasi tidak error.

### US-008: Detail Anime/Manga
* **Positive:** Given pengguna memilih satu hasil pencarian; When halaman detail dibuka; Then tampil judul, gambar, sinopsis, skor, dan jumlah episode/chapter.
* **Negative:** Given judul tidak ditemukan; When membuka detail; Then tampil pesan ramah, bukan layar kosong.

### US-003: Ubah Status Tracker
* **Positive:** Given user sudah login; When user memilih status pada sebuah judul (Watching, Plan, Completed, Dropped); Then status tersimpan di Supabase dan muncul di tracker sesuai statusnya.
* **Negative:** Given user belum login; When user mencoba mengubah status; Then user diarahkan ke halaman login.

### US-004: Tambah Progres (+1)
* **Positive:** Given status Watching dan episode saat ini 4; When user menekan tombol "+1"; Then angka langsung menjadi 5 dan tersimpan secara instan.
* **Negative:** Given penyimpanan gagal; When user menekan "+1"; Then angka kembali ke semula dan muncul pesan error ramah.

### US-009: Dashboard / Daftar Tracker
* **Positive:** Given user login dan memiliki data tracker; When user membuka halaman tracker; Then daftar tracker miliknya tampil dan dapat disaring per status.
* **Negative:** Given user mencoba membuka tracker milik orang lain; When permintaan dikirim; Then sistem menolaknya secara aman.

---

## 4. Evaluasi Rencana vs Realisasi (Plan vs Actual - PRD Bagian 21)

Tabel evaluasi baseline PRD yang diperbarui pada akhir setiap sprint:

| Fase Sprint | Rencana Fitur (Plan) | Realisasi Aktual (Actual) | Alasan & Analisis (Reason) |
| :--- | :--- | :--- | :--- |
| **Sprint 1 (UTS)** | Register, Login, Pencarian, Detail, Tracker | **Selesai 100% (US-001, US-002, US-003, US-004, US-007, US-008, US-009) & Live di Produksi (`https://mojiji.web.id`, tag `v1.0.0-mvp`).** Seluruh Acceptance Criteria terverifikasi lulus via pengujian otomatis Postman Newman Staging dan Produksi. | **Tercapai tepat waktu.** Optimasi reverse proxy dinamis & Next.js static export terbukti sangat efisien pada VPS 2 GB RAM (beban seluruh kontainer hanya ~91.6 MB / 4.6%). |
| **Sprint 2** | Komentar, Profil, Dark/Light Mode, Reminder | *(Akan diisi pada akhir Sprint 2)* | — |
| **Final Sprint (UAS)** | Deployment dan stabilization | *(Akan diisi pada akhir Final Sprint)* | — |
