# MJ-050 — Smoke Test Skeleton MOJIJI

> **Dokumen hasil eksekusi QA**. Isi berdasarkan pengujian nyata. Jangan mengubah Not Run menjadi Pass tanpa bukti.

## 1. Informasi Pengujian

| Field | Value |
|---|---|
| Ticket ID | MJ-050 |
| Tujuan | Smoke test skeleton: Compose, web, health setiap service, Register, Login |
| Acuan | Timeline MJ-050; PRD Revisi 4; API Contract MVP |
| Dependency | MJ-051, MJ-039, MJ-043 |
| Tester | [Nama QA] |
| Tanggal | [YYYY-MM-DD] |
| Environment | Local (disiapkan Backend/DevOps) / [alternatif yang disepakati] |
| Branch / Commit / Build | [isi] |
| Web URL | [konfirmasi Frontend/DevOps] |
| API baseUrl | [konfirmasi Backend/DevOps] |
| Status keseluruhan | Not Run |

## 2. Prasyarat dan Handoff

- [ ] MJ-051 (Compose dan cara menjalankan) sudah siap.
- [ ] MJ-039 (route halaman MVP) sudah siap.
- [ ] MJ-043 (Register dan koneksi DB) sudah siap.
- [ ] Backend/DevOps mengonfirmasi Compose berjalan; sertakan log/status tanpa secret.
- [ ] Frontend mengonfirmasi web berjalan dengan `npm run dev` atau URL pengujian.
- [ ] Backend memberikan URL health gateway dan **setiap service**, serta status dukungan Login.
- [ ] Postman Collection MJ-049 dapat dibuka dan `baseUrl` sesuai.
- [ ] Akun dan email dummy disiapkan tanpa mencantumkan password asli.

Jika prasyarat gagal, catat *Blocked* dan penyebabnya; jangan menyimpulkan kode rusak sebelum environment siap.

## 3. Ringkasan Hasil Smoke Test

| ID | Pemeriksaan | Cara verifikasi | Expected Result | Actual Result | Status | Evidence / Bug |
|---|---|---|---|---|---|---|
| SM-01 | Compose lokal | Lihat output `docker compose ps` dan log dari Backend/DevOps | Service yang diperlukan aktif, tidak terus-menerus restart | Belum diuji | Not Run | [link] |
| SM-02 | Gateway health | `GET {{baseUrl}}/api/health` via Postman | HTTP 200 | Belum diuji | Not Run | [link] |
| SM-03 | Health tiap service | Kirim GET ke URL health yang dikonfirmasi Backend | Seluruh endpoint health yang disepakati mengembalikan HTTP 200 | Belum diuji | Not Run | [link] |
| SM-04 | Website | Buka URL lokal yang diberikan Frontend | Halaman dasar MOJIJI muncul tanpa kegagalan fatal | Belum diuji | Not Run | [link] |
| SM-05 | Register dasar | `POST {{baseUrl}}/api/auth/register` dengan data dummy valid | Akun berhasil dibuat; sesuai PRD diarahkan ke halaman login bila diuji lewat UI. Status 201 masih usulan API Contract | Belum diuji | Not Run | [link] |
| SM-06 | Login dasar | `POST {{baseUrl}}/api/auth/login` dengan akun dummy | Kredensial valid diterima; login menuju dashboard bila diuji lewat UI. Status 200 masih usulan API Contract | Belum diuji | Not Run | [link] |

**Catatan:** Login diminta dalam langkah MJ-050, tetapi dependensi tiket hanya memastikan implementasi Register (MJ-043); konfirmasi kesiapan Login dengan Backend sebelum memberi status Fail. Endpoint health setiap service juga harus diperoleh dari Backend; jangan mengarang port/URL.

## 4. Detail Eksekusi

### SM-01 — Compose
- **Pelaksana setup:** [Backend/DevOps]
- **Waktu pemeriksaan:** [isi]
- **Langkah:** Minta bukti status container Compose dan log penting yang sudah disensor.
- **Hasil aktual:** [isi]
- **Status:** Not Run
- **Evidence:** [isi]

