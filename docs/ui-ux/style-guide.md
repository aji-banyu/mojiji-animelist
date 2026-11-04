# Style Guide & Pedoman Visual — Mojiji AnimeList

* **Ticket ID:** `MJ-001`
* **Minggu:** 3 (Project Planning)
* **Role / PIC:** UI/UX Designer / Ican
* **Status:** Final & Terverifikasi
* **Tautan Berkas Figma:** Ruang Kerja Tim `MOJIJI Design` (Halaman `Style Guide`)

---

## 1. Pendahuluan & Tujuan Desain

Pedoman visual (*Style Guide*) ini disusun sebagai acuan tunggal kebenaran (*single source of truth*) antarmuka web **Mojiji AnimeList**. Desain mengusung konsep antarmuka minimalis, berkinerja cepat, modern, dan bebas distraksi untuk mempermudah penggemar anime/manga mencatat jurnal tontonan/bacaan mereka dalam 1–2 ketukan.

Sistem desain dirancang selaras dengan pustaka komponen **Shadcn UI** dan **Tailwind CSS**, serta mendukung secara penuh **Tema Terang (Light Mode)** dan **Tema Gelap (Dark Mode)** sejak fondasi awal proyek.

---

## 2. Palet Warna Sistem (Color Palette)

Seluruh token warna menggunakan variabel HSL / HEX yang dipetakan langsung ke CSS Variables di `apps/web/app/globals.css`.

### 2.1 Warna Fungsional & Netral

| Token Warna | Tema Terang (Light) | Tema Gelap (Dark) | Peruntukan Antarmuka |
| :--- | :--- | :--- | :--- |
| **Background** | `#FFFFFF` (`hsl(0 0% 100%)`) | `#09090B` (`hsl(240 10% 3.9%)`) | Latar belakang kanvas aplikasi |
| **Foreground** | `#09090B` (`hsl(240 10% 3.9%)`) | `#FAFAFA` (`hsl(0 0% 98%)`) | Warna teks utama (*headings* dan *body*) |
| **Card** | `#FFFFFF` (`hsl(0 0% 100%)`) | `#18181B` (`hsl(240 3.7% 15.9%)`) | Kartu kontainer judul, profil, dan modal |
| **Card Foreground** | `#09090B` (`hsl(240 10% 3.9%)`) | `#FAFAFA` (`hsl(0 0% 98%)`) | Teks di dalam kartu |
| **Primary** | `#18181B` (`hsl(240 5.9% 10%)`) | `#FAFAFA` (`hsl(0 0% 98%)`) | Tombol aksi utama (*CTA*), sorotan penting |
| **Primary Foreground**| `#FAFAFA` (`hsl(0 0% 98%)`) | `#18181B` (`hsl(240 5.9% 10%)`) | Teks tombol aksi utama |
| **Secondary** | `#F4F4F5` (`hsl(240 4.8% 95.9%)`)| `#27272A` (`hsl(240 3.7% 15.9%)`) | Tombol aksi sekunder, tab non-aktif |
| **Secondary Foreground**| `#18181B` (`hsl(240 5.9% 10%)`) | `#FAFAFA` (`hsl(0 0% 98%)`) | Teks elemen sekunder |
| **Muted** | `#F4F4F5` (`hsl(240 4.8% 95.9%)`)| `#27272A` (`hsl(240 3.7% 15.9%)`) | Latar belakang elemen redup (*disabled*) |
| **Muted Foreground** | `#71717A` (`hsl(240 3.8% 46.1%)`)| `#A1A1AA` (`hsl(240 5% 64.9%)`) | Teks sekunder, sinopsis pendek, metadata |
| **Border / Input** | `#E4E4E7` (`hsl(240 5.9% 90%)`) | `#27272A` (`hsl(240 3.7% 15.9%)`) | Garis tepi kartu, kolom isian input form |
| **Destructive** | `#EF4444` (`hsl(0 84.2% 60.2%)`) | `#7F1D1D` (`hsl(0 62.8% 30.6%)`) | Aksi berbahaya (Hapus tracker, Logout) |

---

### 2.2 Token Warna 5 Status Progress Tracker

Status pelacakan anime dan manga memiliki kode visual warna standar untuk memberikan kejelasan status seketika pada kartu dashboard dan badge detail:

| Status Tracker | Label Tampilan | Nilai HEX / HSL | Representasi Visual & Peruntukan |
| :--- | :--- | :--- | :--- |
| **`plan`** | Plan to Watch / Read | `#64748B` (`hsl(215 16% 47%)`) | **Abu-abu Slate:** Judul direncanakan untuk dinikmati nanti. |
| **`watching` / `reading`** | Sedang Menonton / Membaca | `#0284C7` (`hsl(199 89% 48%)`) | **Biru Langit (Sky):** Judul aktif yang sedang berlangsung progresnya. |
| **`completed`** | Selesai | `#16A34A` (`hsl(142 76% 36%)`) | **Hijau Emerald:** Judul telah tuntas ditonton atau dibaca. |
| **`on_hold`** | Ditunda | `#D97706` (`hsl(38 92% 50%)`) | **Kuning Amber:** Judul dihentikan sementara waktu. |
| **`dropped`** | Ditinggalkan | `#DC2626` (`hsl(0 72% 51%)`) | **Merah Crimson:** Judul tidak dilanjutkan lagi. |

---

## 3. Tipografi (Typography Hierarchy)

Aplikasi menggunakan keluarga font sans-serif modern (`Geist Sans` atau `Inter`) dengan tingkat keterbacaan tinggi di berbagai ukuran layar:

| Level Tipografi | Ukuran (Size) | Bobot (Weight) | Line Height | Contoh Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | 32 px (`text-2xl` / `text-3xl`) | Bold (700) | 1.2 | Judul halaman utama, judul detail anime/manga |
| **Heading / H2** | 24 px (`text-xl` / `text-2xl`) | SemiBold (600) | 1.3 | Judul seksi ("Dashboard Tracker", "Hasil Pencarian") |
| **Subheading / H3**| 18 px (`text-lg`) | Medium (500) | 1.4 | Judul kartu anime, nama modal dialog |
| **Body Regular** | 14 px / 16 px (`text-sm` / `text-base`)| Regular (400) | 1.5 | Paragraf sinopsis, deskripsi panduan |
| **Label / Button**| 14 px (`text-sm`) | Medium (500) | 1.0 | Teks tombol aksi, label kolom input |
| **Caption / Badge**| 12 px (`text-xs`) | Medium / SemiBold | 1.0 | Badge status, skor anime (misal: "⭐ 8.7"), metadata episode |

---

## 4. Resolusi Target & Grid Layout Responsif

Sesuai ketentuan rekayasa PRD Poin 19 (Usability), seluruh antarmuka web MOJIJI wajib mendukung dua ukuran viewport acuan:

### 4.1 Mobile Viewport (Ukuran Acuan: 360 px)
* **Lebar Kontainer:** Fluid 100% dengan padding sisi horizontal `px-4` (16 px).
* **Tata Letak Navigasi:** Hamburger menu toggle di bagian sudut kanan atas; navigasi utama collapse ke drawer/modal.
* **Tata Letak Kartu Katalog:** 1 kolom vertikal atau 2 kolom ringkas (*compact grid*).
* **Target Sentuh Minimum (*Touch Target*):** 44 x 44 px untuk seluruh tombol interaktif (termasuk tombol `+1` progres).

### 4.2 Desktop Viewport (Ukuran Acuan: 1280 px)
* **Lebar Kontainer Maksimum:** `max-w-7xl` (1280 px) dengan margin otomatis di tengah kanvas (`mx-auto px-8`).
* **Tata Letak Navigasi:** Navbar horizontal permanen di bagian atas (*header sticky*).
* **Tata Letak Kartu Katalog:** Grid responsif 4 hingga 5 kolom kartu judul.
* **Dashboard Tracker:** Tampilan tabel atau kartu modular lengkap dengan visualisasi progress bar.

---

## 5. Sudut Lengkung (*Border Radius*) & Elevasi

Mengikuti standar token Shadcn UI:
* **Radius Card / Modal:** `rounded-lg` (8 px / `calc(var(--radius))`
* **Radius Button / Input:** `rounded-md` (6 px / `calc(var(--radius) * 0.8)`)
* **Radius Badge:** `rounded-full` (9999 px / pil bulat)
* **Bayangan / Shadow:** `shadow-sm` untuk kartu konten standar, `shadow-lg` untuk modal dialog mengambang (*floating modal*).

---

## 6. Footer Atribusi Wajib

Sesuai aturan hak cipta dan kepatuhan PRD:
* **Teks Resmi:** *"Data: MyAnimeList melalui Tenrai"*
* **Posisi:** Terpasang di seluruh bagian bawah layout (*global footer*) dengan warna teks `muted-foreground` (12 px).

---

## 7. Status Verifikasi Penerimaan (Acceptance Criteria)

- [x] Workspace Figma tim *MOJIJI Design* aktif dengan 4 halaman terstruktur.
- [x] Hak akses telah dikonfigurasi: *Can edit* untuk Ican dan Dika, *Can comment* untuk anggota lain.
- [x] Seluruh anggota tim dapat membuka berkas dan meninggalkan komentar review.
- [x] Spesifikasi warna Light/Dark, 5 status, tipografi, dan grid responsif terdokumentasi lengkap.
