---
title: "Acceptance Criteria & Spesifikasi Tiket Frontend Sprint 2"
sidebar_position: 4
tags: [frontend, architecture, acceptance-criteria, sprint-2, kanban]
---

# Acceptance Criteria & Spesifikasi Tiket Frontend Sprint 2 (US-005, US-010, US-011)

> **Dokumen:** `docs/architecture/ac-sprint-2-frontend.md`  
> **Tiket:** `MJ-112` — Tulis AC US-005, US-010, US-011 dan tiket frontend Sprint 2  
> **Role:** Frontend Developer (Andika / Dika)  
> **Sprint:** Sprint 2 (Minggu 9 s.d. Minggu 11)  
> **Status:** **DRAFT SELESAI — SIAP DI-REVIEW QA (MJ-124)**  
> **Referensi Utama:** Mini PRD Revisi 4 Poin 14, 15, 17, 18; Timeline Minggu 9–11; Style Guide UI/UX (`docs/ui-ux/style-guide.md`)  
> **Tanggal:** 15 November 2026  

---

## 1. Latar Belakang dan Ruang Lingkup

Sesuai catatan resmi pada **Mini PRD Revisi 4 (v1.4) Bab 14**:
> *"Acceptance Criteria untuk User Story MVP. Untuk story setelah UTS, kriterianya ditulis saat Sprint Planning."*

Memasuki Minggu ke-9 (awal Sprint 2), tim Front-end menyusun dokumen ini sebagai dasar pengujian mutu (*Quality Gate*) dan spesifikasi implementasi sebelum penulisan kode dimulai. Dokumen ini mendefinisikan kriteria keberterimaan formal berformat **Given-When-Then** untuk tiga User Story prioritas *Should Have* pada Sprint 2, serta memecah beban kerja Front-end ke dalam tiket terukur berstandar 8 field wajib Kanban.

### Batasan Ruang Lingkup Sprint 2 (Front-end)

| ID Story | Modul / Fitur | Prioritas MoSCoW | Target Rilis | Peran Front-end |
|---|---|:---:|:---:|---|
| **US-010** | Halaman Profil Pengguna | *Should Have* | Minggu 9 | Mengubah rute `/profile/` dari status *placeholder* menjadi halaman data akun aktif mengonsumsi `GET /api/users/me`. |
| **US-011** | Mode Tema Terang dan Gelap | *Should Have* | Minggu 9 | Menyempurnakan switch tema instan berbasis Zustand `themeStore`, persistensi `localStorage`, dan kepatuhan kontras visual. |
| **US-005** | Komentar di Halaman Detail | *Should Have* | Minggu 9 (UI Mock) & Minggu 10 (API) | Membangun komponen daftar komentar dan formulir input di `/detail/` dengan mock awal (`MJ-115`), lalu integrasi API (`MJ-131`). |
| **US-006** | Pengingat Manual (Reminder) | *Could Have* | Minggu 10–11 | Komponen waktu pengingat dan pendaftaran Service Worker. Dikerjakan paling akhir; dievaluasi pada Minggu 11 (MJ-160). |

---

## 2. Matriks Kriteria Keberterimaan Resmi (Acceptance Criteria)

Format pengujian mengacu pada standar BDD (*Behavior-Driven Development*):
- **Given:** Kondisi awal sistem / status autentikasi pengguna.
- **When:** Aksi atau tindakan yang dilakukan oleh pengguna di antarmuka web.
- **Then:** Hasil yang diharapkan, respons visual, dan perubahan state yang dapat diverifikasi secara objektif.

---

### 2.1 US-010 — Halaman Profil Pengguna

Pengguna yang telah memiliki akun ingin melihat informasi profil pribadinya agar dapat memverifikasi identitas akun dan riwayat aktivitas di MOJIJI.

