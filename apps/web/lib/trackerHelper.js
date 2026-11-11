/**
 * trackerHelper.js
 * Utilitas untuk resolusi total episode/chapter dan kalkulasi persentase progres
 * pada Anime & Manga Tracker (Tiket MJ-095).
 */

import { FALLBACK_HOME_DATA } from "./homeData.js";

// Cache indeks katalog agar lookup judul/ID berjalan cepat O(1)
let catalogMap = null;

function getCatalogMap() {
  if (catalogMap) return catalogMap;

  catalogMap = {
    byId: new Map(),
    byTitle: new Map(),
  };

  try {
    for (const mediaType of Object.keys(FALLBACK_HOME_DATA || {})) {
      const sections = FALLBACK_HOME_DATA[mediaType] || {};
      for (const sectionKey of Object.keys(sections)) {
        const list = sections[sectionKey];
        if (Array.isArray(list)) {
          for (const entry of list) {
            const rawCount = String(entry.metaCount || "");
            const parsed = parseInt(rawCount.replace(/\D+/g, ""), 10) || 0;
            if (parsed > 0) {
              const numId = Number(entry.id || entry.malId);
              if (numId) {
                catalogMap.byId.set(`${mediaType}_${numId}`, parsed);
                catalogMap.byId.set(String(numId), parsed);
              }
              if (entry.title) {
                const normTitle = entry.title.trim().toLowerCase();
                catalogMap.byTitle.set(`${mediaType}_${normTitle}`, parsed);
                catalogMap.byTitle.set(normTitle, parsed);
              }
            }
          }
        }
      }
    }
  } catch {
    // Fail-safe jika parsing FALLBACK_HOME_DATA mengalami masalah
  }

  return catalogMap;
}

/**
 * Resolusi total episode atau chapter sebuah item tracker.
 *
 * Prioritas:
 * 1. Number(item.total) jika bernilai > 0
 * 2. Properti eksplisit lain pada item (totalChapters, totalEpisodes, chapters, episodes, dsb)
 * 3. Lookup ke dataset katalog resmi (FALLBACK_HOME_DATA) berdasarkan malId / id / title
 * 4. 0 jika belum diketahui (TBA / Ongoing tanpa data)
 */
export function resolveTrackerTotal(item) {
  if (!item) return 0;

  // 1. Cek langsung properti total
  const directTotal = Number(item.total);
  if (Number.isFinite(directTotal) && directTotal > 0) {
    return directTotal;
  }

  // 2. Cek properti alternatif yang mungkin dikirim oleh API atau Catalog
  const altCandidates = [
    item.totalChapters,
    item.totalEpisodes,
    item.chapters,
    item.episodes,
    item.information?.chapters,
    item.information?.episodes,
  ];
  for (const cand of altCandidates) {
    const val = Number(cand);
    if (Number.isFinite(val) && val > 0) {
      return val;
    }
  }

  // 3. Lookup ke data katalog resmi (FALLBACK_HOME_DATA)
  const map = getCatalogMap();
  const mediaType = (item.mediaType || item.media_type || "").toLowerCase();
  const rawId = item.malId || item.mal_id || item.id;
  const numId = Number(rawId);

  if (numId) {
    if (mediaType && map.byId.has(`${mediaType}_${numId}`)) {
      return map.byId.get(`${mediaType}_${numId}`);
    }
    if (map.byId.has(String(numId))) {
      return map.byId.get(String(numId));
    }
  }

  if (item.title) {
    const normTitle = item.title.trim().toLowerCase();
    if (mediaType && map.byTitle.has(`${mediaType}_${normTitle}`)) {
      return map.byTitle.get(`${mediaType}_${normTitle}`);
    }
    if (map.byTitle.has(normTitle)) {
      return map.byTitle.get(normTitle);
    }
  }

  return 0;
}

/**
 * Menghitung persentase progres (0 - 100) secara cerdas & responsif:
 * - Jika status adalah "completed" atau "finished" -> 100%
 * - Jika total > 0 -> (progress / total) * 100 (dibatasi 0 - 100)
 * - Jika total <= 0 (TBA) namun progress > 0 -> hitung berbasis milestone dinamis (kelipatan 50, min 100)
 *   sehingga setiap klik +1, +5, +10 progress bar dan angka persentase tetap berjalan secara mulus.
 */
export function calculateProgressPercent(progress, total, status) {
  const numProg = Math.max(0, Number(progress) || 0);
  const numTotal = Math.max(0, Number(total) || 0);

  // Jika progres 0, persentase selalu 0%
  if (numProg <= 0) {
    return 0;
  }

  const normStatus = String(status || "").toLowerCase();
  if (normStatus === "completed" || normStatus === "finished") {
    return 100;
  }

  if (numTotal > 0) {
    return Math.min(100, Math.round((numProg / numTotal) * 100));
  }

  // Milestone dinamis untuk judul ongoing dengan total TBA
  const milestone = Math.max(100, Math.ceil(numProg / 50) * 50);
  return Math.min(100, Math.round((numProg / milestone) * 100));
}

/**
 * Palet warna semantik status tracker yang dipakai konsisten pada card & modal kelola.
 */
export const TRACKER_STATUS_THEMES = {
  plan: {
    badgeColor:
      "bg-st-plan-badge text-white border-transparent hover:bg-st-plan-badge-hover",
    optionActive:
      "bg-st-plan-soft text-st-plan-soft-text hover:bg-st-plan-soft-hover",
    inactiveText:
      "text-st-plan-muted hover:text-st-plan-muted-hover",
  },
  on_hold: {
    badgeColor:
      "bg-st-hold-badge text-white border-transparent hover:bg-st-hold-badge-hover",
    optionActive:
      "bg-st-hold-soft text-st-hold-soft-text hover:bg-st-hold-soft-hover",
    inactiveText:
      "text-st-hold-muted hover:text-st-hold-muted-hover",
  },
  watching: {
    badgeColor:
      "bg-st-watching-badge text-white border-transparent hover:bg-st-watching-badge-hover",
    optionActive:
      "bg-st-watching-soft text-st-watching-soft-text hover:bg-st-watching-soft-hover",
    inactiveText:
      "text-st-watching-muted hover:text-st-watching-muted-hover",
  },
  completed: {
    badgeColor:
      "bg-st-done-badge text-white border-transparent hover:bg-st-done-badge-hover",
    optionActive:
      "bg-st-done-soft text-st-done-soft-text hover:bg-st-done-soft-hover",
    inactiveText:
      "text-st-done-muted hover:text-st-done-muted-hover",
  },
};

export function getTrackerStatusTheme(status) {
  const norm = String(status || "").toLowerCase();
  if (norm === "watching" || norm === "reading") return TRACKER_STATUS_THEMES.watching;
  if (norm === "completed" || norm === "finished") return TRACKER_STATUS_THEMES.completed;
  if (norm === "on_hold" || norm === "paused") return TRACKER_STATUS_THEMES.on_hold;
  return TRACKER_STATUS_THEMES.plan;
}
