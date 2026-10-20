# Rincian Tugas Backend dan Standar Respons — Mojiji AnimeList

## 1. Informasi Dokumen

| Kolom | Nilai |
|---|---|
| Proyek | Mojiji AnimeList |
| Tiket | MJ-026 |
| Pemilik | Syafii — Backend |
| Tiket terkait | MJ-025 — Kontrak API MVP |
| Status dokumen | Standar kerja untuk implementasi dan QA |
| Terakhir diperbarui | 2026-10-10 |

## 2. Tujuan

Dokumen ini merinci pekerjaan Backend untuk MVP dan menetapkan standar respons yang konsisten bagi tim Backend, Frontend, dan QA. Dokumen ini harus tetap selaras dengan `docs/api/api-contract-mvp.md`. Setiap perubahan terhadap kontrak API publik harus ditinjau oleh pihak yang terdampak dan dicatat pada kedua dokumen tersebut.

Dokumen ini menjelaskan standar kerja yang telah disepakati dan rencana tugas. Dokumen ini **tidak menyatakan bahwa seluruh endpoint telah selesai diimplementasikan atau diuji**.

## 3. Layanan dan Tanggung Jawab

| Layanan | Port lokal default | Tanggung jawab |
|---|---:|---|
| API Gateway | 3000 | Titik masuk permintaan dari klien dan penerusan permintaan ke layanan yang sesuai |
| User Service | 3001 | Registrasi, login/logout, dan profil pengguna yang sedang login |
| Catalog Service | 3002 | Pencarian dan pengambilan detail anime/manga dari penyedia katalog eksternal |
| Tracker Service | 3003 | Daftar anime/manga yang dilacak pengguna serta perubahan status dan progres |

Port tersebut menjelaskan konfigurasi lokal dan tidak berarti seluruh endpoint sudah diimplementasikan.

## 4. Rincian Endpoint MVP

Endpoint berikut mengikuti gambaran umum API proyek dan dokumen Kontrak API MVP.

| Area | Metode dan endpoint | Tanggung jawab |
|---|---|---|
| Auth | `POST /api/auth/register` | Membuat akun dan memvalidasi data registrasi |
| Auth | `POST /api/auth/login` | Mengautentikasi pengguna menggunakan mekanisme sesi/token yang telah disepakati |
| Auth | `POST /api/auth/logout` | Mengakhiri sesi/token yang sedang digunakan, sesuai mekanisme autentikasi |
| User | `GET /api/users/me` | Mengembalikan profil pengguna yang sedang terautentikasi |
| Catalog | `GET /api/catalog/search?type=anime\|manga&q=...` | Mencari katalog anime/manga |
| Catalog | `GET /api/catalog/:type/:malId` | Mengembalikan detail satu anime atau manga |
| Tracker | `GET /api/tracker?status=...` | Menampilkan daftar item yang dilacak pengguna, dengan filter status jika diperlukan |
| Tracker | `POST /api/tracker` | Menambahkan item ke daftar pelacakan pengguna |
| Tracker | `PATCH /api/tracker/:id/status` | Mengubah status pelacakan suatu item |
| Tracker | `POST /api/tracker/:id/increment` | Menambah progres sesuai aturan pelacakan yang telah disepakati |
| Tracker | `DELETE /api/tracker/:id` | Menghapus item milik pengguna dari daftar pelacakan |

Komentar, notifikasi, dan pengingat berada di luar cakupan MVP ini, kecuali jika Product Owner secara eksplisit menambahkannya ke dalam cakupan.

## 5. Delapan Kolom Wajib pada Tiket GitHub Projects

Setiap tiket Backend harus memiliki:

1. **ID Tiket** — identitas unik, misalnya `MJ-026`.
2. **Judul** — nama singkat yang menjelaskan tindakan atau pekerjaan.
3. **Deskripsi/Cakupan** — menjelaskan pekerjaan yang termasuk dan tidak termasuk dalam tiket.
4. **Kriteria Penerimaan (Acceptance Criteria/AC)** — kondisi yang dapat diamati untuk menentukan bahwa pekerjaan selesai.
5. **Pemilik (Owner)** — orang yang bertanggung jawab menyelesaikan pekerjaan.
6. **Prioritas** — tingkat kepentingan relatif yang disepakati tim.
7. **Status** — keadaan pekerjaan, seperti Todo, In Progress, In Review, atau Done.
8. **Dependensi** — tiket atau keputusan yang harus diselesaikan terlebih dahulu. Gunakan `None` jika tidak ada dependensi.