| ID Skenario | Kategori Kasus | Kriteria Keberterimaan (Given-When-Then) | Hasil yang Diharapkan (Expected Result) |
|---|:---:|---|---|
| **AC-010-P01** | Positif (Tampilan Data) | **Given** pengguna telah berhasil login dan memiliki cookie sesi aktif;<br/>**When** pengguna membuka rute `/profile/` (melalui klik Avatar di Navbar $\rightarrow$ "Profil Saya");<br/>**Then** halaman memuat data profil dari `GET /api/users/me` dan menampilkan: Avatar inisial, `username`, alamat `email`, serta tanggal bergabung (`created_at`) yang diformat ramah (misal: *"Bergabung sejak November 2026"*). | Kartu profil terisi data asli pengguna tanpa teks *placeholder* atau layar kosong. |
| **AC-010-P02** | Positif (Navigasi Aksi) | **Given** pengguna sedang berada di halaman `/profile/`;<br/>**When** pengguna menekan tombol "Kembali ke Beranda" atau "Lihat Koleksi Tracker";<br/>**Then** peramban langsung mengarahkan ke `/home/` atau `/tracker/` secara cepat dan mulus. | Navigasi SPA berjalan lancar tanpa reload peramban penuh. |
| **AC-010-N01** | Negatif (Proteksi Tamu) | **Given** pengunjung belum login (tidak memiliki sesi aktif);<br/>**When** pengunjung mencoba mengakses URL `https://mojiji.web.id/profile/` secara langsung di address bar;<br/>**Then** komponen `AuthGuard` mendeteksi sesi kosong dan langsung mengalihkan pengunjung ke `/login/` dengan aman. | Halaman profil tidak pernah bocor ke pengguna tanpa autentikasi. |
| **AC-010-N02** | Negatif (Gangguan Jaringan) | **Given** pengguna login mengakses `/profile/` namun koneksi backend terputus / gateway offline;<br/>**When** panggilan `GET /api/users/me` menghasilkan timeout atau error jaringan;<br/>**Then** antarmuka menampilkan kartu state error ramah berbahasa Indonesia lengkap dengan tombol "Coba Lagi" tanpa merusak tata letak Navbar. | Pengguna mendapat umpan balik jelas dan opsi pemulihan mandiri. |

---

### 2.2 US-011 — Mode Tema Terang dan Gelap

Pengguna ingin dapat memilih antara tampilan Gelap (*Dark Mode*) untuk kenyamanan mata di malam hari atau tampilan Terang (*Light Mode*) untuk visibilitas optimal di lingkungan terang.

| ID Skenario | Kategori Kasus | Kriteria Keberterimaan (Given-When-Then) | Hasil yang Diharapkan (Expected Result) |
|---|:---:|---|---|
| **AC-011-P01** | Positif (Transisi Instan) | **Given** pengguna membuka halaman mana pun di MOJIJI (`/home/`, `/explore/`, `/detail/`, `/tracker/`, `/profile/`);<br/>**When** pengguna mengklik tombol toggle tema (ikon Matahari/Bulan) di kanan atas Navbar;<br/>**Then** kelas tema pada elemen root HTML (`<html>`) berganti seketika antara `.dark` dan `.light`, seluruh token warna CSS (`bg`, `surface`, `text`, `border`) menyesuaikan secara instan tanpa reload halaman. | Perubahan tema terjadi < 50 milidetik secara reaktif melalui Zustand `themeStore`. |
| **AC-011-P02** | Positif (Persistensi Sesi) | **Given** pengguna telah memilih mode Terang (*Light Mode*);<br/>**When** pengguna me-refresh halaman (F5), menutup tab, atau membuka sesi browser baru di domain yang sama;<br/>**Then** tema yang dimuat pertama kali tetap konsisten berada di mode Terang sesuai nilai kunci `mojiji_theme` di `localStorage`. | Preferensi visual pengguna tersimpan permanen di sisi klien. |
| **AC-011-P03** | Positif (Kontras & Aksesibilitas) | **Given** aplikasi berada dalam mode Terang maupun mode Gelap;<br/>**When** QA melakukan inspeksi keterbacaan pada teks heading, body, kartu katalog, badge skor, dan tombol aksi;<br/>**Then** rasio kontras warna teks terhadap latar belakang memenuhi standar WCAG 2.1 AA (minimal 4.5:1 untuk teks normal), tidak ada elemen teks putih di atas latar putih atau teks gelap di atas latar gelap. | Lulus audit kontras visual UI/UX (tiket `MJ-111`). |
| **AC-011-N01** | Negatif (LocalStorage Diblokir) | **Given** browser pengguna menonaktifkan atau membatasi akses `localStorage` (misal mode keamanan tinggi tertentu);<br/>**When** pengguna membuka aplikasi MOJIJI;<br/>**Then** aplikasi tetap berjalan stabil dengan fallback default ke tema Gelap (*Dark Mode* / identitas resmi MOJIJI) tanpa memicu *unhandled exception* atau layar putih. | Aplikasi toleran terhadap pembatasan izin penyimpanan browser klien. |

