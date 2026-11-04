# Dokumentasi Koneksi Database (Lokal & Staging)

Dokumen ini berisi panduan dan konfigurasi koneksi database PostgreSQL/Supabase untuk lingkungan **Lokal Development** dan **Staging**, yang dapat digunakan oleh tim Backend untuk konfigurasi service dan DTO.

---

## 1. Lingkungan Lokal (Local Development)

Lingkungan lokal menggunakan **PostgreSQL** dan **Redis** yang dijalankan di dalam container Docker Compose.

### A. Format Connection String
```env
# Connection String PostgreSQL (Direct)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mojiji_dev?sslmode=disable

