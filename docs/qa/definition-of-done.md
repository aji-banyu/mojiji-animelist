# Definition of Done (DoD) — MOJIJI

> **Proyek:** MOJIJI — Web Tracking Anime & Manga  
> **Tiket pembuatan dokumen:** MJ-031  
> **Sumber aturan:** Mini PRD MOJIJI Revisi 4 (v1.4 — Docker/Migration Update), **poin 4: Team & Development → Development Workflow → Definition of Done**.  
> **Status:** Draft untuk disepakati tim; checklist ini tidak mengubah PRD.

## 1. Apa itu Definition of Done?

**Definition of Done** adalah standar bersama untuk memutuskan apakah sebuah tiket/fitur benar-benar **selesai**, bukan hanya karena seseorang sudah menulis kode, membuat dokumen, atau membuka Pull Request.

Menurut PRD poin 4, pekerjaan dikatakan Done ketika:

1. Fitur **sesuai Acceptance Criteria**.
2. Fitur **sudah diuji**.
3. Perubahan **sudah di-review melalui Pull Request**.
4. **Tidak ada password atau kunci rahasia** di repository.
5. **Dokumen terkait diperbarui**.

Untuk pekerjaan **non-fungsional/dokumentasi** seperti MJ-031, verifikasi mengikuti AC tiketnya dan review dokumennya; tidak perlu mengklaim pengujian fungsi aplikasi yang memang tidak diubah.

## 2. Checklist DoD utama (berdasarkan lima poin PRD)

### A. Acceptance Criteria terpenuhi

- [ ] Setiap AC yang relevan dengan tiket telah diperiksa satu per satu.
- [ ] Hasil implementasi atau dokumen sesuai AC yang **resmi/disepakati**, bukan asumsi pribadi.
- [ ] Bukti pemenuhan AC tersedia atau dirujuk melalui tiket/PR.
- [ ] Requirement yang masih menunggu keputusan **tidak diklaim sudah terpenuhi**.

### B. Sudah diuji atau diverifikasi sesuai jenis pekerjaan

- [ ] Jenis verifikasi sesuai pekerjaan: UI manual, Postman/API, integration, E2E, atau review dokumen.
- [ ] Langkah/verifikasi dan hasil aktual dicatat, **hanya jika benar-benar telah dilakukan**.
- [ ] Bukti pengujian atau review dicantumkan (screenshot, hasil Postman, log aman, komentar review, dll. sesuai relevansi).
- [ ] Bug blocker yang terkait tidak dibiarkan tanpa penanganan sebelum tiket dinyatakan Done.

### C. Sudah melalui Pull Request dan review

- [ ] Perubahan dibuat pada branch kerja dari `develop` sesuai aturan Git tim.
- [ ] Pull Request mengarah ke **`develop`** untuk alur pekerjaan biasa.
- [ ] Reviewer memeriksa perubahan dan persyaratan approval repository terpenuhi.
- [ ] Review comment atau permintaan revisi yang relevan telah ditindaklanjuti.
- [ ] Status tiket di papan GitHub Projects sesuai hasil review dan verifikasi.

### D. Tidak ada secret dalam repository

- [ ] Tidak ada `.env` nyata, password, API key, token, cookie sesi, private key, atau kredensial database yang di-commit.
- [ ] Screenshot, Postman response, log, dan bukti tes yang dibagikan telah disensor jika mengandung informasi sensitif.
- [ ] Hanya contoh konfigurasi aman (mis. `.env.example`) yang dapat masuk repository bila diperlukan.

### E. Dokumentasi diperbarui

- [ ] Dokumen yang terkena dampak telah ditambah atau diperbarui (bila relevan).
- [ ] Perubahan API dirujuk di `docs/api` bila relevan.
- [ ] Perubahan arsitektur/deployment/database dijelaskan pada dokumen terkait bila relevan.
- [ ] Untuk pekerjaan QA, skenario, test case, hasil, bug, atau catatan klarifikasi disimpan di `docs/qa` sesuai tiket.

**Catatan sumber:** Lima bagian A–E merujuk langsung pada **lima prinsip DoD PRD poin 4**. Sub-checklist adalah **cara verifikasi yang disarankan QA**, bukan persyaratan produk baru yang berdiri sendiri. Jika tim memutuskan detail operasional yang berbeda, catat keputusan dan sinkronkan dokumen.

## 3. Cara menggunakan checklist

1. Buka GitHub Issue terkait dan baca Acceptance Criteria tiket.
2. Pilih hanya langkah verifikasi yang relevan dengan perubahan.
3. Kumpulkan bukti untuk poin yang memang sudah selesai.
4. Minta reviewer memeriksa PR dan bukti.
5. Pindahkan tiket ke **Done** hanya jika AC dan seluruh aspek DoD yang berlaku telah terverifikasi.

Jangan menyamakan **PR sudah dibuat**, **kode sudah selesai**, atau **dokumen sudah ditulis** dengan status **Done**.

## 4. Penerapan khusus pada tiket dokumentasi QA

Contoh untuk **MJ-031**:

| Prinsip DoD | Bukti yang relevan untuk MJ-031 | Status awal |
|---|---|---|
| AC tiket | Hasil review kejelasan AC **dibahas** dan checklist DoD tersedia | Menunggu pembahasan |
| Verifikasi | Review isi `review-ac.md` dan `definition-of-done.md`, bukan tes website | Belum diverifikasi |
| PR review | PR ke `develop` ditinjau reviewer | Belum diverifikasi |
| Keamanan | Periksa perubahan tidak berisi rahasia | Belum diverifikasi |
| Dokumentasi | Dua file ditambahkan ke `docs/qa/` | Periksa di PR |

Untuk **fitur aplikasi** nanti, bukti verifikasi berasal dari pengujian yang relevan pada environment sesuai tiket, misalnya staging melalui browser dan Postman. QA tidak perlu menjalankan Docker ataupun migration production dari laptop untuk menyelesaikan dokumentasi ini.

## 5. Catatan dan persetujuan tim

| Tanggal | Peninjau | Keputusan/masukan | Link Issue/PR | Status |
|---|---|---|---|---|
| — | — | Belum ada persetujuan tercatat | — | Draft |

- [ ] Checklist diperiksa dan dibahas bersama tim.
- [ ] Keputusan/revisi operasional dicatat beserta sumbernya.
- [ ] Dokumen siap digunakan sebagai acuan pemeriksaan tiket setelah disetujui.

---

**Referensi internal:** Mini PRD Revisi 4 poin 4, GitHub Project/Issue, `CONTRIBUTING.md`, dan `docs/qa/review-ac.md`.
