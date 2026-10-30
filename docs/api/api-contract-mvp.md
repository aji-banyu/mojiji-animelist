# API Contract MVP — Mojiji AnimeList

* **Status:** Disepakati untuk implementasi
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
  "success": true,
  "data": {}
}
```

Untuk response berupa daftar:

```json
{
  "success": true,
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
  "success": false,
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

* **Status:** Terimplementasi (Tiket `MJ-043`)
* **Tujuan:** Membuat akun pengguna baru.
* **Autentikasi:** Publik (tanpa login / cookie).
* **Base URL:**
  * Direct Service (Lokal Development): `http://localhost:4001`
  * Melalui API Gateway (Tiket MJ-045): `http://localhost:4000`
  * Staging / Production: `https://staging.<domain>` / `https://<domain>`

#### Request Headers
| Header | Nilai | Keterangan |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Wajib |

#### Request Body Schema (JSON)
| Field | Tipe | Wajib? | Aturan Validasi |
| :--- | :--- | :--- | :--- |
| `username` | `string` | Ya | 3–50 karakter, alfanumerik dan garis bawah |
| `email` | `string` | Ya | Format email valid, maksimal 255 karakter |
| `password` | `string` | Ya | Minimal 8 karakter (sesuai AC US-007) |

Contoh request:
```json
{
  "username": "contoh_user",
  "email": "user@example.com",
  "password": "example-password"
}
```

#### Status HTTP & Response

* **`201 Created`** — Akun berhasil dibuat dan disimpan ke database. Password tidak dikembalikan.
```json
{
  "success": true,
  "data": {
    "id": "e4b2d56a-1f87-4948-a0c5-343219488a01",
    "username": "contoh_user",
    "email": "user@example.com",
    "createdAt": "2026-10-30T13:20:56.044Z"
  }
}
```

* **`400 Bad Request`** — Validasi input gagal (password < 8 karakter, email tidak valid, username kosong/spesial karakter).
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validasi input gagal",
    "details": [
      "Password minimal terdiri dari 8 karakter"
    ]
  }
}
```

* **`409 Conflict`** — Username atau email sudah digunakan di sistem.
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT_ERROR",
    "message": "Email atau username sudah digunakan",
    "details": [
      "Email sudah digunakan"
    ]
  }
}
```

* **`500 Internal Server Error`** — Kesalahan internal server (koneksi database terputus/gagal). Tidak membocorkan stack trace.
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Terjadi kesalahan pada server saat memproses registrasi"
  }
}
```

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
  "success": true,
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

* [x] Format final response sukses dan error.
* [x] Status HTTP final untuk tiap kondisi.
* [x] Mekanisme autentikasi, sesi, dan cookie.
* [x] Field final request dan response sesuai skema database.
* [x] Enum status tracker.
* [x] Aturan duplikasi judul pada tracker.
* [x] Aturan pagination dan batas `limit`.
* [x] Pemetaan error provider katalog ke response internal.
* [x] Review kontrak bersama Frontend dan QA.

## 8. Keputusan Autentikasi, Sesi Cookie, dan CORS

**Status:** Disepakati untuk implementasi.

### 8.1. Mekanisme Autentikasi

- Autentikasi menggunakan sesi yang dikelola oleh Backend.
- Browser menggunakan cookie untuk mengirimkan sesi pada request yang memerlukan autentikasi.
- Frontend tidak menyimpan session ID atau token autentikasi di `localStorage`.
- Endpoint `GET /api/users/me` digunakan untuk memperoleh informasi pengguna yang sedang login.
- Endpoint `POST /api/auth/logout` mengakhiri sesi dan menghapus atau menonaktifkan cookie sesi.
- Detail penyimpanan, masa berlaku, dan invalidasi sesi perlu ditetapkan oleh Backend.

### 8.2. Konfigurasi Cookie

Usulan konfigurasi cookie sesi:

- `HttpOnly`: aktif agar JavaScript di browser tidak dapat membaca cookie sesi.
- `Secure`: aktif pada lingkungan HTTPS.
- `SameSite`: Lax sebagai pilihan awal, dengan keputusan akhir berdasarkan arsitektur deployment.
- `Path`: `/`.
- Masa berlaku dan kebijakan kedaluwarsa sesi: ditetapkan sesuai kebijakan Backend.

Cookie sesi tidak boleh memuat kata sandi atau informasi rahasia pengguna secara langsung. Nilai cookie sesi tidak boleh dicatat ke log.

### 8.3. API Gateway dan Base URL

- Frontend berkomunikasi melalui API Gateway, bukan langsung ke layanan internal.
- Prefix endpoint API yang digunakan dalam kontrak ini adalah `/api`.
- Path `/api` melalui domain frontend dengan reverse proxy digunakan sebagai pendekatan arsitektur.
- Base URL development, staging, dan production harus dikonfirmasi bersama Backend dan DevOps.

### 8.4. CORS dan CSRF

- Jika API diakses melalui same-origin reverse proxy, konfigurasi CORS untuk request browser tersebut umumnya tidak diperlukan.
- Jika Frontend dan API menggunakan origin berbeda, Backend harus menentukan origin yang diizinkan serta konfigurasi credentials secara eksplisit.
- Jangan menggunakan wildcard origin (`*`) untuk request credentialed.
- Backend perlu mengevaluasi dan menetapkan perlindungan CSRF untuk endpoint yang mengubah data dan menggunakan autentikasi berbasis cookie.

### 8.5. Hal yang Perlu Dikonfirmasi

- [x] Backend menetapkan penyimpanan sesi, masa berlaku, dan mekanisme invalidasi sesi.
- [x] Backend dan DevOps menetapkan base URL API Gateway untuk setiap environment.
- [x] Frontend mengonfirmasi cara mengirim request dengan cookie sesi.
- [x] Backend menetapkan strategi CORS dan CSRF sesuai arsitektur akhir.
- [x] QA meninjau skenario login, logout, sesi kedaluwarsa, akses tanpa autentikasi, dan akses lintas origin jika digunakan.

**Catatan:** Bagian ini adalah usulan kontrak. Tandai sebagai final hanya setelah keputusan terkait dikonfirmasi oleh pihak yang bertanggung jawab.