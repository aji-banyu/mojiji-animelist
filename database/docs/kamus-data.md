# Kamus Data (Data Dictionary) - Momiji Project

Dokumentasi ini mendefinisikan struktur entitas, kolom, tipe data, serta aturan bisnis untuk basis data Momiji Project berdasarkan PRD Poin 17.

## 1. Entitas USER
Menyimpan data informasi pengguna aplikasi.

| Nama Kolom | Tipe Data | Boleh Kosong? (Nullable) | Nilai Awal (Default) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | Tidak | `gen_random_uuid()` / Auto-increment | Primary Key |
| `username` | VARCHAR(50) | Tidak | - | Unik, nama pengguna |
| `email` | VARCHAR(255) | Tidak | - | Unik, surel pengguna |
| `password_hash` | VARCHAR(255) | Tidak | - | Hash kata sandi |
| `created_at` | TIMESTAMPTZ | Tidak | `NOW()` | Waktu pembuatan akun |

---

## 2. Entitas TRACKER
Menyimpan daftar pantauan anime/manga pengguna yang bersumber dari MyAnimeList (Tenrai API).

| Nama Kolom | Tipe Data | Boleh Kosong? (Nullable) | Nilai Awal (Default) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | Tidak | `gen_random_uuid()` / Auto-increment | Primary Key |
| `user_id` | UUID / INT | Tidak | - | Referensi ke `USER.id` (tanpa foreign key fisik lintas service) |
| `media_type` | VARCHAR(20) | Tidak | - | Jenis media (`anime` atau `manga`) |
| `mal_id` | INT | Tidak | - | ID judul dari MyAnimeList |
| `title` | VARCHAR(255) | Tidak | - | Judul anime/manga |
| `image_url` | TEXT | Ya | - | Tautan gambar poster/cover |
| `total` | INT | Ya | `0` | Total episode/chapter |
| `status` | VARCHAR(50) | Tidak | `'plan_to_watch'` / `'reading'` / dll | Status tonton/baca |
| `progress` | INT | Tidak | `0` | Progress saat ini |
| `updated_at` | TIMESTAMPTZ | Tidak | `NOW()` | Waktu pembaruan terakhir |

---

## 3. Entitas COMMENT
Menyimpan ulasan atau komentar pengguna terhadap suatu judul anime/manga.

| Nama Kolom | Tipe Data | Boleh Kosong? (Nullable) | Nilai Awal (Default) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | Tidak | `gen_random_uuid()` / Auto-increment | Primary Key |
| `user_id` | UUID / INT | Tidak | - | Referensi ke `USER.id` |
| `username` | VARCHAR(50) | Tidak | - | Denormalisasi username pengomentar |
| `media_type` | VARCHAR(20) | Tidak | - | Jenis media (`anime` atau `manga`) |
| `mal_id` | INT | Tidak | - | ID judul MyAnimeList |
| `content` | TEXT | Tidak | - | Isi komentar |
| `created_at` | TIMESTAMPTZ | Tidak | `NOW()` | Waktu komentar dibuat |

---

## 4. Entitas REMINDER
Menyimpan pengingat jadwal rilis anime/manga bagi pengguna.

| Nama Kolom | Tipe Data | Boleh Kosong? (Nullable) | Nilai Awal (Default) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | Tidak | `gen_random_uuid()` / Auto-increment | Primary Key |
| `user_id` | UUID / INT | Tidak | - | Referensi ke `USER.id` |
| `media_type` | VARCHAR(20) | Tidak | - | Jenis media (`anime` atau `manga`) |
| `mal_id` | INT | Tidak | - | ID judul MyAnimeList |
| `title` | VARCHAR(255) | Tidak | - | Judul media yang diingatkan |
| `remind_at` | TIMESTAMPTZ | Tidak | - | Waktu pemicu pengingat |
| `status` | VARCHAR(20) | Tidak | `'active'` / `'sent'` | Status pengingat |

---

## 5. Entitas PUSH_SUBSCRIPTION
Menyimpan langganan web push notification per pengguna.

| Nama Kolom | Tipe Data | Boleh Kosong? (Nullable) | Nilai Awal (Default) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | Tidak | `gen_random_uuid()` / Auto-increment | Primary Key |
| `user_id` | UUID / INT | Tidak | - | Referensi ke `USER.id` |
| `endpoint` | TEXT | Tidak | - | URL Endpoint Web Push |
| `p256dh` | TEXT | Tidak | - | Kunci enkripsi P256DH |
| `auth` | TEXT | Tidak | - | Kunci otentikasi |

---

## Aturan Bisnis & Arsitektur Database
1. **Unik Tracker:** Satu pengguna hanya boleh memiliki satu data tracker untuk satu judul yang sama (Kombinasi unik: `user_id + media_type + mal_id`).
2. **Kunci Unik Pengguna:** Kolom `email` dan `username` pada entitas `USER` bersifat unik dan tidak boleh kembar.
3. **Pemisahan Layanan (No Cross-Service Foreign Key):** Setiap service memiliki skema database yang terpisah. Oleh karena itu, kolom `user_id` pada tabel lain hanya berfungsi sebagai referensi logis tanpa relasi *Foreign Key* fisik antar service.
4. **Standar Waktu:** Seluruh kolom waktu/tanggal wajib menggunakan tipe data `TIMESTAMPTZ` (Timestamp with Time Zone).
5. **Sumber Data Eksternal:** Data lengkap anime/manga tidak disimpan secara lokal, melainkan diambil secara dinamis melalui Tenrai API berdasarkan `mal_id` dari MyAnimeList.