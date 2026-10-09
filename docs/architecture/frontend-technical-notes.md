# Catatan Teknis Frontend — Mojiji (AnimeList)

**Dokumen:** `docs/architecture/frontend-technical-notes.md`
**Tiket:** MJ-005
**Role:** Frontend (Dika)
**Tanggal:** 2026-10-07
**Versi:** 1.0

---

## 1. Ringkasan Stack Frontend

| Item | Pilihan | Keterangan |
|---|---|---|
| Framework | Next.js 15 (App Router) | JavaScript, bukan TypeScript |
| UI Library | Shadcn UI (style: `base-nova`, base color: `neutral`) | Komponen di `@/components/ui` |
| State Management | Zustand 5 | Store global untuk sesi, tracker, dan pencarian |
| Styling | Tailwind CSS 4 + CSS Variables | Konfigurasi via `app/globals.css` |
| Icon | Lucide React | Sudah terpasang via Shadcn |
| Font | Geist Sans + Geist Mono | Via `next/font/google` |
| Package Manager | npm | |
| Dev Server | `npm run dev` (Turbopack) | Port default: `3000` |

---

## 2. Daftar Halaman (Routes)

Semua route menggunakan **App Router** (`app/` directory).

| Route | File | Halaman | Auth Required | Sprint |
|---|---|---|---|---|
| `/` | `app/page.js` | Landing / Home | Tidak | Sprint 1 |
| `/login` | `app/(auth)/login/page.js` | Login | Tidak (redirect jika sudah login) | Sprint 1 |
| `/register` | `app/(auth)/register/page.js` | Register | Tidak (redirect jika sudah login) | Sprint 1 |
| `/search` | `app/search/page.js` | Pencarian Anime & Manga | Tidak | Sprint 1 |
| `/anime/[malId]` | `app/anime/[malId]/page.js` | Detail Anime | Tidak | Sprint 1 |
| `/manga/[malId]` | `app/manga/[malId]/page.js` | Detail Manga | Tidak | Sprint 1 |
| `/tracker` | `app/tracker/page.js` | Dashboard Tracker | **Ya** | Sprint 1 |
| `/profile` | `app/profile/page.js` | Profil Pengguna | **Ya** | Sprint 2 |

### Catatan Route

- Route `(auth)` menggunakan **Route Group** Next.js agar tidak muncul di URL.
- Route `/tracker` dan `/profile` harus mengecek sesi sebelum render. Jika tidak ada sesi, redirect ke `/login`.
- `malId` adalah ID judul (MAL ID) yang didapatkan dari Tenrai API v1 melalui Catalog Service (integer).

---

## 3. Target Struktur Folder `apps/web/`

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.js
│   │   └── register/
│   │       └── page.js
│   ├── anime/
│   │   └── [malId]/
│   │       └── page.js
│   ├── manga/
│   │   └── [malId]/
│   │       └── page.js
│   ├── search/
│   │   └── page.js
│   ├── tracker/
│   │   └── page.js
│   ├── profile/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js          ← Root layout (Navbar masuk di sini)
│   └── page.js            ← Landing / Home
│
├── components/
│   ├── ui/                ← Komponen Shadcn (auto-generated, jangan diedit manual)
│   ├── Navbar.js          ← Navigasi utama
│   ├── TrackerCard.js     ← Kartu item di dashboard tracker
│   ├── AnimeCard.js       ← Kartu hasil pencarian
│   └── StatusBadge.js     ← Badge status (Plan, Watching, dll.)
│
├── lib/
│   ├── utils.js           ← Utility (sudah ada dari Shadcn)
│   └── api.js             ← Fungsi fetch ke API Gateway
│
├── store/
│   ├── authStore.js       ← State sesi pengguna
│   ├── trackerStore.js    ← State data tracker
│   └── searchStore.js     ← State hasil pencarian
│
├── hooks/                 ← Custom React hooks (jika dibutuhkan)
│
├── public/
├── package.json
└── next.config.mjs
```

> **Catatan:** Folder `store/` ditambahkan manual (belum ada dari init Next.js).

---

## 4. State Management — Zustand Stores

### 4.1 `authStore.js`

Menyimpan data sesi pengguna yang sedang login.

| State / Action | Tipe | Keterangan |
|---|---|---|
| `user` | `object \| null` | Data pengguna: `{ id, username, email }` |
| `isLoggedIn` | `boolean` | Derived dari `user !== null` |
| `isLoading` | `boolean` | Saat proses login/logout berlangsung |
| `login(userData)` | `function` | Set `user` dan `isLoggedIn = true` |
| `logout()` | `function` | Reset `user` ke `null` |

**Sumber data:** Respons dari `POST /api/auth/login` via API Gateway.

**Persistensi:** Sesi dikelola oleh cookie httpOnly di backend (User Service). Zustand hanya menyimpan data untuk kebutuhan render; bukan pengganti cookie.

---

### 4.2 `trackerStore.js`

Menyimpan daftar item tracker milik pengguna yang sedang login.

| State / Action | Tipe | Keterangan |
|---|---|---|
| `items` | `array` | Daftar tracker item |
| `isLoading` | `boolean` | Saat fetching data tracker |
| `error` | `string \| null` | Pesan error jika fetch gagal |
| `fetchItems()` | `function` | Ambil data dari `GET /api/tracker` |
| `addItem(data)` | `function` | Tambah item baru via `POST /api/tracker` |
| `updateStatus(id, status)` | `function` | Ubah status via `PATCH /api/tracker/:id` |
| `incrementProgress(id)` | `function` | Progres +1 via `POST /api/tracker/:id/increment` |
| `removeItem(id)` | `function` | Hapus item via `DELETE /api/tracker/:id` |

**Struktur satu item tracker:**
```js
{
  id: "uuid",
  mal_id: 1,
  media_type: "anime", // atau "manga"
  title: "Naruto",
  image_url: "https://...",
  status: "watching", // plan | watching | reading | completed | on_hold | dropped
  progress: 5,
  total: 220,
  updated_at: "2026-10-07T..."
}
```

**Status yang valid:**

| Nilai | Label | Untuk |
|---|---|---|
| `plan` | Plan to Watch / Plan to Read | Anime & Manga |
| `watching` | Sedang Menonton | Anime |
| `reading` | Sedang Membaca | Manga |
| `completed` | Selesai | Anime & Manga |
| `on_hold` | Ditunda | Anime & Manga |
| `dropped` | Dihentikan | Anime & Manga |

---

### 4.3 `searchStore.js`

Menyimpan state hasil pencarian anime/manga.

| State / Action | Tipe | Keterangan |
|---|---|---|
| `query` | `string` | Kata kunci pencarian |
| `type` | `"anime" \| "manga"` | Filter tipe konten |
| `results` | `array` | Daftar hasil dari Catalog Service |
| `isLoading` | `boolean` | Saat request pencarian berlangsung |
| `error` | `string \| null` | Pesan error jika pencarian gagal |
| `search(query, type)` | `function` | Fetch ke `GET /api/catalog/search?q=...&type=...` |
| `clearResults()` | `function` | Reset results ke array kosong |

---

## 5. Integrasi API

Frontend berkomunikasi **hanya** dengan **API Gateway**. Frontend tidak boleh memanggil service internal (User Service, Catalog Service, dll.) secara langsung.

**Base URL API Gateway:**
```
Development : http://localhost:4000   ← ASSUMPTION, perlu dikonfirmasi ke Backend
Staging     : (ditentukan DevOps)
Production  : (ditentukan DevOps)
```

Base URL disimpan sebagai environment variable di `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> **DECISION NEEDED — untuk Backend (Syafii):** Frontend membutuhkan konfirmasi port dan prefix path API Gateway sebelum implementasi fitur dimulai.

