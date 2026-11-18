#!/bin/bash
# ==============================================================================
# Mojiji AnimeList - Skrip Menyalakan Lingkungan Staging (staging-up.sh)
# Tiket: MJ-091, MJ-127 | PIC: Aji (DevOps)
# ==============================================================================
set -e

echo "=================================================="
echo " [MOJIJI] Menyalakan Lingkungan Staging"
echo "=================================================="

# Navigasi ke root repositori/direktori proyek staging
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$BASE_DIR"

COMPOSE_FILE="infra/compose/docker-compose.server.yml"
ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Berkas $ENV_FILE tidak ditemukan di $BASE_DIR!"
  exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Error: Berkas $COMPOSE_FILE tidak ditemukan di $BASE_DIR!"
  exit 1
fi

# Ambil seluruh service KECUALI container migrate agar tidak muncul status Exited (2)
SERVICES_TO_START=$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" config --services 2>/dev/null | grep -v -E '^migrate$' || true)

if [ -n "$SERVICES_TO_START" ]; then
  echo "Menjalankan container staging: $SERVICES_TO_START..."
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans $SERVICES_TO_START
else
  echo "Menjalankan seluruh container staging..."
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans
fi

# Muat ulang konfigurasi Caddy secara otomatis (Target spesifik staging + Fallback auto-detect)
echo "Memuat ulang konfigurasi Caddy..."
CADDY_CONTAINER="mojiji_caddy_server_staging"
if ! docker ps --format "{{.Names}}" | grep -q "^${CADDY_CONTAINER}$"; then
  CADDY_CONTAINER=$(docker ps --filter "name=caddy" --format "{{.Names}}" | head -n 1)
fi

if [ -n "$CADDY_CONTAINER" ]; then
  echo "Reloading Caddy container ($CADDY_CONTAINER)..."
  docker exec "$CADDY_CONTAINER" caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || docker restart "$CADDY_CONTAINER" 2>/dev/null || true
fi

# Verifikasi Kesehatan Layanan (Healthcheck API Gateway maks. 12 detik)
echo "Memverifikasi kesehatan layanan staging..."
HEALTH_OK=false
for i in $(seq 1 6); do
  if curl -s -f "http://localhost:4000/health" > /dev/null 2>&1; then
    HEALTH_OK=true
    break
  fi
  echo "Menunggu API Gateway sehat... ($i/6)"
  sleep 2
done

echo ""
echo "=================================================="
echo " Status Container Staging Terkini:"
echo "=================================================="
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps

echo ""
echo "Pemeriksaan Memori Host:"
free -m
echo ""

if [ "$HEALTH_OK" = true ]; then
  echo "✅ Lingkungan Staging sehat & siap diakses di: https://staging.mojiji.web.id"
else
  echo "⚠️ Catatan: Container berhasil dinyalakan, endpoint healthcheck masih dalam proses inisialisasi."
fi
