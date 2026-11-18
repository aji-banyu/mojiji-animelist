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

# Buat dummy directory services agar Docker tidak komplain validasi build path
mkdir -p services/api-gateway services/user-service services/catalog-service services/tracker-service 2>/dev/null || true

# Hentikan seluruh kontainer backend staging secara langsung via Docker Engine
# Cara ini kebal dari masalah validasi compose file, cepat, dan Caddy tetap hidup
echo "Mendeteksi kontainer backend staging yang sedang aktif..."
CONTAINERS_TO_STOP=$(docker ps --filter "name=_staging" --format "{{.Names}}" | grep -v "caddy" || true)

if [ -n "$CONTAINERS_TO_STOP" ]; then
  echo "Menghentikan kontainer: $CONTAINERS_TO_STOP"
  docker stop -t 2 $CONTAINERS_TO_STOP 2>/dev/null || docker kill $CONTAINERS_TO_STOP 2>/dev/null || true
else
  echo "Seluruh kontainer backend staging sudah dalam kondisi mati."
fi

echo ""
echo "=================================================="
echo " Status Container Staging Terkini:"
echo "=================================================="
docker ps --filter "name=_staging" || true

echo ""
echo "Pemeriksaan Memori Bebas Host (RAM Dihemat):"
free -m || true
echo ""
echo "🛑 Seluruh service backend staging berhasil dimatikan (Caddy tetap aktif)."