---

### 2.3 US-005 — Komentar di Halaman Detail Anime & Manga

Pengguna ingin dapat membaca ulasan komunitas dan menuliskan opininya mengenai judul anime atau manga yang sedang ditinjau.

| ID Skenario | Kategori Kasus | Kriteria Keberterimaan (Given-When-Then) | Hasil yang Diharapkan (Expected Result) |
|---|:---:|---|---|
| **AC-005-P01** | Positif (Render Seksi Komentar) | **Given** pengguna membuka halaman detail anime atau manga (`/detail/?type=anime&id=...`);<br/>**When** konten detail selesai dimuat;<br/>**Then** di bawah bagian Karakter & Staf tampil seksi terpisah "Diskusi & Komentar Komunitas" yang menyajikan: total jumlah komentar, daftar ulasan yang sudah ada, dan formulir penulisan ulasan. | Tata letak seksi komentar terstruktur proporsional dan selaras dengan tema aktif. |
| **AC-005-P02** | Positif (Tulis Komentar Berhasil) | **Given** pengguna telah login dan mengetikkan ulasan yang valid (panjang 3 s.d. 500 karakter);<br/>**When** pengguna menekan tombol primer "Kirim Komentar";<br/>**Then** sistem mengirim permintaan `POST /api/interaction/comments`, komentar baru langsung disematkan pada urutan teratas daftar komentar (Optimistic/Reaktif), kotak input teks dikosongkan, dan muncul toast konfirmasi hijau: *"Komentar berhasil dikirim!"*. | Ulasan tersimpan dan langsung terlihat oleh penulis tanpa perlu memuat ulang halaman. |
| **AC-005-P03** | Positif (Informasi Kartu Komentar) | **Given** daftar komentar dimuat di layar;<br/>**When** pengguna melihat masing-masing item komentar;<br/>**Then** setiap kartu menampilkan: avatar inisial berwarna aksen, username penulis, badge penanda waktu relatif bahasa Indonesia (misal: *"baru saja"*, *"2 jam yang lalu"*, *"3 hari yang lalu"*), dan isi teks komentar yang rapi mendukung pemisahan baris (*line-break*). | Informasi ulasan jelas, terbaca, dan mudah dipahami. |
| **AC-005-N01** | Negatif (Validasi Input Kosong) | **Given** pengguna login berada di seksi komentar;<br/>**When** formulir komentar masih kosong atau hanya berisi karakter spasi/whitespace;<br/>**Then** tombol "Kirim Komentar" berada dalam kondisi tidak aktif (*disabled*). Jika dipicu via shortcut keyboard, sistem memunculkan pesan validasi: *"Komentar tidak boleh kosong"*. | Mencegah pengiriman data sampah ke database. |
| **AC-005-N02** | Negatif (Akses Pengunjung Belum Login) | **Given** pengunjung belum login membuka halaman detail;<br/>**When** pengunjung menggulir ke seksi komentar;<br/>**Then** pengunjung tetap dapat membaca daftar komentar yang ada, namun area formulir input digantikan oleh banner informatif: *"Masuk dengan akun Mojiji kamu untuk ikut menulis komentar."* lengkap dengan tombol tautan cepat menuju `/login/`. | Akses baca bersifat publik, sementara akses menulis dilindungi sesi autentikasi. |
| **AC-005-N03** | Negatif (State Komentar Kosong) | **Given** judul anime/manga yang dibuka belum memiliki komentar sama sekali di database;<br/>**When** seksi komentar selesai dimuat;<br/>**Then** sistem tidak menampilkan error, melainkan menampilkan komponen ilustrasi/pesan kosong ramah: *"Belum ada komentar untuk judul ini. Jadilah yang pertama membagikan pendapatmu!"*. | Tidak ada layar kosong atau tampilan canggung saat data bernilai `[]`. |

---

