# API Contract MVP — Mojiji AnimeList

* **Status:** Draft untuk review Backend, Frontend, dan QA
* **Scope:** Authentication, User Profile, Catalog, dan Tracker
* **Acuan:** Mojiji PRD Revisi 4, bagian 18 — API Overview
* **Catatan:** Detail kontrak yang belum ditetapkan dalam PRD merupakan usulan awal dan perlu disepakati tim sebelum implementasi.

## 1. Konvensi Umum

* Prefix API: `/api`
* Format request dan response: JSON.
* Endpoint personal wajib memeriksa sesi pengguna.
* Seluruh input harus divalidasi.
* Password harus di-hash sebelum disimpan.
* Response eksternal dari provider katalog tidak boleh diteruskan mentah; Catalog Service harus menormalisasi data.
* Format response sukses dan error harus konsisten di seluruh service.

### 1.1 Usulan Response Sukses

```json
{
  "data": {}
}
```

Untuk response berupa daftar:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10
  }
}
```

`meta` digunakan jika pagination diterapkan.

### 1.2 Usulan Response Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

`details` dapat digunakan untuk memberikan informasi field yang tidak valid. Informasi sensitif seperti password dan cookie sesi tidak boleh dimasukkan ke response atau log.

## 2. Authentication dan User Profile

### 2.1 POST /api/auth/register

**Tujuan:** Membuat akun baru.

Contoh request awal:

```json
{
  "username": "contoh_user",
  "email": "user@example.com",
  "password": "example-password"
}
```

Usulan status HTTP:

* `201 Created` — akun berhasil dibuat.
* `400 Bad Request` — input tidak valid.
* `409 Conflict` — username atau email sudah digunakan, jika berlaku.
* `500 Internal Server Error` — kesalahan internal.

Password wajib di-hash sebelum disimpan. Field request perlu disesuaikan dengan keputusan tim.

### 2.2 POST /api/auth/login

**Tujuan:** Memulai sesi pengguna.

Contoh request:

```json
{
  "email": "user@example.com",
  "password": "example-password"
}
```

Usulan status HTTP:

* `200 OK` — login berhasil.
* `400 Bad Request` — input tidak valid.
* `401 Unauthorized` — kredensial salah.
* `500 Internal Server Error` — kesalahan internal.

Mekanisme sesi dan cookie perlu mengikuti keputusan autentikasi tim. Cookie atau session tidak boleh dibocorkan ke log.

### 2.3 POST /api/auth/logout

**Tujuan:** Mengakhiri sesi pengguna.

Usulan status HTTP:

* `200 OK` — logout berhasil.
* `401 Unauthorized` — sesi tidak valid, jika diwajibkan kebijakan tim.
* `500 Internal Server Error` — kesalahan internal.

Sesi harus diakhiri dan cookie sesi dihapus atau dinonaktifkan sesuai mekanisme autentikasi yang dipilih.

### 2.4 GET /api/users/me

**Tujuan:** Mengambil informasi akun yang sedang login.

Autentikasi: wajib.

Contoh response awal:

```json
{
  "data": {
    "id": "user-id",
    "username": "contoh_user",
    "email": "user@example.com"
  }
}
```

Usulan status HTTP:

* `200 OK` — profil berhasil diambil.
* `401 Unauthorized` — belum login atau sesi tidak valid.
* `500 Internal Server Error` — kesalahan internal.

Field profil merupakan contoh awal yang perlu dicocokkan dengan model data dan kebutuhan UI.

## 3. Catalog

### 3.1 GET /api/catalog/search?type=anime&q=naruto

**Tujuan:** Mencari anime atau manga melalui Catalog Service.

Query parameter:

* `type`: `anime` atau `manga`, wajib.
* `q`: kata kunci pencarian, wajib.
* `page`: nomor halaman, opsional jika pagination diterapkan.
* `limit`: jumlah hasil, opsional jika pagination diterapkan.

Usulan status HTTP:

* `200 OK` — pencarian berhasil.
* `400 Bad Request` — parameter tidak valid.
* `429 Too Many Requests` — pembatasan request berlaku.
* `502 Bad Gateway` — provider gagal memberikan respons yang valid.
* `504 Gateway Timeout` — provider mengalami timeout.
* `500 Internal Server Error` — kesalahan internal lainnya.

Catalog Service harus menangani network error, rate limit, timeout, dan downtime provider tanpa membuat seluruh aplikasi crash.

### 3.2 GET /api/catalog/:type/:malId

**Tujuan:** Mengambil detail anime atau manga.

Contoh endpoint:

* `/api/catalog/anime/1`
* `/api/catalog/manga/1`

Parameter:

* `type`: `anime` atau `manga`.
* `malId`: ID judul pada provider.

Usulan field data katalog:

* `id`
* `type`
* `title`
* `image`
* `synopsis`
* `score`
* `totalEpisodes`, jika tersedia.
* `totalChapters`, jika tersedia.

Usulan status HTTP:

* `200 OK` — detail ditemukan.
* `400 Bad Request` — parameter tidak valid.
* `404 Not Found` — judul tidak ditemukan.
* `429 Too Many Requests` — pembatasan request berlaku.
* `502 Bad Gateway` — provider mengembalikan respons tidak valid.
* `504 Gateway Timeout` — provider mengalami timeout.
* `500 Internal Server Error` — kesalahan internal lainnya.

Field final harus diverifikasi terhadap dokumentasi provider dan pengujian aktual. Tidak semua field selalu tersedia.

## 4. Tracker

Seluruh endpoint tracker hanya boleh mengakses data milik pengguna yang sedang login. Pemeriksaan kepemilikan wajib dilakukan sebelum perubahan data.

### 4.1 GET /api/tracker?status=watching

**Tujuan:** Mengambil daftar tracker milik pengguna.

Query parameter:

* `status`: filter status opsional; nilai yang diperbolehkan harus disepakati tim.

Usulan status HTTP:

* `200 OK` — daftar berhasil diambil.
* `400 Bad Request` — filter tidak valid.
* `401 Unauthorized` — belum login.
* `500 Internal Server Error` — kesalahan internal.

### 4.2 POST /api/tracker

**Tujuan:** Menambahkan judul ke tracker.

Contoh request awal:

```json
{
  "type": "anime",
  "malId": 1,
  "status": "watching",
  "progress": 0
}
```

Usulan status HTTP:

* `201 Created` — tracker berhasil dibuat.
* `400 Bad Request` — input tidak valid.
* `401 Unauthorized` — belum login.
* `409 Conflict` — judul sudah ada di tracker, jika dibatasi unique constraint.
* `500 Internal Server Error` — kesalahan internal.

Field request perlu diselaraskan dengan skema database.

### 4.3 PATCH /api/tracker/:id/status

**Tujuan:** Mengubah status tracker.

Contoh request:

```json
{
  "status": "completed"
}
```

Nilai status yang diperbolehkan harus disamakan dengan enum database dan kebutuhan UI.

Usulan status HTTP:

* `200 OK` — status berhasil diperbarui.
* `400 Bad Request` — status tidak valid.
* `401 Unauthorized` — belum login.
* `404 Not Found` — tracker tidak ditemukan atau tidak dapat diakses pengguna.
* `500 Internal Server Error` — kesalahan internal.

### 4.4 POST /api/tracker/:id/increment

**Tujuan:** Menambah progres tracker sebesar satu.

Aturan awal:

* Progres bertambah satu jika request valid.
* Jika total episode atau chapter diketahui, validasi batas progres.
* Periksa kepemilikan tracker sebelum mengubah data.

Usulan status HTTP:

* `200 OK` — progres berhasil diperbarui.
* `400 Bad Request` — progres tidak valid atau melewati batas yang diketahui.
* `401 Unauthorized` — belum login.
* `404 Not Found` — tracker tidak ditemukan atau tidak dapat diakses pengguna.
* `500 Internal Server Error` — kesalahan internal.

### 4.5 DELETE /api/tracker/:id

**Tujuan:** Menghapus tracker milik pengguna.

Usulan status HTTP:

* `204 No Content` — tracker berhasil dihapus.
* `401 Unauthorized` — belum login.
* `404 Not Found` — tracker tidak ditemukan atau tidak dapat diakses pengguna.
* `500 Internal Server Error` — kesalahan internal.

## 5. Keamanan dan Keandalan

* Hash password sebelum disimpan.
* Validasi seluruh input.
* Periksa sesi untuk endpoint personal.
* Periksa kepemilikan sebelum mengubah atau menghapus tracker.
* Jangan mencatat password, cookie sesi, atau secret ke log.
* Simpan konfigurasi rahasia di environment atau secret store, bukan di repository.
* Tangani timeout, network error, HTTP 429, dan downtime provider katalog.
* Terapkan HTTPS pada URL publik.
* Verifikasi kembali rate limit provider saat implementasi karena dapat berubah.

## 6. Di Luar Scope Kontrak MVP Ini

Endpoint komentar dan notifikasi/reminder belum dirinci dalam dokumen ini. Kontrak keduanya perlu ditetapkan sebelum implementasi apabila fitur tersebut masuk ke scope MVP yang disepakati.

## 7. Hal yang Perlu Disepakati Sebelum Implementasi

* [ ] Format final response sukses dan error.
* [ ] Status HTTP final untuk tiap kondisi.
* [ ] Mekanisme autentikasi, sesi, dan cookie.
* [ ] Field final request dan response sesuai skema database.
* [ ] Enum status tracker.
* [ ] Aturan duplikasi judul pada tracker.
* [ ] Aturan pagination dan batas `limit`.
* [ ] Pemetaan error provider katalog ke response internal.
* [ ] Review kontrak bersama Frontend dan QA.
