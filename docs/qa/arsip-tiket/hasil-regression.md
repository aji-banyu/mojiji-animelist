# MJ-086 — Hasil Regression Testing MVP & Verifikasi Redis Cache MOJIJI

> **Tiket:** MJ-086 — Regression MVP & Cache  
> **Status laporan:** **DRAFT / PARTIAL — BELUM QA SIGN-OFF**  
> **Tanggal penyusunan:** 3 November 2026 (WIB)  
> **Lokasi yang dituju:** `docs/qa/hasil-regression.md`  
> **Lingkup:** Register → Login → Search → Detail → Tracker; verifikasi `X-Cache` dan latensi cache hit  
> **Catatan utama:** QA menyampaikan bahwa request Catalog yang dijalankan sudah *pass*, tetapi screenshot terakhir yang tersedia hanya menunjukkan daftar request pada Postman, bukan hasil *run* seluruh skenario MJ-086. Hasil tiket sebelumnya dipakai sebagai **baseline**, tidak otomatis dianggap bukti regression run baru.

## 1. Informasi sesi

| Item | Keterangan |
|---|---|
| Tester | QA MOJIJI — **[isi nama tester]** |
| Tanggal/jam eksekusi MJ-086 | **[isi tanggal/jam aktual per run]** |
| Environment utama | **Staging** |
| URL website | `https://staging.mojiji.web.id` |
| Postman environment | `MOJIJI Staging`; `baseUrl=https://staging.mojiji.web.id` |
| Tools | Postman; Chrome/DevTools untuk pembuktian alur UI/E2E |
| Build / commit SHA yang diuji | **Belum dicatat — perlu konfirmasi DevOps** |
| Referensi AC / test case | `docs/qa/skenario-mvp.md`; API Contract MVP; Mini PRD MOJIJI Revisi 4 |
| Tiket baseline | MJ-068 (Authentication), MJ-069 (Catalog), MJ-085 (Tracker) |
| Laporan baseline | `docs/qa/hasil-auth.md`, `docs/qa/hasil-catalog.md`, `docs/qa/hasil-tracker.md` (pastikan tersedia di repo) |
| Redis cache | Mekanisme observasi menurut panduan Backend: response header `X-Cache` = `MISS`, `HIT`, atau `STALE` |
| Kriteria performa | NFR pencarian **cache HIT** < 300 ms, dengan syarat status cache benar-benar terverifikasi |

### Cara membaca status

- **PASS (terverifikasi):** Ada hasil aktual dan bukti untuk *run* MJ-086 yang sesuai Expected Result.
- **PASS baseline:** Hasil teramati pada tiket sebelumnya; **bukan** bukti MJ-086 dijalankan ulang.
- **DILAPORKAN PASS:** QA menyatakan berhasil, tetapi detail respons/evidence run MJ-086 belum dilampirkan.
- **PARTIAL / NOT VERIFIED:** Hanya sebagian komponen atau bukti tersedia.
- **BLOCKED:** Pengujian belum dapat dilakukan karena dependency atau simulasi yang aman belum tersedia.
- **FAIL:** Hanya dipakai apabila ada kegagalan aktual yang terkonfirmasi; jangan menyamakan `401`, `404`, atau `502` yang diharapkan pada tes negatif dengan bug.

## 2. Matriks Regression MVP — MJ-086

ID `REG-01` s.d. `REG-07` di bawah merupakan ID pelaporan MJ-086, **bukan** perubahan penomoran TC resmi di `skenario-mvp.md`.