## 3. Rincian Pemecahan Tiket Front-end Sprint 2 (Format 8 Field Wajib Kanban)

Seluruh backlog pekerjaan Front-end pada Sprint 2 dipecah menjadi tiket-tiket spesifik yang masing-masing memenuhi **8 atribut standar Kanban**:
1. `ID Tiket`
2. `Minggu Pelaksanaan`
3. `Role Penanggung Jawab`
4. `Tipe Tiket`
5. `Kategori Fitur`
6. `Estimasi Bobot (S/M/L)`
7. `Uraian Pekerjaan Teknis (Langkah Kerja)`
8. `Acceptance Criteria & Prasyarat (Dependencies)`

### Tabel Ringkasan Tiket Front-end (Sprint 2)

| ID Tiket | Minggu | Tipe | Kategori | Judul Pekerjaan | Estimasi | Prasyarat (Dependencies) |
|---|:---:|:---:|:---:|---|:---:|---|
| **MJ-112** | M9 | `docs` | Planning | Tulis AC US-005, US-010, US-011 & tiket frontend Sprint 2 | **M** | `MJ-015` |
| **MJ-113** | M9 | `feat` | Tema | Toggle tema Terang/Gelap (US-011) di seluruh halaman MVP | **M** | `MJ-109`, `MJ-023` |
| **MJ-114** | M9 | `feat` | Profil | Halaman Profil Pengguna aktif (US-010) via `/api/users/me` | **M** | `MJ-109`, `MJ-119` |
| **MJ-115** | M9 | `feat` | Komentar | Komponen Komentar di halaman Detail (Mock Data UI) | **M** | `MJ-109`, `MJ-112`, `MJ-116` |
| **MJ-131** | M10 | `feat` | Komentar | Integrasi Komentar ke Interaction Service API (US-005) | **M** | `MJ-118`, `MJ-115` |
| **MJ-132** | M10 | `feat` | Reminder | Komponen Form & Daftar Pengingat di Detail (US-006) | **M** | `MJ-110`, `MJ-136` |
| **MJ-133** | M10 | `feat` | Reminder | Integrasi Web Push / Service Worker izin notifikasi | **L** | `MJ-132`, `MJ-137` |
| **MJ-152** | M11 | `fix` | Polishing | Perbaikan bug hasil pengujian QA Sprint 2 | **S** | `MJ-141` |

---

### Detail Spesifikasi Tiap Tiket Front-end

#### 1. Tiket MJ-113: Toggle Tema Terang/Gelap (US-011)
- **ID:** `MJ-113` | **Minggu:** 9 | **Role:** Frontend (Dika) | **Tipe:** `feat`
- **Kategori:** Tema | **Estimasi:** `M` (2-3 jam)
- **Uraian Pekerjaan:**
  1. Pastikan `store/themeStore.js` memanipulasi class `.dark` dan `.light` pada `document.documentElement` secara bersih tanpa *hydration mismatch*.
  2. Periksa seluruh kelas warna di `apps/web/app/globals.css` untuk memastikan variabel warna `--bg`, `--surface`, `--surface-2`, `--border`, dan `--text-2` di mode Terang menghasilkan kontras tajam terhadap teks utama.
  3. Uji tampilan toggle di Navbar desktop dan drawer mobile.
- **Kriteria Keberterimaan (AC):** Memenuhi `AC-011-P01`, `AC-011-P02`, dan `AC-011-P03`. Tema berganti seketika di Beranda, Jelajah, Detail, Tracker, dan Profil.
- **Dependencies:** `MJ-109` (Handoff UI/UX), `MJ-023` (Design Tokens).

#### 2. Tiket MJ-114: Halaman Profil Pengguna (US-010)
- **ID:** `MJ-114` | **Minggu:** 9 | **Role:** Frontend (Dika) | **Tipe:** `feat`
- **Kategori:** Profil | **Estimasi:** `M` (2-3 jam)
- **Uraian Pekerjaan:**
  1. Perbarui `apps/web/app/profile/page.js` untuk mengganti kartu *placeholder* dengan kartu profil lengkap.
  2. Ambil data pengguna saat mount dari `useAuthStore` atau panggil `getMeApi()` (`GET /api/users/me`) melalui `lib/api.js`.
  3. Render avatar lingkaran besar dengan inisial nama, username, email, dan tanggal bergabung dengan format Indonesia (`id-ID`).
  4. Sediakan ringkasan status cepat koleksi tontonan (menghubungkan ke `useTrackerStore`).
  5. Bungkus halaman dengan `<AuthGuard>`.
