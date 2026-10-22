# MJ-048 — Test Case Rinci Register dan Login/Logout

> **Status:** DRAFT — belum dieksekusi; belum boleh dinyatakan final sebelum dependency MJ-042 (API Contract final dan keputusan sesi cookie) terpenuhi.  
> **Ticket:** MJ-048 | **Minggu:** 5 | **Role:** QA  
> **Lokasi repository:** `docs/qa/test-case-auth.md`  
> **Sumber utama:** Mini PRD MOJIJI Revisi 4 / Versi 1.4 (bagian 9, 13, 14, 18, dan 19); skenario MJ-030 `docs/qa/skenario-mvp.md`; rencana data uji MJ-032 `docs/qa/rencana-environment.md`; instruksi MJ-048 pada timeline.  
> **Kontrak API:** Referensi final MJ-042 **belum diverifikasi**. Jangan menganggap status HTTP, format JSON, nama cookie, konfigurasi CORS, atau detail Logout dalam draft ini sebagai keputusan tim.

## 1. Tujuan dan cakupan

Menyiapkan test case rinci untuk **US-007 Register** dan **US-002 Login/Logout**, meliputi data uji, langkah, hasil yang diharapkan, pengujian positif/negatif, serta cek keamanan dasar (`password_hash` dan atribut `HttpOnly`). Dokumen ini adalah **rencana tes**, bukan laporan eksekusi.

### Basis Acceptance Criteria resmi

| Referensi | Jenis | Ketentuan resmi PRD (ringkasan setia) |
|---|---|---|
| US-007 / Register | Positive | Pengunjung mengisi username, email, dan password minimal 8 karakter dengan benar → akun dibuat dan diarahkan ke halaman login. |
| US-007 / Register | Negative | Email sudah terdaftar → pendaftaran ditolak dan muncul pesan error. |
| US-002 / Login | Positive | Akun valid, email dan password benar → pengguna login dan masuk dashboard. |
| US-002 / Login | Negative | Password salah → login ditolak dan pesan error muncul. |

**Catatan penting:** PRD mencantumkan fitur Logout dan endpoint `POST /api/auth/logout`, tetapi **tidak menjabarkan AC Logout tersendiri**. Pengujian password 7 karakter merupakan penguraian batas minimum 8 karakter pada AC Register, bukan AC negatif terpisah. Pengecekan `password_hash` dan `HttpOnly` merupakan cek keamanan dari instruksi MJ-048/NFR; jangan menyebutnya sebagai AC resmi tambahan.

## 2. Cakupan dan pelacakan test case

| Test Case ID | Skenario | Sumber | Jenis | Prioritas | Status |
|---|---|---|---|---|---|
| TC-R01 | Register dengan email baru dan password valid | US-007 Positive; MJ-030 TC-001 | Positive, Manual UI + API opsional | High | Not Run |
| TC-R02 | Register dengan email yang sudah ada | US-007 Negative; MJ-030 TC-002 | Negative, Manual UI + API opsional | High | Not Run |
| TC-R03 | Register dengan password 7 karakter | Batas minimal pada US-007 Positive; penjabaran MJ-048 | Negative, Manual UI | High | Not Run |
| TC-L01 | Login dengan email/password benar | US-002 Positive; MJ-030 TC-003 | Positive, Manual UI | High | Not Run |
| TC-L02 | Login dengan password salah | US-002 Negative; MJ-030 TC-004 | Negative, Manual UI | High | Not Run |
| TC-L03 | Logout dari sesi aktif | Fitur US-002 + endpoint Logout; **AC rinci menunggu konfirmasi** | Positive, Manual UI/API | High | Not Run |
| TC-S01 | Respons Register tidak mengekspos `password_hash` | Instruksi keamanan MJ-048 | Security, API | High | Not Run |
| TC-S02 | Respons Login tidak mengekspos `password_hash` | Instruksi keamanan MJ-048 | Security, API | High | Not Run |
| TC-S03 | Cookie autentikasi bersifat `HttpOnly` | Instruksi MJ-048 + NFR Security | Security, Browser/API | High | Not Run |

## 3. Environment, data uji, dan keselamatan