### SM-02 — Gateway Health
- **Method:** GET
- **Endpoint:** `{{baseUrl}}/api/health`
- **Langkah:** Pilih environment Postman yang benar; klik Send; lihat status HTTP dan Test Results.
- **Hasil aktual (status dan ringkasan response):** [isi]
- **Status:** Not Run
- **Evidence:** [isi]

### SM-03 — Health Tiap Service
| Service | URL / Endpoint yang dikonfirmasi | HTTP Status Aktual | Status QA | Evidence |
|---|---|---|---|---|
| User | [isi] | [isi] | Not Run | [link] |
| Catalog | [isi] | [isi] | Not Run | [link] |
| Tracker | [isi] | [isi] | Not Run | [link] |
| Gateway | [isi] | [isi] | Not Run | [link] |

> Daftar disesuaikan dengan service yang benar-benar tersedia pada skeleton. Jangan mengklaim semuanya lolos hanya karena health gateway lolos.

### SM-04 — Web Terbuka
- **URL dan browser:** [isi]
- **Langkah:** Akses URL dari Frontend dan pastikan halaman utama/halaman yang dijanjikan dapat ditampilkan.
- **Hasil aktual:** [isi]
- **Status:** Not Run
- **Evidence:** [isi]

### SM-05 — Register Dasar
- **Method:** POST
- **Endpoint:** `{{baseUrl}}/api/auth/register`
- **Body contoh (gunakan email dummy baru saat eksekusi):**
```json
{
  "username": "qa_smoke_001",
  "email": "qa.smoke.001@example.com",
  "password": "dummy-8plus"
}
```
- **Langkah:** Kirim request melalui Postman. Catat status HTTP dan response yang telah disensor. Pastikan tidak ada password atau `password_hash` pada response.
- **Expected Result:** Register berhasil untuk data valid; kode 201 merupakan usulan API Contract, konfirmasi sebelum menjadikannya assertion wajib.
- **Hasil aktual:** [isi]
- **Status:** Not Run
- **Evidence:** [isi]

### SM-06 — Login Dasar
- **Method:** POST
- **Endpoint:** `{{baseUrl}}/api/auth/login`
- **Body:** Kredensial akun dummy yang sebelumnya didaftarkan. Jangan simpan password aktual di evidence atau repo.
- **Langkah:** Kirim request melalui Postman dan catat status HTTP serta respon yang telah disensor.
- **Expected Result:** Login dengan kredensial benar berhasil jika implementasi Login sudah tersedia. Kode HTTP 200 adalah usulan API Contract.
- **Hasil aktual:** [isi]
- **Status:** Not Run
- **Evidence:** [isi]

## 5. Bug dan Blocker

| Item | Pemeriksaan terkait | Masalah / alasan terblokir | GitHub Issue | Pemilik / tindak lanjut | Status |
|---|---|---|---|---|---|
| [isi] | [SM-XX] | [isi] | [link / N/A] | [isi] | [isi] |

Jika menemukan kegagalan yang sudah direproduksi saat prasyarat terpenuhi, buat GitHub Issue dengan langkah reproduksi, expected result, actual result, tingkat keparahan, dan evidence. Jika belum dapat diuji karena dependency, catat sebagai *Blocked* dan hubungi pemilik tiket.

## 6. Kesimpulan dan Handoff

- **Pass:** [jumlah]
- **Fail:** [jumlah]
- **Blocked:** [jumlah]
- **Not Run:** [jumlah]
- **Status keseluruhan:** Not Run
- **Temuan utama:** [isi setelah testing]
- **Bug yang dilaporkan:** [link / N/A]
- **Tindak lanjut untuk Frontend/Backend/DevOps:** [isi]
- **Evidence utama:** [link]

**Aturan penutupan MJ-050:** Hasil benar-benar dicatat dan kegagalan yang terverifikasi dilaporkan. Jangan tulis Passed/Done tanpa melakukan pengujian dan menyimpan evidence.