### Endpoint yang Akan Dikonsumsi Frontend (Sprint 1)

| Method | Endpoint | Dipakai di Halaman |
|---|---|---|
| `POST` | `/api/auth/register` | `/register` |
| `POST` | `/api/auth/login` | `/login` |
| `POST` | `/api/auth/logout` | Navbar |
| `GET` | `/api/users/me` | Root layout (cek sesi saat load) |
| `GET` | `/api/catalog/search?q=...&type=...` | `/search` |
| `GET` | `/api/catalog/:type/:malId` | `/anime/[malId]`, `/manga/[malId]` |
| `GET` | `/api/tracker` | `/tracker` |
| `POST` | `/api/tracker` | Halaman detail |
| `PATCH` | `/api/tracker/:id` | `/tracker` |
| `POST` | `/api/tracker/:id/increment` | `/tracker` |
| `DELETE` | `/api/tracker/:id` | `/tracker` |

**Kontrak lengkap setiap endpoint** (request body, response shape, error codes) ada di `docs/api/` — dikerjakan Backend dan disepakati bersama sebelum coding fitur.

---

## 6. Penanganan Sesi & Auth Guard

- Sesi pengguna diverifikasi via `GET /api/users/me` saat aplikasi pertama kali dimuat.
- Jika respons `401`, `authStore` direset dan pengguna diarahkan ke `/login`.
- Halaman yang membutuhkan auth (`/tracker`, `/profile`) dicek di level page atau via Next.js middleware.
- Cookie dikelola oleh browser secara otomatis (httpOnly cookie dari backend). Frontend **tidak** menyimpan token di `localStorage`.

---

## 7. Konvensi Kode

| Hal | Konvensi | Contoh |
|---|---|---|
| Komponen | PascalCase | `AnimeCard.js`, `Navbar.js` |
| Store Zustand | camelCase + suffix `Store` | `authStore.js` |
| Fungsi API | Dipusatkan di `lib/api.js` | Jangan tulis `fetch` inline di komponen |
| Komponen Shadcn | Jangan diedit langsung | Bungkus di komponen baru jika perlu modifikasi |
| Import alias | Gunakan `@/` | `import { Button } from "@/components/ui/button"` |

---

## 8. Dependensi ke Role Lain

| Kebutuhan Frontend | Dari Role | Status |
|---|---|---|
| Desain halaman (wireframe / mockup) tiap page | UI/UX — Ican | ASSUMPTION: dikerjakan paralel di Sprint 1 |
| Kontrak API seluruh endpoint Sprint 1 | Backend — Syafii | ASSUMPTION: selesai sebelum implementasi fitur |
| Konfirmasi port dan prefix path API Gateway | Backend — Syafii | **DECISION NEEDED** |
| Konfirmasi skema field objek `tracker` item | Backend (Syafii) + DBA (Ryan) | **DECISION NEEDED** |
| Konfirmasi struktur data hasil mapping Tenrai API v1 | Backend (Syafii) | **DECISION NEEDED** |

---

## 9. Catatan Risiko

| Risiko | Mitigasi |
|---|---|
| API Gateway belum siap saat frontend mulai coding | Buat mock API lokal (JSON statis) agar frontend tidak terhenti |
| Kontrak API berubah setelah frontend sudah coding | Ikuti proses CHANGE REQUEST; jangan ubah diam-diam |
| Shadcn update breaking saat `npx shadcn add` | Pin versi Shadcn di `package.json` jika muncul masalah kompatibilitas |

---

*Dokumen ini adalah catatan kerja Frontend dan bukan pengganti API Contract resmi di `docs/api/`.
Setiap item bertanda ASSUMPTION atau DECISION NEEDED harus dikonfirmasi ke role terkait sebelum implementasi fitur dimulai.*
