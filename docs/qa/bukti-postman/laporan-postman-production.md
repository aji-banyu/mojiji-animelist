# Laporan Pengujian Postman Core API MVP — Environment Production

> **Tiket:** MJ-104 | **Minggu:** 8 (Sprint 1 MVP) | **Role:** QA (Nadia)  
> **Environment:** MOJIJI Production (`https://mojiji.web.id`)  
> **Koleksi Postman:** `tests/api/MOJIJI-MVP.postman_collection.json`  
> **Environment File:** `tests/api/MOJIJI-production.postman_environment.json`  
> **Tanggal Eksekusi:** 8 November 2026  
> **Hasil Akhir:** **12/12 PASS (100% LULUS)**  

---

## 1. Parameter Eksekusi

| Parameter | Nilai |
|---|---|
| **Target Environment** | Production Live |
| **Base URL** | `https://mojiji.web.id` |
| **Akun Uji** | Akun Demo Resmi (`demo.user@mojiji.web.id`), Tanpa Data Pribadi |
| **Total Request** | 12 Request (Health, Auth, Catalog, Tracker) |
| **Status Akhir** | **ALL PASS** (0 Failed / 0 Blocked) |
| **Protokol Keamanan** | HTTPS Terverifikasi (Caddy Auto-SSL) |
| **Database** | Supabase Production Terpisah |
| **Cache Store** | Upstash Redis Production (Prefix `mojiji_prod:`) |

---

## 2. Matriks Hasil Pengujian Endpoint Inti (Production)

| No | Modul / Folder | Nama Request | Method & Endpoint | HTTP Status | Response Time | Status |
|:--:|:---|:---|:---|:---:|:---:|:---:|
| 1 | **Health** | GET API Gateway Health | `GET /api/health` | 200 OK | 21 ms | **PASS** |
| 2 | **Auth & Users** | POST Register | `POST /api/auth/register` | 201 Created | 195 ms | **PASS** |
| 3 | **Auth & Users** | POST Login | `POST /api/auth/login` | 200 OK | 170 ms | **PASS** |
| 4 | **Auth & Users** | GET /api/users/me | `GET /api/users/me` | 200 OK | 38 ms | **PASS** |
| 5 | **Catalog** | GET Search Anime | `GET /api/catalog/search?type=anime&q=naruto` | 200 OK | 280 ms | **PASS** |
| 6 | **Catalog** | GET Detail Anime | `GET /api/catalog/anime/20` | 200 OK | 68 ms | **PASS (Cache HIT)** |
| 7 | **Tracker** | POST Create Tracker | `POST /api/tracker` | 201 Created | 98 ms | **PASS** |
| 8 | **Tracker** | GET List Tracker | `GET /api/tracker` | 200 OK | 55 ms | **PASS** |
| 9 | **Tracker** | POST Increment Progress (+1) | `POST /api/tracker/{{trackerId}}/increment` | 200 OK | 82 ms | **PASS** |
| 10 | **Tracker** | PATCH Update Status | `PATCH /api/tracker/{{trackerId}}/status` | 200 OK | 76 ms | **PASS** |
| 11 | **Tracker** | DELETE Tracker Item | `DELETE /api/tracker/{{trackerId}}` | 200 OK | 69 ms | **PASS** |
| 12 | **Auth & Users** | POST Logout | `POST /api/auth/logout` | 200 OK | 30 ms | **PASS** |

---

## 3. Verifikasi Kriteria Keberhasilan (Success Criteria PRD)

- [x] **Pemisahan Lingkungan:** Pengujian menggunakan `baseUrl` produksi `https://mojiji.web.id`, data terisolasi dari database staging.
- [x] **Tanpa Data Pribadi:** Pengujian hanya menggunakan kredensial akun demo sesuai aturan kepatuhan QA.
- [x] **Core API Stabil:** Semua 12 endpoint inti MVP (Health, Auth, Catalog, Tracker) mengembalikan status code 200/201 yang valid.
- [x] **NFR Kecepatan Cache:** Respons detail anime ID 20 berkecepatan **68 ms** (< 300 ms target PRD).
- [x] **Status Rilis:** Core API MVP di Production terbukti siap melayani pengguna nyata saat sesi demo UTS.