| ID | Alur / cakupan | Expected Result | Hasil yang dapat ditunjukkan saat ini | Status MJ-086 | Evidence / tindak lanjut |
|---|---|---|---|---|---|
| **REG-01** | Register akun baru | Registrasi berhasil; user baru dibuat; UI mengarahkan ke Login bila menguji E2E | Baseline MJ-068: `POST /api/auth/register` **201**, `success: true`. Belum ada respons Register baru dari run MJ-086 | **PASS baseline API; NOT VERIFIED run MJ-086/UI** | Lampirkan respons Register baru (sensor password), catat user dummy, cek navigasi UI |
| **REG-02** | Login dan sesi | Login sukses, sesi bisa digunakan; UI masuk ke halaman yang benar | Baseline MJ-068: Login **200**; `/api/users/me` **200**. UI Staging sebelumnya menunjukkan **Smart Mock Staging**, sehingga integrasi autentikasi riil belum pasti | **PASS baseline API; NOT VERIFIED run MJ-086/E2E** | Login dengan akun REG-01; cek sesi, redirect, dan backend aktual |
| **REG-03** | Search Anime/Manga | Naruto muncul dengan data relevan dari Catalog | Baseline MJ-069: pencarian Naruto Anime/Manga **200**, `success: true`. QA menyampaikan seluruh request Catalog yang dicoba sudah pass; screenshot terkini hanya memperlihatkan daftar request | **DILAPORKAN PASS; evidence run MJ-086 pending** | Lampirkan HTTP status, data, tanggal, dan screenshot respons Search untuk kedua tipe |
| **REG-04** | Detail Anime/Manga | Detail judul berisi field yang diwajibkan atau penanganan nilai yang tidak ada | Baseline MJ-069: Detail Anime Naruto (`malId=20`) **200**; Manga Naruto (`malId=11`) **200**. Tidak ada screenshot detail ulang khusus MJ-086 | **PASS baseline API; NOT VERIFIED run MJ-086** | Lampirkan detail respons pada build MJ-086 yang sama |
| **REG-05** | Tracker dalam alur E2E | User yang sama dapat menambahkan judul, memperbarui status, menambah progres, melihatnya kembali; tidak bocor ke akun lain | Baseline MJ-085: Create **201**, Update **200**, Increment **200**, GET filter **200**. Namun TC-012 anonim, TC-014 rollback, TC-016 lintas akun belum terbukti; UI belum diuji menyeluruh | **PARTIAL — API baseline; E2E/otorisasi belum lengkap** | Ulangi di satu sesi alur REG-01→05; bukti persistensi, UI, dan sesi yang benar |
| **REG-06** | Redis cache MISS/HIT | Request identik menghasilkan header `X-Cache` yang sesuai kondisi cache | Belum ada screenshot/nilai `X-Cache` untuk run MJ-086; waktu respons saja bukan bukti HIT/MISS | **NOT VERIFIED** | Ambil screenshot **Response → Headers** (bukan Request Headers) pada dua request identik |
| **REG-07** | NFR latency saat cache HIT | Request yang **terbukti HIT** memenuhi waktu respons < 300 ms | Ada pengukuran baseline MJ-069, tetapi header HIT tidak tercatat. Tidak cukup untuk menyatakan NFR lulus/gagal | **NOT VERIFIED** | Catat `X-Cache`, response time, Postman Timing, dan kondisi jaringan setiap iterasi |

**Ringkasan:** Tidak ada bukti yang cukup untuk menyatakan **7/7 REG PASS** atau **MJ-086 DONE**. Ada hasil positif dari tiket-tiket sebelumnya dan laporan lisan bahwa Catalog *pass*, tetapi verifikasi ulang end-to-end serta cache masih harus dilengkapi.

## 3. Baseline teramati dari tiket sebelumnya (bukan regression run MJ-086)

### 3.1 Authentication — MJ-068 (pengujian 1 November 2026)

| Pemeriksaan | Hasil baseline | Batasan |
|---|---|---|
| Register valid | `201 Created` | API; redirect UI bukan bagian yang terverifikasi |
| Login valid | `200 OK` | API; sesi diuji lewat `/api/users/me` |
| Validasi register/login negatif | `409` duplikat, `400` password pendek, `401` password salah | Respons negatif sesuai skenario |
| Logout & invalidasi sesi | Logout `200`; akses `/api/users/me` setelahnya `401` | API/sesi |
| Pengamanan response & cookie | Password/hash tidak muncul pada body yang diuji; atribut `HttpOnly`, `Secure`, `SameSite=Lax` terlihat | Bukan audit keamanan menyeluruh |

