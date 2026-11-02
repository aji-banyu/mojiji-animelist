# Laporan Analisis Performa Query Dashboard (MJ-082)

## 1. Tujuan
Memeriksa efisiensi dan performa query dashboard yang memfilter berdasarkan `user_id` dan `status` pada tabel `tracker_service.trackers` menggunakan 5.000 data dummy.

## 2. Lingkungan Uji
- **Database**: PostgreSQL (Docker Local)
- **Jumlah Data**: 5.000 baris `tracker_service.trackers`
- **Query Uji**:
  ```sql
  EXPLAIN ANALYZE 
  SELECT * FROM tracker_service.trackers 
  WHERE user_id = '00000000-0000-0000-0000-000000000000' AND status = 'WATCHING';