/**
 * Adapter untuk menormalisasi data dari Tenrai API ke format standar MOJIJI AnimeList
 * Sesuai kontrak docs/api/api-contract-mvp.md Bagian 3
 */

function extractNames(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  return arr
    .map((item) => (typeof item === "object" && item !== null ? item.name : item))
    .filter(Boolean);
}

function parseThemeEntry(rawStr) {
  if (typeof rawStr !== "string" || !rawStr.trim()) return null;
  const cleaned = rawStr
    .replace(/^\d+:\s*/, "")
    .replace(/\s*\(eps?[^)]*\)\s*$/i, "")
    .trim();
  const byMatch = cleaned.match(/^"([^"]+)"\s+by\s+(.+)$/i);
  if (byMatch) {
    return { title: byMatch[1].trim(), artist: byMatch[2].trim() };
  }
  const simpleBy = cleaned.match(/^(.+?)\s+by\s+(.+)$/i);
  if (simpleBy) {
    return {
      title: simpleBy[1].replace(/^["']|["']$/g, "").trim(),
      artist: simpleBy[2].trim(),
    };
  }
  return { title: cleaned, artist: "-" };
}

function normalizeCharactersList(rawCharacters, isAnime) {
  if (!Array.isArray(rawCharacters)) return [];
  return [...rawCharacters]
    .sort((a, b) => {
      const aMain = String(a?.role || "").toLowerCase() === "main" ? 1 : 0;
      const bMain = String(b?.role || "").toLowerCase() === "main" ? 1 : 0;
      if (aMain !== bMain) return bMain - aMain;
      return (Number(b?.favorites) || 0) - (Number(a?.favorites) || 0);
    })
    .slice(0, 24)
    .map((entry) => {
      const charInfo = entry?.character || {};
      const vas = Array.isArray(entry?.voice_actors) ? entry.voice_actors : [];
      const preferredVa =
        vas.find((va) => String(va?.language || "").toLowerCase() === "japanese") ||
        vas[0] ||
        null;

      return {
        malId: charInfo.mal_id || null,
        name: charInfo.name || "Unknown",
        role: entry?.role || "Supporting",
        image:
          charInfo.images?.jpg?.image_url ||
          charInfo.images?.webp?.image_url ||
          "",
        voiceActor:
          isAnime && preferredVa?.person
            ? {
                malId: preferredVa.person.mal_id || null,
                name: preferredVa.person.name || "Unknown",
                language: preferredVa.language || "Japanese",
                image: preferredVa.person.images?.jpg?.image_url || "",
              }
            : null,
      };
    });
}

function normalizeStaffList(rawStaff) {
  if (!Array.isArray(rawStaff)) return [];
  return rawStaff.slice(0, 20).map((entry) => ({
    malId: entry?.person?.mal_id || null,
    name: entry?.person?.name || "Unknown",
    role: Array.isArray(entry?.positions)
      ? entry.positions.join(", ")
      : entry?.positions || "-",
    image: entry?.person?.images?.jpg?.image_url || "",
  }));
}

function normalizeItem(rawItem, type, extras = {}) {
  if (!rawItem) return null;

  const isAnime = type === "anime";
  const normalized = {
    id: rawItem.mal_id,
    malId: rawItem.mal_id,
    type: type,
    format: rawItem.type || null,
    title: rawItem.title || rawItem.title_english || "Untitled",
    titleEnglish: rawItem.title_english || null,
    titleJapanese: rawItem.title_japanese || null,
    titleSynonyms: Array.isArray(rawItem.title_synonyms) ? rawItem.title_synonyms : [],
    image:
      rawItem.images?.jpg?.large_image_url ||
      rawItem.images?.jpg?.image_url ||
      rawItem.images?.webp?.large_image_url ||
      rawItem.images?.webp?.image_url ||
      null,
    score: typeof rawItem.score === "number" ? rawItem.score : null,
    scoredBy: typeof rawItem.scored_by === "number" ? rawItem.scored_by : null,
    rank: typeof rawItem.rank === "number" ? rawItem.rank : null,
    popularity: typeof rawItem.popularity === "number" ? rawItem.popularity : null,
    members: typeof rawItem.members === "number" ? rawItem.members : null,
    favorites: typeof rawItem.favorites === "number" ? rawItem.favorites : null,
    synopsis: rawItem.synopsis || null,
    status: rawItem.status || null,
    source: rawItem.source || null,
    genres: extractNames(rawItem.genres),
    themes: extractNames(rawItem.themes),
    demographics: extractNames(rawItem.demographics),
  };

  if (isAnime) {
    normalized.totalEpisodes = typeof rawItem.episodes === "number" ? rawItem.episodes : null;
    normalized.episodes = normalized.totalEpisodes;
    normalized.aired = rawItem.aired?.string || null;
    normalized.season = rawItem.season || null;
    normalized.year = typeof rawItem.year === "number" ? rawItem.year : null;
    normalized.broadcast = rawItem.broadcast?.string || null;
    normalized.producers = extractNames(rawItem.producers);
    normalized.licensors = extractNames(rawItem.licensors);
    normalized.studios = extractNames(rawItem.studios);
    normalized.duration = rawItem.duration || null;
    normalized.rating = rawItem.rating || null;
    normalized.openings = Array.isArray(rawItem.theme?.openings)
      ? rawItem.theme.openings.map(parseThemeEntry).filter(Boolean)
      : [];
    normalized.endings = Array.isArray(rawItem.theme?.endings)
      ? rawItem.theme.endings.map(parseThemeEntry).filter(Boolean)
      : [];
    if (rawItem.trailer) {
      normalized.trailer = {
        youtubeId: rawItem.trailer.youtube_id || null,
        url: rawItem.trailer.url || null,
        embedUrl: rawItem.trailer.embed_url || null,
        images: rawItem.trailer.images || null,
      };
    }
  } else if (type === "manga") {
    normalized.totalChapters = typeof rawItem.chapters === "number" ? rawItem.chapters : null;
    normalized.chapters = normalized.totalChapters;
    normalized.volumes = typeof rawItem.volumes === "number" ? rawItem.volumes : null;
    normalized.published = rawItem.published?.string || null;
    normalized.authors = extractNames(rawItem.authors);
    normalized.serializations = extractNames(rawItem.serializations);
  }

  if (Array.isArray(extras.characters)) {
    normalized.characters = normalizeCharactersList(extras.characters, isAnime);
  }
  if (Array.isArray(extras.staff)) {
    normalized.staff = normalizeStaffList(extras.staff);
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

