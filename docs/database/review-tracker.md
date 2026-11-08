---
title: "Laporan Review Constraint & Index Tabel Tracker (MJ-067)"
sidebar_position: 8
tags: [database, tracker, review, constraint, index, docusaurus]
---

# Laporan Review Constraint & Index Tabel Tracker (MJ-067)

Dokumentasi ini mencatat implementasi dan pengujian *constraint* serta *index* pada tabel `trackers` di skema `tracker_svc`.

## 1. Implementasi Migrasi (003)
- **File Migrasi:** `003_add_tracker_constraints.sql`
- **Constraint Unik:** Menambahkan `uk_tracker_user_media` pada kombinasi `(user_id, media_type, mal_id)` untuk mencegah data ganda.
- **Check Constraint:** Memastikan `progress >= 0` dan batasan `status` hanya menerima 5 nilai valid (`PLAN_TO_WATCH`, `WATCHING`, `COMPLETED`, `DROPPED`, `PAUSED`).
- **Index Performa:** Membuat *composite index* `idx_trackers_user_status` pada kolom `(user_id, status)` untuk optimalisasi kueri *dashboard*.

## 2. Hasil Pengujian (Testing)
- Pengujian `INSERT` data duplikat berhasil ditolak oleh database (*Unique Constraint Violation*).
- Pengujian nilai `progress` negatif atau status di luar ketentuan berhasil dicegah (*Check Constraint Violation*).
- Migrasi sukses diterapkan pada lingkungan lokal dan Supabase Staging.

## 3. Status Handoff
- Constraint dan index telah disetujui bersama tim Backend.