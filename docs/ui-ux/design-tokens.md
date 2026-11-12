# Design Tokens & Spesifikasi Komponen UI — Mojiji AnimeList

* **Ticket ID:** `MJ-019`
* **Minggu:** 4 (Sprint Planning)
* **Role / PIC:** UI/UX Designer / Ican
* **Status:** Final & Terverifikasi
* **Dependensi:** `MJ-001` (Setup Figma tim dan style guide)
* **Tautan Kanvas Figma:** [MOJIJI Design Canvas (Node 603-167)](https://www.figma.com/design/VOMA5k5k3d6oSUpKONJPpF/MOJIJI?node-id=603-167&t=aPgqBjBmzo28waIf-1)

---

## 1. Pendahuluan

Dokumen ini merumuskan hierarki **Token Desain (*Design Tokens*)** dan spesifikasi teknis komponen antarmuka pengguna (*UI Components*) untuk sistem antarmuka **Mojiji AnimeList**. 

Spesifikasi ini dirancang untuk menjembatani rancangan di kanvas Figma dengan implementasi pustaka komponen **Shadcn UI** dan **Tailwind CSS v4** pada repositori frontend di `apps/web/components/ui/` dan `apps/web/app/globals.css`.

---

## 2. Token Desain Semantik (Semantic Design Tokens)

### 2.1 Token Warna Permukaan & Teks (*Surfaces & Typography*)

| Nama Token Variabel | Nilai HEX / CSS Value | Peruntukan & Spesifikasi Teknis |
| :--- | :--- | :--- |
| **`--bg`** | `#16171B` | Latar belakang dasar kanvas aplikasi (*Dark Charcoal Slate*). |
| **`--surface`** | `#1E1F24` | Latar belakang kartu konten (*Card*), modal dialog, dan sidebar. |
| **`--surface-2`** | `#27292F` | Kontainer sekunder, baris tabel, latar pill switch, tombol `surface`. |
| **`--surface-2-hover`**| `#2E313A` | State *hover* interaktif pada kontainer sekunder. |
| **`--border`** | `#373A42` | Garis pembatas (*border*) default pada kartu, input, dan pemisah seksi. |
| **`--border-hover`** | `#5A5E6B` | Garis pembatas saat menerima kursor *hover*. |
| **`--text`** | `#ECEEF6` | Teks judul utama (*Headings H1-H3*), teks tombol aktif, kontras tinggi. |
| **`--text-2`** | `#A5AAC0` | Teks deskripsi sekunder, sinopsis judul, label metadata. |
| **`--text-3`** | `#6D7390` | Teks keterangan bantuan (*placeholder*, *caption*, teks pudar). |

---

### 2.2 Token Warna Aksen & Brand (*Brand Accents*)

| Nama Token Variabel | Nilai HEX / CSS Value | Peruntukan & Spesifikasi Teknis |
| :--- | :--- | :--- |
| **`--primary`** | `#6B68C6` | **Periwinkle Violet:** Tombol aksi utama (*CTA*), tab navigasi aktif. |
| **`--primary-hover`** | `#5E5AB8` | State *hover* tombol aksi utama. |
| **`--primary-soft`** | `rgba(107, 104, 198, 0.16)` | Latar tombol lembut (*soft button*), badge highlight. |
| **`--primary-ring`** | `rgba(107, 104, 198, 0.45)` | Cincin fokus aksesibilitas (*focus-visible ring*). |
| **`--secondary`** | `#8E639C` | **Muted Mauve:** Aksen pelengkap, badge tipe konten sekunder. |
| **`--secondary-text`**| `#C4A3D1` | Teks aksen sekunder. |
| **`--destructive`** | `#EC5D74` | **Rose Red:** Aksi destruktif (tombol hapus tracker, modal konfirmasi). |
| **`--destructive-hover`**| `#D94A61` | State *hover* aksi destruktif. |
| **`--score-bg`** | `#E2A63E` | Latar badge skor rating anime/manga (*Amber Gold*). |
| **`--score-star`** | `#D9895C` / `#FF7A3D` | Warna ikon bintang rating. |
| **`--media-anime`** | `#0EA5E9` | Tag label kategori Anime (*Sky Blue*). |
| **`--media-manga`** | `#F97316` | Tag label kategori Manga (*Vibrant Orange*). |

---

### 2.3 Token 5 Status Progress Tracker

Status pelacakan judul memiliki sistem warna semantik terpadu untuk kartu dashboard dan halaman detail:

| Status Tracker | Variabel Badge Solid | Variabel Soft Background | Variabel Soft Text | Label Resmi |
| :--- | :--- | :--- | :--- | :--- |
| **`plan`** | `--st-plan-badge: #4A7C9B` | `--st-plan-soft: #233E54` | `--st-plan-soft-text: #BAE2FC` | Plan to Watch / Read |
| **`watching` / `reading`** | `--st-watching-badge: #8E639C` | `--st-watching-soft: #3F2C4D` | `--st-watching-soft-text: #EAD2F7` | Sedang Menonton / Membaca |
| **`completed`** | `--st-done-badge: #47876B` | `--st-done-soft: #1E4033` | `--st-done-soft-text: #A3EBC9` | Selesai |
| **`on_hold`** | `--st-hold-badge: #A37B3E` | `--st-hold-soft: #45361E` | `--st-hold-soft-text: #F5DC93` | Ditunda |
| **`dropped`** | `--color-status-drop: #EC5D74` | `rgba(236, 93, 116, 0.16)` | `#FCA5A5` | Ditinggalkan |

---

### 2.4 Token Radius & Sudut Lengkung (*Border Radius*)

Sistem menggunakan skala radius berbasis token `--radius: 0.625rem` (10 px):

* **`radius-sm` (6 px):** Input checkbox, sub-elemen mikro.
* **`radius-md` (8 px):** Kolom form input (`input.jsx`), tombol ukuran kecil (`btn-sm`).
* **`radius-lg` (10 px):** Tombol standar (`btn-default`), kartu katalog, kartu tracker.
* **`radius-xl` (14 px):** Tombol ukuran sedang/besar (`btn-md` / `btn-lg`).
* **`radius-full` (9999 px):** Badge rating, status pill badge, segmented switch.

---

## 3. Spesifikasi Pustaka Komponen UI Utama (Shadcn UI Alignment)

### 3.1 Komponen Tombol (`Button.jsx`)

Komponen tombol mendukung 5 varian visual dan 6 skala ukuran:

| Varian Tombol | Styling Visual Utama | Peruntukan |
| :--- | :--- | :--- |
| **`primary`** | `bg-accent hover:bg-primary-hover text-white shadow-sm shadow-accent/25` | Tombol CTA utama (Login, Register, Simpan Tracker). |
| **`secondary`** | `bg-secondary hover:bg-secondary-hover text-white shadow-sm shadow-secondary/25` | Aksi penunjang di halaman detail dan modal. |
| **`outline`** | `border border-border bg-surface hover:bg-surface-2 text-text shadow-sm` | Tombol sekunder, batalkan modal, filter samping. |
| **`surface`** | `border border-border bg-surface-2 hover:bg-surface-2-hover text-text-2` | Tombol navigasi baris dan toggle filter. |
| **`ghost`** | `text-text-2 hover:text-text hover:bg-surface-2 border-transparent` | Ikon toggle menu, aksi minor di navbar. |

**Skala Ukuran Tombol:**
* `sm`: Tinggi 36 px (`h-9 px-3 text-xs rounded-lg`)
* `md`: Tinggi 40 px (`h-10 px-4 text-xs sm:text-sm rounded-xl font-semibold`)
* `default`: Tinggi 44 px (`h-11 px-4 text-sm rounded-xl font-semibold`) — *Memenuhi standar touch target minimum 44px.*
* `lg`: Tinggi 48 px (`h-12 px-6 text-base rounded-xl font-bold`)
* `icon`: 36 x 36 px (`h-9 w-9 p-0 rounded-lg`)
* `iconMd`: 40 x 40 px (`h-10 w-10 p-0 rounded-xl`)
* **Micro-interaction:** `active:scale-[0.98] transition-all duration-150` saat diklik.

---

### 3.2 Komponen Pencarian Reusable (`SearchInput.jsx`)

* **Struktur:** Kontainer input fluid dengan ikon pencarian `Search` (14 px) di sisi kiri absolut dan tombol pembersih `X` di sisi kanan saat kolom terisi.
* **Visual:** Background `--surface-2` (`#27292F`), border `--border` (`#373A42`), placeholder `--text-3` (`#6D7390`).
* **Debounce Teknis:** Input menerapkan debounce 400ms sebelum memanggil API Catalog untuk mencegah lonjakan kuota publik Tenrai (maks. 4 req/detik).

---

### 3.3 Komponen Segmented Switch (`SegmentedSwitch.jsx`)

* **Tujuan:** Pengalih kategori media antara **Anime** dan **Manga** pada beranda dan halaman jelajah.
* **Visual:** Kontainer kapsul full-rounded dengan latar belakang `--switch-pill-bg` (`#2A2B3D`) dan border halus `#3C3E56`.
* **Animasi Sliding:** Menggunakan highlight pill aktif yang bergeser secara halus mengikuti opsi yang dipilih (`transition-all duration-200`).

---

### 3.4 Komponen Badge Skor Rating (`RatingBadge.jsx`)

* **Visual:** Latar belakang solid kuning keemasan `--score-bg` (`#E2A63E`) dengan teks dan ikon bintang berwarna gelap pekat `--score-text` (`#16171B`).
* **Format Numerik:** Format skor desimal dengan satu angka di belakang koma (misal: `8,5` atau `9,0`).

---

### 3.5 Komponen Kartu Tracker & Tombol Cepat `+1` (`TrackerCards.jsx`)

* **Layout Kartu:** Rasio gambar poster 3:4 dengan overlay gradien gelap di bagian bawah untuk keterbacaan judul.
* **Visual Progres:** Menampilkan teks `ep X / Total` serta progress bar horizontal.
* **Interaksi Tombol `+1`:**
  * Tombol aksi satu ketukan cepat untuk menaikkan progres tontonan/bacaan.
  * Terapkan **Optimistic UI:** angka bertambah seketika di antarmuka sebelum respons server selesai.
  * *Disabled State:* Tombol dinonaktifkan otomatis saat progres telah mencapai total episode/chapter, atau saat status judul adalah `completed`.

---

## 4. Status Verifikasi Penerimaan (Acceptance Criteria Tiket MJ-019)

- [x] Spesifikasi Design Token warna (Surfaces, Neutrals, Brand, 5 Status Tracker) didefinisikan lengkap.
- [x] Token skala tipografi, border radius (`0.625rem`), dan grid responsif selaras dengan kode frontend.
- [x] Komponen UI utama (Button, SearchInput, SegmentedSwitch, RatingBadge, TrackerCards) terdokumentasi dengan panduan varian dan ukurannya.
- [x] Desain terverifikasi kompatibel dengan tema gelap dan arsitektur Next.js statis.
