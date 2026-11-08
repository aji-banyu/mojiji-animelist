---
title: "Dokumentasi Skema MVP Database (MJ-084)"
sidebar_position: 10
tags: [database, mvp, schema, erd, docusaurus]
---

# Dokumentasi Skema MVP Database

Dokumentasi kamus data, diagram ERD sederhana, dan riwayat migrasi untuk tabel `users` dan `trackers`.

## 1. Kamus Data (Data Dictionary)

### A. Tabel `auth.users` / `user_service.users`
| Nama Kolom | Tipe Data | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID unik untuk setiap pengguna |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Alamat email pengguna |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Waktu pembuatan akun |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Waktu pembaruan akun terakhir |

### B. Tabel `tracker_service.trackers`
| Nama Kolom | Tipe Data | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID unik untuk setiap item tracker |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Foreign Key pemilik tracker |
| `title` | VARCHAR(255) | NOT NULL | Judul entri tracker (misal: nama anime) |
| `status` | VARCHAR(50) | NOT NULL, CHECK (status IN ('WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'PLAN_TO_WATCH')) | Status progres tracker |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Waktu entri ditambahkan |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Waktu entri diperbarui |

### Index pada Tabel `trackers`
- `idx_trackers_user_status` ON `tracker_service.trackers(user_id, status)`: Mempercepat query filter dashboard berdasarkan user dan status.

---

## 2. Diagram Relasi Sederhana (ERD)

```mermaid
erDiagram
    USERS ||--o{ TRACKERS : "owns"
    
    USERS {
        uuid id PK
        string email
        timestamptz created_at
        timestamptz updated_at
    }

    TRACKERS {
        uuid id PK
        uuid user_id FK
        string title
        string status
        timestamptz created_at
        timestamptz updated_at
    }
}

---

## 3. Daftar Migrasi Bernomor

| No. Migrasi | Nama File Migrasi | Tanggal Dijalankan | Deskripsi Perubahan |
| :--- | :--- | :--- | :--- |
| `001` | `001_create_users_table.sql` | 2026-10-01 | Inisialisasi tabel users untuk manajemen pengguna |
| `002` | `002_create_trackers_table.sql` | 2026-10-05 | Inisialisasi tabel trackers dan relasi foreign key |
| `003` | `003_add_constraints_and_indexes.sql` | 2026-10-10 | Penambahan check constraint status dan index composite `idx_trackers_user_status` (MJ-067) |