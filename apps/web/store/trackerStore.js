import { create } from "zustand";
import {
  addTrackerApi,
  deleteTrackerApi,
  getTrackerItemApi,
  getTrackerListApi,
  updateTrackerStatusApi,
} from "@/lib/api";

const CACHE_TTL_MS = 2 * 60 * 1000;
let inflightListPromise = null;

export function normalizeTrackerMediaType(type) {
  return String(type || "anime").toLowerCase() === "manga" ? "manga" : "anime";
}

export function getTrackerCompositeKey(type, malId) {
  return `${normalizeTrackerMediaType(type)}:${String(malId)}`;
}

function getItemMediaType(item) {
  return normalizeTrackerMediaType(item?.mediaType || item?.media_type);
}

function getItemMalId(item) {
  return String(item?.malId ?? item?.mal_id ?? "");
}

function formatTrackerFetchError(err) {
  if (
    err?.isOffline ||
    err?.status === 503 ||
    err?.error?.code === "SERVER_OFFLINE" ||
    err?.code === "ERR_NETWORK"
  ) {
    return "Gagal memuat tracker. Periksa koneksi internet Anda.";
  }
  return err?.error?.message || "Gagal memuat daftar tracker. Silakan coba lagi.";
}

function upsertItemInList(items, nextItem) {
  if (!nextItem) return items;
  const targetKey = getTrackerCompositeKey(getItemMediaType(nextItem), getItemMalId(nextItem));
  const idx = items.findIndex(
    (it) =>
      (it.id != null && nextItem.id != null && String(it.id) === String(nextItem.id)) ||
      getTrackerCompositeKey(getItemMediaType(it), getItemMalId(it)) === targetKey
  );

  if (idx >= 0) {
    const copy = [...items];
    copy[idx] = { ...copy[idx], ...nextItem };
    return copy;
  }
  return [nextItem, ...items];
}

const useTrackerStore = create((set, get) => ({
  items: [],
  hasFetched: false,
  lastFetchedAt: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,

  findItem: (type, malId) => {
    const key = getTrackerCompositeKey(type, malId);
    return (
      get().items.find(
        (it) => getTrackerCompositeKey(getItemMediaType(it), getItemMalId(it)) === key
      ) || null
    );
  },

  fetchTrackerList: async ({ force = false } = {}) => {
    const state = get();
    const isFresh =
      state.hasFetched && Date.now() - state.lastFetchedAt < CACHE_TTL_MS;

    if (!force && isFresh) {
      return state.items;
    }

    if (inflightListPromise) {
      return inflightListPromise;
    }

    set({
      isLoading: !state.hasFetched,
      isRefreshing: state.hasFetched,
      error: null,
    });

    inflightListPromise = (async () => {
      try {
        const response = await getTrackerListApi();
        const nextItems =
          response && response.success && Array.isArray(response.data)
            ? response.data
            : [];

        set({
          items: nextItems,
          hasFetched: true,
          lastFetchedAt: Date.now(),
          isLoading: false,
          isRefreshing: false,
          error: null,
        });
        return nextItems;
      } catch (err) {
        const current = get();
        set({
          isLoading: false,
          isRefreshing: false,
          error: current.hasFetched ? null : formatTrackerFetchError(err),
        });
        throw err;
      } finally {
        inflightListPromise = null;
      }
    })();

    return inflightListPromise;
  },

  checkTrackerItem: async (type, malId) => {
    const cached = get().findItem(type, malId);
    if (cached && get().hasFetched) {
      return cached;
    }

    try {
      const response = await getTrackerItemApi(type, malId);
      if (response?.success && response?.data) {
        const normalized = response.data;
        set((state) => ({
          items: upsertItemInList(state.items, normalized),
        }));
        return normalized;
      }
    } catch {
      // Abaikan jika 404 (belum ada di tracker) atau error jaringan
    }
    return cached;
  },

  addTrackerItem: async ({
    type = "anime",
    malId,
    status = "plan",
    progress = 0,
    metadata = null,
  }) => {
    const normalizedType = normalizeTrackerMediaType(type);
    try {
      const response = await addTrackerApi({
        type: normalizedType,
        malId,
        status,
        progress,
      });

      const createdRaw =
        response?.data && typeof response.data === "object"
          ? response.data
          : {
              id: `trk_${normalizedType}_${malId}`,
              mediaType: normalizedType,
              media_type: normalizedType,
              malId: Number(malId) || malId,
              mal_id: Number(malId) || malId,
              status,
              progress,
            };

      const hydrated = {
        ...metadata,
        ...createdRaw,
        mediaType: createdRaw.mediaType || createdRaw.media_type || normalizedType,
        media_type: createdRaw.media_type || createdRaw.mediaType || normalizedType,
        malId: createdRaw.malId ?? createdRaw.mal_id ?? Number(malId) ?? malId,
        mal_id: createdRaw.mal_id ?? createdRaw.malId ?? Number(malId) ?? malId,
      };

      set((state) => ({
        items: upsertItemInList(state.items, hydrated),
        hasFetched: true,
        lastFetchedAt: Date.now(),
      }));

      return { ok: true, alreadyExists: false, item: hydrated };
    } catch (err) {
      if (err?.status === 409 || err?.error?.code === "CONFLICT") {
        await get().fetchTrackerList({ force: true }).catch(() => {});
        const existing = get().findItem(normalizedType, malId);
        return { ok: true, alreadyExists: true, item: existing };
      }
      throw err;
    }
  },

  updateTrackerItem: async (id, newStatus, newProgress, nextTotal = null) => {
    const prevItems = get().items;
    const prevItem = prevItems.find((it) => it.id === id);
    const nextProgNum = Number(newProgress) || 0;

    set((state) => ({
      items: state.items.map((it) =>
        it.id === id
          ? {
              ...it,
              status: newStatus,
              progress: nextProgNum,
              total: nextTotal || it.total,
            }
          : it
      ),
    }));

    try {
      const response = await updateTrackerStatusApi(id, newStatus, nextProgNum);
      if (response?.data && typeof response.data === "object") {
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id ? { ...it, ...response.data } : it
          ),
        }));
      }
      return response;
    } catch (err) {
      if (prevItem) {
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? prevItem : it)),
        }));
      }
      throw err;
    }
  },

  deleteTrackerItem: async (id) => {
    await deleteTrackerApi(id);
    set((state) => ({
      items: state.items.filter((it) => it.id !== id),
    }));
  },

  reset: () => {
    inflightListPromise = null;
    set({
      items: [],
      hasFetched: false,
      lastFetchedAt: 0,
      isLoading: false,
      isRefreshing: false,
      error: null,
    });
  },
}));

export default useTrackerStore;