**Total baseline MJ-068:** 9/9 pemeriksaan API/respons/cookie sesuai harapan. Ini **tidak** menetapkan hasil regresi UI MJ-086.

### 3.2 Catalog — MJ-069 (baseline yang pernah terlihat)

| Skenario | Endpoint ringkas | Hasil baseline | Durasi teramati |
|---|---|---|---|
| Search Anime Naruto — permintaan pertama | `GET /api/catalog/search—type=anime&q=Naruto` | 200; `success: true`; Naruto (`malId=20`) | **2.700 ms** |
| Search Anime Naruto — permintaan kedua | Request sama | 200; data tersedia | **209,91 ms** |
| Search Manga Naruto — permintaan pertama | `GET /api/catalog/search—type=manga&q=Naruto` | 200; Naruto (`malId=11`) | **1.350 ms** |
| Search Manga Naruto — permintaan kedua | Request sama | 200; data tersedia | **1.710 ms** |
| Search tanpa hasil | `GET /api/catalog/search—type=anime&q=zzzxxyyqq123456` | 200; `data: []` | **602 ms** |
| Detail Anime Naruto | `GET /api/catalog/anime/20` | 200; data judul/sinopsis/gambar/skor | **1.070 ms** |
| Detail Manga Naruto | `GET /api/catalog/manga/11` | 200; data judul/sinopsis/gambar/skor | **958 ms** |
| Detail ID tidak ditemukan | `GET /api/catalog/anime/999999999` | 404; `NOT_FOUND` (**sesuai expected negative test**) | **2.250 ms** |

**Pembatasan interpretasi:** Durasi di atas berasal dari sesi sebelumnya. Respons kedua lebih cepat pada Anime **tidak membuktikan** `X-Cache: HIT`, sedangkan respons kedua Manga yang lebih lambat **tidak otomatis membuktikan** kegagalan cache. Postman juga mencakup pengaruh jaringan/TCP handshake. TC-007/TC-010 (provider gagal) dilaporkan QA sudah pass bersama request Catalog lain, namun detail HTTP/evidence hasilnya belum diberikan di percakapan ini; jangan mencantumkan angka atau `PASS terverifikasi` tanpa log aktual.

### 3.3 Tracker — MJ-085 (pengujian 3 November 2026)

| Skenario | Hasil baseline | Status evidensi |
|---|---|---|
| TC-011a Create Naruto | `POST /api/tracker` → **201**; GET setelahnya menemukan record ID sama | **PASS API** |
| TC-011b Update status | `PATCH /api/tracker/{trackerId}/status` → **200**; `watching → completed`, GET filter `completed` menemukan record sama | **PASS API** |
| TC-013 Increment +1 | `POST /api/tracker/{trackerId}/increment` → **200**; `progress 1 → 2` | **PASS API untuk variasi 1→2**; bukti GET sesudahnya/UI 4→5 belum ada |
| TC-015 GET + filter | `GET /api/tracker` dan filter `watching`/`completed` → **200**, record yang sesuai terlihat | **PASS API daftar/filter**, bukan UI Dashboard |
| TC-012 tanpa Login | GET `200` ketika kemungkinan cookie akun A masih tersimpan | **NOT VERIFIED**; tes anonim/redirect belum terbukti |
| TC-014 rollback | Belum ada simulasi kegagalan penyimpanan terkontrol | **BLOCKED** |
| TC-016 isolasi akun | GET `200` menampilkan record A; identitas sesi akun B tidak dibuktikan | **INCONCLUSIVE**; jangan klaim kebocoran data atau PASS |

