# Dokumentasi Desain UI/UX — Mojiji AnimeList

Selamat datang di direktori dokumentasi antarmuka dan pengalaman pengguna (*UI/UX Design*) untuk proyek **Mojiji AnimeList**. Direktori ini berfungsi sebagai acuan tunggal kebenaran (*single source of truth*) desain visual, sistem token antarmuka, alur interaksi pengguna, serta catatan serah terima (*handoff*) antara tim desain dan tim pengembang (*frontend*).

---

## 1. Tautan Kanvas Desain Resmi (Figma)

Seluruh rancangan antarmuka, *wireframe*, dan purwarupa interaktif (*prototype*) MOJIJI dikerjakan pada kanvas Figma resmi berikut:

* **Tautan Berkas Figma:** [MOJIJI Design Canvas (Node 603-167)](https://www.figma.com/design/VOMA5k5k3d6oSUpKONJPpF/MOJIJI?node-id=603-167&t=aPgqBjBmzo28waIf-1)
* **Status Desain:** Mencakup *wireframe* low-fi hingga visual hi-fi tahap akhir Sprint 1 (Milestone MVP / UTS).
* **Hak Akses Kolaborasi:**
  * *Can Edit:* Ican (Lead UI/UX Designer) & Dika (Frontend Developer / Sekunder UI/UX)
  * *Can View & Comment:* Seluruh anggota tim MOJIJI (Syafii, Ryan, Nadia, Aji)

---

## 2. Struktur Dokumentasi UI/UX di Repositori

Dokumentasi desain di repositori ini disusun secara terstruktur untuk mendukung alur rekayasa perangkat lunak tim:

| Dokumen | Tiket | Deskripsi & Isi Utama |
| :--- | :---: | :--- |
| [Style Guide & Pedoman Visual](style-guide.md) | `MJ-001` | Palet warna tema gelap/terang, token 5 warna status tracker, tipografi, dan grid responsif. |
| [Alur Pengguna & Struktur Layar MVP](user-flow-mvp.md) | `MJ-002` | Diagram alur interaksi pengguna (core flow: Auth → Search → Detail → Tracker) dan daftar route. |
| [Design Tokens & Spesifikasi Komponen](design-tokens.md) | `MJ-019` | Spesifikasi token warna CSS variables, tombol, input, kartu, dan badge selaras Shadcn UI. |
| [Dokumen Handoff Desain ke Frontend](handoff-mvp.md) | `MJ-038` | Dokumen resmi serah terima spesifikasi desain ke tim Frontend (Dika). |
| [Review Implementasi UI (Design QA)](review-implementasi-ui.md) | `MJ-055` | Evaluasi audit visual antara hasil implementasi kode Next.js vs desain Figma. |
| [Checklist Polishing UI MVP](polishing-ui-mvp.md) | `MJ-092` | Evaluasi final konsistensi visual dan kenyamanan responsivitas mobile 360px & desktop 1280px. |

---

## 3. Prinsip & Batasan Rekayasa Desain MOJIJI

1. **Efisiensi & Kecepatan:** Antarmuka dirancang bersih (*clean & clutter-free*) untuk memastikan pengguna dapat memperbarui progres tontonan/bacaan hanya dalam 1–2 kali ketukan.
2. **Dual Viewport Baku:**
   * **Mobile Viewport (360 px):** Dioptimalkan untuk navigasi satu tangan (*thumb-friendly*) dengan target sentuh (*touch target*) minimal 44x44 px.
   * **Desktop Viewport (1280 px):** Memanfaatkan ruang layar lebar dengan grid katalog modular dan dashboard tracker terstruktur.
3. **Penyelarasan Komponen (Shadcn UI & Tailwind CSS):** Desain menggunakan skala radius sudut (`0.625rem` / 10 px) dan hierarki komponen yang selaras dengan pustaka komponen frontend (`@/components/ui`).
4. **Footer Atribusi Wajib:** Seluruh tata letak menyertakan kredit data resmi: *"Data: MyAnimeList melalui Tenrai"*.
5. **Kepatuhan Cakupan (Scope Discipline):** Desain mematuhi batas PRD tanpa menyertakan fitur di luar cakupan (tanpa rating bintang, tanpa pemutar streaming, dan tanpa pembaca manga).
