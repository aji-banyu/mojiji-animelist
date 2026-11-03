# Laporan Pengujian MJ-085 — Pengujian Fitur Tracker (Status, +1 Progres, Dashboard, dan Keamanan Akses)

> **Tiket:** MJ-085 | **Minggu:** 7 | **Role:** QA (Nadia)  
> **Environment:** MOJIJI Staging (`https://staging.mojiji.web.id`)  
> **Tools:** Postman, Chrome DevTools  
> **Referensi:** Mini PRD Revisi 4 US-003, US-004, US-009; Skenario MVP (`docs/qa/skenario-mvp.md`); API Contract MVP (`docs/api/api-contract-mvp.md`)  
> **Status:** In Progress  

---

## 1. Ringkasan Eksekusi & Tabel UAT Tracker

| NO | Test Case | Skenario | Endpoint & Method | Hasil yang Diharapkan | Hasil Aktual | Status |
|:--:|:---|:---|:---|:---|:---|:---:|
| 1 | **TC-011a** | Tambah anime ke tracker | `POST /api/tracker` | HTTP 201 Created, metadata judul tersimpan, status `watching` | *Sedang diuji* | *In Progress* |
| 2 | **TC-011b** | Ubah status tracker | `PATCH /api/tracker/:id/status` | HTTP 200 OK, status terupdate ke `completed` | *Belum diuji* | *Not Run* |
| 3 | **TC-012** | Ubah/Akses tracker tanpa login | `GET / POST /api/tracker` (No Session) | HTTP 401 Unauthorized, diarahkan ke Login | *Belum diuji* | *Not Run* |
| 4 | **TC-013** | Tambah progres +1 | `POST /api/tracker/:id/increment` | HTTP 200 OK, progres bertambah `progress: progress + 1` | *Belum diuji* | *Not Run* |
| 5 | **TC-014** | Progres +1 saat melebihi total | `POST /api/tracker/:id/increment` | HTTP 400 Bad Request, progres tidak melebihi `totalEpisodes` | *Belum diuji* | *Not Run* |
| 6 | **TC-015** | Dashboard tracker & filter status | `GET /api/tracker—status=watching` | HTTP 200 OK, mengembalikan array judul sesuai status milik user | *Belum diuji* | *Not Run* |
| 7 | **TC-016** | Akses tracker milik user lain | `GET /api/tracker/:foreignId` | HTTP 404 Not Found, data pengguna lain tidak bocor | *Belum diuji* | *Not Run* |

---

## 2. Prasyarat Pengujian (Preconditions)
1. User telah melakukan login melalui endpoint `POST /api/auth/login` dan memiliki sesi cookie `mojiji_session` / `mj_stg_session` aktif di Postman.
2. Endpoint target adalah **MOJIJI Staging** (`https://staging.mojiji.web.id`).
3. Variabel `trackerId` disimpan otomatis di environment Postman saat `TC-011a` berhasil dijalankan.

---

## 3. Catatan Keamanan & Isolasi Data
* **Header `X-User-Id`:** Diuji bahwa API Gateway menyuntikkan ID user dari cookie sesi JWT terverifikasi, bukan dari body permintaan.
* **Isolasi Kepemilikan:** Query database wajib menyaring data `WHERE user_id = $1` untuk menjamin pengguna hanya dapat membaca dan mengubah daftar trackernya sendiri.

