---
title: "Konfigurasi Domain, Caddy & HTTPS Otomatis (MJ-054)"
sidebar_position: 4
tags: [infrastruktur, devops, caddy, dns, ssl, domain, https, reverse-proxy, shared-hosting]
---

# Konfigurasi Domain, Caddy & HTTPS Otomatis (MJ-054)

Dokumen ini mencatat konfigurasi domain publik, integrasi DNS Management, mekanisme *SNI Edge Ingress* pada peladen NAT VPS Xeon Shared, arsitektur *Reverse Proxy* berbasis Caddy, serta otomatisasi sertifikat SSL/TLS menggunakan Let's Encrypt / ZeroSSL untuk proyek **Mojiji AnimeList** sesuai tiket **MJ-054**.

---

## 1. Arsitektur Reverse Proxy & Terminasi TLS Caddy

Seluruh lalu lintas web publik dari internet diarahkan melalui port **80 (HTTP)** dan **443 (HTTPS)** menuju kontainer Caddy yang bertindak sebagai gerbang tunggal (*Edge Reverse Proxy*):

```mermaid
flowchart TD
    subgraph CLIENTS ["Akses Pengguna & Klien API"]
        WebUser["Pengunjung Web (Browser)"]
        ApiUser["Klien Aplikasi Mobile / Postman"]
    end

    subgraph PROVIDER_EDGE ["Router Edge Provider NAT VPS (103.147.32.27)"]
        EDGE_ROUTER{"SNI Domain Ingress Router\n(Port 80/443)"}
        IP_BLOCK["Akses Raw IP 80/443 -> DIBLOKIR"]
    end

    subgraph CADDY_EDGE ["Caddy Web Server (Container :443 / :80 di VPS #1966)"]
        TLS["Auto TLS Termination\n(Let's Encrypt / ZeroSSL)"]
        GZIP["Kompresi Gzip Dinamis"]
        ROUTER{"Evaluasi Jalur Path URL"}
    end

    subgraph BACKEND_NETWORK ["Jaringan Internal Docker (mojiji_internal)"]
        GATEWAY["mojiji_gateway_server (:4000)"]
        STATIC["File Statis Hasil Ekspor Next.js (/srv)"]
    end

    WebUser -->|HTTPS staging.mojiji.web.id| EDGE_ROUTER
    ApiUser -->|HTTPS mojiji.web.id/api/*| EDGE_ROUTER
    EDGE_ROUTER -->|Teruskan Traffic Domain ke VPS| TLS
    
    WebUser -.->|Akses Langsung http://103.147.32.27| IP_BLOCK
    
    TLS --> GZIP --> ROUTER
    ROUTER -->|Jika Awalan /api/*| GATEWAY
    ROUTER -->|Jalur Lainnya (/*)| STATIC

    style PROVIDER_EDGE fill:#fff3cd,stroke:#ffc107,color:#856404
    style CADDY_EDGE fill:#e8f4f8,stroke:#17a2b8,color:#0c5460
```

---

## 2. Pendaftaran Domain `.web.id` & Konfigurasi DNS

Proyek Mojiji menggunakan domain lokal Indonesia tingkat dua (**`.web.id`**), yaitu **`mojiji.web.id`**, yang terdaftar di bawah regulasi PANDI (*Pengelola Nama Domain Internet Indonesia*).

### A. Konfigurasi DNS A-Record (DomaiNesia DNS Management)
Dua buah A-Record diarahkan ke alamat IP Publik bersama VPS peladen (`103.147.32.27`):

| Host / Subdomain | Tipe Record | Alamat Tujuan (IP VPS) | TTL | Peruntukan Lingkungan |
| :--- | :---: | :---: | :---: | :--- |
| **`@` (Root Domain)** | `A` | `103.147.32.27` | 3600 | Domain Utama Production (`mojiji.web.id`) |
| **`staging`** | `A` | `103.147.32.27` | 3600 | Lingkungan Staging (`staging.mojiji.web.id`) |

> [!NOTE] Strategi Single-Origin Path Routing:
> Pada perancangan awal sempat dipertimbangkan subdomain terpisah `api.mojiji.web.id`. Namun, untuk mengeliminasi kendala **CORS (*Cross-Origin Resource Sharing*)** serta pembatasan pemblokiran *Third-Party Cookies* pada peramban modern (Safari, Chrome), tim memutuskan strategi **Single-Origin Path-Based Routing**: `/api/*` diteruskan ke API Gateway pada domain yang sama.