## 4. Prosedur khusus cache untuk MJ-086

**Acuan Backend:** `X-Cache: MISS` berarti cache belum menyediakan respons aktif; `HIT` berarti respons dilayani Redis; `STALE` berarti fallback saat upstream bermasalah. Target NFR < 300 ms berlaku untuk **cache HIT yang telah diverifikasi**.

1. Gunakan Staging dan satu endpoint Search, misalnya `GET {{baseUrl}}/api/catalog/search—type=anime&q=Naruto`.
2. Klik **Send**; catat HTTP status, Response Time, dan **Response → Headers → X-Cache**. Jangan otomatis menyebut permintaan pertama MISS; query mungkin sudah pernah di-cache.
3. Klik **Send** sekali lagi dengan parameter dan environment **identik**; catat parameter yang sama. Jangan otomatis menyebut permintaan kedua HIT tanpa header.
4. Bila header `HIT` muncul, periksa apakah waktu respons Postman < 300 ms; bila melampaui target, periksa **Timing** dan koordinasikan pengukuran sisi server/Redis dengan Backend agar efek jaringan tidak keliru dianggap latensi cache.
5. Simpan screenshot dua iterasi yang menunjukkan **URL, HTTP Status, X-Cache, Response Time, dan tanggal/build**. Jangan tampilkan cookie/token.

### Form hasil Cache — isi hanya setelah pengujian MJ-086

| Run | Type / Query | HTTP | X-Cache teramati | Response Time (ms) | Syarat NFR (<300ms saat HIT) | Evidence |
|---|---|---|---|---|---|---|
| C-01 | Anime / Naruto — iterasi 1 | Belum dicatat | **Belum dicatat** | — | Tidak dapat dinilai | — |
| C-02 | Anime / Naruto — iterasi 2 | Belum dicatat | **Belum dicatat** | — | Tidak dapat dinilai | — |
| C-03 | Manga / Naruto — iterasi 1 | Belum dicatat | **Belum dicatat** | — | Tidak dapat dinilai | — |
| C-04 | Manga / Naruto — iterasi 2 | Belum dicatat | **Belum dicatat** | — | Tidak dapat dinilai | — |

Catatan: Untuk tes `STALE`/provider error, gunakan metode fault injection pada **Local/testing terisolasi** bersama Backend; jangan mematikan Tenrai atau mengubah konfigurasi Staging publik. Hasil TC-007/TC-010 yang diperiksa pada environment lain harus mencantumkan environment tersendiri.

## 5. Bukti, sumber hasil, dan pelacakan

| Materi | Referensi / lokasi tujuan | Keadaan |
|---|---|---|
| Baseline Authentication | `docs/qa/hasil-auth.md`; `docs/qa/evidence/mj-068/` | Laporan sebelumnya tersedia; cocokkan evidence setelah commit |
| Baseline Catalog | `docs/qa/hasil-catalog.md`; `docs/qa/evidence/mj-069/` | Sejumlah screenshot respons sudah teramati; bukti TC-007/010 terkini belum dilampirkan di sesi ini |
| Baseline Tracker | `docs/qa/hasil-tracker.md`; `docs/qa/evidence/mj-085/` | Beberapa respons API teramati; cakupan negatif/UI masih parsial |
| Run REG-01–05 (ulang) | `docs/qa/evidence/mj-086/regression/` | **Belum dilampirkan sebagai run MJ-086** |
| Run C-01–C-04 (cache) | `docs/qa/evidence/mj-086/cache/` | **Belum dilampirkan** |
| GitHub Issues untuk bug | Nomor dan tautan Issue sebenarnya (jika ada) | **Belum dicatat**; jangan mengarang Issue |
| Build/commit yang diuji | SHA deployment dari DevOps | **Belum dicatat** |

> **Penting:** Path evidence di atas adalah **lokasi penyimpanan yang disarankan**, bukan klaim bahwa screenshot sudah ada di repository. File gambar harus disalin dan disensor sebelum dicommit.

