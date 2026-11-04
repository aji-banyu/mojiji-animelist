# Database Guidelines & Migration Rules (Momoji Project)

Dokumentasi ini menetapkan standar operasional pengelolaan basis data untuk memastikan konsistensi, keamanan, dan kemudahan pemeliharaan di seluruh lingkungan (*development*, *staging*, *production*).

## 1. Aturan Penamaan & Pembuatan Migration
- **Format Penamaan:** Setiap file migrasi baru wajib menggunakan penomoran urut berbasis angka tiga digit dengan deskripsi singkat (*snake_case*).
  - Contoh: `001_create_user_schema.sql`, `002_create_tracker_schema.sql`.
- **Urutan Eksekusi:** File migrasi harus dieksekusi secara berurutan sesuai nomor urutnya untuk menjaga integritas dependensi antartabel.
- **Mekanisme Rollback:** Setiap file migrasi *DDL* (pembuatan tabel/skema) harus didampingi atau didokumentasikan dengan skrip kebalikannya (`DROP TABLE IF EXISTS` / `DROP SCHEMA IF EXISTS`) jika diperlukan pemulihan darurat.

## 2. Pembagian Schema per Microservice
- Arsitektur basis data menerapkan prinsip *logical schema separation* guna mendukung pemisahan batas layanan (*microservices boundaries*).
- Setiap service memiliki skema independennya sendiri:
  - `user_service`: Menangani entitas terkait pengguna (`users`, dll).
  - `tracker_service`: Menangani entitas pelacakan media (`trackers`, dll).
- **Larangan Hard Foreign Key Antar Service:** Tidak diperkenankan membuat *foreign key constraint* lintas skema/service yang berbeda untuk menjaga kısılan dan independensi antar-service. Relasi antar-service dikelola secara logis di level aplikasi.

## 3. Larangan Mengubah Skema Lewat Dashboard Supabase
- **Strict Rule:** Dilarang keras melakukan perubahan struktur basis data (seperti membuat tabel baru, mengubah tipe data kolom, menghapus kolom, atau mengubah constraint) secara manual melalui GUI Dashboard Supabase di lingkungan *Staging* maupun *Production*.
- Semua perubahan skema **wajib** melalui berkas migrasi (`database/migrations/`) yang di-commit ke Git, agar riwayat perubahan terdokumentasi dan dapat direplikasi dengan presisi.    