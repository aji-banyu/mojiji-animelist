---
title: "Konfigurasi Domain, Caddy, dan HTTPS (MJ-054)"
sidebar_position: 2
tags: [infrastruktur, devops, caddy, dns, ssl]
---

# Setup Domain dan Reverse Proxy (HTTPS)

Dokumen ini mencatat langkah-langkah konfigurasi domain publik, pengaturan DNS, serta implementasi *Reverse Proxy* menggunakan Caddy untuk mengamankan komunikasi peladen VPS dengan sertifikat SSL/HTTPS Let's Encrypt. (Tiket: **MJ-054**)

## 1. Registrasi dan Pointing DNS
Proyek Mojiji menggunakan ekstensi domain lokal `.web.id` (`mojiji.web.id`). Berbeda dengan domain `.com`, aktivasi domain `.web.id` diawasi oleh PANDI dan mewajibkan verifikasi identitas (KTP).

Setelah aktif, *routing* DNS diatur melalui panel DNS Management (DomaiNesia) dengan membuat dua **A Record** yang mengarah ke IP Publik VPS (`103.147.32.27`):
- **Host `@`** diarahkan ke `103.147.32.27` (Mewakili domain utama untuk Frontend).
- **Host `api`** diarahkan ke `103.147.32.27` (Mewakili subdomain untuk API Gateway).

## 2. Pengaturan Firewall VPS (Penting!)
Selain membuka port di level sistem operasi Ubuntu menggunakan UFW (`sudo ufw allow 80/tcp` dan `443/tcp`), akses port HTTP dan HTTPS **wajib** dibuka melalui panel dasbor penyedia VPS eksternal ("VPS Murah").

**Langkah penyelesaian (Colocated Router):**
Penyedia VPS memblokir akses web publik secara langsung via IP. Agar sertifikat SSL Let's Encrypt bisa diterbitkan, nama domain wajib didaftarkan pada dasbor VPS:
1. Masuk ke panel VPS.
2. Cari bagian **Domain & Website (port 80/443)**.
3. Tambahkan domain `mojiji.web.id` dan `api.mojiji.web.id` agar *router* VPS meneruskan lalu lintas eksternal ke dalam kontainer Caddy.

## 3. Arsitektur Separation of Concerns (Caddyfile)
Sesuai standar industri, berkas konfigurasi peladen web tidak dicampur dengan berkas orkestrasi Docker. Kami memisahkan konfigurasi Caddy ke direktori spesifik: `infra/caddy/Caddyfile`.

**Isi `Caddyfile`:**
```caddyfile
mojiji.web.id {
    # Menyajikan file statis Frontend hasil ekspor Next.js
    root * /srv
    file_server

    # Meneruskan lalu lintas spesifik ke API Gateway
    handle /api/* {
        reverse_proxy api-gateway:4000
    }
}

api.mojiji.web.id {
    # Meneruskan seluruh lalu lintas subdomain murni ke API Gateway
    reverse_proxy api-gateway:4000
}
```

**Pemetaan Volume Docker (`docker-compose.server.yml`):**
Layanan Caddy merujuk ke Caddyfile menggunakan struktur direktori relatif yang aman:
```yaml
volumes:
  - ../caddy/Caddyfile:/etc/caddy/Caddyfile
```

## 4. Hasil dan Validasi (Acceptance Criteria)
Ketika situs `[https://mojiji.web.id](https://mojiji.web.id)` diakses pasca-konfigurasi, sistem akan menampilkan respons **HTTP ERROR 404 Not Found**. 

Hal ini adalah **perilaku yang diharapkan (Expected Behavior)**, karena Caddy diarahkan untuk membaca folder `/srv`, yang mana saat ini masih kosong (aplikasi Frontend belum dibangun/di-*deploy* oleh CI/CD). 

Validasi kesuksesan dibuktikan dengan:
1. Halaman tidak lagi menampilkan pesan *"Site can't be reached"*.
2. Browser menampilkan ikon gembok (Padlock) dengan status **"Connection is secure"** dan **"Certificate is valid"**.
3. Caddy berhasil melakukan automasi penerbitan sertifikat SSL dari Let's Encrypt secara mandiri.
