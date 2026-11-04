# Dokumentasi Desain UI/UX — Mojiji AnimeList

Selamat datang di direktori dokumentasi antarmuka dan pengalaman pengguna (*UI/UX Design*) untuk proyek **Mojiji AnimeList**. Direktori ini menyimpan seluruh spesifikasi teknis desain, pedoman gaya (*style guide*), hierarki token desain, diagram alur pengguna (*user flow*), catatan handoff ke tim Frontend, serta laporan evaluasi kegunaan (*usability review*).

---

## 1. Tautan Kanvas Desain Resmi (Figma)

* **Nama Berkas Figma:** `MOJIJI Design`
* **Ruang Kerja Tim:** [Tautan Proyek Figma Tim MOJIJI](https://www.figma.com/) *(Akses: Edit untuk Ican & Dika; Comment untuk seluruh anggota tim)*
* **Penanggung Jawab (PIC):** Ican (UI/UX Designer Utama) & Dika (Frontend / Sekunder UI/UX)

---

## 2. Struktur Halaman di Figma

Proyek desain di Figma dibagi menjadi 4 halaman (*pages*) utama sesuai standar kerja tim:

| Halaman Figma | Isi & Tujuan | Tiket Terkait |
| :--- | :--- | :--- |
| **1. Style Guide** | Palet warna (Light/Dark mode), 5 warna status tracker, tipografi, grid responsif (Mobile 360px, Desktop 1280px), dan elevasi. | `MJ-001`, `MJ-111` |
| **2. Wireframe (Low-Fi)** | Sketsa layout tata letak monokromatik tanpa warna dekoratif untuk alur MVP (Register, Login, Search, Detail, Dashboard). | `MJ-003`, `MJ-018` |
| **3. Hi-Fi Prototype** | Rancangan visual beresolusi tinggi, state loading (skeleton), empty state, error state, dan prototipe interaktif. | `MJ-020`, `MJ-036`, `MJ-037`, `MJ-093`, `MJ-110` |
| **4. Komponen & Token** | Pustaka master component (Button, Input, Badge, Card, Navbar) yang diselaraskan dengan pustaka komponen Shadcn UI. | `MJ-019` |

---

## 3. Indeks Dokumentasi di Repositori

Seluruh tiket UI/UX didokumentasikan secara terstruktur melalui berkas-berkas berikut:

1. [Style Guide & Pedoman Visual](style-guide.md) (`MJ-001`)
2. [Alur Pengguna & Struktur Layar MVP](user-flow-mvp.md) (`MJ-002`)
3. [Spesifikasi Wireframe Low-Fi](wireframes-lowfi.md) (`MJ-003`, `MJ-018`)
4. [Design Tokens & Pustaka Komponen UI](design-tokens.md) (`MJ-019`)
5. [Spesifikasi Desain Hi-Fi MVP](hifi-spec-mvp.md) (`MJ-020`, `MJ-036`, `MJ-037`)
6. [Dokumen Handoff Desain ke Frontend](handoff-mvp.md) (`MJ-038`)
7. [Spesifikasi UI States, Empty, & Error Handling](ui-states-error.md) (`MJ-056`)
8. [Spesifikasi Interaksi Tracker](interaction-tracker.md) (`MJ-057`)
9. [Laporan Review Implementasi UI Frontend](review-implementasi-ui.md) (`MJ-055`, `MJ-074`, `MJ-075`)
10. [Checklist Polishing UI MVP](polishing-ui-mvp.md) (`MJ-092`)
11. [Rancangan Desain Sprint 2 (Komentar, Profil, Tema)](hifi-sprint2-prep.md) (`MJ-093`)

---

## 4. Ketentuan Mutlak Rekayasa UI/UX MOJIJI

1. **Dual Viewport:** Seluruh layar wajib dirancang pada resolusi **Mobile (360px)** dan **Desktop (1280px)**.
2. **Dual Theme:** Seluruh elemen wajib mendukung **Tema Terang (Light Mode)** dan **Tema Gelap (Dark Mode)**.
3. **Kesesuaian Shadcn UI:** Penamaan dan radius border mengacu langsung pada konvensi CSS Variables Shadcn UI (`@/components/ui`).
4. **Pesan Kesalahan Sesuai PRD:** Teks pesan error validasi dan server wajib sama persis dengan kriteria Acceptance Criteria resmi PRD.
5. **Footer Atribusi Wajib:** Menyertakan label *“Data: MyAnimeList melalui Tenrai”* pada bagian footer.
6. **Disiplin Batasan Fitur:** Tidak mendesain fitur rating bintang, pemutar video, atau pembaca manga di luar cakupan PRD.