- **Kriteria Keberterimaan (AC):** Memenuhi `AC-010-P01`, `AC-010-P02`, dan `AC-010-N01`. Tamu dialihkan ke login; data akun terautentikasi tampil akurat.
- **Dependencies:** `MJ-109` (Handoff UI/UX), `MJ-119` (Endpoint Backend Profil).

#### 3. Tiket MJ-115: Komponen Komentar di Halaman Detail (Mock UI)
- **ID:** `MJ-115` | **Minggu:** 9 | **Role:** Frontend (Dika) | **Tipe:** `feat`
- **Kategori:** Komentar | **Estimasi:** `M` (2-4 jam)
- **Uraian Pekerjaan:**
  1. Buat direktori komponen baru: `apps/web/components/detail/DetailComments.jsx`.
  2. Buat dataset mock komentar awal di `apps/web/lib/mock/commentMock.js` berisi 3-4 contoh komentar per judul.
  3. Rancang UI formulir input ulasan (textarea dengan penghitung karakter 0/500, avatar pengguna aktif, tombol Kirim ungu).
  4. Rancang UI daftar kartu komentar (avatar, nama, badge waktu, teks ulasan, tombol hapus jika ulasan milik sendiri).
  5. Sematkan komponen di bawah seksi karakter & trailer pada `apps/web/app/detail/page.js`.
- **Kriteria Keberterimaan (AC):** Memenuhi `AC-005-P01`, `AC-005-P03`, `AC-005-N01`, dan `AC-005-N02`. Tampilan selesai dan interaktif secara lokal menggunakan data mock sebelum backend live.
- **Dependencies:** `MJ-109` (Handoff UI/UX), `MJ-112` (Dokumen AC ini), `MJ-116` (Kontrak API Backend).

#### 4. Tiket MJ-131: Hubungkan Komentar ke Interaction Service API (US-005)
- **ID:** `MJ-131` | **Minggu:** 10 | **Role:** Frontend (Dika) | **Tipe:** `feat`
- **Kategori:** Komentar | **Estimasi:** `M` (2-3 jam)
- **Uraian Pekerjaan:**
  1. Tambahkan fungsi API di `apps/web/lib/api.js`: `getCommentsApi(type, malId)` dan `postCommentApi(payload)`.
  2. Sambungkan komponen `DetailComments.jsx` agar memuat data riil dari API Gateway saat `NEXT_PUBLIC_USE_MOCK="false"`.
  3. Terapkan pembaruan optimistik (komentar langsung tampil sambil request berjalan).
  4. Berikan penanganan error ramah jika terjadi kegagalan jaringan atau respons 401/429.
- **Kriteria Keberterimaan (AC):** Memenuhi `AC-005-P02` dan `AC-005-N04`. Komentar tersimpan ke PostgreSQL Supabase via Interaction Service.
- **Dependencies:** `MJ-118` (API Komentar Selesai), `MJ-115` (Komponen UI Selesai).

#### 5. Tiket MJ-132: Komponen Reminder di Halaman Detail (US-006)
- **ID:** `MJ-132` | **Minggu:** 10 | **Role:** Frontend (Dika) | **Tipe:** `feat`
- **Kategori:** Reminder | **Estimasi:** `M` (2-3 jam)
- **Uraian Pekerjaan:**
  1. Rancang tombol dan modal atur pengingat ("Ingatkan Jadwal") pada kartu aksi halaman detail.
  2. Sediakan input pemilih tanggal & jam penayangan episode/chapter.
  3. Sediakan daftar pengingat aktif yang dapat dibatalkan oleh pengguna.
- **Kriteria Keberterimaan (AC):** Komponen pengingat tampil sesuai desain Figma `MJ-110` dan mendukung input waktu lokal.
- **Dependencies:** `MJ-110` (Desain Reminder), `MJ-136` (Kontrak API Notifikasi).

