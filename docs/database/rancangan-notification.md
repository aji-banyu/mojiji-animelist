---
title: "Rancangan Schema Notification (MJ-122)"
sidebar_position: 11
tags: [database, notification, reminder, push-subscription, schema, docusaurus]
---

# Rancangan Schema Notification (`notification_svc`)

Dokumen ini berisi rancangan struktur tabel, *constraint*, *index*, serta catatan diskusi teknis dengan tim Backend untuk kebutuhan fitur pengingat rilis dan *web push notification* berdasarkan PRD Poin 17.

---

## 1. Pembagian Schema & Prinsip Arsitektur
- **Nama Schema:** `notification_svc`
- **No Cross-Service Foreign Key:** Kolom `user_id` pada skema ini bertindak sebagai referensi logis ke `user_svc.users(id)` tanpa *foreign key constraint* fisik lintas service.
- **Standar Waktu:** Seluruh kolom tanggal/waktu menggunakan tipe data `TIMESTAMPTZ` (UTC).

---

## 2. Rancangan Tabel

### A. Tabel `notification_svc.reminders`
Menyimpan jadwal pengingat rilis anime/manga milik pengguna yang akan diproses secara berkala oleh *scheduler/worker*.

| Nama Kolom | Tipe Data | Constraint / Default | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | ID unik pengingat |
| `user_id` | `UUID` | `NOT NULL` | Referensi logis ke ID pengguna |
| `media_type` | `VARCHAR(20)` | `NOT NULL`, `CHECK (media_type IN ('anime', 'manga'))` | Jenis media yang diingatkan |
| `mal_id` | `INT` | `NOT NULL`, `CHECK (mal_id > 0)` | ID judul dari MyAnimeList |
| `title` | `VARCHAR(255)` | `NOT NULL`, `CHECK (char_length(btrim(title)) > 0)` | Judul media yang ditampilkan pada notifikasi |
| `remind_at` | `TIMESTAMPTZ` | `NOT NULL` | Waktu jadwal pemicu pengiriman pengingat |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'pending'`, `CHECK (status IN ('pending', 'sent', 'cancelled', 'failed'))` | Status pemrosesan pengingat |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Waktu pengingat dibuat |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Waktu pembaruan status terakhir |

#### Constraint & Index `reminders`
- **Check Constraint (`chk_reminders_status`):** Membatasi nilai kolom `status` hanya pada `'pending'`, `'sent'`, `'cancelled'`, dan `'failed'`.
- **Composite Index (`idx_reminders_status_remind_at`):** Dibuat pada `(status, remind_at)` untuk mengoptimalkan query *polling* worker setiap 60 detik (`WHERE status = 'pending' AND remind_at <= now()`).
- **Index Pengguna (`idx_reminders_user_id`):** Dibuat pada `(user_id)` untuk mempercepat pengambilan daftar pengingat aktif milik pengguna di halaman aplikasi.

---

### B. Tabel `notification_svc.push_subscriptions`
Menyimpan data langganan *Web Push API* perangkat/browser milik pengguna.

| Nama Kolom | Tipe Data | Constraint / Default | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | ID unik langganan push |
| `user_id` | `UUID` | `NOT NULL` | Referensi logis ke ID pengguna |
| `endpoint` | `TEXT` | `NOT NULL`, `UNIQUE` | URL Endpoint Web Push browser (unik per perangkat) |
| `p256dh` | `TEXT` | `NOT NULL`, `CHECK (char_length(btrim(p256dh)) > 0)` | Kunci publik enkripsi P256DH |
| `auth` | `TEXT` | `NOT NULL`, `CHECK (char_length(btrim(auth)) > 0)` | Kunci rahasia otentikasi Web Push |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Waktu perangkat didaftarkan |

#### Constraint & Index `push_subscriptions`
- **Unique Constraint (`uk_push_subscriptions_endpoint`):** Menjamin kolom `endpoint` bersifat unik agar tidak terjadi duplikasi pengiriman notifikasi ke browser/perangkat yang sama.
- **Index Pengguna (`idx_push_subscriptions_user_id`):** Dibuat pada `(user_id)` untuk mengambil seluruh target perangkat milik seorang pengguna saat pengingat dikirim.

---

## 3. Catatan Diskusi & Keputusan dengan Backend
- **Mekanisme Polling Worker (Interval 60 Detik):** Backend menjalankan *worker* setiap 60 detik untuk mencari pengingat yang jatuh tempo menggunakan query:
  ```sql
  SELECT id, user_id, media_type, mal_id, title, remind_at
  FROM notification_svc.reminders
  WHERE status = 'pending' AND remind_at <= now()
  ORDER BY remind_at ASC;