## 6. Temuan / risiko / tindak lanjut

| Aspek | Masalah atau batasan yang diketahui | Penanggung jawab tindak lanjut | Status |
|---|---|---|---|
| End-to-end Login/Dashboard | Screenshot sebelumnya memuat label `Sesi Smart Mock Staging Aktif` sehingga integrasi autentikasi aktual belum terbukti | Frontend + Backend | Perlu verifikasi |
| Tracker authorization | Belum ada run dua akun yang membuktikan isolasi pada `/api/tracker`; jangan menyimpulkan vulnerability tanpa bukti sesi B | QA + Backend | Perlu uji ulang |
| Rollback UI saat gagal simpan | Belum ada metode simulasi aman | Frontend + Backend | Blocked |
| Cache MISS/HIT | Response header `X-Cache` belum dicatat | QA + Backend | Belum diverifikasi |
| NFR Cache | Pengukuran lama tidak mempunyai label HIT terverifikasi | QA + Backend | Belum dapat dinilai |
| Regression run baru | Screenshot hasil Run MJ-086 lintas fitur belum dilampirkan | QA | Evidence pending |
| Deployment | SHA/versi build Staging belum dicatat | DevOps | Pending |

**Pelaporan bug:** Gunakan GitHub Issues dan rangkum pada MJ-070 hanya untuk kegagalan **aktual, dapat direproduksi, dan berbeda dari expected negative test**. Jika ditemukan masalah, catat langkah reproduksi, Expected/Actual Result, build, evidence tersensor, severity hasil triage, pemilik, dan hasil retest.

## 7. Checklist Definition of Done MJ-086

- [ ] REG-01 Register dijalankan ulang dan dibuktikan pada build MJ-086.
- [ ] REG-02 Login + sesi (serta navigasi UI bila menjadi cakupan) dijalankan ulang.
- [ ] REG-03 Search dan REG-04 Detail dijalankan ulang; lampirkan respons kedua tipe media.
- [ ] REG-05 Tracker dalam alur end-to-end berjalan dan data terbukti tersimpan pada akun yang benar.
- [ ] C-01–C-04 memiliki bukti `X-Cache` dan response time masing-masing.
- [ ] NFR < 300 ms dinilai **hanya** pada respons `HIT` yang terverifikasi; anomali dijelaskan bersama Backend.
- [ ] Cakupan UI/negative test yang masih tertunda sudah diuji atau diberi status Blocked beserta alasan.
- [ ] Build/commit SHA dan tanggal run dicatat; screenshot evidence tersensor tersedia di repo.
- [ ] Temuan yang benar-benar terkonfirmasi dilaporkan melalui GitHub Issues/MJ-070 dan diretest bila fix tersedia.
- [ ] PR dokumentasi MJ-086 direview serta memenuhi aturan repository (target `develop`, tidak push langsung).

## 8. Kesimpulan QA

Hasil dari MJ-068, MJ-069, dan MJ-085 menyediakan **baseline positif sejumlah endpoint** Authentication, Catalog, dan Tracker. QA juga telah menyampaikan bahwa request Catalog yang diperiksa kembali berhasil, tetapi evidence run MJ-086 dan pemeriksaan cache (`X-Cache`) **belum cukup untuk menetapkan PASS seluruh regression maupun pemenuhan NFR cache**. Status UI/E2E serta beberapa skenario keamanan/rollback juga belum tuntas menurut dokumen sumber.

**Keputusan MJ-086 saat dokumen disusun: PARTIAL / EVIDENCE PENDING — belum dapat dinyatakan DONE.** Lengkapi tabel run, bukti cache, dan pemeriksaan E2E sebelum QA sign-off.

---

**Penanggung jawab dokumen:** QA MOJIJI  
**Nama file:** `hasil-regression.md`  
**Path repository:** `docs/qa/hasil-regression.md`
