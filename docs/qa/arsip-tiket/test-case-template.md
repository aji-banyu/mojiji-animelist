# Test Case Template — MOJIJI

> Template standar QA untuk pengujian fitur MOJIJI berdasarkan Mini PRD Revisi 4 (Versi 1.4 — Docker/Migration Update), Acceptance Criteria, dan Timeline QA Minggu 3–14.
>
> Digunakan untuk pengujian manual, API (Postman), integration, end-to-end (E2E), smoke test, regression test, serta verifikasi non-functional requirements (NFR).

## 1. Test Case Information

| Field | Value |
|---|---|
| Test Case ID | TC-XXX-001 |
| Ticket ID | MJ-XXX |
| User Story ID | US-XXX / N/A |
| Feature | Nama fitur yang diuji |
| Test Scenario | Skenario yang diuji |
| AC Reference | Referensi Acceptance Criteria dari PRD / GitHub Issue |
| Test Type | Manual / API / Integration / E2E / Smoke / Regression / NFR |
| Scenario Type | Positive / Negative |
| Priority | High / Medium / Low |
| Sprint | Sprint 1 / Sprint 2 / Final Sprint |
| Test Environment | Local / Staging / Production |
| Target Branch | Feature Branch / develop / main |
| Tester | Nama QA |
| Test Date | YYYY-MM-DD |
| Build / Version | Versi aplikasi atau commit SHA |
| Related API Endpoint | Method dan endpoint / N/A |

**Catatan:**
- Staging menggunakan branch `develop`.
- Production menggunakan branch `main`.
- Pengujian fitur sebelum dinyatakan Done dilakukan di staging.
- Pengujian production menggunakan akun demo dan data non-sensitif.
- Pengujian API menggunakan Postman.
- QA tidak wajib menjalankan Docker secara langsung.

## 2. Preconditions

Tuliskan kondisi yang harus dipenuhi sebelum pengujian dimulai.

Contoh:
- Aplikasi dapat diakses melalui URL environment yang diuji.
- Service terkait berjalan dan dapat diakses.
- Database sesuai environment tersedia.
- Migration database yang dibutuhkan telah berhasil dijalankan.
- Akun dummy telah tersedia jika pengujian memerlukan login.
- Data awal pengujian telah disiapkan.
- Endpoint API terkait tersedia jika diperlukan.
- Tiket telah siap untuk diuji sesuai workflow tim.

**Catatan:** Tidak semua precondition wajib digunakan. Sesuaikan dengan fitur yang diuji.

## 3. Test Data

Tuliskan data dummy yang digunakan selama pengujian.

| Field | Test Data |
|---|---|
| Username | qa_test_user |
| Email | qa.test@example.com |
| Media Type | anime / manga |
| Search Keyword | Naruto |
| MAL ID | ID dummy atau ID valid sesuai data uji |
| Tracker Status | Plan / Watching / Reading / Completed / On Hold / Dropped |
| Current Progress | 4 |
| Expected Progress | 5 |

**Ketentuan keamanan:**
- Jangan mencantumkan password asli, token, cookie sesi, API key, atau kredensial database.
- Gunakan akun dan data dummy.
- Jangan memakai data production untuk pengujian staging.
- Sensor informasi sensitif pada screenshot atau response API sebelum menyimpannya sebagai evidence.

## 4. Test Steps

Tuliskan langkah pengujian secara berurutan dan jelas.

1. Buka aplikasi atau endpoint pada environment yang ditentukan.
2. Siapkan kondisi awal sesuai Preconditions.
3. Masukkan data pengujian sesuai Test Data.
4. Jalankan tindakan yang ingin diuji.
5. Amati respons aplikasi atau API.
6. Bandingkan hasil aktual dengan Expected Result.
7. Dokumentasikan hasil dan evidence pengujian.

**Catatan:**
- Gunakan langkah spesifik sesuai fitur.
- Untuk API testing, cantumkan HTTP method, endpoint, parameter, dan request body jika diperlukan.
- Untuk integration testing, periksa interaksi antarkomponen terkait.
- Untuk E2E testing, periksa alur pengguna dari awal hingga akhir.

