# MJ-030 — Skenario Pengujian MVP MOJIJI

> **Status:** Draft untuk review Frontend dan Backend — **belum dieksekusi**.  
> **Dasar:** Mini PRD MOJIJI Revisi 4, Versi 1.4 (Docker/Migration Update), bagian 13–14 (User Story dan Acceptance Criteria).  
> **Tiket:** MJ-030 | **Dependency:** MJ-014 | **Lokasi dokumen:** `docs/qa/skenario-mvp.md`.

## Tujuan dan batasan

Menerjemahkan setiap Acceptance Criteria (AC) positif dan negatif yang **sudah tertulis** untuk tujuh User Story MVP menjadi skenario pengujian langkah demi langkah. Skenario ini adalah **rencana pengujian**, bukan bukti bahwa fitur sudah berjalan.

- **Cakupan:** US-007, US-002, US-001, US-008, US-003, US-004, dan US-009.
- **Jenis:** Manual UI atau Postman, sebagaimana tercantum di tiap skenario.
- **Environment saat eksekusi nanti:** staging setelah fitur tersedia dan workflow deployment siap; bukan kewajiban menjalankan Docker di laptop QA.
- **Data pengujian:** hanya akun dan data dummy. Jangan menulis password asli, token, cookie, API key, atau kredensial database dalam dokumen/evidence.
- **Bukan scope MJ-030:** menambahkan AC baru, melakukan pengujian nyata, atau menetapkan HTTP status/format respons yang belum didefinisikan dalam kontrak API.

## Ringkasan cakupan

| ID | User Story | AC resmi | Skenario | Tipe |
|---|---|---|---|---|
| TC-001 | US-007 Register | Positive | Registrasi data valid | Manual UI |
| TC-002 | US-007 Register | Negative | Menolak email terdaftar | Manual UI |
| TC-003 | US-002 Login | Positive | Login kredensial benar | Manual UI |
| TC-004 | US-002 Login | Negative | Menolak password salah | Manual UI |
| TC-005 | US-001 Pencarian | Positive | Pencarian “Naruto” Anime/Manga | Manual UI |
| TC-006 | US-001 Pencarian | Negative | Kata kunci tanpa hasil | Manual UI |
| TC-007 | US-001 Pencarian | Negative | Tenrai tidak tersedia dan cache kosong | Manual UI |
| TC-008 | US-008 Detail | Positive | Menampilkan informasi detail judul | Manual UI |
| TC-009 | US-008 Detail | Negative | Judul tidak ditemukan | Manual UI |
| TC-010 | US-008 Detail | Negative | Tenrai tidak dapat dihubungi | Manual UI |
| TC-011 | US-003 Status | Positive | Mengubah dan menyimpan status tracker | Manual UI |
| TC-012 | US-003 Status | Negative | Pengunjung belum login mencoba ubah status | Manual UI |
| TC-013 | US-004 Progres +1 | Positive | Progres berubah 4 → 5 dan tersimpan | Manual UI |
| TC-014 | US-004 Progres +1 | Negative | Penyimpanan gagal: rollback dan pesan error | Manual UI |
| TC-015 | US-009 Dashboard | Positive | Menampilkan tracker sendiri dan filter status | Manual UI |
| TC-016 | US-009 Dashboard | Negative | Menolak akses tracker pengguna lain | Postman |

**Jumlah:** 16 skenario dari **14 AC resmi**. AC negatif US-001 dan US-008 masing-masing dipisah menjadi dua kondisi agar hasilnya dapat diperiksa dengan jelas. Pemisahan ini **bukan AC tambahan**.

---

## A. US-007 — Register

### TC-001 — Registrasi berhasil dengan data valid

- **AC:** US-007 — Positive.
- **Tipe:** Manual UI.
- **Data uji:** username dummy baru, email dummy belum terdaftar, password dummy minimal 8 karakter (jangan dicatat nilainya).
- **Prasyarat:** Pengunjung belum memiliki akun dengan email uji tersebut; halaman Register dapat dibuka.
- **Langkah:**
  1. Buka halaman Register sebagai pengunjung.
  2. Isi username, email, dan password dummy yang valid sesuai AC.
  3. Kirim formulir pendaftaran.
