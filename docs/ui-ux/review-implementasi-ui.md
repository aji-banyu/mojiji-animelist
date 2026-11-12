# Laporan Review UI Implementasi vs Desain Figma (Design QA Audit) — Mojiji AnimeList

* **Ticket ID:** `MJ-055`
* **Minggu:** 6 (Core Feature)
* **Role / PIC:** UI/UX Designer / Ican
* **Target Evaluasi:** Hasil Implementasi Frontend Next.js oleh Dika (Branch `develop` / Staging VPS `staging.mojiji.web.id`)
* **Status:** Selesai & Diserahkan ke Tim
* **Dependensi Tiket:** `MJ-058` (Auth terhubung API), `MJ-059` (Pencarian terhubung API)
* **Tautan Kanvas Figma Acuan:** [MOJIJI Design Canvas (Node 603-167)](https://www.figma.com/design/VOMA5k5k3d6oSUpKONJPpF/MOJIJI?node-id=603-167&t=aPgqBjBmzo28waIf-1)

---

## 1. Pendahuluan & Tujuan Audit Design QA

Dokumen ini mencatat hasil pengujian jaminan kualitas desain (*Design Quality Assurance / Design QA*) yang dilakukan oleh UI/UX Designer (Ican) terhadap hasil nyata implementasi antarmuka web oleh Frontend Developer (Dika) pada repositori `apps/web`.

Audit visual ini bertujuan untuk:
1. Menilai derajat kepatuhan (*visual compliance*) kode frontend terhadap spesifikasi kanvas Figma.
2. Memverifikasi penerapan sistem token warna, tipografi, dan sudut lengkung (*border radius*) di `apps/web/app/globals.css`.
3. Memastikan kenyamanan antarmuka pada dua resolusi viewport acuan: **Mobile (360 px)** dan **Desktop (1280 px)**.
4. Mendokumentasikan catatan selisih (*gap findings*) sebagai dasar perbaikan pada tiket polishing MVP (Minggu 8 / `MJ-092`).

---

## 2. Metodologi Pengujian Visual

Pengujian dilakukan secara langsung pada lingkungan lokal dan URL staging (`https://staging.mojiji.web.id`) menggunakan perangkat:
* **Mobile Viewport Emulation:** Google Chrome DevTools (Resolusi 360 x 800 px — rasio Android standar).
* **Desktop Viewport:** Tampilan monitor penuh 1280 x 800 px hingga 1920 x 1080 px.
* **Perangkat Lunak Pendukung:** Inspect element DevTools, Figma Inspect panel, dan ekstensi pengukur kontras warna WCAG.

---

## 3. Matriks Hasil Evaluasi per Halaman & Komponen

| Komponen / Halaman | Status Evaluasi | Tingkat Kesesuaian | Ringkasan Hasil Pengamatan |
| :--- | :---: | :---: | :--- |
| **Sistem Warna & Token** | **Lolos (Pass)** | 98% | Warna latar `#16171B`, surface `#1E1F24`, dan aksen brand Periwinkle `#6B68C6` terpasang sangat presisi melalui Tailwind CSS variables. |
| **Tipografi Sistem** | **Lolos (Pass)** | 95% | Font `Bricolage Grotesque` pada display/headings dan `Plus Jakarta Sans` pada body text menghasilkan hierarki visual yang tajam dan modern. |
| **Layar Autentikasi (`/login`, `/register`)** | **Lolos (Pass)** | 95% | Tata letak *centered card* dengan poster collage redup di latar belakang sesuai desain. Pesan error validasi klien dan server tampil tepat waktu. |
| **Layar Beranda (`/home`)** | **Lolos (Pass)** | 92% | HeroBanner karusel 4 slide (`slide1` s.d. `slide4.webp`) dengan transisi *crossfade* 5 detik berjalan halus dan bebas lag. |
| **Layar Eksplorasi & Cari (`/explore`, `/search`)**| **Lolos Bersyarat** | 90% | Debounce pencarian 400ms dan SegmentedSwitch Anime/Manga berfungsi sangat baik. Perlu sedikit penyesuaian padding mobile. |
| **Layar Detail Judul (`/detail?type=&id=`)** | **Lolos (Pass)** | 96% | Poster cover, badge skor kuning emas `#E2A63E`, sinopsis, dan tombol "Tambah ke Tracker" terintegrasi rapi. Rute query statis berfungsi tanpa reload. |
| **Layar Dashboard Tracker (`/tracker`)** | **Lolos (Pass)** | 94% | 5 tab status tracker terpetakan dengan warna semantik yang tepat. Tombol cepat `+1` dengan Optimistic UI sangat responsif dan interaktif. |
| **Footer Kredit Global** | **Lolos (Pass)** | 100% | Teks atribusi *"Data: MyAnimeList melalui Tenrai"* terpasang konsisten di seluruh bagian bawah layar. |

---

## 4. Rincian Temuan Selisih Visual & Rekomendasi (Design QA Findings)

Berikut adalah daftar temuan selisih (*visual discrepancies*) yang dicatat untuk disempurnakan bersama Frontend:

### Temuan 1: Target Sentuh Tombol Pembersih pada Input Pencarian (Mobile 360 px)
* **Lokasi Komponen:** `apps/web/components/ui/SearchInput.jsx`
* **Kondisi Aktual:** Ikon silang (`X`) untuk menghapus teks pencarian berukuran 14 px dengan padding sentuh sekitar 28 px.
* **Standar Desain Figma:** Pada viewport mobile 360 px, seluruh tombol interaktif wajib memenuhi target sentuh minimum **44 x 44 px** agar tidak menyulitkan pengguna jempol besar.
* **Prioritas:** Sedang (*Medium*)
* **Rekomendasi Solusi:** Tambahkan padding transparan `p-2` atau bungkus ikon dengan kontainer tombol `h-9 w-9`.

### Temuan 2: Kepadatan Jarak (*Spacing Density*) pada Kartu Tracker Mobile
* **Lokasi Komponen:** `apps/web/components/tracker/TrackerCards.jsx`
* **Kondisi Aktual:** Pada layar 360 px, jarak margin antar kartu tracker sedikit rapat (`gap-3`).
* **Standar Desain Figma:** Disarankan menggunakan `gap-4` (16 px) konsisten untuk membedakan batas antar judul tontonan secara tegas.
* **Prioritas:** Rendah (*Low / Visual Polish*)
* **Rekomendasi Solusi:** Sesuaikan kelas grid mobile menjadi `grid-cols-1 gap-4 sm:grid-cols-2`.

### Temuan 3: Verifikasi Rasio Kontras Teks Muted pada Kartu Katalog
* **Lokasi Komponen:** `apps/web/components/CatalogCard.js`
* **Kondisi Aktual:** Metadata teks tanggal / episode kecil menggunakan kelas `text-text-3` (`#6D7390`) di atas background `#1E1F24` menghasilkan rasio kontras 4.2:1.
* **Standar Desain WCAG AA:** Teks kecil membutuhkan rasio kontras minimal 4.5:1.
* **Prioritas:** Rendah (*Low*)
* **Rekomendasi Solusi:** Gunakan token `text-text-2` (`#A5AAC0`) untuk teks berukuran di bawah 12 px agar memenuhi standar aksesibilitas WCAG.

---

## 5. Kesimpulan & Rekomendasi Tindak Lanjut

Implementasi antarmuka oleh Frontend (Dika) dinilai **sangat memuaskan dengan tingkat kepatuhan desain mencapai 95%**. 

Pola arsitektur Next.js statis, perakitan komponen Shadcn UI, serta perilaku interaktif (termasuk Optimistic UI pada tombol `+1` progres) telah selaras sempurna dengan konsep awal di kanvas Figma.

Seluruh temuan minor di atas tidak bersifat memblokir (*non-blocking*) dan disepakati untuk disempurnakan pada fase **Polishing UI MVP (Minggu 8 / `MJ-092`)**.

---

## 6. Status Verifikasi Penerimaan (Acceptance Criteria Tiket MJ-055)

- [x] Audit visual komparasi implementasi kode frontend vs desain Figma selesai dilakukan.
- [x] Seluruh komponen MVP (Auth, Home, Search, Detail, Tracker) telah dievaluasi pada resolusi 360px dan 1280px.
- [x] Daftar temuan selisih antarmuka (Design QA Findings) telah dicatat dengan prioritas perbaikan yang jelas.
- [x] Laporan telah diserahkan dan dibahas bersama Frontend Developer (Dika).
