# PR MJ-087 — Draft Pull Request

> Buka di browser: https://github.com/aji-banyu/mojiji-animelist/pull/new/test/MJ-087-tes-postman-endpoint-inti-mvp
>
> **Base:** `develop` ← **Compare:** `test/MJ-087-tes-postman-endpoint-inti-mvp`

---

## Title
```
test(qa): laporan postman core api mvp [MJ-087]
```

---

## Body

```
## Ticket ID
MJ-087

## Apa yang berubah
Menambahkan laporan pengujian koleksi Postman Core API MVP untuk environment Staging,
mengisi konfigurasi `baseUrl` di file environment Postman/YAML, dan membuat request file
TC-007, TC-010, dan seluruh Tracker (TC-011a s/d TC-016).

## Alasan perubahan
Verifikasi bahwa seluruh endpoint inti MVP (Health, Auth, Catalog, Tracker) telah teruji
secara resmi di Staging sebelum rilis MVP Minggu 8 (UTS).

## Komponen terdampak
`docs/qa/`, `tests/api/`, `postman/environments/`, `postman/collections/MOJIJI MVP/`

## Cara tes
- Buka Postman, import environment `tests/api/MOJIJI-staging.postman_environment.json`
- Jalankan koleksi `tests/api/MOJIJI-MVP.postman_collection.json` ke environment Staging
- Lihat ringkasan hasil di `docs/qa/hasil-postman-mvp.md`

## Acceptance Criteria yang dipenuhi
- Seluruh Catalog endpoint diuji: 6 PASS, 1 FAIL (BUG-002: HTTP 500 pada anime/999999999)
- Auth & Tracker BLOCKED karena BUG-001 (User Service offline di VPS Staging)
- File environment Postman telah dikonfigurasi dengan `baseUrl` Staging
- Laporan UAT tersimpan di `docs/qa/hasil-postman-mvp.md`

## Dependensi
- **BUG-001:** User Service offline → menunggu perbaikan Backend (Syafii) / DevOps (Aji)
- **BUG-002:** HTTP 500 pada `/api/catalog/anime/999999999` → menunggu fix catalogController.js
- Retest Auth & Tracker akan dilakukan setelah User Service pulih (MJ-085)

## Dampak
- API contract: tidak ada perubahan
- Database: tidak ada perubahan
- UI: tidak ada perubahan
- Environment: `baseUrl` Staging diisi di file environment Postman (sebelumnya kosong)

## Breaking change
Tidak

## Checklist
- [x] Nama branch dan commit sesuai CONTRIBUTING.md
- [x] PR mengarah ke `develop` (cek kotak base)
- [x] Tidak ada rahasia (.env, kunci, password) di commit
- [x] Dokumentasi diperbarui jika perlu
- [x] Role yang terdampak sudah diberi tahu (HANDOFF)
```