### B. Registrasi Domain di Panel Provider NAT VPS (Port 80/443 Routing)
Karena peladen berjalan di atas arsitektur **Xeon Shared NAT VPS**, akses web port 80 dan 443 via raw IP dinonaktifkan oleh provider. Sebagai gantinya, provider menyediakan fitur panel **"Domain & Website (port 80/443)"**:

1. **Entri Terdaftar di Panel Provider:**
   * `mojiji.web.id` dan `*.mojiji.web.id` (Production)
   * `staging.mojiji.web.id` dan `*.staging.mojiji.web.id` (Staging)
2. **Cara Kerja:** Router edge provider membaca header HTTP `Host:` dan ekstensi TLS *Server Name Indication (SNI)* pada setiap paket data masuk. Jika paket ditujukan untuk domain di atas, router edge seketika meneruskannya ke port 80/443 pada instance VPS kita, di mana Caddy telah siap menyambutnya.

---

## 3. Konfigurasi `Caddyfile` Standar Tim

Konfigurasi peladen web Caddy dipisahkan ke dalam direktori independen di `infra/caddy/Caddyfile`:

```caddy
# ==============================================================================
# Mojiji AnimeList - Konfigurasi Reverse Proxy Caddy
# ==============================================================================

# 1. Lingkungan Staging
staging.mojiji.web.id {
    encode gzip

    # Meneruskan lalu lintas API ke kontainer API Gateway
    handle /api/* {
        reverse_proxy api-gateway:4000
    }

    # Menyajikan file statis Next.js hasil ekspor
    handle {
        root * /srv
        try_files {path} {path}/index.html /index.html
        file_server
    }
}

# 2. Lingkungan Production (Milestone UTS Minggu 8)
mojiji.web.id {
    encode gzip

    # Meneruskan lalu lintas API ke API Gateway Production
    handle /api/* {
        reverse_proxy api-gateway:4000
    }

    # Menyajikan file statis Next.js rilis produksi
    handle {
        root * /srv/production/web
        try_files {path} {path}/index.html /index.html
        file_server
    }
}
```

---

## 4. Persistensi Sertifikat SSL & Volume `caddy_data`

> [!CAUTION]
> **PERINGATAN KRITIS DEVOPS:**  
> Kontainer Caddy memanfaatkan volume bernama **`caddy_data`** untuk menyimpan sertifikat SSL dan kunci privat kriptografi Let's Encrypt.
>
> **DILARANG KERAS MENGHAPUS VOLUME `caddy_data`!**  
> Jika volume ini dihapus secara berkala, Caddy akan meminta sertifikat baru setiap kali *boot*. Otoritas Let's Encrypt menerapkan batas ketat (*Rate Limit* maksimal 5 sertifikat duplikat per minggu). Melewati batas ini akan menyebabkan domain gagal memperoleh HTTPS dan terkunci selama 7 hari penuh!

Pemetaan volume pada `infra/compose/docker-compose.server.yml`:
```yaml
services:
  caddy:
    image: caddy:2-alpine
    container_name: mojiji_caddy_server_${APP_ENV}
    restart: unless-stopped
    mem_limit: 64m
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ../caddy/Caddyfile:/etc/caddy/Caddyfile
      - ../../frontend-build:/srv
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
```

---

## 5. Validasi & Pengujian Sertifikat TLS

Verifikasi keberhasilan penerbitan sertifikat SSL melalui terminal:

```bash
# Uji header HTTPS domain staging
curl -I https://staging.mojiji.web.id/api/health
```

**Bukti Respons Valid:**
```text
HTTP/1.1 200 OK
Alt-Svc: h3=":443"; ma=2592000
Server: Caddy
Date: Wed, 04 Nov 2026 00:00:00 GMT
```
* Ikon gembok hijau (*Connection is secure*) aktif di peramban.
* Pengalihan otomatis HTTP (Port 80) ke HTTPS (Port 443) bekerja secara transparan.

---
*Dokumen ini disusun oleh Aji (DevOps Engineer) sebagai pemenuhan Acceptance Criteria tiket **MJ-054** (Minggu 5).*
