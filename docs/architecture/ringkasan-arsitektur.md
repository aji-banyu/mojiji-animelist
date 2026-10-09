# Ringkasan Arsitektur Mojiji AnimeList

- Tiket: MJ-007
- Cakupan: Arsitektur lintas komponen Mojiji AnimeList
- Kontributor: Backend
- Status: Ringkasan awal untuk ditinjau bersama tim
- Tujuan: Menjelaskan tanggung jawab komponen dan batas antarservice.

## 1. Gambaran Umum

Mojiji AnimeList adalah aplikasi web untuk mencari informasi anime dan manga serta mengelola daftar tontonan atau bacaan pengguna.

Arsitektur backend dirancang agar frontend berkomunikasi melalui API Gateway. Gateway meneruskan permintaan ke service yang bertanggung jawab atas fitur terkait. Informasi katalog diperoleh dari provider eksternal Tenrai API, sedangkan data aplikasi dikelola melalui database.

Komponen dan detail implementasi yang belum diverifikasi harus dikonfirmasi bersama Backend, DBA, Frontend, dan DevOps sebelum dianggap final.

## 2. Tanggung Jawab Komponen

### Frontend
- Menyediakan antarmuka web untuk pengguna.
- Mengirim permintaan ke API Gateway.
- Menampilkan hasil pencarian, detail katalog, dan data tracker dari backend.

### API Gateway
- Menjadi pintu masuk permintaan API dari frontend.
- Meneruskan permintaan ke service yang sesuai.
- Menjadi tempat koordinasi format respons dan penanganan error API.

### User Service
- Menangani fitur dan data yang berkaitan dengan akun pengguna.
- Menjadi service backend untuk kebutuhan pengguna, termasuk pemeriksaan kesehatan service melalui endpoint `/health` pada tahap setup.

### Catalog Service
- Menangani kebutuhan pencarian dan detail anime atau manga.
- Berkomunikasi dengan Tenrai API untuk memperoleh data katalog.
- Menyesuaikan data provider dengan kontrak API internal yang disepakati tim.

### Tracker Service
- Menangani data daftar anime atau manga yang dilacak pengguna.
- Mengelola kebutuhan status tontonan atau bacaan sesuai kontrak fitur yang disepakati tim.

### Database
- Menyimpan data aplikasi yang perlu dipertahankan, sesuai rancangan skema dan keputusan DBA.
- Struktur tabel, relasi, dan aturan akses perlu mengikuti dokumentasi database proyek.

### Cache
- Dapat digunakan untuk mengurangi permintaan berulang dan membantu mengendalikan akses ke provider eksternal.
- Teknologi, kebijakan cache, dan implementasinya perlu dikonfirmasi sebelum dianggap aktif.

### Tenrai API
- Menjadi provider eksternal untuk kebutuhan data katalog anime dan manga.
- Perilaku endpoint, struktur respons, batas permintaan, dan keterbatasan beta harus dicatat berdasarkan pengujian aktual.

## 3. Alur Permintaan Katalog

1. Pengguna melakukan pencarian atau membuka detail anime atau manga di frontend.
2. Frontend mengirim permintaan ke API Gateway.
3. Gateway meneruskan permintaan ke Catalog Service.
4. Catalog Service meminta data yang diperlukan dari Tenrai API.
5. Catalog Service menyesuaikan data untuk kontrak API internal.
6. Respons diteruskan melalui Gateway ke frontend.

Alur ini merupakan gambaran rancangan dan perlu disesuaikan jika implementasi aktual berbeda.

## 4. Prinsip Integrasi

- Frontend menggunakan API internal, bukan bergantung langsung pada detail implementasi provider eksternal.
- Setiap service memiliki tanggung jawab yang jelas.
- Format respons dan error perlu konsisten berdasarkan kontrak API yang disepakati.
- Kredensial dan konfigurasi lingkungan tidak boleh ditulis langsung di source code.
- Batas permintaan provider eksternal harus diperhatikan oleh service yang mengaksesnya.
- Perubahan kontrak harus dikomunikasikan kepada tim yang terdampak.

## 5. Hal yang Perlu Dikonfirmasi

- Pembagian endpoint dan tanggung jawab final setiap service.
- Skema database dan kepemilikan data bersama DBA.
- Format respons API bersama Frontend.
- Konfigurasi deployment dan environment bersama DevOps.
- Endpoint Tenrai yang telah berhasil diuji serta batas permintaannya.
- Strategi cache, autentikasi, dan penanganan kegagalan provider.

## 6. Status Dokumentasi

Dokumen ini adalah ringkasan awal untuk koordinasi lintas tim, bukan bukti bahwa semua service dan infrastruktur telah selesai diimplementasikan.

Dokumentasi referensi provider lama perlu ditinjau dan diselaraskan dengan keputusan penggunaan Tenrai.
