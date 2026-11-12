# Style Guide & Pedoman Visual — Mojiji AnimeList

* **Ticket ID:** `MJ-001`
* **Minggu:** 3 (Project Planning)
* **Role / PIC:** UI/UX Designer / Ican
* **Status:** Final & Terverifikasi
* **Tautan Kanvas Figma:** [MOJIJI Design Canvas (Node 603-167)](https://www.figma.com/design/VOMA5k5k3d6oSUpKONJPpF/MOJIJI?node-id=603-167&t=aPgqBjBmzo28waIf-1)

---

## 1. Pendahuluan & Filosofi Desain

Pedoman visual (*Style Guide*) ini menyajikan spesifikasi visual resmi aplikasi web **Mojiji AnimeList**. Desain mengusung konsep antarmuka *dark-slate minimalist* dengan aksen *periwinkle violet* yang modern, elegan, dan nyaman di mata untuk sesi penjelajahan katalog maupun pencatatan progres harian.

Seluruh token desain dipetakan secara presisi dan selaras dengan konfigurasi Tailwind CSS serta Shadcn UI yang diterapkan pada kode frontend di `apps/web/app/globals.css`.

---

## 2. Palet Warna Sistem (Color Palette)

### 2.1 Warna Netral & Permukaan (*Surface & Neutrals*)

| Token Warna | Nilai HEX / Nilai Asli | Peruntukan Antarmuka |
| :--- | :--- | :--- |
| **`--bg` / `--background`** | `#16171B` | Latar belakang kanvas aplikasi (*dark charcoal slate*). |
| **`--surface` / `--card`** | `#1E1F24` | Latar kartu anime/manga, sidebar navigasi, dan panel form. |
| **`--surface-2`** | `#27292F` | Kontainer sekunder, baris tabel, latar input pencarian. |
| **`--surface-2-hover`** | `#2E313A` | State *hover* pada kontainer sekunder dan item daftar. |
| **`--border` / `--input`** | `#373A42` | Garis batas pembatas (*divider*), border kartu, dan border input form. |
| **`--border-hover`** | `#5A5E6B` | Garis batas saat elemen menerima kursor hover. |
| **`--text` / `--foreground`** | `#ECEEF6` | Teks judul utama (*headings*) dan label penting (*high contrast*). |
| **`--text-2` / `--muted-foreground`** | `#A5AAC0` | Teks sekunder, sinopsis judul, metadata info. |
| **`--text-3`** | `#6D7390` | Teks redup, teks bantuan (*helper text*), footer sekunder. |

### 2.2 Warna Brand, Aksen & Fungsional

| Token Warna | Nilai HEX / Nilai Asli | Peruntukan Antarmuka |
| :--- | :--- | :--- |
| **`--primary` / `--accent`** | `#6B68C6` | **Periwinkle Violet:** Warna brand utama, tombol aksi utama (*CTA*), tab aktif. |
| **`--primary-hover`** | `#5E5AB8` | State hover tombol aksi utama. |
| **`--primary-soft`** | `rgba(107, 104, 198, 0.16)` | Latar tombol lunak (*soft button*), sorotan fokus. |
| **`--primary-ring`** | `rgba(107, 104, 198, 0.45)` | Cincin fokus aksesibilitas (*focus-visible outline*). |
| **`--secondary`** | `#8E639C` | **Muted Mauve:** Warna aksen sekunder untuk variasi visual. |
| **`--secondary-text`** | `#C4A3D1` | Teks beraksen sekunder. |
| **`--destructive`** | `#EC5D74` | **Soft Crimson:** Aksi berbahaya (Hapus dari tracker, konfirmasi logout). |
| **`--destructive-hover`** | `#D94A61` | State hover tombol hapus / aksi destruktif. |
| **`--score-star`** | `#D9895C` / `#FF7A3D` | Ikon bintang skor MyAnimeList. |
| **`--score-bg`** | `#E2A63E` | Badge skor numerik rating katalog. |
| **`--media-anime`** | `#0EA5E9` | Tag kategori media Anime (*Sky Blue*). |
| **`--media-manga`** | `#F97316` | Tag kategori media Manga (*Vibrant Orange*). |

---

## 3. Token Semantik 5 Status Progress Tracker

Status pelacakan pada kartu Dashboard dan halaman Detail menggunakan sistem warna semantik untuk memudahkan pemindaian visual:

| Status Tracker | Label Tampilan | Nilai HEX Utama | Nilai HEX Badge / Soft | Makna Visual |
| :--- | :--- | :--- | :--- | :--- |
| **`plan`** | Plan to Watch / Read | `#98A2C8` | `#4A7C9B` (Badge) / `#233E54` (Soft) | **Slate Steel:** Judul dalam rencana tonton/baca. |
| **`watching` / `reading`** | Sedang Menonton / Membaca | `#3CC4B2` / `#8E639C` | `#8E639C` (Badge) / `#3F2C4D` (Soft) | **Teal / Mauve:** Judul aktif yang sedang dikonsumsi. |
| **`completed`** | Selesai | `#7CC76B` | `#47876B` (Badge) / `#1E4033` (Soft) | **Soft Emerald:** Judul telah selesai ditonton/dibaca. |
| **`on_hold`** | Ditunda | `#E2A63E` | `#A37B3E` (Badge) / `#45361E` (Soft) | **Warm Amber:** Judul dihentikan sementara waktu. |
| **`dropped`** | Ditinggalkan | `#EC5D74` | `#EC5D74` (Badge) / `#4A202A` (Soft) | **Rose Crimson:** Judul tidak dilanjutkan lagi. |

---

## 4. Tipografi Sistem (Typography Scale)

Hierarki tipografi menggunakan font modern sans-serif yang tajam dan nyaman dibaca:

| Kategori | Font Family | Bobot (*Weight*) | Peruntukan Utama |
| :--- | :--- | :--- | :--- |
| **Display & Headings** | `Bricolage Grotesque` | SemiBold (600) / Bold (700) | Judul hero banner, judul halaman utama, nama judul anime/manga di halaman detail. |
| **Body & UI Sans** | `Plus Jakarta Sans` | Regular (400) / Medium (500) | Teks isi sinopsis, label tombol, kolom form input, teks navigasi navbar. |
| **Utility / Mono** | `Inter`, `Poppins`, UI Monospace | Regular (400) / Medium (500) | Angka progres episode/chapter, metadata tanggal, badge skor. |

### Skala Ukuran Font
* **Display / Hero Title:** 32 px – 36 px (`text-3xl` / `text-4xl`)
* **Page Heading (H1/H2):** 24 px – 28 px (`text-2xl`)
* **Card Title / Section Subtitle (H3):** 18 px – 20 px (`text-lg` / `text-xl`)
* **Body Regular:** 14 px – 16 px (`text-sm` / `text-base`), Line Height: 1.5
* **Meta / Form Label / Button:** 13 px – 14 px (`text-sm`), Bobot: Medium (500)
* **Caption / Badge:** 11 px – 12 px (`text-xs`), Bobot: Medium / SemiBold

---

## 5. Tata Letak Grid & Panduan Responsivitas Viewport

Sesuai ketentuan Non-Functional Requirements PRD Poin 19:

### 5.1 Mobile Viewport (Lebar Acuan: 360 px)
* **Kontainer:** Fluid 100% dengan padding horizontal `px-4` (16 px).
* **Grid Katalog:** 2 kolom kartu ringkas atau 1 kolom modular vertikal.
* **Ukuran Target Sentuh Minimum:** 44 x 44 px untuk tombol navigasi, tab switch, dan tombol aksi cepat `+1`.
* **Navigasi:** Navigasi disederhanakan dengan ikon menu hamburger di pojok atas.

### 5.2 Desktop Viewport (Lebar Acuan: 1280 px)
* **Kontainer:** Maksimal `max-w-7xl` (1280 px) dengan margin otomatis rata tengah (`mx-auto px-6 lg:px-8`).
* **Grid Katalog:** Grid responsif 4 hingga 5 kolom kartu judul.
* **Navigasi:** Navbar horizontal tetap (*sticky*) dengan kolom pencarian terintegrasi (*integrated search bar*).

---

## 6. Sudut Lengkung (*Border Radius*) & Bayangan (*Shadows*)

Mengikuti skala token Shadcn UI:
* **Radius Dasar (`--radius`):** `0.625rem` (10 px)
* **Radius Kartu & Modal:** `rounded-lg` (10 px)
* **Radius Tombol & Kolom Input:** `rounded-md` (8 px)
* **Radius Badge & Tag:** `rounded-full` (pil bulat 9999 px)
* **Elevasi / Bayangan:**
  * Kartu standar: Tanpa bayangan tajam (*flat border style* `#373A42`).
  * Modal dialog & dropdown: `shadow-2xl` dengan latar belakang semi-transparan bergradasi halus (*backdrop blur*).

---

## 7. Footer Kredit Atribusi Wajib

Sesuai aturan kepatuhan PRD:
* **Teks Resmi:** *"Data: MyAnimeList melalui Tenrai"*
* **Penempatan:** Tersemat di seluruh bagian bawah layout web (*global footer*) dengan warna teks `text-2` (`#A5AAC0`).

---

## 8. Status Verifikasi Penerimaan (Acceptance Criteria Tiket MJ-001)

- [x] Kanvas Figma tim aktif dan dapat diakses melalui tautan resmi: [Figma MOJIJI](https://www.figma.com/design/VOMA5k5k3d6oSUpKONJPpF/MOJIJI?node-id=603-167&t=aPgqBjBmzo28waIf-1).
- [x] Style Guide mendefinisikan palet warna lengkap (`#6B68C6`, `#16171B`, `#1E1F24`).
- [x] 5 warna status tracker terdokumentasi lengkap (Plan, Watching/Reading, Completed, On Hold, Dropped).
- [x] Hierarki tipografi (`Bricolage Grotesque`, `Plus Jakarta Sans`) telah didefinisikan.
- [x] Standar grid responsif Mobile (360px) dan Desktop (1280px) telah ditetapkan.
