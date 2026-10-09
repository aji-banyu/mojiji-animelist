# Tenrai API Experiment — MJ-009

## 1. Informasi Pengujian

| Item            | Keterangan                                    |
| --------------- | --------------------------------------------- |
| Project         | Mojiji AnimeList                              |
| Ticket          | MJ-009                                        |
| API Provider    | Tenrai API                                    |
| API Version     | v1                                            |
| Base URL        | `https://api.tenrai.org/v1`                   |
| Jenis Pengujian | Pengujian manual endpoint API                 |
| Status          | Pengujian pencarian dan detail anime berhasil |

## 2. Tujuan

Eksperimen ini bertujuan untuk memeriksa aksesibilitas Tenrai API dan mengevaluasi struktur data yang tersedia untuk kebutuhan katalog anime pada Mojiji AnimeList.

Pengujian difokuskan pada:

1. Pencarian anime berdasarkan kata kunci.
2. Pengambilan detail anime berdasarkan MAL ID.
3. Pemeriksaan struktur respons JSON.
4. Peninjauan batas permintaan API berdasarkan dokumentasi resmi.
5. Identifikasi data yang relevan untuk kebutuhan Catalog Service.

## 3. Endpoint yang Diuji

### 3.1 Pencarian Anime

**Endpoint**

```http
GET https://api.tenrai.org/v1/anime?q=naruto&limit=5&sfw
```

**Parameter**

| Parameter | Fungsi                                                |
| --------- | ----------------------------------------------------- |
| `q`       | Kata kunci pencarian anime                            |
| `limit`   | Membatasi jumlah hasil yang diminta                   |
| `sfw`     | Meminta hasil pencarian yang sesuai dengan filter SFW |

**Hasil Pengujian**

Pengujian berhasil mengembalikan respons JSON yang berisi daftar anime terkait Naruto.

Pada respons yang diamati, informasi pagination menunjukkan:

* `current_page`: 1
* `has_next_page`: true
* `items.count`: 5
* `items.total`: 31
* `items.per_page`: 5

Salah satu hasil yang ditemukan adalah anime Naruto dengan informasi berikut:

| Field           | Nilai           |
| --------------- | --------------- |
| `mal_id`        | 20              |
| `title`         | Naruto          |
| `title_english` | Naruto          |
| `type`          | TV              |
| `episodes`      | 220             |
| `status`        | Finished Airing |
| `score`         | 8.03            |

Nilai tersebut merupakan contoh dari respons yang diamati saat pengujian, bukan nilai yang dijamin selalu sama pada setiap permintaan.

### 3.2 Detail Anime

**Endpoint**

```http
GET https://api.tenrai.org/v1/anime/20
```

**Parameter Path**

| Parameter | Fungsi                                             |
| --------- | -------------------------------------------------- |
| `20`      | MAL ID anime Naruto yang digunakan untuk pengujian |

**Hasil Pengujian**

Pengujian endpoint detail dikonfirmasi berhasil. Endpoint ini digunakan untuk mengambil informasi anime berdasarkan MAL ID.

Endpoint detail relevan untuk kebutuhan halaman detail anime pada Mojiji AnimeList. Namun, dokumentasi ini belum mencatat seluruh field respons endpoint detail secara terpisah.

## 4. Struktur Respons dan Data yang Relevan

Respons endpoint pencarian yang diamati menggunakan format JSON dan memiliki dua bagian utama:

* `pagination`: informasi halaman dan jumlah hasil.
* `data`: daftar objek anime hasil pencarian.

Field yang relevan untuk kebutuhan katalog antara lain:

| Field            | Kegunaan                              |
| ---------------- | ------------------------------------- |
| `mal_id`         | Identifikasi anime berdasarkan MAL ID |
| `title`          | Judul utama anime                     |
| `title_english`  | Judul bahasa Inggris jika tersedia    |
| `title_japanese` | Judul bahasa Jepang jika tersedia     |
| `images`         | URL gambar atau poster anime          |
| `synopsis`       | Ringkasan cerita anime                |
| `episodes`       | Jumlah episode jika tersedia          |
| `status`         | Status penayangan anime               |
| `score`          | Skor anime jika tersedia              |
| `genres`         | Daftar genre anime                    |
| `type`           | Jenis anime, misalnya TV atau OVA     |