- **Expected Result:** Akun dibuat dan pengguna diarahkan ke halaman Login.

### TC-002 — Registrasi ditolak jika email telah digunakan

- **AC:** US-007 — Negative.
- **Tipe:** Manual UI.
- **Data uji:** email dummy yang sudah terdaftar, username dummy berbeda, password dummy sesuai syarat.
- **Prasyarat:** Sudah ada akun dummy dengan email tersebut.
- **Langkah:**
  1. Buka halaman Register.
  2. Isi formulir dengan email yang sudah terdaftar.
  3. Kirim formulir pendaftaran.
- **Expected Result:** Sistem menolak pendaftaran dan menampilkan pesan error.

## B. US-002 — Login

### TC-003 — Login berhasil dengan kredensial benar

- **AC:** US-002 — Positive.
- **Tipe:** Manual UI.
- **Data uji:** email dan password dummy dari akun yang sudah terdaftar.
- **Prasyarat:** Akun uji sudah dibuat dan pengguna belum login.
- **Langkah:**
  1. Buka halaman Login.
  2. Masukkan email dan password akun dummy yang benar.
  3. Klik tombol Login.
- **Expected Result:** Pengguna berhasil login dan masuk ke dashboard.

### TC-004 — Login ditolak jika password salah

- **AC:** US-002 — Negative.
- **Tipe:** Manual UI.
- **Data uji:** email akun dummy valid dan password dummy yang tidak cocok.
- **Prasyarat:** Akun dengan email tersebut sudah terdaftar.
- **Langkah:**
  1. Buka halaman Login.
  2. Masukkan email terdaftar dengan password salah.
  3. Kirim formulir Login.
- **Expected Result:** Login ditolak dan pesan error ditampilkan.

> **Catatan AC:** User Story US-002 menyebut *Login dan Logout*, tetapi bagian AC resmi hanya merinci login. Perilaku logout **tidak ditambahkan** sebagai skenario dengan Expected Result buatan; lanjutkan klarifikasi di MJ-014 sebelum membuat skenario resmi logout.

## C. US-001 — Pencarian Anime/Manga

### TC-005 — Pencarian menampilkan hasil dari Tenrai API

- **AC:** US-001 — Positive.
- **Tipe:** Manual UI.
- **Data uji:** kata kunci `Naruto`, tipe `Anime` atau `Manga`.
- **Prasyarat:** Halaman pencarian tersedia dan layanan katalog dapat mengambil data Tenrai.
- **Langkah:**
  1. Buka halaman pencarian.
  2. Ketik `Naruto` dan pilih tipe Anime atau Manga.
  3. Jalankan pencarian dan amati daftar hasil.
- **Expected Result:** Daftar hasil pencarian dari Tenrai API ditampilkan.

### TC-006 — Pencarian dengan kata kunci tanpa hasil

- **AC:** US-001 — Negative (kondisi: tidak ada hasil).
- **Tipe:** Manual UI.
- **Data uji:** kata kunci dummy yang telah dipastikan tidak menghasilkan hasil dari sumber data pada saat pengujian.
- **Prasyarat:** Halaman pencarian tersedia.
- **Langkah:**
  1. Buka halaman pencarian.
  2. Masukkan kata kunci yang tidak memiliki hasil dan pilih tipe media.
  3. Jalankan pencarian.
- **Expected Result:** Pesan yang jelas seperti “Tidak ada hasil” ditampilkan dan aplikasi tidak error.

### TC-007 — Pencarian saat Tenrai gagal dan cache kosong

- **AC:** US-001 — Negative (kondisi: Tenrai tidak dapat dihubungi serta data belum ada di cache).
- **Tipe:** Manual UI.
- **Data uji:** kata kunci yang belum tersimpan di cache; skenario kegagalan Tenrai yang dikendalikan tim.
- **Prasyarat:** Backend/DevOps menyediakan cara aman untuk mensimulasikan kegagalan Tenrai dan memastikan tidak ada cache relevan. **Jangan sengaja mengganggu layanan production.**
- **Langkah:**
  1. Siapkan kondisi Tenrai gagal dan cache untuk permintaan tersebut kosong bersama Backend/DevOps.
  2. Buka pencarian dan masukkan kata kunci uji.
  3. Jalankan pencarian serta amati pesan di UI.
