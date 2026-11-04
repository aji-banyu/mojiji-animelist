/**
 * Adapter untuk menormalisasi data dari Tenrai API ke format standar MOJIJI AnimeList
 * Sesuai kontrak docs/api/api-contract-mvp.md Bagian 3
 */

function normalizeItem(rawItem, type) {
  if (!rawItem) return null;

  const normalized = {
    id: rawItem.mal_id,
    malId: rawItem.mal_id,
    type: type,
    title: rawItem.title || rawItem.title_english || "Untitled",
    image:
      rawItem.images?.jpg?.large_image_url ||
      rawItem.images?.jpg?.image_url ||
      rawItem.images?.webp?.large_image_url ||
      rawItem.images?.webp?.image_url ||
      null,
    score: typeof rawItem.score === "number" ? rawItem.score : null,
    synopsis: rawItem.synopsis || null,
    status: rawItem.status || null,
  };

  if (type === "anime") {
    normalized.totalEpisodes = typeof rawItem.episodes === "number" ? rawItem.episodes : null;
  } else if (type === "manga") {
    normalized.totalChapters = typeof rawItem.chapters === "number" ? rawItem.chapters : null;
  }

  return normalized;
}

function normalizeList(rawList, type) {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((item) => normalizeItem(item, type)).filter(Boolean);
}

module.exports = {
  normalizeItem,
  normalizeList,
};