#### 6. Tiket MJ-152: Perbaikan Bug & Polishing Sprint 2 dari QA
- **ID:** `MJ-152` | **Minggu:** 11 | **Role:** Frontend (Dika) | **Tipe:** `fix`
- **Kategori:** Testing / Bugfix | **Estimasi:** `S` (1-2 jam)
- **Uraian Pekerjaan:**
  1. Mengatasi temuan bug dari pengujian QA (Nadia) pada fitur Profil, Tema, dan Komentar.
  2. Memastikan seluruh build `output: "export"` di Next.js tetap bebas error.
- **Kriteria Keberterimaan (AC):** 100% bug prioritas tinggi dari laporan QA terselesaikan sebelum penyiapan Release Candidate (RC).
- **Dependencies:** `MJ-141` (Laporan Pengujian QA Sprint 2).

---

## 4. Matriks Keselarasan Kontrak API dan Catatan Handoff

Untuk menjamin kelancaran integrasi antara tim Front-end, Backend, dan QA, berikut adalah pemetaan kontrak endpoint yang disepakati:

### 4.1 Pemetaan Endpoint Sprint 2

| Fitur Frontend | Method | Path Gateway | Service Penyedia | Parameter / Payload | Format Respons Sukses |
|---|:---:|---|---|---|---|
| **Profil Pengguna** | `GET` | `/api/users/me` | User Service | Header Cookie `mojiji_session` | `{ success: true, data: { id, username, email, created_at } }` |
| **Daftar Komentar** | `GET` | `/api/interaction/comments` | Interaction Service | Query: `?mediaType=anime&malId=41467` | `{ success: true, data: [ { id, user_id, username, content, created_at } ] }` |
| **Kirim Komentar** | `POST` | `/api/interaction/comments` | Interaction Service | Body: `{ mediaType, malId, content }` | `{ success: true, data: { id, content, created_at }, message: "Komentar berhasil disimpan" }` |
| **Izin Notifikasi** | `POST` | `/api/notifications/subscriptions` | Notification Service | Body: `{ endpoint, keys: { p256dh, auth } }` | `{ success: true, message: "Subscription tersimpan" }` |
| **Buat Pengingat** | `POST` | `/api/notifications/reminders` | Notification Service | Body: `{ mediaType, malId, title, remindAt }` | `{ success: true, data: { id, remindAt, status: "scheduled" } }` |

---

### 4.2 Catatan Handoff Lintas Role

1. **Handoff ke QA (Nadia - Tiket MJ-124):**
   - Dokumen ini diserahkan untuk ditinjau kelayakan ujinya (*testability*).
   - QA diharapkan menurunkan skenario AC pada Bab 2 menjadi berkas test case langkah demi langkah di `docs/qa/` (tiket `MJ-123`).
2. **Handoff ke Backend (Syafii - Tiket MJ-116 & MJ-117):**
   - Mohon pastikan payload `GET /api/users/me` menyertakan string ISO `created_at` agar kartu profil dapat menampilkan lama akun aktif.
   - Pada endpoint `POST /api/interaction/comments`, mohon pastikan nama pengguna (`username`) otomatis diambil dari cookie sesi token JWT di sisi server untuk menjaga integritas data tanpa mengandalkan input dari client.
3. **Handoff ke UI/UX (Ican - Tiket MJ-109 & MJ-111):**
   - Seluruh token warna CSS yang dipakai pada implementasi tema Terang/Gelap (`MJ-113`) merujuk langsung ke *design tokens* Figma tim.

---

## 5. Checklist Kesiapan Selesai (Definition of Done — MJ-112)

- [x] Kriteria Acceptance Criteria (Given-When-Then) untuk US-010 (Profil) telah dirumuskan secara terukur.
- [x] Kriteria Acceptance Criteria (Given-When-Then) untuk US-011 (Dark/Light Mode) telah dirumuskan secara terukur.
- [x] Kriteria Acceptance Criteria (Given-When-Then) untuk US-005 (Komentar) telah dirumuskan secara terukur.
- [x] Rincian tiket Front-end Sprint 2 telah dipecah lengkap dengan 8 field wajib Kanban.
- [x] Kontrak endpoint dan parameter API telah diselaraskan dengan arsitektur microservices MOJIJI.
- [x] Berkas dokumentasi tersimpan rapi pada rute `docs/architecture/ac-sprint-2-frontend.md`.