- **Expected Result:** Aplikasi menampilkan pesan yang jelas dan ramah, tanpa error/crash.

## D. US-008 — Detail Anime/Manga

### TC-008 — Halaman detail menampilkan informasi judul

- **AC:** US-008 — Positive.
- **Tipe:** Manual UI.
- **Data uji:** salah satu judul Anime/Manga valid dari daftar hasil pencarian.
- **Prasyarat:** Pencarian mengembalikan hasil judul yang dapat dibuka.
- **Langkah:**
  1. Cari judul Anime/Manga yang tersedia.
  2. Pilih satu hasil pencarian.
  3. Buka halaman detail dan periksa seluruh informasi yang tampil.
- **Expected Result:** Judul, gambar, sinopsis, skor, dan jumlah episode/chapter ditampilkan.

### TC-009 — Detail judul yang tidak ditemukan

- **AC:** US-008 — Negative (kondisi: judul tidak ditemukan).
- **Tipe:** Manual UI.
- **Data uji:** identitas judul yang tidak ditemukan; rute/ID uji mengikuti implementasi yang disetujui tim.
- **Prasyarat:** Tim menyediakan cara aman untuk membuka detail judul yang tidak ditemukan.
- **Langkah:**
  1. Siapkan identitas judul yang tidak ditemukan.
  2. Coba buka halaman detail judul tersebut.
  3. Amati isi halaman.
- **Expected Result:** Pesan yang jelas ditampilkan; halaman tidak kosong.

### TC-010 — Detail saat Tenrai tidak dapat dihubungi

- **AC:** US-008 — Negative (kondisi: Tenrai tidak dapat dihubungi).
- **Tipe:** Manual UI.
- **Data uji:** judul uji dan simulasi gangguan Tenrai yang disediakan tim.
- **Prasyarat:** Backend/DevOps menyediakan kondisi pengujian gangguan yang aman.
- **Langkah:**
  1. Siapkan kondisi Tenrai tidak dapat dihubungi bersama Backend/DevOps.
  2. Buka halaman detail judul uji.
  3. Amati respons halaman.
- **Expected Result:** Pesan yang jelas ditampilkan; halaman tidak kosong.

## E. US-003 — Ubah Status Tracker

### TC-011 — Pengguna login dapat menyimpan status tracker

- **AC:** US-003 — Positive.
- **Tipe:** Manual UI.
- **Data uji:** akun dummy yang login, satu judul Anime/Manga, status pilihan (misalnya `Watching` untuk Anime).
- **Prasyarat:** Pengguna sudah login dan judul tersedia untuk diberi status.
- **Langkah:**
  1. Login menggunakan akun dummy.
  2. Buka satu judul dan pilih status tracker.
  3. Buka dashboard dan lihat item tersebut sesuai status pilihan.
- **Expected Result:** Status tersimpan; judul muncul di dashboard sesuai status yang dipilih.

### TC-012 — Pengunjung belum login diarahkan ke Login saat mengubah status

- **AC:** US-003 — Negative.
- **Tipe:** Manual UI.
- **Data uji:** pengunjung tanpa sesi login, satu judul Anime/Manga.
- **Prasyarat:** Pengunjung belum login.
- **Langkah:**
  1. Buka halaman judul sebagai pengunjung.
  2. Coba pilih/ubah status tracker untuk judul tersebut.
  3. Amati navigasi aplikasi.
- **Expected Result:** Pengunjung diarahkan ke halaman Login.

## F. US-004 — Tambah Progres +1

### TC-013 — Tombol +1 menambah progres dan menyimpannya

- **AC:** US-004 — Positive.
- **Tipe:** Manual UI.
- **Data uji:** akun dummy, judul berstatus `Watching`, progres awal `4`.
- **Prasyarat:** Pengguna login dan tracker uji memiliki status Watching serta progres 4.
- **Langkah:**
  1. Buka tracker dengan progres 4.
  2. Tekan tombol `+1` sekali.
  3. Periksa angka yang tampil lalu buka ulang data tracker untuk memastikan perubahan tersimpan.
- **Expected Result:** Progres langsung menjadi 5 dan nilainya tersimpan.

