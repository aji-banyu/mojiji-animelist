#!/bin/bash
# ==============================================================================
# Mojiji AnimeList - Skrip Mematikan Service Staging (staging-down.sh)
# Tiket: MJ-091 | PIC: Aji (DevOps)
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

# Menghentikan microservices backend untuk membebaskan alokasi RAM
# Reverse proxy Caddy tetap dibiarkan menyala agar tidak memutuskan koneksi domain
echo "Menghentikan 4 microservices backend (API Gateway, User, Catalog, Tracker)..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" stop api-gateway user-service catalog-service tracker-service

echo ""
echo "=================================================="
echo " Status Container Setelah Penghentian:"
echo "=================================================="
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps

echo ""
echo "Pemeriksaan Memori Bebas Host (RAM Dihemat):"
free -m
echo ""
echo "🛑 Service backend staging berhasil dimatikan."

