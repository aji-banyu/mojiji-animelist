# Laporan Pengujian MJ-087 — Pengujian Koleksi Postman Core API MVP

> **Tiket:** MJ-087 | **Minggu:** 7 | **Role:** QA (Nadia)  
> **Environment:** MOJIJI Staging (`https://staging.mojiji.web.id`)  
> **Koleksi Postman:** `tests/api/MOJIJI-MVP.postman_collection.json`  
> **Environment File:** `tests/api/MOJIJI-staging.postman_environment.json`  
> **Referensi:** API Contract MVP (`docs/api/api-contract-mvp.md`), PRD Bab 11, 14, 20 (Success Criteria)  
> **Status:** Partial — Catalog DONE | Auth & Tracker BLOCKED (User Service offline)  
> **Tanggal Eksekusi:** 4 November 2026  

---

## 1. Tujuan Pengujian

1. Menjalankan seluruh koleksi Postman Core API MVP secara manual terhadap environment Staging.
2. Memverifikasi seluruh endpoint inti MVP (**Health**, **Auth & Users**, **Catalog**, dan **Tracker**) beserta skenario positif dan negatif/error handling.
3. Menyimpan bukti uji resmi (*Test Evidence*) bahwa Core API telah teruji dan siap menyongsong rilis MVP di **Minggu 8 (UTS)**.

---

## 2. Matriks Pengujian Koleksi Postman (Core API MVP)

| Folder / Modul | Nama Request | Method & Endpoint | HTTP Status Aktual | Response Time | Status |
|---|---|---|:---:|:---:|:---:|
| **Health** | GET API Gateway Health | `GET /api/health` | 200 | — | **PASS** |
| **Auth & Users** | POST Register | `POST /api/auth/register` | 502 | — | **BLOCKED** |
| **Auth & Users** | POST Login | `POST /api/auth/login` | 502 | — | **BLOCKED** |
| **Auth & Users** | GET /api/users/me | `GET /api/users/me` | 502 | — | **BLOCKED** |
| **Auth & Users** | POST Logout | `POST /api/auth/logout` | 502 | — | **BLOCKED** |
| **Catalog** | GET Search Manga Naruto | `GET /api/catalog/search?type=manga&q=Naruto` | 200 | 8.350 ms | **PASS** |
| **Catalog** | GET Search No Results | `GET /api/catalog/search?type=anime&q=zzzxxyyqq123456` | 200 | 3.100 ms | **PASS** |
| **Catalog** | GET Search Simulasi Error | `GET /api/catalog/search?type=anime&q=simulasierror502` | 200 | 935 ms | **PASS** |
| **Catalog** | GET Detail Anime (ID 20) | `GET /api/catalog/anime/20` | 200 | 266 ms | **PASS** |
| **Catalog** | GET Detail Manga (ID 11) | `GET /api/catalog/manga/11` | 200 | 72 ms | **PASS** |
| **Catalog** | GET Detail Not Found | `GET /api/catalog/anime/999999999` | ~~500~~ | 599 ms | **FAIL (BUG-002)** |
| **Catalog** | GET Detail ID Invalid (0) | `GET /api/catalog/anime/0` | 400 | 302 ms | **PASS** |
| **Tracker** | GET / POST / PATCH / DELETE | Semua endpoint tracker | 401 | — | **BLOCKED** |

---

## 3. Ringkasan Eksekusi

| Parameter | Nilai |
|---|---|
| **Environment** | MOJIJI Staging |
| **Base URL** | `https://staging.mojiji.web.id` |
| **Catalog Endpoints Diuji** | 7 request |
| **Catalog PASS** | 6 |
| **Catalog FAIL** | 1 (TC-009 → HTTP 500, expected 404) |
| **Auth & Tracker** | BLOCKED — User Service offline (BUG-001) |

---

## 4. Temuan Bug dari MJ-087

### BUG-001 — User Service Offline (BLOCKER)

| Field | Nilai |
|---|---|
| **Severity** | High / Blocker |
| **Endpoint** | Semua endpoint `/api/auth/*` dan `/api/users/*` |
| **HTTP Status Aktual** | `502 Bad Gateway` |
| **Pesan** | `"User Service tidak dapat dihubungi atau sedang offline."` |
| **Dampak** | Seluruh pengujian Auth dan Tracker tidak dapat dijalankan |
| **Assigned To** | Backend (Syafii) / DevOps (Aji) |

### BUG-002 — TC-009: Detail ID Tidak Ditemukan Mengembalikan HTTP 500

| Field | Nilai |
|---|---|
| **Severity** | Medium |
| **Endpoint** | `GET /api/catalog/anime/999999999` |
| **HTTP Status Aktual** | `500 Internal Server Error` |
| **HTTP Status yang Diharapkan** | `404 Not Found`, `error.code: "NOT_FOUND"` |
| **Penyebab Terduga** | Catalog Service tidak menangkap kondisi null/undefined dari Tenrai API untuk ID yang sangat besar. Respons Tenrai mungkin berformat tidak terduga dan tidak cocok dengan pengecekan `NOT_FOUND`. |
| **Assigned To** | Backend (Syafii) |

---

## 5. Observasi Performa Cache Redis

Dua endpoint menunjukkan waktu respons **sangat cepat**, mengindikasikan Cache Hit Redis Upstash:

| Endpoint | Response Time | Indikasi |
|---|:---:|---|
| `GET /api/catalog/anime/20` | **266 ms** | Mendekati Cache Hit (<300 ms) |
| `GET /api/catalog/manga/11` | **72 ms** | Cache Hit Redis terkonfirmasi |

> **Catatan NFR:** Target PRD Bab 19 untuk cache hit adalah < 300 ms. Kedua request detail di atas memenuhi target tersebut. Verifikasi `X-Cache: HIT` pada tab Headers Postman diperlukan sebagai bukti formal.

---

## 6. Catatan & Tindak Lanjut QA

1. **BUG-001 (Blocker):** Pengujian Auth (Register, Login, Logout) dan **seluruh Tracker** tidak dapat dilanjutkan sampai `user-service` dipulihkan oleh DevOps. Minta tim restart container di VPS Staging.
2. **BUG-002 (Medium):** Laporkan ke Backend (Syafii) agar menambahkan penanganan kasus ID tidak ditemukan (`null check` atau tangkap error 404 dari Tenrai) di `catalogController.js`.
3. **Retest Schedule:** Setelah kedua bug diperbaiki, jalankan ulang TC-009 dan seluruh suite Auth & Tracker untuk verifikasi (*retest*).
