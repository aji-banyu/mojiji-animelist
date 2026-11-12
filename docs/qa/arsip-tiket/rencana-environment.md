# MJ-032 — Rencana Environment dan Data Uji MOJIJI

> **Tiket:** MJ-032 — Rencana environment dan data uji  
> **Role:** QA | **Minggu:** 4 | **Dependency:** MJ-030  
> **Referensi:** Mini PRD MOJIJI Revisi 4 (v1.4 — Docker/Migration Update), poin 3–4, 13–14, 16, 18–19; `docs/qa/skenario-mvp.md` (MJ-030).  
> **Status:** Draft rencana — **belum menyiapkan akun, belum memvalidasi data, dan belum menjalankan pengujian.**

## 1. Tujuan dan cakupan

Menetapkan environment tempat skenario MVP akan dijalankan dan menyiapkan daftar **data dummy**, sehingga QA bisa menguji Register, Login, Pencarian, Detail, Status Tracker, +1 Progres, dan Dashboard tanpa menggunakan data pribadi atau mengubah data production.

Dokumen ini adalah **rencana persiapan data uji**, bukan hasil pengujian fitur. Expected Result tetap mengikuti AC resmi dan `docs/qa/skenario-mvp.md`; QA tidak membuat AC atau kontrak API baru.

## 2. Environment pengujian

| Environment | Kegunaan | Sumber aplikasi / branch | Database & cache sesuai PRD | Akses dan penanggung jawab | Status / URL |
|---|---|---|---|---|---|
| **Local (development)** | Debug dan verifikasi awal bila ada kebutuhan khusus, misalnya simulasi kegagalan | Feature branch; backend/database/cache lokal dengan Docker Compose, frontend dapat berjalan via `npm run dev` | PostgreSQL lokal dalam Docker; Redis lokal dalam Docker | Backend/DevOps menyiapkan layanan; DBA menyiapkan skema/migration. **QA tidak wajib memasang atau menjalankan Docker.** | **Belum dikonfirmasi**; alamat lokal mengikuti arahan tim |
| **Staging (utama untuk QA)** | Menjalankan 16 skenario MVP setelah fitur tersedia | `develop`, deployment otomatis di VPS melalui GitHub Actions; frontend/API diakses lewat HTTPS | Supabase **staging** (project 1) dan Upstash Redis dengan prefix `stg:` | DevOps memberikan URL staging dan status deploy; DBA mengonfirmasi skema/migration; Backend membantu data serta kondisi API | **URL staging: menunggu DevOps**; kesiapan belum diverifikasi |
| **Production** | Bukan target pengujian rutin MJ-032; nanti hanya verifikasi sesuai arahan release | `main`, URL publik HTTPS | Supabase **production** (project 2) dan Upstash Redis prefix `prod:` | DevOps/QA sesuai proses rilis; hanya akun demo dan data aman | **Tidak digunakan untuk persiapan MJ-032** |

**Ketentuan dari PRD:** staging dan production harus terpisah, termasuk database, data, secret, dan konfigurasi. Staging boleh bersifat **on-demand** berdasarkan keputusan DevOps setelah pengukuran RAM. Jangan berasumsi staging sudah aktif hanya karena URL diberikan.

### Prasyarat environment sebelum pengujian

- [ ] DevOps memberi URL staging HTTPS yang benar serta memastikan pipeline deploy `develop` berhasil.
- [ ] Backend mengonfirmasi endpoint dan alur UI yang akan diuji tersedia sesuai cakupan tiket.
- [ ] DBA mengonfirmasi skema database/migration **staging** yang dibutuhkan telah siap; QA tidak menjalankan migration sendiri.
- [ ] DevOps/DBA memastikan staging tidak menggunakan kredensial maupun data production.
- [ ] DevOps/Backend menjelaskan apakah staging saat itu selalu aktif atau perlu dinyalakan untuk sesi tes.
- [ ] QA dapat mengakses staging lewat browser; untuk API gunakan Postman ketika kontrak dan koleksinya siap.
- [ ] Untuk skenario khusus, Backend/DevOps menyediakan cara **aman** mensimulasikan error Tenrai, cache kosong, atau kegagalan penyimpanan tanpa mengganggu production.

## 3. Rencana akun dummy (bukan akun yang sudah dibuat)

Gunakan dua identitas yang sepenuhnya fiktif untuk memisahkan kepemilikan tracker. Alamat `example.com` di bawah hanya contoh; **jangan berasumsi akun sudah ada** atau email dapat menerima pesan.

