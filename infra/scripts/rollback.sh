#!/bin/bash
# ==============================================================================
# Mojiji AnimeList - Skrip Rollback Aplikasi Cepat (rollback.sh)
# Tiket: MJ-091 | PIC: Aji (DevOps)
# ==============================================================================
set -e

echo "=================================================="
echo " [MOJIJI] Prosedur Rollback Aplikasi Darurat"
echo "=================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$BASE_DIR"

COMPOSE_FILE="infra/compose/docker-compose.server.yml"
ENV_FILE=".env"
TAG_FILE=".last_good_tag"

if [ ! -f "$TAG_FILE" ]; then
  echo "⚠️ Warning: Berkas $TAG_FILE tidak ditemukan. Menggunakan tag default 'latest'."
  ROLLBACK_TAG="latest"
else
  ROLLBACK_TAG=$(cat "$TAG_FILE")
fi

echo "Memulihkan container microservices ke tag stabil: $ROLLBACK_TAG..."
TAG="$ROLLBACK_TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans

# Muat ulang konfigurasi Caddy
echo "Memuat ulang konfigurasi Caddy..."
docker exec mojiji_caddy_server_staging caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true

echo ""
echo "=================================================="
echo " Status Container Pasca-Rollback:"
echo "=================================================="
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps

echo ""
echo "Pemeriksaan Kesehatan Service (/api/health)..."
if curl -s -f "http://localhost:4000/health" > /dev/null 2>&1; then
  echo "✅ Rollback Berhasil! Layanan sehat dan kembali ke versi: $ROLLBACK_TAG"
else
  echo "⚠️ Layanan belum merespons /health, mohon periksa log: docker compose logs --tail 50 gateway"
fi

echo "ℹ️ Catatan: Rollback ini hanya memulihkan kontainer aplikasi dan tidak menurunkan skema database."

