# Aturan Migration Database (Momiji Project)[cite: 3]

Dokumentasi ini menetapkan standar operasional pengelolaan dan eksekusi file migrasi basis data untuk menjaga integritas di seluruh lingkungan (*development*, *staging*, *production*)[cite: 3].

## 1. Penamaan & Format File
- **Format Penamaan:** Setiap file migrasi wajib menggunakan penomoran urut berformat angka tiga digit di awal nama file (contoh: `001_create_user_schema.sql`, `002_create_tracker_schema.sql`)[cite: 3].
- **Struktur Wajib:** Setiap file migrasi wajib memuat header blok `-- migrate:up` untuk eksekusi perubahan dan `-- migrate:down` untuk prosedur *rollback*[cite: 3].
- **Prinsip Granularitas:** Satu file migrasi hanya diperuntukkan bagi satu unit perubahan struktur yang spesifik (*one migration = one change*)[cite: 3].

## 2. Integritas File Migrasi (Immutability)
- **Dilarang Edit File Lama:** File migrasi yang sudah dieksekusi di lingkungan *Staging* maupun *Production* **dilarang keras** diubah, diedit, atau dihapus[cite: 3].
- **Revisi & Perubahan:** Jika terdapat perbaikan atau penambahan struktur skema, wajib membuat file migrasi baru dengan nomor urut selanjutnya (contoh: `003_add_index_to_users.sql`)[cite: 3].

## 3. Alur Eksekusi (Migration Pipeline)
1. **Lokal (Development):** Penulisan skrip SQL, pengujian perintah `migrate up` dan `migrate down` menggunakan Docker Compose/`dbmate` lokal[cite: 3].
2. **Staging:** Eksekusi otomatis atau terverifikasi ke Supabase Staging via Session Pooler setelah Pull Request disetujui[cite: 3].
3. **Production:** Dijalankan secara otomatis melalui *pipeline* CI/CD resmi (dilarang eksekusi manual dari perangkat lokal)[cite: 3].

## 4. Larangan Perubahan Manual
- **Strict Rule:** Dilarang keras menambah, mengubah, atau menghapus skema/tabel secara manual melalui GUI Dashboard Supabase[cite: 3].
- Seluruh perubahan struktur wajib terdokumentasi dalam berkas migrasi di repositori Git agar dapat dilacak dalam riwayat versi (*version control*)[cite: 3].