| Data | Akun A — pemilik data | Akun B — pengguna lain |
|---|---|---|
| Username rencana | `qa_mojiji_a` | `qa_mojiji_b` |
| Email rencana | `qa.mojiji.a@example.com` | `qa.mojiji.b@example.com` |
| Peran saat pengujian | Memiliki tracker dan data progres untuk tes positif | Menguji isolasi/penolakan akses ke tracker milik Akun A |
| Password | **Tidak ditulis di dokumen, Issue, commit, atau evidence** | **Tidak ditulis di dokumen, Issue, commit, atau evidence** |
| Status pembuatan | Belum dibuat / perlu konfirmasi | Belum dibuat / perlu konfirmasi |

**Aturan penggunaan:**

1. Buat akun melalui alur Register/API yang **disetujui** ketika fitur tersedia; minta bantuan Backend/DBA jika perlu seed data melalui proses tim.
2. Gunakan password dummy yang memenuhi syarat minimal **8 karakter**, tetapi simpan rahasianya hanya melalui cara aman yang disepakati tim, **bukan di repo**.
3. Untuk TC-001, gunakan **username dan email dummy baru** (misalnya variasi bernomor/timestamp agar tidak bentrok); jangan memakai akun A/B yang sudah terdaftar untuk tes sukses registrasi.
4. Untuk TC-002, gunakan **email Akun A yang sudah terdaftar** dan username percobaan yang unik, sehingga yang sedang diuji adalah kondisi email duplikat.
5. Untuk tes keamanan TC-016, autentikasi sebagai Akun B lalu minta akses ke data Akun A **menggunakan cara/endpoint yang disetujui Backend**; jangan mengarang endpoint. Jangan bagikan cookie atau token sesi di bukti pengujian.

## 4. Daftar data uji MVP

| ID Data | Kegunaan / skenario terkait | Nilai atau kondisi rencana | Catatan persiapan / validasi |
|---|---|---|---|
| DU-01 | Registrasi sukses (TC-001) | Username + email dummy **baru**, password dummy minimal 8 karakter | Pastikan belum terdaftar sebelum pengujian; jangan catat password |
| DU-02 | Register email duplikat (TC-002) | Email Akun A, dengan username lain | Akun A perlu dibuat lebih dahulu |
| DU-03 | Login berhasil / gagal (TC-003, TC-004) | Email Akun A + password yang sesuai / tidak sesuai | Password tidak disimpan dalam dokumen |
| DU-04 | Pencarian positif (TC-005) | Query **`Naruto`**, tipe **Anime** atau **Manga** | Pastikan hasil tersedia pada Tenrai saat hari pengujian |
| DU-05 | Pencarian tanpa hasil (TC-006) | Query kandidat **`zzzxxqq`** | **Hanya kandidat**; konfirmasi benar-benar 0 hasil pada Tenrai sebelum tes, jika ada hasil ganti query |
| DU-06 | Tenrai gagal dan cache kosong (TC-007) | Keyword belum ada di cache + simulasi Tenrai gagal | Minta metode simulasi aman dari Backend/DevOps; jangan menghapus cache bersama atau mengganggu production |
| DU-07 | Detail positif (TC-008) | Satu judul valid dari pencarian `Naruto` | Ambil `media_type` dan `mal_id` valid dari hasil API saat tes; jangan menebak ID |
| DU-08 | Detail tidak ditemukan (TC-009) | **`mal_id` yang dipastikan tidak ada — TBD** | Minta Backend menentukan ID atau fixture valid untuk tes negatif; angka tertentu tidak dijamin tidak ada |
| DU-09 | Detail ketika Tenrai gagal (TC-010) | Judul uji + simulasi Tenrai tidak tersedia | Koordinasi dengan Backend/DevOps; tentukan perilaku cache sesuai AC/NFR |
| DU-10 | Ubah status tracker (TC-011) | Akun A login, judul dari DU-07, status **`Watching`** (Anime) | Siapkan item tracker melalui UI/API yang tersedia; periksa tersimpan pada akun A |
| DU-11 | Status tanpa login (TC-012) | Pengunjung tanpa sesi login + judul valid | Gunakan sesi browser baru/incognito, bukan Akun A/B yang masih login |
| DU-12 | Tambah progres +1 (TC-013) | Tracker Akun A: **Watching**, progress awal **4** | Set kondisi awal via fitur/metode yang disepakati tim; harapan AC 4 → 5 dan tersimpan |
| DU-13 | Penyimpanan progres gagal (TC-014) | Tracker Akun A: progress **4** + simulasi gagal simpan | Backend/DevOps menyediakan metode simulasi aman; harapan progres kembali 4 + pesan error |
| DU-14 | Dashboard & filter (TC-015) | Akun A memiliki data tracker dengan status yang dapat difilter | Siapkan minimal data relevan; filter yang tersedia mengikuti implementasi/AC yang disepakati |
| DU-15 | Akses lintas akun ditolak (TC-016) | Akun B mencoba mengakses tracker milik Akun A | Metode request dan bukti respons disepakati Backend; tidak menggunakan data orang lain |

