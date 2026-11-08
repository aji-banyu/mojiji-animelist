---
title: "Laporan Bootstrap & Migrasi Pertama ke Supabase Staging (MJ-066)"
sidebar_position: 7
tags: [database, staging, migration, bootstrap, docusaurus]
---

# Laporan Bootstrap & Migrasi Pertama ke Supabase Staging (MJ-066)

Dokumentasi ini mencatat hasil bootstrap dan eksekusi migrasi awal ke lingkungan Supabase *staging* (`mojiji-staging`).

## 1. Ringkasan Eksekusi Migrasi
- **Target Lingkungan:** Supabase Staging (`mojiji-staging`)
- **Metode Koneksi:** Session Pooler (Aman, via variabel environment lokal di sesi terminal, tidak disimpan dalam repo).
- **File Migrasi yang Dijalankan:**
  - `001_user_schema.sql` (Skema `user_svc` & tabel `users`)
  - `002_tracker_schema.sql` (Skema `tracker_svc` & tabel `trackers`)

## 2. Hasil Verifikasi Schema & Tabel
- Skema `user_svc` dan `tracker_svc` berhasil terpasang di Supabase Staging.
- Tabel `users` dan `trackers` beserta seluruh *constraint*, *index*, dan tipe data `TIMESTAMPTZ` telah diverifikasi melalui Table Editor dan terkonfirmasi valid.
- Backup awal (*pg_dump*) telah diamankan di penyimpanan lokal luar repositori sebagai *restore point*.

## 3. Status Handoff
- Bootstrap staging manual sekali via Session Pooler selesai. 
- Selanjutnya, migrasi otomatis akan ditangani oleh sistem *deploy/pipeline* saat *merge* ke branch `develop`.
- Notifikasi HANDOFF telah diteruskan kepada tim Backend dan DevOps.