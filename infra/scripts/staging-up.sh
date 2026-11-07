#!/bin/bash
# ==============================================================================
# Mojiji AnimeList - Skrip Menyalakan Lingkungan Staging (staging-up.sh)
# Tiket: MJ-091 | PIC: Aji (DevOps)
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

echo "Menjalankan seluruh container staging..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans

# Muat ulang konfigurasi Caddy secara otomatis (Auto-Detect)
echo "Memuat ulang konfigurasi Caddy (Auto-Detect)..."
CADDY_CONTAINER=$(docker ps --filter "name=caddy" --format "{{.Names}}" | head -n 1)
if [ -n "$CADDY_CONTAINER" ]; then
  docker exec "$CADDY_CONTAINER" caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || docker restart "$CADDY_CONTAINER"
fi

echo ""
echo "=================================================="
echo " Status Container Staging Terkini:"
echo "=================================================="
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps

echo ""
echo "Pemeriksaan Memori Host:"
free -m
echo ""
echo "✅ Lingkungan Staging siap diakses di: https://staging.mojiji.web.id"