**Status seluruh data:** Rencana saja, **belum diverifikasi tersedia**. Tidak ada nilai `mal_id` detail maupun URL staging yang boleh dianggap final sebelum dikonfirmasi tim.

## 5. Pemetaan pengujian terhadap environment

| Skenario | Environment utama | Jika perlu bantuan khusus |
|---|---|---|
| TC-001 s.d. TC-006; TC-008; TC-011 s.d. TC-013; TC-015 | **Staging**, browser / Manual UI | Backend untuk fixture/akun, DevOps untuk akses staging |
| TC-007 (Tenrai gagal + cache kosong), TC-010 (Tenrai gagal), TC-014 (gagal simpan) | **Local/lingkungan terkendali** bila diperlukan, lalu staging bila mekanisme aman tersedia | Backend/DevOps menyediakan simulasi; jangan ganggu staging bersama atau production |
| TC-009 (judul tidak ditemukan) | **Staging** jika fixture/ID negatif tervalidasi | Backend membantu memilih ID/rute detail yang valid untuk uji negatif |
| TC-016 (akses tracker orang lain) | **Staging**, Postman | Backend mengonfirmasi request sesuai kontrak API; DBA/Backend memastikan dua akun terpisah |

Environment akhir, metode simulasi, dan bukti pelaksanaan akan dicatat **saat tes dilakukan**, bukan diklaim dalam MJ-032. Rencana ini tidak mengubah tipe atau expected result dari MJ-030.

## 6. Cara menyiapkan, menggunakan, dan membersihkan data

**Sebelum sesi tes:** pastikan staging siap dan izin tim diperoleh; buat dua akun dummy, siapkan data tracker Akun A, serta validasi hasil `Naruto`, query tanpa hasil, dan ID negatif. Jangan memasukkan data langsung melalui dashboard Supabase atau menjalankan migration dari laptop QA.

**Saat sesi tes:** catat test case ID, environment/URL (tanpa secret), versi build/commit bila tersedia, tanggal, Actual Result, status, dan evidence. Sensor semua cookie, token, password, dan informasi sensitif di screenshot/log/response Postman.

**Setelah sesi tes:** hapus/reset data dummy menggunakan fitur atau prosedur yang **disetujui Backend/DBA**. Jangan menghapus data shared staging atau memakai perintah destruktif (`docker compose down -v`, truncate, drop table) sendiri.

## 7. Handoff dan konfirmasi tim

| Role | Hal yang perlu dikonfirmasi | Status |
|---|---|---|
| **DevOps** | URL HTTPS staging, status CI/deploy `develop`, apakah staging on-demand, serta prosedur akses dan simulasi gangguan yang aman | **Menunggu konfirmasi** |
| **DBA** | Kesiapan database/migration staging, pemisahan database production, ketersediaan data dummy atau cara seed/reset aman | **Menunggu konfirmasi** |
| **Backend** | Alur pembuatan akun/fixture, kontrak API untuk TC-016, validasi ID judul tidak ditemukan, cara aman mensimulasikan kegagalan Tenrai dan penyimpanan | **Menunggu konfirmasi** |
| **Frontend** | Jalur UI untuk menyiapkan tracker/status/progres; halaman atau kontrol yang akan digunakan QA pada staging | **Menunggu konfirmasi** |

### Log jawaban dan keputusan

| Tanggal | Role / narasumber | Pertanyaan | Jawaban / keputusan | Referensi GitHub Issue / chat | Status |
|---|---|---|---|---|---|
| — | — | Kesiapan data uji dan environment | Belum ada keputusan yang dicatat | — | Menunggu |

## 8. Checklist penyelesaian tiket MJ-032

- [x] Rencana environment lokal dan staging dijelaskan dalam `docs/qa/rencana-environment.md`.
- [x] Dua **identitas akun contoh** dicatat tanpa password atau data asli.
- [x] Kata kunci positif `Naruto` dan kandidat kata tanpa hasil `zzzxxqq` dicatat.
- [x] Kebutuhan ID judul tidak ditemukan dicatat **sebagai data yang menunggu validasi**, bukan mengarang ID.
- [x] Kebutuhan data tracker (Watching, progres awal 4, dan dua pemilik akun) direncanakan untuk skenario MJ-030.
- [x] Tidak ada data pribadi atau kredensial rahasia dalam dokumen ini.
- [ ] DevOps dan DBA diminta memastikan environment dan data uji siap.
- [ ] Status dan jawaban konfirmasi tim ditambahkan di dokumen/Issue terkait.
- [ ] PR dokumentasi direview serta aturan Definition of Done dipenuhi.

**Kondisi selesai menurut timeline:** daftar akun dan data uji tersedia **di dokumentasi `docs/qa/`**, tanpa menggunakan data asli. Ketersediaan nyata di staging akan diverifikasi kemudian bersama DevOps/DBA, bukan diklaim sekarang.
