# MJ-031 — Review Kejelasan Acceptance Criteria (AC)

> **Proyek:** MOJIJI — Web Tracking Anime & Manga  
> **Tiket:** MJ-031 — Review kejelasan AC dan checklist Definition of Done  
> **Role:** QA  
> **Referensi utama:** Mini PRD MOJIJI Revisi 4 (v1.4 — Docker/Migration Update), poin 13–14, 18–19; `docs/qa/pertanyaan-ac.md` (MJ-014); `docs/qa/skenario-mvp.md` (MJ-030).  
> **Status dokumen:** Draft review — **belum dibahas dan belum disetujui penulis AC**.

## 1. Tujuan dan aturan review

Memeriksa apakah setiap AC memiliki **kondisi awal (Given)**, **tindakan (When)**, dan **hasil yang dapat diamati/diverifikasi (Then)**. Jika belum cukup spesifik untuk diuji dengan konsisten, QA mencatat saran atau pertanyaan kepada penulis AC.

**Aturan:** Catatan dan saran di dokumen ini **bukan AC baru**. QA **tidak mengubah PRD atau Acceptance Criteria sendiri**. Penulis/pemilik requirement harus menyetujui perubahan lebih dulu; jika keputusan sudah dibuat, simpan sumber dan tanggalnya. Pengujian aplikasi dan API **belum dilakukan** sebagai bagian MJ-031.

## 2. Ringkasan review 14 AC resmi (7 User Story MVP)

Keterangan: **Dapat diuji** = hasil AC sudah bisa ditentukan benar/salah. **Dapat diuji; perlu persiapan** = hasilnya jelas, tetapi kondisi khusus harus disimulasikan. **Dapat diuji; perlu rincian** = perilaku inti jelas, tetapi detail input/respons/penanganan tambahan masih perlu dikonfirmasi agar pengujian konsisten.

| User Story | AC | Kondisi/tindakan/hasil yang sudah ditentukan PRD | Penilaian QA | Temuan/hal untuk dikonfirmasi |
|---|---|---|---|---|
| US-007 Register | Positive | Pengunjung mengisi username, email, password valid (minimal 8 karakter) → akun dibuat dan diarahkan ke login | Dapat diuji; perlu rincian | Format username/email dan kebijakan password di luar minimal 8 karakter belum dirinci |
| US-007 Register | Negative | Email sudah terdaftar → pendaftaran ditolak dan pesan error muncul | Dapat diuji; perlu rincian | Teks/penempatan error dan kasus username duplikat belum dirinci pada AC |
| US-002 Login | Positive | Akun tersedia, email dan password benar → masuk ke dashboard | Dapat diuji | Mekanisme sesi dapat dirujuk ke kontrak API final; AC logout belum ditulis |
| US-002 Login | Negative | Password salah → login ditolak dan pesan error muncul | Dapat diuji; perlu rincian | Format pesan dan respons API belum dirinci |
| US-001 Pencarian | Positive | Cari `Naruto`, pilih Anime atau Manga → daftar hasil Tenrai API ditampilkan | Dapat diuji; perlu rincian | Detail tampilan loading, pagination, query kosong belum dirinci |
| US-001 Pencarian | Negative | Hasil kosong **atau** Tenrai tidak terhubung dan cache kosong → pesan jelas, aplikasi tidak error | Dapat diuji; perlu persiapan | Perlu dua kondisi uji terpisah dan bantuan Backend untuk simulasi Tenrai/cache |
| US-008 Detail | Positive | Buka detail dari hasil pencarian → judul, gambar, sinopsis, skor, jumlah episode/chapter tampil | Dapat diuji; perlu rincian | Perlakuan field kosong/gambar gagal belum ditentukan |
| US-008 Detail | Negative | Judul tak ditemukan **atau** Tenrai gagal → pesan jelas, bukan layar kosong | Dapat diuji; perlu persiapan | Perlu dua kondisi uji terpisah; format pesan/retry belum dirinci |
| US-003 Status tracker | Positive | User login pilih status judul → status tersimpan dan judul tampil di dashboard sesuai status | Dapat diuji; perlu rincian | Aturan transisi status dan efek status Completed pada progress belum ditentukan |
| US-003 Status tracker | Negative | User belum login mencoba ubah status → diarahkan ke login | Dapat diuji | Jalur UI yang memicu aksi perlu dipastikan bersama Frontend |
| US-004 Progres +1 | Positive | Status Watching, progress 4, tekan +1 → angka langsung 5 dan tersimpan | Dapat diuji | Batas maksimum ketika progress mencapai total belum ditentukan |
| US-004 Progres +1 | Negative | Penyimpanan gagal ketika tekan +1 → angka kembali ke 4 dan pesan error muncul | Dapat diuji; perlu persiapan | Perlu cara simulasi kegagalan simpan tanpa mengubah data asli |
| US-009 Dashboard | Positive | User login dan punya tracker, buka dashboard → daftar miliknya tampil dan bisa difilter status | Dapat diuji; perlu rincian | Pilihan filter, urutan data, dan empty state belum ditentukan |
| US-009 Dashboard | Negative | User mencoba akses tracker orang lain → permintaan ditolak | Dapat diuji; perlu persiapan | Perlu dua akun dummy serta cara meminta resource yang bukan miliknya; respons API final perlu dikonfirmasi |

**Cakupan:** 14 AC resmi dari 7 User Story MVP. Pada MJ-030, kondisi negatif Pencarian dan Detail dipisah sehingga menjadi **16 skenario**, tanpa menambah AC resmi.

## 3. Saran untuk penulis AC (bukan keputusan)

