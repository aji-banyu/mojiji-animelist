---
title: "Struktur Organisasi Tim & RACI Matrix (Team Breakdown)"
sidebar_position: 3
tags: [team, breakdown, raci, roles, responsibility, agile]
---

# Struktur Organisasi Tim & Pembagian Tugas (Team Breakdown)

Dokumen ini merinci struktur pembagian peran, modul kepemilikan, dan matriks tanggung jawab (*RACI Matrix*) untuk 6 anggota tim pengembang **Mojiji AnimeList** pada mata kuliah Pemrograman Web Framework (Semester 5, STMIK Bina Patria, Dosen: Joni Rodito, S.Kom).

---

## 1. Pemetaan Struktur Peran (Primary & Secondary Roles)

Setiap anggota tim memegang satu **Primary Role** (tanggung jawab utama modul produksi) dan satu **Secondary Role** (pendukung teknis / reviewer silang) untuk menjamin kelancaran *bus factor* dan kesinambungan pengembangan:

| Nama Anggota | Primary Role | Secondary Role | Modul & Area Kepemilikan Utama |
| :--- | :--- | :--- | :--- |
| **Aji Banyu Rizqi** | **DevOps Engineer & Admin** | Frontend Developer | Infrastruktur VPS Xeon, Docker Compose, Caddy Reverse Proxy, GitHub Actions CI/CD, Keamanan Jaringan, dan Bantuan UI Client. |
| **Syafii Nurradha** | **Backend Developer** | DevOps Engineer | Express.js Microservices (API Gateway, User, Catalog, Tracker), Keamanan JWT Cookie HttpOnly, dan Caching Tenrai API. |
| **Andika** | **Frontend Developer** | Database Administrator | Next.js 15 Client, Komponen Shadcn UI, Zustand Store (Theme & Filter), dan Responsivitas Mobile. |
| **Ryan** | **Database Administrator (DBA)** | Backend Developer | PostgreSQL Supabase, Migrasi Dbmate, Multi-schema (`auth`, `catalog`, `tracker`), Connection Pooling, dan Indexing Performa. |
| **Nadia** | **Quality Assurance (QA)** | UI/UX Designer | Test Plan, Skenario Pengujian Alur Inti, Otomasi Postman Newman CLI di CI/CD, dan Verifikasi Matriks Acceptance Criteria (AC). |
| **Ichsan** | **UI/UX Designer** | Tester | Desain Antarmuka Figma, Design Tokens, Tema Dark Glow (#0F172A & #6D4AFF), Wireframing, dan Pengujian Usabilitas. |

---

## 2. Matriks Tanggung Jawab RACI (RACI Matrix)

Keterangan:
- **R (Responsible):** Pelaksana teknis utama tugas.
- **A (Accountable):** Penanggung jawab akhir dan pengambil keputusan.
- **C (Consulted):** Pihak yang dimintai masukan teknis dua arah.
- **I (Informed):** Pihak yang diberi pemberitahuan (*handoff*).

| Aktivitas / Deliverable Proyek | DevOps (Aji) | Backend (Syafii) | Frontend (Andika) | DBA (Ryan) | QA (Nadia) | UI/UX (Ichsan) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Penyusunan PRD & Spesifikasi Fitur** | C | C | C | C | C | **A / R** |
| **Desain Antarmuka & Style Guide (Figma)** | I | I | C | I | C | **A / R** |
| **Desain Skema DB & Migrasi Dbmate** | C | C | I | **A / R** | I | I |
| **Pengembangan API Microservices** | C | **A / R** | C | C | I | I |
| **Pengembangan Antarmuka Web (Next.js)**| C | C | **A / R** | I | C | C |
| **Pengujian Fungsional & Regresi Newman** | C | C | C | I | **A / R** | I |
| **Otomasi CI/CD & Deployment VPS** | **A / R** | C | I | C | I | I |
| **Release Management & Tagging Git** | **A / R** | C | C | C | C | I |
| **Dokumentasi Docusaurus-Ready** | **A / R** | R | R | R | R | R |

---

## 3. Alur Kerja Kolaborasi (Agile Workflow & Branching)

1. **Ticket-Driven Development:** Setiap pekerjaan wajib memiliki tiket di GitHub Projects ("Mojiji Kanban") dengan ID `MJ-xxx`.
2. **Aturan Branching Git:**
   - Dilarang keras push langsung ke branch `main` atau `develop`.
   - Format branch: `<tipe>/MJ-xxx-<deskripsi-singkat>` (contoh: `feat/MJ-094-error-handling`).
   - Tipe branch resmi: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`.
3. **Pull Request (PR) & Review Gate:**
   - Seluruh PR ditujukan ke `develop` menggunakan template resmi `.github/pull_request_template.md`.
   - Mengharuskan pengujian lokal sebelum meminta review.
4. **Definition of Done (DoD):**
   - Kode lulus linting dan build tanpa error (`npm run build`).
   - Acceptance Criteria pada tiket GitHub terpenuhi 100%.
   - Lulus uji regresi QA otomatis (Newman CLI).
   - Dokumentasi terkait di folder `/docs` diperbarui dengan blok frontmatter YAML.