Estimasi atau tanggal jatuh tempo dapat ditambahkan jika diperlukan oleh papan kerja tim, tetapi keduanya tidak termasuk dalam delapan kolom wajib tersebut.

## 6. Rincian Tugas Backend yang Diusulkan

Buat atau perbarui tugas-tugas berikut sebagai tiket yang benar-benar tercatat di GitHub Projects. Pengelompokan di bawah ini **bukan bukti bahwa tiket-tiket tersebut sudah dibuat**. Tetapkan ID tiket, pemilik, prioritas, status, dan dependensi pada papan kerja.

### A. API Gateway

**Cakupan**

- Menyediakan titik masuk HTTP untuk permintaan dari klien.
- Meneruskan permintaan pada rute `/api/auth`, `/api/users`, `/api/catalog`, dan `/api/tracker` ke layanan yang sesuai.
- Menangani error pada tingkat gateway tanpa membocorkan stack trace atau informasi rahasia.

**Kriteria Penerimaan**

- Layanan dapat berjalan pada port lokal yang telah dikonfigurasi.
- `GET /health` mengembalikan HTTP `200` ketika layanan dalam kondisi sehat.
- Permintaan diteruskan sesuai konfigurasi rute yang telah disepakati.
- Error yang dihasilkan gateway mengikuti format respons error bersama.

**Dependensi:** Kerangka awal layanan dan konfigurasi rute yang telah disepakati.

### B. User Service dan Autentikasi

**Cakupan**

- Mengimplementasikan registrasi, login, logout, dan `GET /api/users/me`.
- Memvalidasi input dan mengembalikan pesan error yang aman.
- Melakukan hashing kata sandi; kata sandi tidak boleh disimpan atau dikembalikan dalam bentuk teks biasa.
- Melindungi endpoint yang memerlukan autentikasi.

**Kriteria Penerimaan**

- Permintaan yang valid mengikuti kontrak API.
- Input yang tidak valid menghasilkan format respons error bersama dan status HTTP yang sesuai.
- Permintaan tanpa autentikasi ke endpoint yang dilindungi menghasilkan `401`.
- Kata sandi dan informasi autentikasi sensitif tidak pernah dikembalikan.
- `GET /api/users/me` hanya mengembalikan profil pengguna yang sedang terautentikasi.

**Dependensi:** Mekanisme autentikasi/sesi dan skema database yang telah disepakati.

### C. Catalog Service

**Cakupan**

- Mengimplementasikan endpoint pencarian dan detail anime/manga.
- Menyeragamkan data dari penyedia eksternal ke dalam format respons publik proyek.
- Menangani timeout, pembatasan permintaan (*rate limit*), gangguan layanan, dan respons yang tidak valid dari penyedia eksternal.

**Kriteria Penerimaan**

- Endpoint pencarian memvalidasi parameter `type` dan input pencarian yang wajib diisi.
- Permintaan detail memvalidasi tipe dan ID katalog.
- Hasil yang berhasil mengikuti format respons sukses bersama.
- Input tidak valid menghasilkan `400`; item katalog yang dipastikan tidak ditemukan menghasilkan `404`.
- Gangguan penyedia eksternal diterjemahkan ke format error publik.
- Data mentah penyedia, kredensial, dan stack trace tidak bocor ke respons publik.

**Dependensi:** Pemilihan penyedia katalog dan kontrak API.

### D. Tracker Service

**Cakupan**

- Mengimplementasikan operasi daftar, tambah, ubah status, tambah progres, dan hapus.
- Mewajibkan autentikasi untuk data pelacakan.
- Memastikan pemeriksaan kepemilikan dan validasi aturan status/progres.

**Kriteria Penerimaan**

- Pengguna hanya dapat melihat item miliknya sendiri.
- Operasi tambah, ubah, dan hapus memvalidasi input serta kepemilikan.
- Item yang tidak ditemukan menghasilkan `404`.
- Permintaan tanpa autentikasi menghasilkan `401`; pengguna yang telah terautentikasi tetapi tidak memiliki izin menghasilkan `403` jika sesuai dengan kasusnya.
- Operasi yang berhasil mengikuti standar respons sukses bersama, kecuali respons `204` yang tidak memiliki isi (*body*).

**Dependensi:** Kontrak autentikasi, skema tracker, dan aturan status/progres yang telah disepakati.