Tidak semua field harus selalu memiliki nilai. Beberapa field dapat berisi `null`, array kosong, atau nilai yang berbeda sesuai ketersediaan data.

Sebelum data digunakan oleh fitur aplikasi, Catalog Service perlu menentukan field yang akan diteruskan ke frontend dan menangani field yang tidak tersedia.

## 5. Peninjauan Batas Permintaan API

Berdasarkan dokumentasi resmi Tenrai API yang ditinjau, batas permintaan publik yang didokumentasikan adalah:

| Ketentuan                   | Informasi                      |
| --------------------------- | ------------------------------ |
| Batas per detik             | 4 request per detik            |
| Batas per menit             | 120 request per menit per IP   |
| Respons saat melewati batas | HTTP `429 Too Many Requests`   |
| Header untuk waktu tunggu   | `Retry-After`, jika disediakan |

Jika menerima respons `429`, klien perlu menghormati waktu tunggu yang ditunjukkan oleh header `Retry-After` apabila tersedia, sebelum mencoba kembali.

**Catatan:** angka di atas berasal dari dokumentasi resmi, bukan hasil pengujian beban atau pengujian rate limit secara langsung. Eksperimen MJ-009 ini belum memverifikasi batas tersebut melalui pengiriman request berulang.

## 6. Kendala dan Batas Pengujian

Pengujian ini memiliki beberapa batasan:

1. Pengujian dilakukan secara manual pada endpoint pencarian dan detail anime.
2. Status HTTP numerik dari setiap request belum dicatat secara terpisah dalam laporan.
3. Belum dilakukan pengujian terhadap batas request secara langsung.
4. Belum dilakukan pengujian beban atau pengujian request bersamaan.
5. Belum dilakukan pengujian terhadap seluruh kemungkinan respons error, timeout, atau data yang tidak tersedia.
6. Belum dilakukan implementasi integrasi Tenrai API ke dalam Catalog Service.

Batasan tersebut perlu dipertimbangkan sebelum API digunakan pada lingkungan produksi.

## 7. Implikasi untuk Mojiji AnimeList

Berdasarkan hasil awal, Tenrai API dapat dipertimbangkan sebagai sumber data katalog anime untuk Mojiji AnimeList.

Catalog Service dapat menjadi lapisan yang bertanggung jawab untuk:

* Mengirim permintaan pencarian dan detail anime ke Tenrai API.
* Memetakan respons provider ke format data yang digunakan aplikasi.
* Menangani data yang tidak tersedia atau bernilai `null`.
* Menangani timeout dan respons error.
* Menghormati batas request provider.
* Menyiapkan strategi caching pada tahap pengembangan berikutnya apabila diperlukan.

Integrasi dan penanganan error tersebut merupakan pekerjaan lanjutan, bukan bagian yang telah diselesaikan oleh eksperimen ini.

## 8. Kesimpulan

Berdasarkan pengujian manual yang dilakukan, endpoint pencarian dan detail anime Tenrai API berhasil diakses dan memberikan data yang relevan untuk kebutuhan awal katalog anime Mojiji AnimeList.

Respons pencarian menyediakan informasi identitas anime, judul, gambar, jumlah episode, skor, sinopsis, genre, serta informasi pagination.

Dengan hasil awal tersebut, Tenrai API layak dipertimbangkan untuk eksperimen integrasi Catalog Service selanjutnya. Sebelum digunakan pada produksi, diperlukan pengujian tambahan terhadap status HTTP, penanganan error, batas request, dan konsistensi pemetaan data.

## 9. Referensi

* Dokumentasi resmi Tenrai API: https://api.tenrai.org/documentation
* Changelog Tenrai API: https://api.tenrai.org/changelog
