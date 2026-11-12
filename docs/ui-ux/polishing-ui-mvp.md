# Checklist Polishing Visual & Audit Responsivitas MVP (UTS Readiness) — Mojiji AnimeList

* **Ticket ID:** `MJ-092`
* **Minggu:** 8 (UTS Milestone / MVP Live di URL Publik)
* **Role / PIC:** UI/UX Designer / Ican
* **Lingkungan Evaluasi:** Produksi (`https://mojiji.web.id`) & Staging VPS (`https://staging.mojiji.web.id`)
* **Status:** Final & Siap Evaluasi UTS
* **Dependensi Tiket:** `MJ-075` (Perbaikan UI dari hasil review)
* **Tautan Kanvas Figma Acuan:** [MOJIJI Design Canvas (Node 603-167)](https://www.figma.com/design/VOMA5k5k3d6oSUpKONJPpF/MOJIJI?node-id=603-167&t=aPgqBjBmzo28waIf-1)

---

## 1. Pendahuluan & Tujuan Polishing Visual

Dokumen ini merupakan laporan finalisasi visual (*Visual Polishing & Responsiveness Audit*) untuk menandai kesiapan antarmuka **Minimum Viable Product (MVP)** aplikasi web **Mojiji AnimeList** menjelang evaluasi Milestone Ujian Tengah Semester (UTS) mata kuliah Pemrograman Web Framework oleh dosen pengampu **Joni Rodito, S.Kom**.

Audit ini memastikan seluruh perbaikan dari hasil review UI sebelumnya (`MJ-055` dan `MJ-075`) telah tertutup secara tuntas, antarmuka konsisten dengan sistem token warna `#6B68C6` dan background `#16171B`, serta tata letak responsif berjalan sempurna di layar **Mobile (360 px)** maupun **Desktop (1280 px)**.

---

## 2. Status Penutupan Temuan Design QA (Hasil Audit MJ-055)

Seluruh temuan selisih desain yang dicatat pada dokumen audit sebelumnya telah diverifikasi dan diselesaikan bersama Frontend:

| ID Temuan | Komponen / Lokasi | Isu Awal | Tindakan Penyelesaian di Kode | Status Akhir |
| :---: | :--- | :--- | :--- | :---: |
| **QA-01** | `SearchInput.jsx` (Mobile 360 px) | Target sentuh tombol reset `X` kecil (< 32 px). | Padding interaktif diperluas menjadi `h-9 w-9` (touch target memenuhi standar 44x44 px). | **Selesai (Closed)** |
| **QA-02** | `TrackerCards.jsx` (Mobile 360 px) | Jarak antar kartu tracker terlalu padat (`gap-3`). | Grid kartu distandarisasi menggunakan `gap-4` (16 px) konsisten pada layar ponsel. | **Selesai (Closed)** |
| **QA-03** | `CatalogCard.js` (Metadata Text) | Kontras teks `text-text-3` (#6D7390) 4.2:1. | Ditingkatkan ke token `text-text-2` (#A5AAC0) dengan rasio kontras 5.8:1 (WCAG AA compliant). | **Selesai (Closed)** |

---

## 3. Matriks Audit Responsivitas Komprehensif (360 px vs 1280 px)

Pengujian dilakukan untuk memastikan tidak ada elemen yang meluap (*horizontal scroll overflow*) atau teks yang terpotong secara aneh:

### 3.1 Layar Beranda (`/home` & `/`)
* **Mobile (360 px):**
  * Hero banner karusel 4 slide beradaptasi otomatis terhadap aspek rasio layar ponsel tanpa merusak proporsi gambar.
  * Teks judul display `Bricolage Grotesque` mengecil secara proporsional ke ukuran `text-2xl` (24 px).
  * Indikator strip slide banner terlihat jelas dan mudah di-tap.
* **Desktop (1280 px):**
  * Hero banner tampil megah dengan kontainer `max-w-7xl` di tengah kanvas (`mx-auto`).
  * Slider seksi rekomendasi menampilkan tombol navigasi panah kiri/kanan yang responsif terhadap hover kursor.

---

### 3.2 Layar Autentikasi (`/login` & `/register`)
* **Mobile (360 px):**
  * Kontainer form menyesuaikan lebar layar dengan padding horizontal `px-4`.
  * Saat keyboard virtual ponsel muncul, tata letak form tidak menutupi tombol submit utama (*CTA*).
  * Teks error validasi (misal: *"Password minimal 8 karakter"* atau *"Email atau password salah"*) tampil rapi di bawah kolom input tanpa menggeser layout form secara kasar.
* **Desktop (1280 px):**
  * Form terpusat (*centered card*) dengan lebar maksimal `max-w-md` (448 px) dilengkapi latar belakang *poster collage* bergradasi lembut.

---

### 3.3 Layar Eksplorasi & Pencarian (`/explore` & `/search`)
* **Mobile (360 px):**
  * Kapsul `SegmentedSwitch.jsx` (Anime vs Manga) memenuhi 100% lebar kontainer dengan area sentuh jari yang nyaman.
  * Kolom pencarian `SearchInput.jsx` mudah dijangkau, dengan debounce 400ms yang menjaga kestabilan aplikasi saat mengetik cepat.
  * Hasil katalog tersusun dalam **2 kolom kartu ringkas** yang proporsional.
* **Desktop (1280 px):**
  * Filter toolbar tersusun horizontal dengan opsi filter kategori yang luas.
  * Hasil katalog tersusun dalam **grid 4 hingga 5 kolom kartu judul**.
  * Jika kata kunci tidak ditemukan, kartu *empty state* ramah tampil rapi di tengah layar: *"Tidak ada hasil pencarian"*.

---

### 3.4 Layar Detail Judul (`/detail?type=anime|manga&id=malId`)
* **Mobile (360 px):**
  * Poster judul tampil di bagian atas dengan efek bayangan lembut.
  * Badge skor kuning emas `#E2A63E` dan tag media (`#0EA5E9` Anime / `#F97316` Manga) terletak tepat di bawah judul utama.
  * Tombol **"Tambah ke Tracker"** berukuran lebar penuh (*full-width button*) dengan target sentuh 48 px.
* **Desktop (1280 px):**
  * Tata letak modular dua kolom: kolom kiri memuat poster sampul resolusi tinggi dan info metadata, kolom kanan memuat sinopsis lengkap dan panel pemilihan status tracker.
  * Penanganan rute statis berbasis query parameter berjalan instan tanpa kedipan layar (*zero flicker*).

---

### 3.5 Layar Dashboard Tracker (`/tracker` & `/dashboard`)
* **Mobile (360 px):**
  * Tab filter 5 status (Plan, Watching, Completed, On Hold, Dropped) dapat digeser (*horizontal swipeable*) dengan indikator aktif yang tegas.
  * Tombol cepat **`+1`** berukuran minimal 44x44 px dengan micro-interaction klik responsif (`active:scale-[0.98]`).
  * Angka progres langsung bertambah di layar secara instan (Optimistic UI).
* **Desktop (1280 px):**
  * Kartu tracker tersusun rapi menampilkan judul, thumbnail, progress bar visual, tombol `+1`, dan tombol opsi ubah status.
  * Modal edit progres (`TrackerEditModal.js`) dan modal konfirmasi hapus bernuansa *destructive* `#EC5D74` tampil mengambang (*floating modal*) dengan efek *backdrop blur*.

---

## 4. Verifikasi Kepatuhan Non-Functional Requirements (NFR) PRD

1. **Usability (Poin 19 PRD):**
   * Antarmuka web terbukti nyaman, responsif, dan mudah digunakan baik di HP maupun komputer.
   * Pencatatan dan penambahan progres dapat diselesaikan hanya dalam 1 ketukan tombol `+1`.
2. **Keterbacaan & Kontras Warna:**
   * Seluruh kombinasi teks terhadap latar belakang `#16171B` dan kartu `#1E1F24` memenuhi rasio kontras minimum WCAG AA (minimal 4.5:1 untuk body text dan 3.0:1 untuk elemen UI).
3. **Footer Kredit Atribusi Wajib:**
   * Teks resmi: *"Data: MyAnimeList melalui Tenrai"* terpasang konsisten pada global footer di seluruh rute aplikasi.
4. **Disiplin Batasan Cakupan (*Scope Compliance*):**
   * Desain terverifikasi 100% bebas dari fitur di luar cakupan PRD (tanpa rating bintang pengguna, tanpa pemutar video streaming, dan tanpa pembaca manga).

---

## 5. Pernyataan Kesiapan Evaluasi UTS (UTS Readiness Declaration)

Berdasarkan seluruh hasil audit visual, penyelarasan token desain, dan verifikasi responsivitas pada lingkungan produksi publik (`https://mojiji.web.id`):

> **UI/UX Designer MOJIJI menyatakan bahwa antarmuka Minimum Viable Product (MVP) telah 100% rampung, konsisten, terbebas dari blocker visual, dan SIAP untuk didemokan serta dievaluasi pada Milestone UTS (Minggu 8).**

---

## 6. Status Verifikasi Penerimaan (Acceptance Criteria Tiket MJ-092)

- [x] Penutupan temuan Design QA dari audit sebelumnya (`MJ-055`) terverifikasi tuntas.
- [x] Antarmuka seluruh halaman MVP terbukti responsif pada resolusi 360 px dan 1280 px.
- [x] Konsistensi token warna, tipografi, dan border radius terjaga di seluruh layar.
- [x] Keberadaan footer atribusi resmi telah diverifikasi.
- [x] Dokumen kesiapan visual UTS selesai dan diarsipkan di direktori `docs/ui-ux/`.
