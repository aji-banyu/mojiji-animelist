# Dokumen Serah Terima Desain MVP (Design Handoff) — Mojiji AnimeList

* **Ticket ID:** `MJ-038`
* **Minggu:** 5 (Foundation)
* **Role Pengirim (PIC):** UI/UX Designer / Ican
* **Role Penerima:** Frontend Developer / Dika
* **Tembusan:** QA / Nadia, Backend / Syafii, DevOps / Aji
* **Status:** Diserahkan & Siap Dibangun (*Ready for Implementation*)
* **Dependensi Tiket:** `MJ-020` (Hi-Fi Auth), `MJ-036` (Hi-Fi Catalog), `MJ-037` (Hi-Fi Tracker)
* **Tautan Kanvas Figma Resmi:** [MOJIJI Design Canvas (Node 603-167)](https://www.figma.com/design/VOMA5k5k3d6oSUpKONJPpF/MOJIJI?node-id=603-167&t=aPgqBjBmzo28waIf-1)

---

## 1. Lembar Protokol Serah Terima Resmi (HANDOFF)

Sesuai dengan ketentuan tata kelola kolaborasi tim pada **Prompt Master Bagian 14**:

| Atribut Protokol | Rincian Serah Terima |
| :--- | :--- |
| **Dari Role** | UI/UX Designer (Ican) |
| **Kepada Role** | Frontend Developer (Dika) |
| **Tiket Terkait** | `MJ-038` (Serah Terima Desain MVP) |
| **Fitur yang Diserahkan** | Antarmuka lengkap MVP: Autentikasi, Beranda/Eksplorasi, Pencarian Katalog, Detail Judul Statis, dan Dashboard Tracker (+1 progres). |
| **Artefak yang Diserahkan** | 1. Kanvas Figma Node 603-167 (*Wireframe & Hi-Fi final Sprint 1*)<br>2. `docs/ui-ux/style-guide.md` (Spesifikasi visual & token warna)<br>3. `docs/ui-ux/user-flow-mvp.md` (Diagram alur navigasi & failure paths)<br>4. `docs/ui-ux/design-tokens.md` (Token CSS semantik & panduan komponen Shadcn) |
| **Permintaan ke Penerima** | Merakit seluruh antarmuka web statis Next.js berbasis token warna dan layout yang telah disepakati tanpa mengubah teks pesan error maupun tata letak query statis. |
| **Status Memblokir?** | **YA (Memblokir)** — Frontend membutuhkan kejelasan layout, state error, dan spesifikasi tombol sebelum menyelesaikan tiket integrasi API pada Minggu 6. |
| **Konfirmasi Penerimaan** | Frontend (Dika) menyatakan spesifikasi desain jelas, tidak ada asumsi terbuka, dan siap diimplementasikan. |

---

## 2. Checklist Rinci Spesifikasi Layar MVP

### 2.1 Halaman Autentikasi (`/login` & `/register`)
* **Layout:** Kontainer terpusat (*centered card*) dengan poster kolase redup (*poster collage*) pada background `#16171B`.
* **State Interaktif:**
  * Tombol CTA utama: Varian `primary` (`bg-accent` / `#6B68C6`) dengan state loading spinner saat proses submit.
  * Tombol Google Auth mockup: Varian `outline` dengan logo resmi 4-warna Google.
* **Teks Pesan Error Resmi (Wajib Sesuai AC PRD):**
  * Email ganda: *"Email sudah terdaftar"* (tampil jika backend merespons 409).
  * Password pendek: *"Password minimal 8 karakter"* (validasi form klien).
  * Kredensial salah: *"Email atau password salah"* (tampil jika backend merespons 401).

---

### 2.2 Halaman Beranda & Eksplorasi (`/home`, `/`, `/explore`, `/search`)
* **Hero Banner (`HeroBanner.jsx`):**
  * Menampilkan slider karusel dengan transisi *crossfade* halus 5 detik (`slide1.webp` s.d. `slide4.webp`).
* **Pengalih Tipe Media (`SegmentedSwitch.jsx`):**
  * Kapsul switch responsif untuk berganti antara kategori **Anime** dan **Manga**.
* **Pencarian Reusable (`SearchInput.jsx`):**
  * Input pencarian dengan ikon `Search` dan tombol reset `X`. Wajib menerapkan *debounce* 400ms dan minimal 3 karakter untuk mematuhi limitasi Tenrai API (4 req/detik).
* **Grid Kartu Katalog (`CatalogCard.js`):**
  * Responsivitas: 2 kolom pada Mobile (360 px) dan 4–5 kolom pada Desktop (1280 px).
  * Menampilkan poster cover (rasio 3:4), tag media (`#0EA5E9` Anime / `#F97316` Manga), dan badge skor MyAnimeList (`#E2A63E`).
* **Empty State:**
  * Jika kata kunci tidak ditemukan, tampilkan teks ramah: *"Tidak ada hasil pencarian"*.

---

### 2.3 Halaman Detail Judul (`/detail?type=anime|manga&id=malId`)
* **Ketentuan Teknis Arsitektur:**
  * Alamat rute menggunakan **query parameter statis** (`/detail?type=&id=`) dibungkus elemen `<Suspense>` untuk mendukung kompilasi `output: 'export'` Next.js tanpa server-side rendering.
* **Komponen Detail:**
  * Poster cover resolusi tinggi dengan efek bayangan lembut.
  * Rating badge skor numerik format koma (`RatingBadge.jsx`).
  * Sinopsis lengkap, informasi status penayangan, genre tag, dan jumlah episode/chapter.
  * Tombol utama **"Tambah ke Tracker"** dengan dropdown pemilihan 5 status.
* **State Penanganan Kesalahan:**
  * Jika ID tidak ditemukan (404): Tampilkan pesan *"Judul anime/manga tidak ditemukan"*.
  * Jika Tenrai terkena rate limit (429): Tampilkan pesan ramah *"Server sedang sibuk, silakan coba beberapa saat lagi"*.
  * Jika pengunjung belum login mencoba mengubah tracker: Alihkan langsung ke `/login`.

---

### 2.4 Halaman Dashboard Tracker (`/tracker` & `/dashboard`)
* **Proteksi Halaman:** Wajib login. Jika sesi cookie tidak ditemukan, alihkan ke `/login`.
* **Navigasi Tab Filter 5 Status:**
  * `Plan to Watch/Read` (Badge: `#4A7C9B` / Soft: `#233E54`)
  * `Watching / Reading` (Badge: `#8E639C` / Soft: `#3F2C4D`)
  * `Completed` (Badge: `#47876B` / Soft: `#1E4033`)
  * `On Hold` (Badge: `#A37B3E` / Soft: `#45361E`)
  * `Dropped` (Badge: `#EC5D74` / Soft: `#4A202A`)
* **Kartu Tracker (`TrackerCards.jsx`):**
  * Visualisasi bar progres episode/chapter tontonan.
  * **Tombol Cepat `+1` (Optimistic UI):**
    * Saat ditekan, angka progres bertambah seketika di layar (+1).
    * Jika simpan gagal ke server, angka dikembalikan (*rollback*) dan memunculkan notifikasi toast kesalahan.
    * Tombol dinonaktifkan otomatis saat progres sama dengan total episode (`progress === total`) atau status judul adalah `completed`.
* **Modal Ubah Status & Hapus (`TrackerEditModal.js`):**
  * Opsi mengubah status, mengedit angka progres manual, dan tombol hapus dengan konfirmasi bergaya `destructive` (`#EC5D74`).

---

## 3. Verifikasi Atribusi Footer Wajib

Sesuai aturan hak cipta dan PRD Poin 19:
* **Teks Atribusi Mutlak:** *"Data: MyAnimeList melalui Tenrai"*
* **Posisi:** Terpasang di bagian bawah seluruh halaman (*sticky global footer*) dengan tipografi 12 px warna `--text-2` (`#A5AAC0`).

---

## 4. Status Verifikasi Penerimaan (Acceptance Criteria Tiket MJ-038)

- [x] Kanvas Figma terorganisir rapi dan ditandai siap dibangun (*Ready for dev*).
- [x] Seluruh layar MVP (Auth, Home, Explore, Detail, Tracker) telah diserahkan dengan spesifikasi lengkap.
- [x] Nilai token warna dan komponen selaras dengan kode frontend riil (`apps/web/app/globals.css`).
- [x] Teks pesan kesalahan telah diverifikasi identik dengan Acceptance Criteria resmi PRD.
- [x] Penempatan footer atribusi resmi telah dipastikan.
- [x] Dokumen serah terima (HANDOFF) siap ditandatangani oleh Dika (Frontend).