### TC-014 — Gagal menyimpan +1 mengembalikan angka awal

- **AC:** US-004 — Negative.
- **Tipe:** Manual UI.
- **Data uji:** akun dummy, tracker dengan progres `4`, simulasi kegagalan penyimpanan.
- **Prasyarat:** Backend/Frontend menyediakan cara aman untuk membuat penyimpanan gagal pada environment pengujian.
- **Langkah:**
  1. Buka tracker dengan progres awal 4 dan siapkan simulasi gagal simpan.
  2. Tekan tombol `+1`.
  3. Amati perubahan angka dan pesan setelah respons gagal diterima.
- **Expected Result:** Angka progres kembali ke 4 dan pesan error muncul.

## G. US-009 — Dashboard / Daftar Tracker

### TC-015 — Dashboard menampilkan tracker milik sendiri dan filter status

- **AC:** US-009 — Positive.
- **Tipe:** Manual UI.
- **Data uji:** akun dummy dengan beberapa judul tracker pada status berbeda.
- **Prasyarat:** Pengguna login dan memiliki data tracker.
- **Langkah:**
  1. Login dan buka dashboard.
  2. Periksa daftar tracker milik akun tersebut.
  3. Gunakan filter berdasarkan status, lalu periksa daftar yang ditampilkan.
- **Expected Result:** Daftar tracker milik pengguna ditampilkan dan dapat disaring berdasarkan status.

### TC-016 — Akses tracker milik pengguna lain ditolak

- **AC:** US-009 — Negative.
- **Tipe:** Postman.
- **Data uji:** akun dummy A (pemilik tracker) dan akun dummy B (bukan pemilik); ID/resource tracker A jika tersedia dalam kontrak API.
- **Prasyarat:** Tersedia dua akun uji terpisah. Endpoint atau request untuk menguji akses lintas pengguna dikonfirmasi oleh Backend; **jangan mengarang endpoint baru**.
- **Langkah:**
  1. Buat data tracker milik akun A dan siapkan sesi pengujian akun B.
  2. Menggunakan Postman, kirim permintaan akses ke tracker milik akun A dengan otorisasi akun B melalui mekanisme yang disepakati dalam API contract.
  3. Periksa apakah akses dan data tracker A ditolak/tidak diberikan kepada B.
- **Expected Result:** Sistem menolak akses pengguna B terhadap tracker milik A. **Kode HTTP dan format error mengikuti API contract yang telah disepakati, bukan ditentukan dokumen ini.**

---

## Catatan klarifikasi dan tindak lanjut

1. **US-002 Logout:** Belum ada AC resmi logout; tunggu jawaban MJ-014/keputusan tim sebelum menetapkan Expected Result pengujian logout.
2. **TC-007, TC-010, TC-014:** Memerlukan kondisi kegagalan yang terkontrol bersama Backend/DevOps saat eksekusi nantinya. Dokumen ini belum mengklaim bahwa simulasi tersebut tersedia.
3. **TC-009 dan TC-016:** Cara memasukkan ID judul tidak valid serta request lintas akun perlu mengikuti rute dan kontrak API yang benar-benar tersedia. Minta verifikasi Frontend/Backend.
4. **Data dan pesan spesifik:** Jangan menetapkan batas tambahan, teks pesan persis, HTTP status, token, atau mekanisme baru tanpa keputusan requirement/API contract.
5. **MJ-030 bukan pelaksanaan tes:** Belum ada Actual Result, Pass/Fail, screenshot, atau bukti Postman. Test case rinci/eksekusi dikerjakan di tiket berikutnya sesuai timeline.

## Review & persetujuan

| Reviewer | Fokus pengecekan | Status |
|---|---|---|
| Frontend | Kesesuaian alur UI, navigasi, pesan error, tombol, dan filter | Menunggu review |
| Backend | Kesesuaian API/otorisasi dan kelayakan simulasi error | Menunggu review |
| QA | Setiap skenario merujuk AC resmi dan tidak menambah aturan | Draft |

**Referensi:** Mini PRD MOJIJI Revisi 4 (Versi 1.4), bagian 13–14; `docs/qa/pertanyaan-ac.md` (MJ-014); API Overview PRD bagian 18. 
