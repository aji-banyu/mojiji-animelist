# Laporan Review Constraint & Index Tabel User (MJ-046)

Dokumentasi ini mencakup hasil peninjauan terhadap struktur, *constraint*, dan *index* pada tabel `users` di skema `user_svc` berdasarkan kebutuhan Momiji Project.

## 1. Ringkasan Review Struktur Tabel `users`
- **Nama Skema:** `user_svc`
- **Nama Tabel:** `users`
- **Primary Key:** `id` (UUID / SERIAL)

## 2. Pengecekan Constraint & Keunikan (Constraints)
- **Email:** 
  - Wajib unik (`UNIQUE`) agar tidak ada duplikasi akun dengan email yang sama.
  - Direkomendasikan menggunakan fungsi normalisasi (misalnya `LOWER(email)`) agar penulisan huruf besar/kecil dianggap sama (case-insensitive).
- **Username:** 
  - Wajib unik (`UNIQUE`) untuk identitas profil pengguna di aplikasi.
- **Password:** 
  - Disimpan secara ketat dalam bentuk *hash* (`password_hash`), tidak boleh ada *plain text*.

## 3. Pengecekan Index
- *Index* otomatis telah terbentuk pada kolom yang memiliki constraint `UNIQUE` (pada kolom `email` dan `username`) serta *Primary Key* (`id`).
- Memastikan performa *query lookup* saat proses autentikasi (login berdasarkan email/username) berjalan cepat.

## 4. Kesimpulan & Status
- Seluruh constraint keamanan dan integritas data (unik email & username, *password hashing*, serta tipe data `TIMESTAMPTZ`) sudah sesuai dengan standar arsitektur database Momiji Project.
- Tidak ada perubahan mendesak yang memerlukan migrasi baru saat ini (struktur awal dari MJ-012 sudah memadai).