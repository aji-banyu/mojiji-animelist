# Panduan Kontribusi Mojiji (AnimeList)

Aturan ini berlaku untuk semua anggota tim. Baca sebelum mengerjakan tiket pertama.

## 1. Prinsip dasar

- Setiap pekerjaan punya tiket di GitHub Projects dengan ID `AL-xxx`. ID tiket wajib ada di nama branch, commit, dan PR.
- Dilarang push langsung ke `main` atau `develop`. Semua perubahan lewat Pull Request (PR).
- Dilarang meng-commit rahasia (lihat bagian 7).
- Jangan mengubah kontrak role lain (API, skema database, kebutuhan produk) secara diam-diam. Ajukan CHANGE REQUEST ke tim.

## 2. Branch

- `main` = production. `develop` = integrasi/staging. Keduanya dilindungi.
- Dilarang membuat branch permanen per role (frontend, backend, dba, qa, devops, uiux).
- Semua pekerjaan memakai branch pendek yang dibuat dari `develop`.
- Format nama: `tipe/AL-xxx-deskripsi-singkat`
- Tipe: `feat` (fitur), `fix` (bug), `test` (tes), `docs` (dokumen), `chore` (setup/infra), `refactor` (rapikan kode).
- Contoh: `feat/AL-021-login-ui`, `fix/AL-025-login-validation`, `chore/AL-026-docker-environment`.
- Hapus branch setelah PR di-merge.

## 3. Commit

- Format: `tipe(scope): deskripsi [AL-xxx]`
- Contoh: `feat(auth): add login endpoint [AL-021]`, `docs(api): document login endpoint [AL-024]`.
- Dilarang pesan tanpa makna: `update`, `fix`, `final`, `revision`, `test`, `final-final`.

## 4. Alur kerja per tiket

1. Ambil tiket dari kolom To Do.
2. Buat branch pendek dari `develop`.
3. Kerjakan dan uji di lokal.
4. Commit dengan format di atas.
5. Push, lalu buat Pull Request ke `develop`.
6. Minta review. Perbaiki komentar penting.
7. Setelah di-merge, QA menguji di staging.
8. Tiket Done hanya jika Acceptance Criteria terbukti terpenuhi.

## 5. Pull Request

- Judul PR mengikuti format commit.
- Cek kotak **base**: harus `develop` (release `develop` ke `main` hanya setelah QA).
- Isi PR: Ticket ID, apa yang berubah dan alasannya, komponen terdampak, cara tes, Acceptance Criteria yang dipenuhi, dependency, dampak ke API / database / UI / environment, breaking change.
- Butuh minimal 1 approval dari anggota lain. Anda tidak bisa meng-approve PR sendiri.
- Komentar review yang penting harus selesai (Resolved) sebelum merge.
- Setelah CI aktif, PR hanya boleh di-merge jika CI lolos.

## 6. Pemilik folder

| Folder | Pemilik |
|---|---|
| `apps/web/` | Frontend |
| `services/` | Backend |
| `database/` | DBA |
| `tests/`, `docs/qa/` | QA |
| `docs/ui-ux/` | UI/UX |
| `infra/`, `.github/`, `docs/deployment/` | DevOps |

Semua orang boleh berkontribusi di folder mana pun, tetapi perubahannya direview oleh pemilik folder itu.

## 7. Rahasia

Dilarang di-commit: `.env`, password database, JWT secret, kunci Supabase, token Upstash, password VPS, kunci SSH, GitHub token, dan kunci API apa pun.

- Gunakan `.env.example` untuk mendaftar NAMA variabel tanpa nilai asli.
- Jika rahasia terlanjur ter-commit: segera beri tahu DevOps dan ganti (rotate) kuncinya. Menghapus file saja tidak cukup karena riwayat commit tetap tersimpan.

## 8. Papan Kanban

Backlog, To Do, In Progress, Code Review, Ready for Test, Testing, Done.

Tiket baru dianggap Done setelah Acceptance Criteria diverifikasi, dokumen diperbarui, dan tidak ada rahasia di commit.

## 9. Komunikasi

Gunakan label berikut agar tidak ada asumsi tersembunyi: CONFIRMED, ASSUMPTION, PROPOSAL, BLOCKED, DECISION NEEDED.

Jika pekerjaan Anda membuat role lain bergantung, tulis HANDOFF: dari siapa, untuk siapa, tiket, apa yang sudah siap, apa yang diminta, artefak, catatan penting, dan apakah memblokir.
