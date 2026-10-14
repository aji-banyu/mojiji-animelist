# Peta Environment & Rencana Secret MOJIJI

Dokumen ini memetakan infrastruktur dan batasan resource untuk proyek MOJIJI.

## 1. Peta Environment
| Environment | Lokasi Berjalan | Database | Cache (Redis) | Alamat / URL |
| :--- | :--- | :--- | :--- | :--- |
| **Lokal** | Laptop masing-masing | PostgreSQL (Docker Lokal) | Redis (Docker Lokal) | `http://localhost:3000` |
| **Staging** | VPS 1 GB (Branch `develop`) | Supabase Staging | Upstash Staging (`staging:`) | `https://staging.mojiji.com` |
| **Production**| VPS 1 GB (Branch `main`) | Supabase Production | Upstash Prod (`prod:`) | `https://mojiji.com` |

> **Catatan VPS:** Staging dan Production akan berjalan di satu VPS 1 GB yang sama, namun dipisah menggunakan container Docker yang berbeda.

## 2. Rencana Pengelolaan Secret
*   **Pantangan:** TIDAK BOLEH MENULIS PASSWORD ATAU TOKEN API LANGSUNG DI DALAM KODE (`.js`, `.ts`, dll).
*   **Lokal:** Gunakan file `.env` di komputer masing-masing. (Jangan pernah di-commit).
*   **VPS:** Kunci rahasia akan disimpan di dalam file `.env` tersembunyi langsung di dalam VPS.
*   **GitHub Actions:** Kunci rahasia untuk keperluan *build* akan disimpan di **GitHub Secrets**.

## 3. Batasan Free Hosting (PENTING)
Tim Backend dan DBA wajib memperhatikan batasan kuota layanan gratis berikut:
*   **VPS:** Hanya memiliki RAM 1 GB. Aplikasi harus efisien, penggunaan memori akan dipantau ketat.
*   **Supabase (Database):** Maksimal 2 project gratis (untuk Staging & Prod). Project gratis akan di-*pause* otomatis oleh Supabase jika tidak ada aktivitas selama 1 minggu.
*   **Upstash (Redis):** Maksimal 500.000 perintah (commands) per bulan. Hati-hati jangan melakukan iterasi/looping berlebihan ke Redis.
