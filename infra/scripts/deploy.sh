#!/bin/bash
# ==============================================================================
# Mojiji AnimeList - Skrip Otomatisasi Deploy & Auto-Rollback (deploy.sh)
# Tiket: MJ-073, MJ-091, MJ-101, MJ-174 | PIC: Aji (DevOps)
# ==============================================================================
set -e

TARGET_ENV="${1:-staging}"
APP_TAG="${2:-latest}"

echo "=================================================="
echo " [MOJIJI DEPLOY] Target: $TARGET_ENV | Tag: $APP_TAG"
echo "=================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$BASE_DIR"

if [ "$TARGET_ENV" != "staging" ] && [ "$TARGET_ENV" != "production" ]; then
  echo "❌ Error: Target lingkungan tidak valid. Gunakan 'staging' atau 'production'."
  exit 1
fi

COMPOSE_FILE="infra/compose/docker-compose.server.yml"
ENV_FILE=".env"
TAG_FILE=".last_good_tag"

# 1. Catat tag stabil sebelumnya untuk penanganan darurat
if [ -f "$TAG_FILE" ]; then
  PREV_TAG=$(cat "$TAG_FILE")
else
  PREV_TAG="latest"
fi
echo "Tag stabil aktif saat ini: $PREV_TAG"

# 2. Unduh image aplikasi yang sudah dibangun oleh GitHub Actions (Zero-Build VPS)
echo "Mengunduh image aplikasi terbaru..."
TAG="$APP_TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" pull api-gateway user-service catalog-service tracker-service

# 3. Jalankan backup otomatis pg_dump jika target adalah production (sebelum migrasi)
if [ "$TARGET_ENV" = "production" ]; then
  echo "Membuat backup otomatis database production..."
  BACKUP_DIR="/opt/mojiji/backups"
  mkdir -p "$BACKUP_DIR"
  BACKUP_FILE="$BACKUP_DIR/mojiji_prod_$(date +%Y%m%d_%H%M%S).sql"
  
  if [ -n "$DATABASE_URL" ]; then
    docker run --rm -e DATABASE_URL="$DATABASE_URL" postgres:16-alpine pg_dump "$DATABASE_URL" > "$BACKUP_FILE" || true
    if [ ! -s "$BACKUP_FILE" ]; then
      echo "❌ Error: Backup database gagal atau file kosong! Membatalkan deployment demi keamanan data."
      exit 1
    fi
    echo "✅ Backup berhasil disimpan di: $BACKUP_FILE"
  fi
fi

# 4. Jalankan migrasi database
echo "Menjalankan migrasi database via container migrate..."
if ! docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm migrate --migrations-dir /db/migrations up; then
  echo "❌ ERROR: Migrasi database gagal! Membatalkan pengaktifan versi baru."
  exit 1
fi

# 5. Aktifkan container aplikasi versi baru
echo "Mengaktifkan container aplikasi versi $APP_TAG..."
TAG="$APP_TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans

# 6. Muat ulang konfigurasi Caddy secara otomatis (zero-downtime)
echo "Memuat ulang konfigurasi Caddy..."
docker exec mojiji_caddy_server_${TARGET_ENV} caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || docker compose -f "$COMPOSE_FILE" restart caddy 2>/dev/null || true

# 7. Verifikasi Kesehatan Layanan (Healthcheck maks. 60 detik)
echo "Memverifikasi kesehatan layanan (/health)..."
HEALTH_OK=false
for i in $(seq 1 12); do
  if curl -s -f "http://localhost:4000/health" > /dev/null 2>&1; then
    HEALTH_OK=true
    break
  fi
  echo "Menunggu endpoint sehat... ($i/12)"
  sleep 5
done

if [ "$HEALTH_OK" = true ]; then
  echo "=================================================="
  echo "✅ [DEPLOY SUCCESS] Layanan sehat dan siap melayani!"
  echo "=================================================="
  echo "$APP_TAG" > "$TAG_FILE"
else
  echo "=================================================="
  echo "⚠️ [DEPLOY FAILED] Layanan tidak sehat! Memulai Auto-Rollback..."
  echo "=================================================="
  TAG="$PREV_TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans
  docker exec mojiji_caddy_server_${TARGET_ENV} caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true
  echo "Rollback aplikasi selesai. Versi dikembalikan ke tag stabil: $PREV_TAG."
  echo "Catatan: Skema database tidak di-rollback otomatis untuk melindungi data pengguna."
  exit 1
fi

# 8. Laporan metrik sistem
echo ""
echo "=== Statistik Resource Container ==="
docker stats --no-stream
echo ""
echo "=== Kapasitas Memori Server ==="
free -m

