# Laporan Pengujian MJ-069 — Pencarian dan Detail Anime/Manga serta Waktu Respons Awal

> **Tiket:** MJ-069 | **Minggu:** 6 | **Role:** QA (Nadia)  
> **Environment:** MOJIJI Staging (`https://staging.mojiji.web.id`)  
> **Tools:** Postman, Chrome DevTools  
> **Referensi:** Mini PRD Revisi 4 (v1.4) US-001 & US-008, API Contract MVP (`docs/api/api-contract-mvp.md`), Skenario MVP (`docs/qa/skenario-mvp.md`)  
> **Status:** In Progress  

---

## 1. Ringkasan Eksekusi & Tabel UAT

| NO | Test Case | Skenario | Hasil Diharapkan | Hasil Aktual | Waktu Respons | Status |
|:--:|:---|:---|:---|:---|:---:|:---:|
| 1 | **TC-005a** | Search Anime "Naruto" | HTTP 200, `success: true`, data anime relevan (`malId: 20`) | HTTP 200 OK, data anime Naruto (`malId: 20`) | Req 1: 2.700 ms<br>Req 2: 209,91 ms | **PASS** |
| 2 | **TC-005b** | Search Manga "Naruto" | HTTP 200, `success: true`, data manga relevan (`malId: 11`) | HTTP 200 OK, data manga Naruto (`malId: 11`) | Req 1: 1.350 ms<br>Req 2: 1.710 ms | **PASS** |
| 3 | **TC-006** | Search No Results (`zzzxxyyqq123456`) | HTTP 200, `success: true`, `data: []`, tidak ada error server | HTTP 200 OK, `data: []`, `pagination: {}` | 602 ms | **PASS** |
| 4 | **TC-007** | Search saat Tenrai API gagal | Pesan error ramah, aplikasi tidak crash (502 / format terstandarisasi) | *Menunggu simulasi bersama Backend* | — | *Pending* |
| 5 | **TC-008a** | Detail Anime Valid (ID 20) | HTTP 200, `success: true`, detail judul, skor, sinopsis, gambar | HTTP 200 OK, data Naruto (score: 8.03, sinopsis, gambar lengkap) | 1.070 ms | **PASS** |
| 6 | **TC-008b** | Detail Manga Valid (ID 11) | HTTP 200, `success: true`, detail manga Naruto lengkap | HTTP 200 OK, data manga Naruto lengkap | 450 ms | **PASS** |
| 7 | **TC-009** | Detail ID Tidak Ditemukan (ID `999999999`) | HTTP 404, `success: false`, `code: "NOT_FOUND"`, pesan ramah | *Sedang diuji* | — | *In Progress* |
| 8 | **TC-010** | Detail saat Tenrai API gagal | Pesan error ramah, aplikasi tidak crash | *Menunggu simulasi bersama Backend* | — | *Pending* |

---

## 2. Rincian Pengujian API (Postman)

### TC-005a — Search Anime Naruto
* **Method & URL:** `GET {{baseUrl}}/api/catalog/search?type=anime&q=Naruto`
* **Headers:** `No Auth` (Publik)
* **Hasil Pengujian:**
  * Request 1: HTTP 200 OK, Response Time 2.700 ms.
  * Request 2: HTTP 200 OK, Response Time 209,91 ms.
  * Body: `success: true`, item pertama mengembalikan `id: 20`, `malId: 20`, `type: "anime"`, `title: "Naruto"`.
* **Catatan Performa:** Request kedua turun drastis ke 209,91 ms (<300 ms). Karena verifikasi cache status adalah lingkup MJ-079 (Sprint 1 Minggu 7), penurunan ini dicatat sebagai baseline respons awal.
* **Status:** PASS (Functional API).

### TC-005b — Search Manga Naruto
* **Method & URL:** `GET {{baseUrl}}/api/catalog/search?type=manga&q=Naruto`
* **Headers:** `No Auth`
* **Hasil Pengujian:**
  * Request 1: HTTP 200 OK, Response Time 1.350 ms.
  * Request 2: HTTP 200 OK, Response Time 1.710 ms.
  * Body: `success: true`, `malId: 11`, `type: "manga"`, `title: "Naruto"`.
* **Catatan Performa:** Request kedua mengalami sedikit peningkatan durasi (1.710 ms) yang didominasi oleh TCP Handshake jaringan (~1.060 ms), bukan beban komputasi backend. Secara fungsional data dan normalisasi sesuai kontrak.
* **Status:** PASS (Functional API).

### TC-006 — Search No Results
* **Method & URL:** `GET {{baseUrl}}/api/catalog/search?type=anime&q=zzzxxyyqq123456`
* **Hasil Pengujian:**
  * HTTP Status: 200 OK, Response Time: 602 ms.
  * Body: `{"success": true, "data": [], "pagination": {}}`.
  * Sistem menangani query yang tidak ditemukan dengan mengembalikan array kosong tanpa melempar error server 500.
* **Status:** PASS (Negative Case).

### TC-008a — Detail Anime Valid
* **Method & URL:** `GET {{baseUrl}}/api/catalog/anime/20`
* **Hasil Pengujian:**
  * HTTP Status: 200 OK, Response Time: 1.070 ms.
  * Body: Mengembalikan detail lengkap Naruto (skor 8.03, judul, URL cover image, sinopsis).
* **Status:** PASS (Positive Case).

### TC-008b — Detail Manga Valid
* **Method & URL:** `GET {{baseUrl}}/api/catalog/manga/11`
* **Hasil Pengujian:**
  * HTTP Status: 200 OK, Response Time: 450 ms.
  * Body: Mengembalikan detail manga Naruto (ID 11) dengan `type: "manga"`.
* **Status:** PASS (Positive Case).

### TC-009 — Detail Judul Tidak Ditemukan
* **Method & URL:** `GET {{baseUrl}}/api/catalog/anime/999999999`
* **Expected Result:** HTTP 404 Not Found, `success: false`, `code: "NOT_FOUND"`.
* **Actual Result:** *(Sedang diuji)*

### TC-007 & TC-010 — Penanganan Gangguan Upstream Tenrai
* **Kondisi:** Simulasi kegagalan koneksi ke API eksternal Tenrai saat data belum ter-cache.
* **Expected Result:** HTTP 502 / Error ramah terstandarisasi, tidak ada unhandled exception / crash.
* **Catatan:** Skenario disimulasikan bersama Backend secara terkontrol tanpa membanjiri server Tenrai asli.

---

## 3. Catatan Evaluasi & Observasi QA
1. **Target Waktu Respons (<300 ms):** Sesuai PRD Bab 19, target respons <300 ms diperuntukkan untuk request yang telah ter-cache di Redis. Pada pengujian awal (MJ-069), variasi waktu respons (209 ms - 2.700 ms) dipengaruhi oleh latensi panggilan upstream Tenrai API dan overhead jaringan (TCP/TLS handshake).
2. **Kesesuaian Kontrak API:** Struktur response body untuk `search` dan `detail` telah ternormalisasi dengan baik (`success`, `data`, `id`, `malId`, `type`, `title`).

