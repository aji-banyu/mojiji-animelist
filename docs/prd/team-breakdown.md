---
title: "Struktur Organisasi Tim & RACI Matrix (Team Breakdown)"
sidebar_position: 3
tags: [team, breakdown, roles, raci, agile, gitflow, dod]
---

# Struktur Organisasi Tim & Alur Kerja (Team Breakdown)

Dokumen ini disusun berdasarkan **Mini PRD: MOJIJI Bagian 4 (Team & Development)** untuk memetakan peran, alur kerja kolaboratif, serta matriks tanggung jawab (*RACI Matrix*) seluruh anggota tim pengembang Mojiji AnimeList.

---

## 1. Pemetaan Peran Tim (Primary & Secondary Roles)
Berdasarkan Mini PRD Bagian 4 Tabel Tim:

| Nama Anggota | Primary Role | Secondary Role | Tanggung Jawab Utama Berdasarkan PRD |
| :--- | :--- | :--- | :--- |
| **Andika** | **Frontend** | DBA | Membangun antarmuka Next.js 15, komponen Shadcn UI, state Zustand, static export, dan pembantu query basis data. |
| **Syafii** | **Backend** | DevOps | Mengembangkan Express.js microservices (User, Catalog, Tracker), REST API, autentikasi cookie JWT, dan integrasi Redis. |
| **Ryan** | **DBA** | Backend | Mengelola PostgreSQL di Supabase (staging & production), skema relasional, migrasi berkas Dbmate, dan optimasi pooler. |
| **Nadia** | **QA** | UI/UX | Menyusun test plan, skenario pengujian AC, pengujian regresi API otomatis dengan Postman / Newman CLI, dan review UI. |
| **Aji** | **DevOps** | Frontend | Menyiapkan 1 VPS Xeon 2 GB RAM fisik (+ 2 GB Swap), Caddy reverse proxy HTTPS, GitHub Actions CI/CD, Docker Compose, dan bantuan UI. |
| **Ichsan** | **UI/UX** | Tester | Merancang alur mockup dan design system di Figma, tema Dark Glow, handoff aset ke frontend, dan usability testing. |

---

## 2. Alur Kerja Pengembangan (Development Workflow)

Tahapan perpindahan status tiket di papan GitHub Projects ("Mojiji Kanban"):
```
Product Backlog ➔ Sprint Planning ➔ To Do ➔ In Progress ➔ Code Review ➔ Ready for Test ➔ Testing ➔ Done
```

* **Git Workflow:**
  * Hanya ada dua cabang permanen: **`main`** (production) dan **`develop`** (staging); cabang default di repositori adalah **`develop`**.
  * Seluruh pekerjaan dilakukan di cabang fitur pendek yang dicabangkan dari `develop` (contoh: `feat/MJ-021-login-ui`), lalu diajukan melalui Pull Request ke `develop`.
  * **Dilarang keras melakukan push langsung ke `main` atau `develop`.**
  * Format pesan commit wajib menyertakan tipe dan nomor tiket: `feat(...)`, `fix(...)`, `docs(...)`, `chore(...)`, `test(...)` dengan format `[MJ-xxx]`.
* **Durasi Sprint:**
  * **Sprint 1 (Minggu 4–8):** Core MVP (Register, Login, Cari, Detail, Tracker) sampai live di production VPS (UTS).
  * **Sprint 2 (Minggu 9–11):** Fitur Lanjutan (Komentar, Profil, Dark/Light Mode, Reminder).
  * **Final Sprint (Minggu 12–14):** Stabilisasi, dokumentasi Docusaurus, dan rilis produk akhir (UAS).
* **Definition of Done (DoD):**
  1. Fitur memenuhi Acceptance Criteria (AC) pada User Story.
  2. Telah lolos pengujian fungsional dan otomatis (Newman CLI).
  3. Lolos peninjauan kode (*Code Review*) melalui Pull Request.
  4. Tidak ada kredensial, password, atau API key rahasia yang ter-commit ke repositori.
  5. Dokumen teknis terkait di folder `/docs` telah diperbarui dengan standar frontmatter YAML.

---

## 3. Matriks Tanggung Jawab RACI (RACI Matrix)

* **R (Responsible):** Pelaksana tugas teknis.
* **A (Accountable):** Penanggung jawab tunggal hasil akhir.
* **C (Consulted):** Rekan diskusi / masukan teknis silang (*Pairing / Secondary Role*).
* **I (Informed):** Pihak yang menerima pemberitahuan (*Handoff*).

| Aktivitas / Modul Proyek | Andika (FE) | Syafii (BE) | Ryan (DBA) | Nadia (QA) | Aji (DevOps) | Ichsan (UI/UX) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Penyusunan PRD & User Story** | C | C | C | C | C | **A / R** |
| **Desain Antarmuka Figma & Tokens** | C | I | I | C | I | **A / R** |
| **Perancangan Basis Data & Migrasi** | I | C | **A / R** | I | C | I |
| **Pengembangan API Microservices** | C | **A / R** | C | I | C | I |
| **Pengembangan Frontend Web Next.js**| **A / R** | C | I | C | C | C |
| **Pengujian Fungsional & Newman CLI** | I | C | I | **A / R** | C | I |
| **Infrastruktur VPS, Caddy, & CI/CD** | I | C | C | I | **A / R** | I |
| **Release Management & Tagging Git** | C | C | C | C | **A / R** | I |
| **Dokumentasi Terpadu (/docs)** | R | R | R | R | **A / R** | R |
