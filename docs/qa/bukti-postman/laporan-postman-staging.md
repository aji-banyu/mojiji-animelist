# Laporan Pengujian Postman Core API MVP — Environment Staging

> **Tiket:** MJ-104 | **Minggu:** 8 (Sprint 1 MVP) | **Role:** QA (Nadia)  
> **Environment:** MOJIJI Staging (`https://staging.mojiji.web.id`)  
> **Koleksi Postman:** `tests/api/MOJIJI-MVP.postman_collection.json`  
> **Environment File:** `tests/api/MOJIJI-staging.postman_environment.json`  
> **Tanggal Eksekusi:** 8 November 2026  
> **Hasil Akhir:** **12/12 PASS (100% LULUS)**  

---

## 1. Parameter Eksekusi

| Parameter | Nilai |
|---|---|
| **Target Environment** | Staging |
| **Base URL** | `https://staging.mojiji.web.id` |
| **Total Request** | 12 Request (Health, Auth, Catalog, Tracker) |
| **Status Akhir** | **ALL PASS** (0 Failed / 0 Blocked) |
| **User Service Status** | Active & Online (Bug 502 terselesaikan) |
| **Upstream Provider** | Tenrai API Connected & Active |
| **Database** | Supabase Staging Connected |
| **Cache Store** | Upstash Redis Connected |

---

## 2. Matriks Hasil Pengujian Endpoint Inti (Staging)

| No | Modul / Folder | Nama Request | Method & Endpoint | HTTP Status | Response Time | Status |
|:--:|:---|:---|:---|:---:|:---:|:---:|
| 1 | **Health** | GET API Gateway Health | `GET /api/health` | 200 OK | 24 ms | **PASS** |
| 2 | **Auth & Users** | POST Register | `POST /api/auth/register` | 201 Created | 215 ms | **PASS** |
| 3 | **Auth & Users** | POST Login | `POST /api/auth/login` | 200 OK | 180 ms | **PASS** |
| 4 | **Auth & Users** | GET /api/users/me | `GET /api/users/me` | 200 OK | 45 ms | **PASS** |
| 5 | **Catalog** | GET Search Anime | `GET /api/catalog/search?type=anime&q=naruto` | 200 OK | 310 ms | **PASS** |
| 6 | **Catalog** | GET Detail Anime | `GET /api/catalog/anime/20` | 200 OK | 85 ms | **PASS (Cache HIT)** |
| 7 | **Tracker** | POST Create Tracker | `POST /api/tracker` | 201 Created | 110 ms | **PASS** |
| 8 | **Tracker** | GET List Tracker | `GET /api/tracker` | 200 OK | 62 ms | **PASS** |
| 9 | **Tracker** | POST Increment Progress (+1) | `POST /api/tracker/{{trackerId}}/increment` | 200 OK | 95 ms | **PASS** |
| 10 | **Tracker** | PATCH Update Status | `PATCH /api/tracker/{{trackerId}}/status` | 200 OK | 88 ms | **PASS** |
| 11 | **Tracker** | DELETE Tracker Item | `DELETE /api/tracker/{{trackerId}}` | 200 OK | 74 ms | **PASS** |
| 12 | **Auth & Users** | POST Logout | `POST /api/auth/logout` | 200 OK | 35 ms | **PASS** |

---

## 3. Catatan Observasi Performa & Keamanan

1. **Autentikasi & Cookie Sesi:**
   - Request `POST /api/auth/login` berhasil menyuntikkan cookie `mojiji_session` (`HttpOnly`, `Secure`, `SameSite=Lax`).
   - Request berikutnya (`/api/users/me` dan `/api/tracker`) memanfaatkan cookie sesi tersebut tanpa perlu token manual di header Authorization.
2. **Efisiensi Cache Redis:**
   - `GET /api/catalog/anime/20` merespons dalam waktu **85 ms** dengan header `X-Cache: HIT`, jauh melampaui NFR target (< 300 ms).
3. **Integritas Tracker:**
   - Siklus hidup tracker (Create $\rightarrow$ Get List $\rightarrow$ Increment $+1$ $\rightarrow$ Update Status $\rightarrow$ Delete) berhasil dieksekusi secara mulus pada user session yang aktif.

