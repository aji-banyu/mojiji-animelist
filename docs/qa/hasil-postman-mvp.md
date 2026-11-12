---
title: "Laporan Pengujian Postman Core API MVP"
sidebar_position: 2
tags: [qa, postman, newman, core-api, testing, staging, production]
---

# Laporan Pengujian Postman Core API MVP

> **Status:** **ALL PASS (100% LULUS DI STAGING & PRODUCTION)**  
> **Koleksi Postman:** `tests/api/MOJIJI-MVP.postman_collection.json`  
> **Environment File:** `tests/api/MOJIJI-staging.postman_environment.json` & `tests/api/MOJIJI-production.postman_environment.json`  
> **Referensi:** API Contract MVP (`docs/api/api-contract-mvp.md`), PRD Bab 11, 14, 20 (Success Criteria)  
> **Tiket Terkait:** MJ-087 (Pengujian Awal), MJ-097 (Bug Fix Integrasi), MJ-104 (Bukti Uji Final)  
> **Tanggal Update:** 8 November 2026  

---

## 1. Tujuan Pengujian

1. Menjalankan seluruh koleksi Postman Core API MVP terhadap environment **Staging** dan **Production**.
2. Memverifikasi seluruh endpoint inti MVP (**Health**, **Auth & Users**, **Catalog**, dan **Tracker**) beserta skenario positif dan penanganan error.
3. Menyimpan bukti uji resmi (*Test Evidence*) bahwa Core API telah teruji, stabil, dan memenuhi Success Criteria Milestone UTS Minggu 8.

---

## 2. Matriks Pengujian Koleksi Postman (Core API MVP)

| No | Modul / Folder | Nama Request | Method & Endpoint | Status Staging | Status Production | Response Time (Prod) | Status |
|:--:|:---|:---|:---|:---:|:---:|:---:|:---:|
| 1 | **Health** | GET API Gateway Health | `GET /api/health` | 200 OK | 200 OK | 21 ms | **PASS** |
| 2 | **Auth & Users** | POST Register | `POST /api/auth/register` | 201 Created | 201 Created | 195 ms | **PASS** |
| 3 | **Auth & Users** | POST Login | `POST /api/auth/login` | 200 OK | 200 OK | 170 ms | **PASS** |
| 4 | **Auth & Users** | GET /api/users/me | `GET /api/users/me` | 200 OK | 200 OK | 38 ms | **PASS** |
| 5 | **Catalog** | GET Search Anime | `GET /api/catalog/search?type=anime&q=naruto` | 200 OK | 200 OK | 280 ms | **PASS** |
| 6 | **Catalog** | GET Detail Anime | `GET /api/catalog/anime/20` | 200 OK | 200 OK | 68 ms | **PASS (Cache HIT)** |
| 7 | **Tracker** | POST Create Tracker | `POST /api/tracker` | 201 Created | 201 Created | 98 ms | **PASS** |
| 8 | **Tracker** | GET List Tracker | `GET /api/tracker` | 200 OK | 200 OK | 55 ms | **PASS** |
| 9 | **Tracker** | POST Increment Progress (+1) | `POST /api/tracker/{{trackerId}}/increment` | 200 OK | 200 OK | 82 ms | **PASS** |
| 10 | **Tracker** | PATCH Update Status | `PATCH /api/tracker/{{trackerId}}/status` | 200 OK | 200 OK | 76 ms | **PASS** |
| 11 | **Tracker** | DELETE Tracker Item | `DELETE /api/tracker/{{trackerId}}` | 200 OK | 200 OK | 69 ms | **PASS** |
| 12 | **Auth & Users** | POST Logout | `POST /api/auth/logout` | 200 OK | 200 OK | 30 ms | **PASS** |

---

## 3. Ringkasan Eksekusi & Test Evidence

| Parameter | Environment Staging | Environment Production |
|---|---|---|
| **Base URL** | `https://staging.mojiji.web.id` | `https://mojiji.web.id` |
| **Total Request Dieksekusi** | 12 Request | 12 Request |
| **Tingkat Kelulusan (Pass Rate)** | **100% (12/12 PASS)** | **100% (12/12 PASS)** |
| **Status Auth & Tracker** | Active & Terverifikasi | Active & Terverifikasi |
| **Bukti Uji Rinci** | [Laporan Staging](bukti-postman/laporan-postman-staging.md) | [Laporan Production](bukti-postman/laporan-postman-production.md) |

---

## 4. Evaluasi Performa Cache Redis (NFR)

Pengujian berulang pada endpoint katalog membuktikan efektivitas Redis Cache (Upstash) di Production:

| Endpoint | Waktu Respons (Cache HIT) | Standar PRD (NFR) | Status |
|---|:---:|:---:|:---:|
| `GET /api/catalog/anime/20` | **68 ms** | $< 300$ ms | **MEMENUHI** |
| `GET /api/catalog/manga/11` | **72 ms** | $< 300$ ms | **MEMENUHI** |

> [!NOTE]
> Response Header `X-Cache: HIT` terkonfirmasi aktif pada respon kedua, membuktikan latensi jauh di bawah ambang batas maksimal NFR 300 ms.

---

## 5. Status Defect & Penutupan Bug

- **BUG-001 (User Service 502):** Ditutup setelah perbaikan Docker network di staging oleh DevOps (Aji). Seluruh endpoint Auth & Tracker kini normal.
- **BUG-002 (Detail 999999999 Error 500):** Ditutup setelah penambahan penanganan error `NOT_FOUND` di `catalogController.js` oleh Backend (Syafii). Endpoint merespons HTTP 404 sesuai kontrak.

---

## 6. Panduan Eksekusi Otomatis (Newman CLI)

Untuk menjalankan ulang seluruh rangkaian pengujian Core API secara otomatis:

```bash
# Menjalankan terhadap Staging
npx newman run tests/api/MOJIJI-MVP.postman_collection.json \
  -e tests/api/MOJIJI-staging.postman_environment.json

# Menjalankan terhadap Production
npx newman run tests/api/MOJIJI-MVP.postman_collection.json \
  -e tests/api/MOJIJI-production.postman_environment.json
```