- **Tempat eksekusi nanti:** Staging (prioritas) setelah deploy dan layanan siap. Local hanya bila Backend/DevOps menyediakan layanan pengujian. QA tidak wajib menjalankan Docker atau migration.
- **URL UI staging:** `[KONFIRMASI_DEVOPS]`
- **Base URL API staging:** `[KONFIRMASI_BACKEND_DEVOPS]`
- **API dari PRD:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/users/me` (untuk verifikasi sesi, bila sesuai kontrak final).
- **Akun A:** `qa.mojiji.a@example.com` (akun dummy, perlu disiapkan).
- **Akun B:** `qa.mojiji.b@example.com` (akun dummy, opsional sebagai data isolasi).
- **Email baru:** gunakan alias/data dummy yang **belum terdaftar** pada environment uji, misalnya `qa.register.unique@example.com`; pastikan benar-benar unik sebelum eksekusi.
- **Email terdaftar:** akun A yang sudah didaftarkan untuk pengujian.
- **Username contoh:** `qa_auth_unique_01`; ganti bila sudah digunakan.
- **Password valid:** buat nilai dummy minimal 8 karakter saat pelaksanaan, simpan hanya di tempat aman; **jangan** menuliskannya di repository, issue, screenshot, atau evidence.
- **Password 7 karakter:** siapkan secara privat saat eksekusi, jangan tulis nilainya di dokumen.
- **Password salah:** nilai dummy yang berbeda dari password akun A; jangan ditulis dalam dokumentasi.
- **Pencatatan bukti:** screenshot hasil tampilan dan respons API **yang disensor**; hindari menyimpan body request berisi password dan header cookie/session.

### Data yang perlu tersedia sebelum tes berjalan

| Data/akses | Penanggung jawab konfirmasi | Status awal |
|---|---|---|
| URL staging dan status deployment | DevOps | Belum dikonfirmasi |
| Akun A, email terdaftar, dan data dummy aman | QA + Backend/DBA | Belum dikonfirmasi |
| Kontrak request/response/error auth | Backend — MJ-042 | Belum diverifikasi |
| Keputusan session cookie, `HttpOnly`, `Secure`, `SameSite`, CORS | Backend/Frontend — MJ-042 | Belum diverifikasi |
| Mekanisme pengujian Logout dan endpoint verifikasi sesi | Backend/Frontend | Belum dikonfirmasi |

---

## 4. Test case rinci

### TC-R01 — Register berhasil dengan email baru

| Field | Isi |
|---|---|
| Test Case ID | TC-R01 |
| Ticket / Story | MJ-048 / US-007 |
| AC Reference | US-007 — Positive; MJ-030 TC-001 |
| Test Type | Manual UI (API check bila tersedia) |
| Scenario Type | Positive |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Pengunjung belum login; halaman Register dapat diakses; email dummy uji belum terdaftar. |
| Test Data | Username dummy baru, email baru, password dummy **minimal 8 karakter**. |
| Related API | `POST /api/auth/register` |

**Test Steps**
1. Buka halaman Register tanpa sesi login.
2. Isi username dan email dummy baru, lalu masukkan password dummy minimal 8 karakter.
3. Kirim formulir Register.
4. Periksa navigasi aplikasi setelah proses pendaftaran.
5. Jika tersedia akses yang disepakati, verifikasi respons API tanpa menyalin informasi sensitif.

**Expected Result:** Akun berhasil dibuat dan pengguna diarahkan ke halaman Login. Format pesan, kode HTTP, dan struktur respons mengikuti MJ-042 saat sudah disahkan.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run.  
**Evidence:** Belum ada.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

### TC-R02 — Register ditolak karena email sudah terdaftar

| Field | Isi |
|---|---|
| Test Case ID | TC-R02 |
| Ticket / Story | MJ-048 / US-007 |
| AC Reference | US-007 — Negative; MJ-030 TC-002 |
| Test Type | Manual UI (API check bila tersedia) |
| Scenario Type | Negative |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Ada akun dummy A yang sudah menggunakan email uji; halaman Register dapat diakses. |
| Test Data | Email akun A yang sudah terdaftar, username dummy berbeda, password dummy valid. |
| Related API | `POST /api/auth/register` |

**Test Steps**
1. Buka halaman Register tanpa login.
2. Isi formulir dengan email yang sudah digunakan oleh akun dummy A.
3. Isi field lain dengan data dummy valid.
4. Kirim formulir Register dan amati hasilnya.

**Expected Result:** Pendaftaran **ditolak** dan pesan error ditampilkan. Status HTTP dan struktur error diperiksa terhadap API Contract MJ-042 setelah final.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run.  
**Evidence:** Belum ada.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

### TC-R03 — Register dengan password 7 karakter

| Field | Isi |
|---|---|
| Test Case ID | TC-R03 |
| Ticket / Story | MJ-048 / US-007 |
| AC Reference | Penjabaran batas minimal 8 karakter dari US-007 Positive; instruksi MJ-048 (bukan AC resmi tersendiri) |
| Test Type | Manual UI (validasi form/backend sesuai kontrak) |
| Scenario Type | Negative |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Pengunjung belum login; halaman Register dapat diakses. |
| Test Data | Username dan email dummy baru, password dummy **tepat 7 karakter**. |
| Related API | `POST /api/auth/register` |

**Test Steps**
1. Buka halaman Register.
2. Isi username dan email dummy baru.
3. Isi password dummy tepat 7 karakter tanpa mencantumkan nilai aktual pada evidence.
4. Kirim formulir Register.
5. Periksa apakah validasi menolak nilai di bawah minimum.

**Expected Result (turunan dari syarat minimum):** Pendaftaran dengan password 7 karakter **tidak diterima**. Bentuk pesan validasi dan respons API ditentukan oleh UI/kontrak final; minta konfirmasi jika belum ditetapkan.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run.  
**Evidence:** Belum ada.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

### TC-L01 — Login berhasil dengan kredensial benar

| Field | Isi |
|---|---|
| Test Case ID | TC-L01 |
| Ticket / Story | MJ-048 / US-002 |
| AC Reference | US-002 — Positive; MJ-030 TC-003 |
| Test Type | Manual UI |
| Scenario Type | Positive |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Akun A sudah terdaftar dan tidak sedang login. |
| Test Data | Email dan password dummy yang benar untuk akun A. |
| Related API | `POST /api/auth/login` |

**Test Steps**
1. Buka halaman Login tanpa sesi aktif.
2. Isi email akun A.
3. Isi password dummy yang benar melalui input aman.
4. Klik Login.
5. Amati navigasi dan tampilan halaman setelah login.

**Expected Result:** Pengguna berhasil login dan diarahkan ke dashboard sesuai AC resmi. Format respons dan pengaturan cookie harus cocok dengan hasil akhir MJ-042.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run.  
**Evidence:** Belum ada.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

### TC-L02 — Login ditolak karena password salah

| Field | Isi |
|---|---|
| Test Case ID | TC-L02 |
| Ticket / Story | MJ-048 / US-002 |
| AC Reference | US-002 — Negative; MJ-030 TC-004 |
| Test Type | Manual UI |
| Scenario Type | Negative |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Akun A sudah terdaftar; tidak ada sesi aktif saat mencoba Login. |
| Test Data | Email akun A benar, password dummy yang salah. |
| Related API | `POST /api/auth/login` |

**Test Steps**
1. Buka halaman Login.
2. Isi email akun A yang terdaftar.
3. Isi password dummy yang **salah**.
4. Klik Login dan periksa respons UI.
5. Pastikan proses tidak membawa pengguna ke dashboard sebagai pengguna yang berhasil login.

**Expected Result:** Login ditolak dan pesan error ditampilkan. Detail respons dan kode HTTP mengikuti kontrak MJ-042 setelah final.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run.  
**Evidence:** Belum ada.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

### TC-L03 — Logout dari sesi login aktif

| Field | Isi |
|---|---|
| Test Case ID | TC-L03 |
| Ticket / Story | MJ-048 / US-002 |
| AC Reference | Fitur Logout pada US-002 dan API Overview (endpoint tersedia); **AC terinci belum tertulis dalam PRD** |
| Test Type | Manual UI, integrasi/API bila diperlukan |
| Scenario Type | Positive (draft / menunggu keputusan) |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Akun A login dan memiliki sesi yang valid. |
| Test Data | Sesi dummy akun A; jangan tampilkan cookie/token. |
| Related API | `POST /api/auth/logout`; `GET /api/users/me` sebagai kandidat cek sesi jika disetujui dalam kontrak |

**Test Steps**
1. Login menggunakan akun A.
2. Gunakan fungsi Logout pada UI (atau request yang telah disepakati jika UI belum siap).
3. Amati respons sistem.
4. Coba buka kembali area yang memerlukan login atau lakukan cek sesi dengan mekanisme yang disepakati tim.

**Expected Result (masih harus dikonfirmasi):** Sesi pengguna diakhiri oleh fungsi Logout; perilaku navigasi, pembersihan cookie, dan penolakan akses setelah logout **harus ditentukan dalam AC/API Contract final**, bukan diasumsikan sebagai ketentuan yang sudah disetujui.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run — pending AC/contract.  
**Evidence:** Belum ada.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

### TC-S01 — Respons Register tidak membocorkan `password_hash`

| Field | Isi |
|---|---|
| Test Case ID | TC-S01 |
| Ticket / Story | MJ-048 / US-007 |
| AC Reference | Cek keamanan instruksi MJ-048; NFR Security PRD |
| Test Type | API (Postman/Network tab), pemeriksaan keamanan dasar |
| Scenario Type | Security |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Endpoint Register tersedia; data akun dummy baru disiapkan. |
| Test Data | Email baru + field Register valid; nilai password hanya saat pengujian. |
| Related API | `POST /api/auth/register` |

**Test Steps**
1. Lakukan Register dengan data dummy melalui UI/Postman.
2. Buka **respons** Register yang diterima klien (bukan body request yang berisi password).
3. Periksa seluruh field respons, termasuk objek bersarang jika ada.
4. Pastikan tidak ada field `password_hash`, nilai hash password, atau password plaintext yang dikirim ke klien.

**Expected Result:** Respons tidak mengandung `password_hash` maupun nilai password/hash sensitif. Bentuk respons yang diizinkan mengikuti API Contract MJ-042.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run.  
**Evidence:** Belum ada; simpan hanya respons yang telah disensor.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

### TC-S02 — Respons Login tidak membocorkan `password_hash`

| Field | Isi |
|---|---|
| Test Case ID | TC-S02 |
| Ticket / Story | MJ-048 / US-002 |
| AC Reference | Cek keamanan instruksi MJ-048; NFR Security PRD |
| Test Type | API (Postman/Network tab), pemeriksaan keamanan dasar |
| Scenario Type | Security |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Akun dummy A sudah ada; Login API tersedia. |
| Test Data | Email akun A dan password benar yang tidak disalin ke evidence. |
| Related API | `POST /api/auth/login` |

**Test Steps**
1. Login dengan akun dummy A.
2. Periksa **respons** API Login (tanpa menyalin request body atau header sensitif).
3. Periksa bahwa field `password_hash`, password plaintext, atau hash password tidak muncul di respons.

**Expected Result:** Respons Login tidak mengirim `password_hash`, password plaintext, ataupun hash password ke klien.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run.  
**Evidence:** Belum ada; simpan respons tersensor.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

### TC-S03 — Session cookie memiliki atribut `HttpOnly`

| Field | Isi |
|---|---|
| Test Case ID | TC-S03 |
| Ticket / Story | MJ-048 / US-002 |
| AC Reference | Instruksi MJ-048; NFR Security dan strategi cookie yang difinalkan di MJ-042 |
| Test Type | Browser DevTools atau Postman; pemeriksaan keamanan cookie |
| Scenario Type | Security |
| Environment | Staging (direncanakan) |
| Priority | High |
| Preconditions | Login berhasil; mekanisme autentikasi memakai cookie sesuai keputusan MJ-042. |
| Test Data | Akun dummy A. |
| Related API | `POST /api/auth/login` dan respons `Set-Cookie` jika ada |

**Test Steps**
1. Login menggunakan akun dummy A di browser pada environment pengujian.
2. Buka Developer Tools → Network → request Login, lalu lihat header `Set-Cookie` dan/atau tab Application/Storage → Cookies.
3. Temukan cookie autentikasi **tanpa menyalin nilainya**.
4. Verifikasi atribut `HttpOnly` aktif; periksa pengaturan cookie lain (`Secure`, `SameSite`, domain/path) terhadap kontrak MJ-042, tanpa menganggap nilainya sudah disepakati.

**Expected Result:** Cookie sesi autentikasi memiliki atribut `HttpOnly`, sesuai instruksi MJ-048. Bila strategi autentikasi final berubah, lakukan review ulang requirement sebelum menyatakan Pass/Fail.

**Actual Result:** Belum diuji.  
**Test Status:** Not Run — pending keputusan cookie MJ-042.  
**Evidence:** Belum ada; **sensor nilai cookie** sebelum menyimpan screenshot.  
**Bug Reference:** N/A.  
**Retest:** Not Run.

---

## 5. Catatan API Contract dan klarifikasi (WAJIB sebelum final)

| Perlu dikonfirmasi | Rujukan | Status |
|---|---|---|
| MJ-042 benar-benar Done dan file kontrak API final tersedia di `docs/api/` | Backend / MJ-042 | Belum diverifikasi |
| Struktur request Register dan Login (field wajib, tipe data) | Kontrak API final | Belum diverifikasi |
| HTTP status dan format JSON sukses/error setiap endpoint | Kontrak API final | Belum diverifikasi |
| Ketentuan validasi password 7 karakter dan tempat validasinya | AC US-007 / Frontend / Backend | Perlu konfirmasi detail respons |
| Keputusan perilaku Logout (pengakhiran sesi, redirect, pengujian sesi setelah Logout) | US-002 / MJ-014 / MJ-042 | Belum disepakati pada PRD yang tersedia |
| Jenis dan nama session cookie, `HttpOnly`, `Secure`, `SameSite`, domain, CORS, subdomain/proxy | MJ-042 | Belum diverifikasi |
| Deployment terbaru: PRD menjelaskan VPS/Caddy, tetapi tiket MJ-042 GitHub membahas Vercel/Render | DevOps + Backend | **Decision needed:** dokumen mana yang terbaru? |
| Persiapan akun dan URL staging | MJ-032 / DevOps / DBA | Belum dikonfirmasi |

**Aturan penting:** Jangan menetapkan angka HTTP status (misalnya 200/201/400/409), teks error persis, path halaman Login/Logout, nama cookie, atau format JSON sebelum ada kontrak final. Jika tim sudah menyepakati spesifikasi terbaru, revisi test case ini berdasarkan keputusan tersebut.

## 6. Bukti dan pencatatan eksekusi (diisi nanti saat testing)

| Test Case ID | Tanggal | Build/Commit | Actual Result | Status (Not Run/Pass/Fail/Blocked) | Evidence / Bug |
|---|---|---|---|---|---|
| TC-R01 | — | — | Belum diuji | Not Run | — |
| TC-R02 | — | — | Belum diuji | Not Run | — |
| TC-R03 | — | — | Belum diuji | Not Run | — |
| TC-L01 | — | — | Belum diuji | Not Run | — |
| TC-L02 | — | — | Belum diuji | Not Run | — |
| TC-L03 | — | — | Belum diuji | Not Run | — |
| TC-S01 | — | — | Belum diuji | Not Run | — |
| TC-S02 | — | — | Belum diuji | Not Run | — |
| TC-S03 | — | — | Belum diuji | Not Run | — |

## 7. Review, handoff, dan Definition of Done MJ-048

- [ ] MJ-030 dan MJ-042 sudah memenuhi dependency (Done); kontrak API final sudah tersedia.
- [ ] Isi sembilan test case diperiksa terhadap Acceptance Criteria dan kontrak API final.
- [ ] AC Logout diperjelas/disetujui oleh pemilik requirement; tidak diasumsikan secara sepihak.
- [ ] Detail cookie, CORS, dan environment disepakati dengan Backend dan Frontend.
- [ ] Dokumen disimpan di `docs/qa/test-case-auth.md` dan dicek tidak mengandung secret.
- [ ] Frontend dan Backend menerima HANDOFF dan membaca test case.
- [ ] Review PR dan koreksi penting selesai; PR ke `develop` disetujui.

> **Tidak perlu mengubah status sembilan test case menjadi Pass pada MJ-048.** Eksekusi Register/Login/Logout dijadwalkan pada tiket pengujian berikutnya (MJ-068), saat fitur dan environment siap.

### Template handoff

**HANDOFF — MJ-048 (QA → Backend & Frontend)**  
**Artefak:** `docs/qa/test-case-auth.md`  
**Sudah siap:** Draft 9 test case Register, Login, Logout dan security checks.  
**Diminta:** Periksa kesesuaian AC serta final API Contract MJ-042; konfirmasi detail Logout, validasi password minimal 8 karakter, struktur response/error, dan strategi cookie/HttpOnly.  
**Blokir finalisasi:** Ya — kontrak API final dan keputusan Logout/cookie masih perlu diverifikasi.  
**Catatan:** Belum ada pengujian atau evidence; semua test case masih Not Run.
