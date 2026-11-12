import { create } from "zustand";

const HOME_TABS_STORAGE_KEY = "mojiji_home_tabs";
const TRACKER_FILTERS_STORAGE_KEY = "mojiji_tracker_filters";
const EXPLORE_CACHE_TTL_MS = 5 * 60 * 1000;
const EXPLORE_CACHE_MAX_ENTRIES = 24;

export function buildExploreCacheKey({
  type = "all",
  query = "",
  genres = [],
  format = "Semua",
  sortBy = "popularity",
  page = 1,
} = {}) {
  const normalizedGenres = [...(Array.isArray(genres) ? genres : [])]
    .map((g) => String(g).trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join(",");
  return `${type}::${String(query || "").trim().toLowerCase()}::${normalizedGenres}::${String(format || "Semua").toLowerCase()}::${sortBy}::${page}`;
}

const VALID_MEDIA_TYPES = new Set(["all", "anime", "manga"]);
const VALID_TRACKER_STATUSES = new Set([
  "all",
  "plan",
  "watching",
  "reading",
  "on_hold",
  "completed",
]);
const VALID_VIEW_MODES = new Set(["grid", "list"]);

const DEFAULT_HOME_TABS = {
  latest: "all",
  topRated: "all",
  trending: "all",
  popular: "all",
};

const DEFAULT_TRACKER_FILTERS = {
  activeType: "all",
  activeStatus: "all",
  viewMode: "grid",
};

function readSessionJson(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSessionJson(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Abaikan jika penyimpanan browser dibatasi (mis. mode privat)
  }
}

function sanitizeHomeTabs(raw) {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_HOME_TABS };
  return {
    latest: VALID_MEDIA_TYPES.has(raw.latest) ? raw.latest : "all",
    topRated: VALID_MEDIA_TYPES.has(raw.topRated) ? raw.topRated : "all",
    trending: VALID_MEDIA_TYPES.has(raw.trending) ? raw.trending : "all",
    popular: VALID_MEDIA_TYPES.has(raw.popular) ? raw.popular : "all",
  };
}

function sanitizeTrackerFilters(raw) {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_TRACKER_FILTERS };
  return {
    activeType: VALID_MEDIA_TYPES.has(raw.activeType) ? raw.activeType : "all",
    activeStatus: VALID_TRACKER_STATUSES.has(raw.activeStatus)
      ? raw.activeStatus
      : "all",
    viewMode: VALID_VIEW_MODES.has(raw.viewMode) ? raw.viewMode : "grid",
  };
}

/**
 * Filter Store — Menyimpan pilihan tab switch Beranda, cache katalog Beranda,
 * serta filter Tracker agar pilihan tidak ter-reset saat berpindah ke Detail lalu kembali.
 */
const useFilterStore = create((set, get) => ({
  homeTabs: { ...DEFAULT_HOME_TABS },
  hasHydratedHomeTabs: false,
  homeCatalog: null,
  homeHeroIndex: 0,

  trackerFilters: { ...DEFAULT_TRACKER_FILTERS },
  hasHydratedTrackerFilters: false,
  exploreCatalogCache: {},

  getExploreCatalogCache: (key) => {
    const entry = get().exploreCatalogCache?.[key];
    if (!entry) return null;
    if (Date.now() - entry.fetchedAt > EXPLORE_CACHE_TTL_MS) {
      return null;
    }
    return entry;
  },

  setExploreCatalogCache: (key, value) =>
    set((state) => {
      const nextCache = { ...(state.exploreCatalogCache || {}) };
      nextCache[key] = {
        items: Array.isArray(value?.items) ? value.items : [],
        pagination: value?.pagination || {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
        },
        fetchedAt: Date.now(),
      };

      const keys = Object.keys(nextCache);
      if (keys.length > EXPLORE_CACHE_MAX_ENTRIES) {
        keys.sort(
          (a, b) => (nextCache[a]?.fetchedAt || 0) - (nextCache[b]?.fetchedAt || 0)
        );
        const overflow = keys.length - EXPLORE_CACHE_MAX_ENTRIES;
        for (let i = 0; i < overflow; i++) {
          delete nextCache[keys[i]];
        }
      }

      return { exploreCatalogCache: nextCache };
    }),

  hydrateHomeTabs: () => {
    if (get().hasHydratedHomeTabs) return;
    const saved = readSessionJson(HOME_TABS_STORAGE_KEY);
    set({
      homeTabs: saved ? sanitizeHomeTabs(saved) : { ...DEFAULT_HOME_TABS },
      hasHydratedHomeTabs: true,
    });
  },

  setHomeTab: (sectionKey, nextTab) => {
    if (!(sectionKey in DEFAULT_HOME_TABS) || !VALID_MEDIA_TYPES.has(nextTab)) {
      return;
    }
    const nextTabs = {
      ...get().homeTabs,
      [sectionKey]: nextTab,
    };
    writeSessionJson(HOME_TABS_STORAGE_KEY, nextTabs);
    set({ homeTabs: nextTabs, hasHydratedHomeTabs: true });
  },

  setHomeCatalog: (catalogOrUpdater) =>
    set((state) => {
      const nextCatalog =
        typeof catalogOrUpdater === "function"
          ? catalogOrUpdater(state.homeCatalog)
          : catalogOrUpdater;
      if (!nextCatalog) {
        return { homeCatalog: null };
      }
      return {
        homeCatalog: {
          ...nextCatalog,
          fetchedAt:
            nextCatalog.isComplete === false
              ? state.homeCatalog?.fetchedAt || 0
              : Date.now(),
        },
      };
    }),

  setHomeHeroIndex: (indexOrUpdater) =>
    set((state) => ({
      homeHeroIndex:
        typeof indexOrUpdater === "function"
          ? indexOrUpdater(state.homeHeroIndex)
          : indexOrUpdater,
    })),

  hydrateTrackerFilters: () => {
    if (get().hasHydratedTrackerFilters) return;
    const saved = readSessionJson(TRACKER_FILTERS_STORAGE_KEY);
    set({
      trackerFilters: saved
        ? sanitizeTrackerFilters(saved)
        : { ...DEFAULT_TRACKER_FILTERS },
      hasHydratedTrackerFilters: true,
    });
  },

  setTrackerFilters: (patch) => {
    const nextFilters = sanitizeTrackerFilters({
      ...get().trackerFilters,
      ...patch,
    });
    writeSessionJson(TRACKER_FILTERS_STORAGE_KEY, nextFilters);
    set({
      trackerFilters: nextFilters,
      hasHydratedTrackerFilters: true,
    });
  },
}));

export default useFilterStore;

