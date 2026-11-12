---
title: "Panduan & Ringkasan Bukti Uji Postman Core API"
sidebar_position: 1
tags: [qa, postman, core-api, test-evidence]
---

# Bukti Uji Postman Core API MVP (Tiket MJ-104)

> **Folder:** `docs/qa/bukti-postman/`  
> **Tiket:** MJ-104 | **Minggu:** 8 (Milestone UTS) | **Role:** QA (Nadia)  
> **Status:** **ALL PASS (Staging & Production)**  

---

## 1. Daftar Dokumen Bukti Uji

1. **[Laporan Postman Staging](laporan-postman-staging.md):**  
   Hasil pengujian 12 endpoint inti Core API terhadap `https://staging.mojiji.web.id` (Hasil: 12/12 PASS).
2. **[Laporan Postman Production](laporan-postman-production.md):**  
   Hasil pengujian 12 endpoint inti Core API terhadap `https://mojiji.web.id` (Hasil: 12/12 PASS).

---

## 2. File Koleksi dan Environment

Semua artefak pengujian disimpan di folder `tests/api/`:
- **Koleksi Postman:** `tests/api/MOJIJI-MVP.postman_collection.json`
- **Environment Staging:** `tests/api/MOJIJI-staging.postman_environment.json` (`baseUrl`: `https://staging.mojiji.web.id`)
- **Environment Production:** `tests/api/MOJIJI-production.postman_environment.json` (`baseUrl`: `https://mojiji.web.id`)

---

## 3. Cara Menjalankan Ulang Koleksi

### Menggunakan Postman Desktop
1. Buka aplikasi Postman.
2. Klik tombol **Import**, pilih file koleksi `tests/api/MOJIJI-MVP.postman_collection.json` dan environment yang diinginkan (`MOJIJI-staging` atau `MOJIJI-production`).
3. Pilih environment di pojok kanan atas.
4. Klik kanan pada folder koleksi **MOJIJI MVP** $\rightarrow$ **Run collection**.
5. Pastikan urutan request: Health $\rightarrow$ Auth (Register $\rightarrow$ Login) $\rightarrow$ Users $\rightarrow$ Catalog $\rightarrow$ Tracker $\rightarrow$ Logout.

### Menggunakan Newman CLI (CI / Terminal)
```bash
# Menjalankan terhadap Staging
npx newman run tests/api/MOJIJI-MVP.postman_collection.json \
  -e tests/api/MOJIJI-staging.postman_environment.json \
  --reporters cli

# Menjalankan terhadap Production
npx newman run tests/api/MOJIJI-MVP.postman_collection.json \
  -e tests/api/MOJIJI-production.postman_environment.json \
  --reporters cli
```