## 5. Expected Result

Tuliskan hasil yang seharusnya terjadi berdasarkan Acceptance Criteria pada PRD atau GitHub Issue yang telah disepakati.

Expected Result harus dapat diverifikasi.

Contoh:
- Register berhasil membuat akun dan mengarahkan pengguna ke halaman login.
- Login dengan kredensial benar membuka dashboard.
- Pencarian "Naruto" menampilkan hasil anime/manga dari Tenrai API.
- Detail menampilkan judul, gambar, sinopsis, skor, dan jumlah episode/chapter.
- Perubahan status tracker berhasil disimpan.
- Tombol +1 mengubah progres dari 4 menjadi 5 dan menyimpannya.
- Jika penyimpanan +1 gagal, progres kembali ke nilai sebelumnya dan pesan error ditampilkan.
- Pengguna tidak dapat mengakses tracker milik pengguna lain.

**Catatan:** Jangan menambahkan persyaratan baru yang belum disepakati sebagai Acceptance Criteria.

## 6. Actual Result

Diisi dengan hasil yang benar-benar terjadi setelah test case dijalankan.

Tuliskan:
- Respons aplikasi atau API.
- Perubahan data yang terjadi.
- Pesan error yang muncul jika ada.
- Perbedaan antara hasil aktual dan Expected Result.
- Waktu respons jika melakukan pengujian performa.

Jika test case belum dijalankan, tulis:

`Not Tested`

## 7. Test Status

Pilih salah satu:

| Status | Keterangan |
|---|---|
| Not Run | Pengujian belum dijalankan |
| Pass | Hasil aktual sesuai Expected Result |
| Fail | Hasil aktual tidak sesuai Expected Result |
| Blocked | Pengujian tidak dapat dilakukan karena kendala atau dependency |

**Catatan:**
- Test case berstatus Fail harus memiliki referensi bug jika ditemukan defect.
- Test case berstatus Blocked harus mencantumkan alasan pengujian terhambat.
- Test case Pass harus memiliki evidence yang memadai sesuai jenis pengujian.

## 8. Evidence

Tambahkan bukti pengujian yang dapat diverifikasi.

Jenis evidence:
- Screenshot hasil pengujian.
- Rekaman layar jika diperlukan.
- Response API dari Postman yang sudah disensor.
- Hasil pengujian Postman/Newman.
- Log aplikasi yang relevan dan tidak mengandung secret.
- Bukti pipeline GitHub Actions.
- Bukti status migration staging/production.
- Bukti backup production sebelum migration jika menguji proses deployment.
- Bukti hasil pengujian performa atau penggunaan RAM.

**Evidence Link:**

`[Tambahkan link screenshot, laporan, log, atau GitHub Actions]`

**Catatan:** Simpan evidence pada lokasi dokumentasi QA yang disepakati tim dan cantumkan referensinya.

## 9. Bug Reference / Notes

Jika ditemukan bug, buat GitHub Issue dan isi informasi berikut:

| Field | Value |
|---|---|
| Bug ID / Issue | Link GitHub Issue |
| Bug Title | Judul masalah |
| Severity | High / Medium / Low |
| Environment | Local / Staging / Production |
| Steps to Reproduce | Langkah untuk mengulangi bug |
| Expected Result | Hasil yang seharusnya |
| Actual Result | Hasil yang terjadi |
| Evidence | Link bukti bug |
| Assigned Role | Frontend / Backend / DBA / DevOps / Role terkait |

**Notes:**

Tuliskan catatan tambahan, kendala, atau hasil diskusi dengan anggota tim.

Jika tidak ditemukan bug, tulis:

`N/A`

## 10. Retest Information

| Field | Value |
|---|---|
| Retest Date | YYYY-MM-DD / N/A |
| Retest Environment | Local / Staging / Production |
| Retest Build / Version | Versi atau commit SHA |
| Retest Result | Pass / Fail / Not Run |
| Related Fix / PR | Link Pull Request perbaikan / N/A |
| Notes | Catatan hasil pengujian ulang |
| Retest Evidence | Link evidence / N/A |

