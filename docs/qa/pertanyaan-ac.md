# MJ-014 — Review User Story dan Acceptance Criteria (AC)

**Project:** MOJIJI — Web Tracking Anime & Manga  
**Role:** QA  
**Referensi:** Mini PRD Revisi 4 (Versi 1.4 — Docker/Migration Update), poin 13–14; GitHub Issue [#63 — MJ-014](https://github.com/aji-banyu/mojiji-animelist/issues/63)  
**Status keseluruhan:** Menunggu klarifikasi tim

> Dokumen ini merangkum review yang **sudah dicatat sebagai komentar pada GitHub Issue #63**. Pertanyaan di bawah adalah hal yang perlu dikonfirmasi; **bukan Acceptance Criteria baru**. Jangan mengubah PRD atau menetapkan jawaban sendiri. Semua keputusan akhir harus berasal dari tim dan dicatat beserta sumbernya.

## Ringkasan

| User Story | Fitur | Status AC di Mini PRD | Status klarifikasi |
|---|---|---|---|
| US-007 | Register | Positive dan Negative tersedia | Menunggu konfirmasi |
| US-002 | Login dan Logout | Positive dan Negative untuk login; AC logout belum dirinci | Menunggu konfirmasi |
| US-001 | Pencarian Anime/Manga | Positive dan Negative tersedia | Menunggu konfirmasi |
| US-008 | Detail Anime/Manga | Positive dan Negative tersedia | Menunggu konfirmasi |
| US-003 | Ubah status tracker | Positive dan Negative tersedia | Menunggu konfirmasi |
| US-004 | Tambah progres +1 | Positive dan Negative tersedia | Menunggu konfirmasi |
| US-009 | Dashboard tracker | Positive dan Negative tersedia | Menunggu konfirmasi |
| US-005 | Komentar | AC rinci belum ditetapkan; Sprint 2 | Menunggu Sprint Planning/konfirmasi |
| US-010 | Profil | AC rinci belum ditetapkan; Sprint 2 | Menunggu Sprint Planning/konfirmasi |
| US-011 | Dark/Light Mode | AC rinci belum ditetapkan; Sprint 2 | Menunggu Sprint Planning/konfirmasi |
| US-006 | Manual Reminder | AC rinci belum ditetapkan; fitur Could Have Sprint 2 | Menunggu keputusan scope dan AC |

## Hasil review dan pertanyaan

### US-007 — Register

**Yang sudah jelas:** Pengunjung mengisi username, email, dan password minimal 8 karakter; pendaftaran berhasil mengarahkan ke login; email duplikat ditolak. Mini PRD juga mewajibkan username/email unik dan password disimpan sebagai hash.

**Celah yang perlu diklarifikasi:**
1. Selain panjang minimal 8 karakter, apakah password harus mengandung huruf besar, angka, atau simbol?
2. Berapa panjang username yang diperbolehkan dan karakter apa saja yang valid?
3. Apa respons ketika username sudah digunakan?
4. Apa validasi untuk format email salah atau input kosong?
5. Di mana pesan validasi ditampilkan (per field atau notifikasi umum)?

**Jawaban/keputusan tim:** Belum diterima.  
**Sumber keputusan / tanggal:** —

### US-002 — Login dan Logout

**Yang sudah jelas:** Kredensial benar mengarahkan ke dashboard; password salah membuat login ditolak dan menampilkan pesan error. Logout berada dalam scope autentikasi, tetapi perilakunya belum dijelaskan dalam AC rinci.

**Celah yang perlu diklarifikasi:**
1. Bagaimana respons login untuk email yang belum terdaftar?
2. Bagaimana validasi email/password kosong?
3. Setelah logout, diarahkan ke halaman mana?
4. Apa perilaku ketika pengguna menekan Back atau membuka dashboard setelah logout?
5. Berapa masa berlaku sesi dan apakah dapat diperpanjang?
6. Apakah error email tidak terdaftar dan password salah memakai pesan sama?

**Jawaban/keputusan tim:** Belum diterima.  
**Sumber keputusan / tanggal:** —

### US-001 — Pencarian Anime/Manga

**Yang sudah jelas:** Mencari dengan kata kunci, memilih Anime/Manga, hasil berasal dari Tenrai API. Jika hasil kosong atau Tenrai tidak tersedia dan cache kosong, harus ada pesan yang jelas tanpa aplikasi error. PRD juga menetapkan cache Redis dan target waktu respons cache di bawah 300 ms.

**Celah yang perlu diklarifikasi:**
1. Apa yang terjadi ketika kata kunci kosong?
2. Apakah pencarian memakai pagination, dan berapa item per halaman?
3. Apakah pencarian tidak peka huruf besar/kecil?
4. Apa indikator loading yang digunakan?
5. Pesan apa yang ditampilkan jika Tenrai gagal dan cache kosong?
6. Kapan cache lama boleh ditampilkan, dan apakah perlu penanda data lama?

**Jawaban/keputusan tim:** Belum diterima.  
**Sumber keputusan / tanggal:** —

### US-008 — Detail Anime/Manga

**Yang sudah jelas:** Halaman detail menampilkan judul, gambar, sinopsis, skor, jumlah episode/chapter. Jika judul tidak ditemukan atau Tenrai gagal, sistem memberi pesan yang jelas, bukan layar kosong.

**Celah yang perlu diklarifikasi:**
1. Apa yang ditampilkan ketika sinopsis, skor, atau jumlah episode/chapter tidak tersedia?
2. Apakah gambar yang gagal dimuat memakai placeholder?
3. Apakah pesan judul tidak ditemukan dilengkapi tombol kembali ke pencarian?
4. Apakah tersedia tombol Retry untuk timeout?
5. Apa yang ditampilkan saat HTTP 429, dan apakah cache digunakan?
6. Apa indikator loading halaman detail?

**Jawaban/keputusan tim:** Belum diterima.  
**Sumber keputusan / tanggal:** —

### US-003 — Ubah Status Tracker

**Yang sudah jelas:** Status Plan, Watching/Reading, Completed, On Hold, Dropped dapat dipilih; perubahan disimpan dan terlihat di dashboard. Pengguna belum login diarahkan ke login saat mencoba mengubah status.

**Celah yang perlu diklarifikasi:**
1. Apakah Watching hanya untuk anime dan Reading hanya untuk manga? Bagaimana nilai status dalam API?
2. Apakah perubahan antarstatus bebas (misalnya Completed kembali ke Watching)?
3. Apakah memilih Completed otomatis mengisi progres hingga total?
4. Bagaimana penanganan kegagalan simpan status?
5. Apa kode respons dan pesan saat mengubah tracker milik akun lain?
6. Apa respons API untuk status yang tidak valid?

**Jawaban/keputusan tim:** Belum diterima.  
**Sumber keputusan / tanggal:** —

### US-004 — Tambah Progres +1

**Yang sudah jelas:** Menekan +1 menaikkan progres satu angka (misalnya 4 menjadi 5) dan menyimpannya. **AC negatif sudah menjelaskan:** jika penyimpanan gagal, angka dikembalikan ke nilai sebelumnya dan pesan error muncul.

**Celah yang masih perlu diklarifikasi:**
1. Apa yang terjadi jika progres sudah mencapai total episode/chapter?
2. Bagaimana jika total episode/chapter belum diketahui?
3. Bagaimana penanganan klik +1 berulang dengan cepat?
4. Apakah status otomatis menjadi Completed saat progres mencapai total?
5. Apa status HTTP dan format error bila penambahan progres ditolak?

**Jawaban/keputusan tim:** Belum diterima untuk pertanyaan terbuka di atas.  
**Sumber keputusan / tanggal:** —

### US-009 — Dashboard / Daftar Tracker

**Yang sudah jelas:** Pengguna login bisa melihat tracker miliknya dan memfilter menurut status. Akses terhadap tracker milik pengguna lain harus ditolak.

**Celah yang perlu diklarifikasi:**
1. Status apa saja yang tersedia untuk filter?
2. Apa empty state jika pengguna belum memiliki tracker?
3. Bagaimana urutan item tracker ditentukan?
4. Apakah tersedia filter Anime/Manga selain filter status?
5. Bagaimana daftar yang panjang ditampilkan (pagination/infinite scroll/dll.)?
6. Apa pesan jika pengambilan tracker gagal?
7. Apa kode respons bila belum login atau mencoba membaca data orang lain?

**Jawaban/keputusan tim:** Belum diterima.  
**Sumber keputusan / tanggal:** —

### US-005 — Komentar

**Yang sudah jelas:** Pengguna dapat menulis komentar pada halaman detail. Ini fitur Should Have Sprint 2. **AC rinci belum ada dalam PRD dan direncanakan saat Sprint Planning.**

**Celah yang perlu diklarifikasi saat perencanaan Sprint 2:**
1. Berapa batas karakter komentar?
2. Apakah komentar kosong atau hanya spasi ditolak?
3. Bagaimana validasi dan keamanan isi komentar?
4. Bagaimana urutan komentar?
5. Apakah pengunjung tanpa login boleh membaca komentar?
6. Apakah komentar dapat diedit/dihapus oleh pemiliknya?
7. Apa respons untuk pengguna belum login atau input tidak valid?

**Jawaban/keputusan tim:** Belum diterima; tunggu AC Sprint 2.  
**Sumber keputusan / tanggal:** —

### US-010 — Profil

**Yang sudah jelas:** Pengguna dapat melihat informasi akun sendiri lewat `GET /api/users/me`. Ini fitur Should Have Sprint 2. **AC rinci belum ada dalam PRD.**

**Celah yang perlu diklarifikasi saat perencanaan Sprint 2:**
1. Field profil apa saja yang harus ditampilkan?
2. Field sensitif apa saja yang tidak boleh muncul pada respons API?
3. Apa yang terjadi jika sesi sudah kedaluwarsa?
4. Apa pesan ketika profil gagal dimuat, dan apakah tersedia Retry?
5. Apakah profil hanya untuk melihat atau juga bisa diedit?
6. Bagaimana format respons sukses dan error `GET /api/users/me`?

**Jawaban/keputusan tim:** Belum diterima; tunggu AC Sprint 2.  
**Sumber keputusan / tanggal:** —

### US-011 — Dark/Light Mode

**Yang sudah jelas:** Pengguna dapat mengganti tema terang/gelap. Ini fitur Should Have Sprint 2. **AC rinci belum ada dalam PRD.**

**Celah yang perlu diklarifikasi saat perencanaan Sprint 2:**
1. Apa tema default: terang, gelap, atau mengikuti perangkat?
2. Apakah pilihan tetap tersimpan setelah refresh?
3. Apakah tema berlaku di semua halaman?
4. Apakah tema berubah otomatis mengikuti perangkat?
5. Apa standar aksesibilitas/kontras untuk kedua tema?
6. Bagaimana komponen gambar, ikon, dan elemen khusus beradaptasi?

**Jawaban/keputusan tim:** Belum diterima; tunggu AC Sprint 2.  
**Sumber keputusan / tanggal:** —

### US-006 — Manual Reminder

**Yang sudah jelas:** Pengguna dapat mengatur pengingat manual berupa notifikasi browser. Ini fitur Could Have yang dikerjakan terakhir pada Sprint 2 dan dapat dikembalikan ke Backlog jika waktu tidak cukup. **AC rinci belum ada dalam PRD.**

**Celah yang perlu diklarifikasi:**
1. Apakah Reminder akan dikerjakan dalam Sprint 2 atau ditunda?
2. Apakah harus login untuk membuat pengingat?
3. Zona waktu dan format tanggal/jam apa yang digunakan?
4. Haruskah notifikasi tetap terkirim saat browser ditutup?
5. Apa yang terjadi jika izin notifikasi ditolak?
6. Apakah reminder bisa diedit atau dihapus?
7. Apakah waktu pengingat di masa lalu ditolak?
8. Apa perilaku aplikasi jika reminder tersimpan tetapi penjadwalan notifikasi gagal?

**Jawaban/keputusan tim:** Menunggu Sprint Planning/keputusan scope Sprint 2.  
**Sumber keputusan / tanggal:** —

## Tindak lanjut klarifikasi

1. Kirim ringkasan dan tautan [Issue #63](https://github.com/aji-banyu/mojiji-animelist/issues/63) ke grup tim; minta penanggung jawab requirement menjawab.
2. Jika tim menjawab, isi bagian **Jawaban/keputusan tim** dan **Sumber keputusan / tanggal** pada User Story yang sesuai. Jangan menganggap pertanyaan sebagai AC baru sebelum diputuskan.
3. Sinkronkan status jawaban di GitHub Issue #63 dan dokumen ini.
4. Jika perubahan Acceptance Criteria disetujui, minta pemilik PRD/requirement memperbarui sumber resminya; QA tidak mengubah PRD sepihak.
5. Saat semua pertanyaan yang perlu dituntaskan pada fase ini telah memperoleh keputusan terdokumentasi, verifikasi bersama tim apakah MJ-014 memenuhi syarat Done.

**Catatan:** Detail lengkap review awal per User Story tetap tersimpan pada komentar GitHub Issue #63. Dokumen ini merangkum dan mengonsolidasikan pertanyaan untuk tindak lanjut.
