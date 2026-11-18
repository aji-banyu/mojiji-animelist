#!/bin/bash
# ==============================================================================
# Mojiji AnimeList - Skrip Mematikan Service Staging (staging-down.sh)
# Tiket: MJ-091, MJ-127 | PIC: Aji (DevOps)
# ==============================================================================
set -e

echo "=================================================="
echo " [MOJIJI] Menghentikan Service Backend Staging"
echo "=================================================="

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

# Menghentikan seluruh microservices backend untuk membebaskan alokasi RAM
# Reverse proxy Caddy tetap dibiarkan menyala agar tidak memutuskan koneksi domain
echo "Mendeteksi seluruh microservices backend di $COMPOSE_FILE..."
SERVICES_TO_STOP=$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" config --services 2>/dev/null | grep -v -E '^(caddy|migrate)$' || true)

# Fallback aman jika parsing otomatis kosong
if [ -z "$SERVICES_TO_STOP" ]; then
  SERVICES_TO_STOP="api-gateway user-service catalog-service tracker-service interaction-service"
fi

echo "Menghentikan backend microservices: $SERVICES_TO_STOP"
# Gunakan timeout stop 2 detik (-t 2) agar Node.js tidak menggantung grace period 10 detik
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" stop -t 2 $SERVICES_TO_STOP || {
  echo "⚠️ Peringatan: Stop standar mengalami kendala, mematikan kontainer secara paksa..."
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" kill $SERVICES_TO_STOP 2>/dev/null || true
}

echo ""
echo "=================================================="
echo " Status Container Setelah Penghentian:"
echo "=================================================="
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps

echo ""
echo "Pemeriksaan Memori Bebas Host (RAM Dihemat):"
free -m
echo ""
echo "🛑 Seluruh service backend staging berhasil dimatikan (Caddy tetap aktif)."
