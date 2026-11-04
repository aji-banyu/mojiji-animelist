# MJ-070 — Monitoring Bug dan Retest QA

> **Status:** BELUM DIJALANKAN — **tidak ada bug yang diklaim telah ditemukan atau diperbaiki**.  
> **Tiket:** MJ-070 | **Dependency:** MJ-068 dan MJ-069 | **PIC:** QA.  
> **Sumber kebenaran bug:** **GitHub Issues + GitHub Projects**; dokumen ini hanya rekap pendamping, bukan pengganti pembuatan Issue.

## 1. Tujuan dan prasyarat

- [ ] Hasil pengujian MJ-068 (`docs/qa/hasil-auth.md`) dan MJ-069 (`docs/qa/hasil-catalog.md`) tersedia dengan hasil nyata.
- [ ] Semua temuan **Fail** dikonfirmasi dapat direproduksi dan dicatat dalam **GitHub Issue** tersendiri.
- [ ] Setiap Issue diberi label role pemilik (Frontend/Backend/DevOps/DBA sesuai kasus) dan severity mengikuti konvensi tim.
- [ ] Tim pemilik bug mengetahui temuan dan dependency.
- [ ] Setelah fix tersedia di build staging yang baru, QA melakukan **retest**; jangan menyatakan bug Closed hanya karena developer mengaku sudah memperbaiki.

## 2. Format laporan bug yang dibuat di GitHub Issue

Gunakan `docs/qa/template-bug.md` dari MJ-013 sebagai acuan. Setiap laporan setidaknya mencakup:

```md
## Ringkasan Bug
[Auth/Catalog] Judul singkat masalah

## Related Ticket / Test Case
MJ-068 atau MJ-069; TC-xxx

## Severity dan Environment
Severity: High / Medium / Low
Environment: Staging / Local
Build / Commit: ...
Browser / Postman: ...

## Preconditions
- ...

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Result
...

## Actual Result
...

## Evidence
Tautan screenshot/log/response API yang sudah disensor.

## Owner / Label
Frontend / Backend / DevOps / DBA sesuai sumber masalah.

## Retest
Not Run (diisi setelah fix tersedia).
```

**Larangan:** Jangan sertakan nilai password, token, cookie sesi, secret, atau data akun nyata. Jangan menebak penyebab bug sebagai fakta sebelum diinvestigasi.

## 3. Rekap semua Issue (isi dengan tautan nyata)

| Issue / Link | Sumber (MJ / TC) | Ringkasan | Severity | Owner / Label | Status Issue | Build Fix | Retest (tanggal, hasil) | Bukti |
|---|---|---|---|---|---|---|---|---|
| — | — | **Belum ada temuan yang tercatat** | — | — | — | — | Not Run | — |

## 4. Prosedur monitoring dan retest

1. Cek GitHub Projects setiap awal hari kerja untuk Issue yang relevan dengan MJ-068 dan MJ-069.
2. Periksa apakah pemilik bug sudah menyediakan PR fix / commit serta environment tempat fix tersedia.
3. Jalankan ulang **langkah reproduksi yang sama** pada build yang sudah diperbarui. Pastikan Actual Result sekarang sesuai Expected Result dan kumpulkan evidence baru.
4. Bila berhasil, catat **Retest: Pass** beserta tanggal, build, dan link bukti; beri komentar pada Issue dan minta/ikuti proses Closed sesuai kebijakan tim.
5. Bila masih terjadi, catat **Retest: Fail** dan kembalikan Issue ke pemiliknya dengan evidence baru.
6. Lakukan regression singkat pada alur terkait bila perlu (misal fix Login tidak merusak Logout).
7. Sampaikan ringkasan bug terbuka ke tim saat **sync tengah minggu**.

## 5. Laporan ringkas untuk sync tengah minggu

| Metrik | Isi setelah monitoring |
|---|---|
| Bug baru dari MJ-068 | Belum diverifikasi |
| Bug baru dari MJ-069 | Belum diverifikasi |
| Bug Open / In Progress | Belum dihitung |
| Bug Ready for Retest | Belum dihitung |
| Retest Pass | Belum dihitung |
| Retest Fail | Belum dihitung |
| Blocker utama dan owner | — |
| Keputusan / tindakan berikutnya | — |

## 6. Handoff QA ke Frontend / Backend

- **Dikirim oleh:** QA.
- **Ditujukan kepada:** Frontend/Backend (atau role terkait berdasarkan bug).
- **Artefak:** Tautan GitHub Issue, bukti tersensor, dan catatan MJ-068/MJ-069.
- **Diminta:** Konfirmasi penanggung jawab, rencana perbaikan, referensi PR/commit fix, dan pemberitahuan ketika build baru siap diuji ulang.
- **Memblokir—:** Tentukan berdasarkan severity, dampak user flow, dan keputusan tim; jangan otomatis menyebut semua bug blocker.

## 7. Definition of Done untuk MJ-070

- [ ] Semua bug yang **benar-benar ditemukan** selama MJ-068/MJ-069 memiliki GitHub Issue lengkap.
- [ ] Issue memiliki label dan PIC yang sesuai; bisa ditelusuri ke test case dan evidence.
- [ ] Bug yang sudah diperbaiki dan tersedia untuk QA **telah diuji ulang**, dengan hasilnya tercatat.
- [ ] Ringkasan status bug disampaikan dalam sync tengah minggu.
- [ ] PR dokumentasi (jika dibuat) telah direview sesuai workflow tim.

Jika hasil tes MJ-068/MJ-069 tidak menemukan bug, laporkan **"Tidak ditemukan bug dalam cakupan tes ini"** hanya sesudah tes sungguhan selesai dan evidence tersedia. Jangan membuat Issue palsu untuk memenuhi angka.
