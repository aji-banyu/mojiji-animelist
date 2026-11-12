"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertCircle,
  RotateCcw,
  WifiOff,
} from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import SegmentedSwitch from "@/components/ui/SegmentedSwitch";
import SearchInput from "@/components/ui/SearchInput";
import { searchCatalogApi } from "@/lib/api";

const SEARCH_TYPE_OPTIONS = [
  { id: "anime", label: "Anime" },
  { id: "manga", label: "Manga" },
];

function formatCatalogViews(members) {
  if (!members || typeof members !== "number") return undefined;
  if (members >= 1000000) return `${(members / 1000000).toFixed(1)}m`;
  if (members >= 1000) return `${Math.round(members / 1000)}k`;
  return String(members);
}

function normalizeSearchResultItem(item, contentType) {
  const id = item.mal_id || item.id;
  const mediaType = item.type || contentType;
  const episodes =
    item.episodes ||
    (item.chapters ? `${item.chapters} Ch` : item.format) ||
    undefined;

  return {
    ...item,
    id,
    malId: id,
    type: mediaType,
    image: item.image || item.image_url || "",
    episodes,
    views: item.views || formatCatalogViews(item.members),
  };
}

export default function CatalogSearch({ initialType = "anime", initialQuery = "" }) {
  const [type, setType] = useState(initialType === "manga" ? "manga" : "anime");
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const prevInitialQueryRef = useRef(initialQuery);
  const prevInitialTypeRef = useRef(initialType);

  useEffect(() => {
    if (initialQuery && initialQuery !== prevInitialQueryRef.current) {
      prevInitialQueryRef.current = initialQuery;
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (initialType && initialType !== prevInitialTypeRef.current) {
      prevInitialTypeRef.current = initialType;
      setType(initialType === "manga" ? "manga" : "anime");
    }
  }, [initialType]);

  const abortControllerRef = useRef(null);

  const executeSearch = useCallback(async (searchTerm, contentType) => {
    const trimmed = searchTerm.trim();

    if (trimmed.length < 3) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      setHasSearched(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchCatalogApi(
        {
          q: trimmed,
          type: contentType,
          limit: 20,
        },
        controller.signal
      );

      if (response && response.success) {
        const list = Array.isArray(response.data) ? response.data : [];
        setResults(list.map((it) => normalizeSearchResultItem(it, contentType)));
      } else {
        setResults([]);
      }
    } catch (err) {
      if (
        err?.name === "AbortError" ||
        err?.name === "CanceledError" ||
        err?.code === "ERR_CANCELED"
      ) {
        return;
      }

      let errorMsg = "Gagal memuat katalog. Silakan coba lagi.";
      let errorType = "general";

      if (
        err?.status === 429 ||
        err?.error?.code === "RATE_LIMIT_EXCEEDED" ||
        err?.error?.code === "RATE_LIMITED"
      ) {
        errorType = "rate_limit";
        errorMsg = "Batas permintaan tercapai. Tunggu beberapa detik lalu coba lagi.";
      } else if (
        err?.isOffline ||
        err?.status === 503 ||
        err?.error?.code === "SERVER_OFFLINE" ||
        err?.code === "ERR_NETWORK"
      ) {
        errorType = "offline";
        errorMsg = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else if (err?.error?.message) {
        errorMsg = err.error.message;
      }

      setError({ message: errorMsg, type: errorType });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 3) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setResults([]);
      setIsLoading(false);
      setError(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      executeSearch(query, type);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, type, executeSearch]);

  const handleTypeChange = (newType) => {
    if (newType === type) return;
    setType(newType);
    if (query.trim().length >= 3) {
      executeSearch(query, newType);
    }
  };

  const handleClear = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setQuery("");
    setResults([]);
    setError(null);
    setIsLoading(false);
    setHasSearched(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim().length >= 3) {
        executeSearch(query, type);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Bar Kontrol Seragam: Sliding SegmentedSwitch + SearchInput */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <SegmentedSwitch
          options={SEARCH_TYPE_OPTIONS}
          value={type}
          onChange={handleTypeChange}
          size="md"
          className="w-full sm:w-48 shrink-0"
          ariaLabel="Filter Tipe Pencarian"
        />

        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onClear={handleClear}
          placeholder={
            type === "anime"
              ? "Cari anime... (contoh: Naruto, One Piece, Frieren)"
              : "Cari manga... (contoh: Berserk, Monster, Chainsaw Man)"
          }
          clearAriaLabel="Bersihkan pencarian"
          className="flex-1 min-w-0"
        />
      </div>

      {/* State Error */}
      {error && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-text shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive border border-destructive/30">
              {error.type === "offline" ? <WifiOff size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-text text-base">
                {error.type === "rate_limit"
                  ? "Batas Kuota Tercapai"
                  : error.type === "offline"
                  ? "Koneksi Terputus"
                  : "Kendala Pencarian"}
              </p>
              <p className="text-xs sm:text-sm text-text-2 leading-relaxed max-w-xl">
                {error.message || error}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => executeSearch(query, type)}
            className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-destructive-hover active:scale-95 cursor-pointer shrink-0"
          >
            <RotateCcw size={14} />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton Grid (Selaras dengan Explore) */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface animate-pulse"
            >
              <div className="aspect-[2/3] w-full bg-surface-2" />
              <div className="p-3 space-y-2 border-t border-border">
                <div className="h-3.5 w-3/4 rounded bg-surface-2" />
                <div className="h-2.5 w-1/2 rounded bg-surface-2/60" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hasil Pencarian menggunakan CatalogCard seragam */}
      {!isLoading && !error && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-text-2">
            Menampilkan{" "}
            <span className="font-bold text-text">{results.length}</span> hasil{" "}
            {type === "anime" ? "anime" : "manga"} untuk &ldquo;
            <span className="font-semibold text-text">{query.trim()}</span>&rdquo;
          </p>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {results.map((item) => (
              <CatalogCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Initial Welcome State (< 3 karakter) */}
      {!isLoading && !error && query.trim().length < 3 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-4 py-14 text-center shadow-sm">
          <h3 className="text-base font-bold text-text sm:text-lg">
            Temukan {type === "anime" ? "Anime" : "Manga"} Favoritmu!
          </h3>
          <p className="mt-1.5 max-w-md text-xs sm:text-sm text-text-2 leading-relaxed">
            Ketik minimal 3 karakter judul {type === "anime" ? "anime" : "manga"} untuk mulai mencari di katalog.
          </p>
        </div>
      )}

      {/* Tidak ada hasil */}
      {!isLoading && !error && hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-4 py-14 text-center shadow-sm">
          <h3 className="text-base font-bold text-text sm:text-lg">
            Tidak ada hasil ditemukan
          </h3>
          <p className="mt-1.5 max-w-md text-xs sm:text-sm text-text-2 leading-relaxed">
            Tidak ditemukan {type} untuk &ldquo;
            <span className="text-text font-semibold">{query.trim()}</span>&rdquo;. Coba kata kunci lain.
          </p>
        </div>
      )}
    </div>
  );
}