### E. Standar Respons API Bersama

**Cakupan**

- Menerapkan standar respons pada seluruh endpoint MVP.
- Menyelaraskan `docs/api/api-contract-mvp.md` dengan dokumen ini.
- Menambahkan atau memperbarui pengujian untuk contoh respons sukses dan error yang mewakili kasus-kasus utama.

**Kriteria Penerimaan**

- Kontrak API mendokumentasikan respons sukses, error, dan tanpa isi.
- Endpoint yang telah diimplementasikan menggunakan status HTTP dan format respons yang terdokumentasi.
- Kode error bersifat konsisten sehingga dapat digunakan oleh Frontend dan QA.
- Frontend dan QA dapat menggunakan kontrak API yang sama dan telah di-commit ke repositori.

**Dependensi:** Dokumen ini dan hasil peninjauan Kontrak API MVP.

## 7. Standar Respons API Bersama

### 7.1 Respons Sukses dengan Isi

Gunakan format berikut untuk respons sukses yang memiliki isi (*body*):

```json
{
  "success": true,
  "data": {
    "id": "example-id"
  }
}
```

Aturan:

- `success` harus bernilai `true`.
- `data` berisi data yang dikembalikan oleh endpoint.
- Struktur `data` harus didokumentasikan untuk setiap endpoint.
- Tambahkan `meta` hanya jika endpoint benar-benar mendefinisikan metadata, seperti informasi paginasi.

Untuk endpoint yang mengembalikan daftar, `data` berupa array:

```json
{
  "success": true,
  "data": [
    {
      "id": "example-id",
      "title": "Example title"
    }
  ]
}
```

Jika paginasi diterapkan, dokumentasikan terlebih dahulu kolom `meta` secara tepat pada kontrak endpoint sebelum mengembalikannya.

### 7.2 Respons Tanpa Isi

Gunakan HTTP `204 No Content` hanya jika operasi berhasil dan kontrak API secara eksplisit menetapkan bahwa respons tidak memiliki isi (*body*). Respons `204` tidak boleh berisi format JSON maupun isi respons lainnya.

Sebagai contoh, operasi penghapusan yang berhasil dapat mengembalikan `204` jika kontrak API menetapkannya. Jika tidak, gunakan respons yang telah didokumentasikan, seperti HTTP `200`.

### 7.3 Respons Error

Untuk error yang memiliki isi respons, gunakan format berikut:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

Aturan:

- `success` harus bernilai `false`.
- `error.code` merupakan kode yang konsisten dan dapat dibaca oleh program.
- `error.message` merupakan pesan singkat yang aman ditampilkan kepada klien.
- `error.details` berupa array yang berisi detail aman terkait kolom atau informasi tambahan. Gunakan `[]` jika tidak ada detail.
- Jangan pernah mengembalikan stack trace, rahasia, nilai kata sandi, token, atau detail internal penyedia eksternal.