| ID | Fitur | Saran/pertanyaan yang perlu diputuskan penulis AC | Tujuan QA | Status |
|---|---|---|---|---|
| Q-031-01 | US-007 Register | Pastikan aturan validasi username, format email, input kosong, dan username duplikat. Apakah perlu AC tambahan? | Menentukan input valid/tidak valid secara konsisten | Menunggu tanggapan |
| Q-031-02 | US-002 Login/Logout | Tambahkan/rumuskan AC logout jika masuk dalam target Sprint 1; konfirmasi tujuan navigasi dan kondisi sesi setelah logout. | Agar logout yang termasuk scope dapat diuji | Menunggu tanggapan |
| Q-031-03 | US-001 Pencarian | Tegaskan perilaku ketika kata kunci kosong, sumber cache fallback, dan bentuk pesan saat Tenrai gagal. | Menghindari perbedaan interpretasi hasil | Menunggu tanggapan |
| Q-031-04 | US-008 Detail | Tentukan tampilan ketika field Tenrai kosong atau gambar gagal dan apakah ada tindakan retry. | Menguji kasus data yang tidak lengkap secara objektif | Menunggu tanggapan |
| Q-031-05 | US-003 Status | Konfirmasi status yang valid untuk anime/manga, aturan transisi, dan apakah Completed mengubah progress. | Menghindari expected result buatan QA | Menunggu tanggapan |
| Q-031-06 | US-004 Progres | Tentukan perilaku di batas total episode/chapter, total tidak diketahui, dan klik berulang. | Mendefinisikan boundary test dengan tepat | Menunggu tanggapan |
| Q-031-07 | US-009 Dashboard | Tegaskan pilihan filter, kondisi dashboard kosong, dan respons saat akses lintas akun. | Membuat tes UI dan API bisa diverifikasi konsisten | Menunggu tanggapan |
| Q-031-08 | Fitur Sprint 2 | Tulis AC resmi US-005 (Komentar), US-010 (Profil), US-011 (Dark/Light Mode), dan US-006 (Reminder) saat Sprint Planning, sesuai PRD. | Menyiapkan dasar test case Sprint 2 | Menunggu Sprint Planning |

**Catatan tambahan:** Detail lengkap pertanyaan per User Story telah dirangkum pada `docs/qa/pertanyaan-ac.md` (MJ-014). Hindari membuat keputusan yang berbeda di dua dokumen tersebut.

## 4. Catatan Non-Functional Requirements (NFR) yang sudah terukur

Bagian ini **bukan penambahan AC fungsional**. PRD poin 19 sudah menyediakan ukuran untuk beberapa pengujian non-fungsional yang dapat dijadikan referensi pada tiket pengujian terpisah:

| NFR | Ketentuan PRD | Hal yang harus disiapkan agar dapat diverifikasi |
|---|---|---|
| Redis cache | Pencarian yang sudah berada di cache menjawab **kurang dari 300 ms** | Cara mengukur dan memastikan kondisi cache hit |
| Tenrai rate limit | Maksimal **4 permintaan/detik**; batas publik juga **120/menit per IP** | Log/metric untuk memeriksa pembatasan request bersama Backend |
| Resource server | RAM VPS di bawah **75% saat pengujian** | Bukti pengukuran RAM dari DevOps |
| Security | User hanya bisa mengakses datanya sendiri; password disimpan sebagai hash | Akun dummy terpisah; bukti pengujian yang tidak mengekspos secret |
| Error handling | Saat Tenrai bermasalah, gunakan data cache atau pesan yang ramah | Kondisi simulasi kegagalan dari Backend |

## 5. Cakupan Sprint 2 — AC belum tersedia

Mini PRD poin 14 menyebut **AC detail story setelah UTS dibuat saat Sprint Planning**. Karena itu review berikut **belum bisa diberi hasil final**:

- **US-005 — Komentar:** AC rinci belum ada.
- **US-010 — Profil:** AC rinci belum ada.
- **US-011 — Dark/Light Mode:** AC rinci belum ada.
- **US-006 — Manual Reminder:** AC rinci belum ada; fitur *Could Have* dapat ditunda berdasarkan keputusan tim di akhir Minggu 11.

Tindak lanjut: review kembali setelah pemilik requirement menerbitkan AC resmi. Jangan menulis expected result baru atas nama PRD.

## 6. Catatan diskusi dan keputusan tim

Isi tabel **setelah** review/sync dilakukan; jangan menandai selesai sebelum ada pembahasan.

| Tanggal | Dibahas bersama | Topik/ID pertanyaan | Keputusan atau jawaban | Bukti (Issue/PR/chat) | Status |
|---|---|---|---|---|---|
| — | — | — | Belum ada keputusan yang didokumentasikan dalam file ini | — | Menunggu diskusi |

### Tindak lanjut MJ-031

- [ ] Cocokkan review ini dengan jawaban terbaru MJ-014 dan hasil MJ-030.
- [ ] Kirim saran di atas ke **penulis/pemilik Acceptance Criteria**.
- [ ] Bahas catatan review pada **sync tengah minggu**, sesuai timeline MJ-031.
- [ ] Catat keputusan, tanggal, dan tautan sumber (Issue/PR/chat).
- [ ] Jika ada perubahan AC yang disetujui, minta pemilik requirement memperbarui sumber resmi; perbarui dokumen QA setelahnya.
- [ ] Minta Frontend dan Backend mengecek bagian yang berhubungan dengan UI dan API.

**Kondisi selesai tiket MJ-031:** catatan review **sudah dibahas** dan checklist Definition of Done tersedia di `docs/qa/`. Membuat file ini saja belum cukup untuk mengklaim tiket Done.