**Catatan:**
- Retest dilakukan setelah bug diperbaiki dan perubahan tersedia di environment pengujian.
- Pastikan bug sebelumnya tidak terjadi lagi.
- Jika diperlukan, lakukan regression testing pada fitur yang berkaitan.

## 11. Non-Functional Requirements Verification

Isi bagian ini hanya jika test case berkaitan dengan NFR.

| Area | Requirement PRD | Result |
|---|---|---|
| Performance | Pencarian yang sudah ada di cache Redis merespons kurang dari 300 ms | Pass / Fail / N/A |
| Tenrai Rate Limit | Permintaan maksimal 4/detik dan 120/menit per IP | Pass / Fail / N/A |
| Security | Pengguna hanya dapat mengakses data miliknya sendiri | Pass / Fail / N/A |
| Validation | Input pengguna divalidasi | Pass / Fail / N/A |
| Error Handling | Kesalahan menampilkan pesan yang jelas dan ramah | Pass / Fail / N/A |
| Responsive UI | Tampilan nyaman digunakan di HP dan komputer | Pass / Fail / N/A |
| Resource Usage | Penggunaan RAM VPS di bawah 75% saat pengujian | Pass / Fail / N/A |
| Deployment | Aplikasi dapat diakses melalui HTTPS | Pass / Fail / N/A |
| Environment Isolation | Staging dan production menggunakan konfigurasi serta database terpisah | Pass / Fail / N/A |
| Database Migration | Migration staging berjalan otomatis melalui pipeline deployment | Pass / Fail / N/A |
| Production Backup | Pipeline production menjalankan pg_dump sebelum migration | Pass / Fail / N/A |

**Catatan:**
- QA memverifikasi NFR yang relevan terhadap test case dan sesuai tahap pengerjaan.
- QA tidak perlu menjalankan Docker atau migration production dari laptop.
- Verifikasi migration, backup, dan deployment dapat menggunakan bukti workflow GitHub Actions yang disediakan DevOps/DBA.
- Nilai N/A digunakan jika suatu requirement tidak berkaitan dengan test case.

## 12. QA Verification & Definition of Done

Checklist verifikasi sebelum test case atau tiket fitur dinyatakan selesai.

- [ ] Acceptance Criteria yang relevan telah diuji.
- [ ] Expected Result sesuai dengan PRD atau AC terbaru yang telah disepakati.
- [ ] Actual Result telah dicatat.
- [ ] Test Status telah ditentukan.
- [ ] Evidence pengujian telah dilampirkan.
- [ ] Bug yang ditemukan telah didokumentasikan dalam GitHub Issue.
- [ ] Bug blocker tidak tersisa.
- [ ] Retest telah dilakukan jika terdapat perbaikan bug.
- [ ] Regression testing telah dilakukan jika diperlukan.
- [ ] Pengujian staging telah selesai sesuai cakupan tiket.
- [ ] Pull Request fitur telah melalui review.
- [ ] Tidak ada kredensial atau data sensitif dalam dokumentasi pengujian.
- [ ] Dokumen terkait telah diperbarui.
- [ ] Tiket siap dinyatakan Done sesuai workflow tim.

## 13. QA Final Notes

**Overall Test Result:** Pass / Fail / Blocked / Not Run

**QA Verification:** Approved / Changes Required / Pending

**Verified By:** Nama QA

**Verification Date:** YYYY-MM-DD

**Additional Notes:**

Tuliskan kesimpulan hasil pengujian, kendala yang belum terselesaikan, dan tindak lanjut yang diperlukan.

---

**Reference Documents:**
- Mini PRD MOJIJI Revisi 4 — Versi 1.4 (Docker/Migration Update).
- MOJIJI Timeline Minggu 3–14 — Docker/Migration Update.
- GitHub Issues dan Acceptance Criteria terkait.
- Dokumentasi API pada `docs/api`.
- Dokumentasi QA pada `docs/qa`.

**Dokumen:** Test Case Template — MOJIJI

**Status:** Template QA

**Maintainer:** QA / Tester