Contoh error validasi dengan detail:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "A valid email address is required"
      }
    ]
  }
}
```

### 7.4 Pemetaan Status HTTP

Gunakan status HTTP yang paling sesuai dengan hasil operasi. Perilaku khusus setiap endpoint harus didokumentasikan dalam `docs/api/api-contract-mvp.md`.

| Status HTTP | Arti | Contoh kode/penggunaan |
|---|---|---|
| `200 OK` | Berhasil dengan isi respons | Pembacaan atau pembaruan yang berhasil |
| `201 Created` | Sumber daya berhasil dibuat | Registrasi atau pembuatan tracker |
| `204 No Content` | Berhasil tanpa isi respons | Penghapusan, hanya jika ditentukan oleh kontrak |
| `400 Bad Request` | Input dari klien tidak valid | `VALIDATION_ERROR` |
| `401 Unauthorized` | Autentikasi tidak ada atau tidak valid | `UNAUTHENTICATED` |
| `403 Forbidden` | Pengguna yang terautentikasi tidak diizinkan melakukan tindakan | `FORBIDDEN` |
| `404 Not Found` | Sumber daya atau rute tidak ditemukan | `NOT_FOUND` |
| `409 Conflict` | Permintaan bertentangan dengan kondisi data yang ada | `CONFLICT` |
| `429 Too Many Requests` | API membatasi jumlah permintaan dari klien | `RATE_LIMITED` |
| `502 Bad Gateway` | Penyedia atau layanan upstream mengembalikan respons yang tidak dapat digunakan | `UPSTREAM_ERROR` |
| `503 Service Unavailable` | Layanan sementara tidak tersedia | `SERVICE_UNAVAILABLE` |
| `504 Gateway Timeout` | Permintaan ke layanan upstream mengalami timeout | `UPSTREAM_TIMEOUT` |
| `500 Internal Server Error` | Terjadi kesalahan internal yang tidak terduga | `INTERNAL_ERROR` |

Jangan langsung meneruskan status HTTP atau respons mentah dari penyedia eksternal tanpa pemeriksaan. Terjemahkan error penyedia ke status HTTP dan kode error publik yang telah ditetapkan untuk proyek ini.

## 8. Aturan Validasi dan Keamanan

- Validasi parameter query, parameter path, dan isi permintaan (*request body*).
- Gunakan `400` dengan `VALIDATION_ERROR` untuk input klien yang tidak valid.
- Gunakan `401` jika autentikasi tidak ada atau tidak valid.
- Gunakan `403` jika pengguna sudah terautentikasi, tetapi tidak memiliki izin untuk melakukan operasi.
- Periksa kepemilikan untuk seluruh operasi tracker yang mengakses data milik pengguna.
- Lakukan hashing kata sandi dan jangan mencatat atau mengembalikan kata sandi, token, maupun informasi rahasia ke log atau respons.
- Berikan pesan yang aman kepada klien. Simpan detail diagnostik di log dengan menghapus informasi sensitif.
- Catalog Service harus menangani timeout, pembatasan permintaan, dan gangguan penyedia eksternal.
- Respons API publik tidak boleh menampilkan data mentah dari penyedia eksternal.

## 9. Tanggung Jawab dan Serah Terima

**Backend**

- Memelihara kontrak API dan mengimplementasikan standar respons bersama.
- Menjaga agar perilaku endpoint dan status HTTP tetap sesuai dokumentasi.
- Menguji respons sukses, validasi, autentikasi, otorisasi, sumber daya yang tidak ditemukan, serta gangguan penyedia eksternal jika relevan.
- Memperbarui kontrak setelah perubahan API disetujui.

**Frontend**

- Membaca kontrak API dan menggunakan data respons sukses dari `data`.
- Menangani error menggunakan `error.code` dan pesan yang aman ditampilkan.
- Melaporkan kolom yang hilang atau ketidaksesuaian, bukan bergantung pada perilaku yang tidak terdokumentasi.

**QA**

- Menyusun pengujian berdasarkan kriteria penerimaan setiap endpoint dan kontrak API.
- Memverifikasi status HTTP, format respons, validasi, autentikasi, kepemilikan, dan gangguan penyedia eksternal.
- Melaporkan penyimpangan terhadap kontrak API yang telah didokumentasikan.

## 10. Kriteria Penyelesaian — MJ-026

- [ ] Dokumen telah di-commit sebagai `docs/api/backend-task-breakdown.md`.
- [ ] `docs/api/api-contract-mvp.md` telah diperiksa dan diselaraskan dengan standar respons.
- [ ] Tiket tugas Backend telah dibuat di GitHub Projects dan memiliki delapan kolom wajib.
- [ ] Setiap tiket memiliki kriteria penerimaan yang dapat diamati dan dependensi yang jelas.
- [ ] Standar respons telah dicatat dalam dokumentasi proyek dan dibagikan kepada Frontend serta QA.
- [ ] Masukan hasil peninjauan telah diselesaikan dan diterapkan pada dokumen.
- [ ] Pull Request telah ditinjau dan di-merge sesuai alur kerja repositori.

Jangan menandai suatu item sebagai selesai tanpa bukti. Dokumen tertulis saja tidak membuktikan bahwa tiket telah dibuat, pengujian telah berhasil, atau implementasi telah selesai.

## 11. Status dan Tindak Lanjut Git

Dokumen MJ-026 telah di-commit dan di-merge ke branch `develop` melalui Pull Request. Karena itu, langkah pembuatan branch, commit, push, dan pembukaan Pull Request untuk MJ-026 tidak perlu diulangi.

Jika ditemukan perubahan atau perbaikan pada dokumen ini, buat branch baru dari `develop`, lakukan perubahan, periksa hasilnya, lalu ajukan Pull Request baru dengan target `develop`.

Sebelum mengajukan perubahan, bandingkan `docs/api/api-contract-mvp.md` dengan standar ini dan perbaiki contoh yang bertentangan jika perubahan tersebut telah disepakati oleh tim.
