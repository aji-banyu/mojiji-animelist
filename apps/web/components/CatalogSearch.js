"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Star,
  Film,
  BookOpen,
  AlertCircle,
  Loader2,
  RotateCcw,
  WifiOff,
} from "lucide-react";
import { searchCatalogApi } from "@/lib/api";

export default function CatalogSearch({ initialType = "anime", initialQuery = "" }) {
  const [type, setType] = useState(initialType); // "anime" | "manga"
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Ref untuk melacak nilai initialQuery agar TIDAK me-reset input saat pengguna sedang mengetik
  const prevInitialQueryRef = useRef(initialQuery);

  // Hanya update query ketika initialQuery dari luar (URL parameter) benar-benar berubah
  useEffect(() => {
    if (initialQuery && initialQuery !== prevInitialQueryRef.current) {
      prevInitialQueryRef.current = initialQuery;
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Ref untuk AbortController (Membatalkan permintaan lama jika pengguna mengetik lagi)
  const abortControllerRef = useRef(null);

  // Fungsi eksekusi pencarian ke Catalog Service
  const executeSearch = useCallback(
    async (searchTerm, contentType) => {
      const trimmed = searchTerm.trim();

      // Syarat minimal 3 huruf sebelum memanggil API
      if (trimmed.length < 3) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        setHasSearched(false);
        return;
      }

      // Batalkan permintaan sebelumnya yang masih berjalan (in-flight)
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
          setResults(Array.isArray(response.data) ? response.data : []);
        } else {
          setResults([]);
        }
      } catch (err) {
        // Abaikan error akibat pembatalan request (AbortError / CanceledError)
        if (
          err?.name === "AbortError" ||
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED"
        ) {
          return;
        }

        // Tangani pesan error ramah pengguna (MJ-094)
        let errorMsg = "Gagal memuat katalog. Silakan coba lagi.";
        let errorType = "general"; // "rate_limit" | "offline" | "general"

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
    },
    []
  );

  // Debounce 400 ms sebelum memanggil API pencarian
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

  // Handler saat tab tipe (Anime/Manga) diganti
  const handleTypeChange = (newType) => {
    if (newType === type) return;
    setType(newType);
    if (query.trim().length >= 3) {
      executeSearch(query, newType);
    }
  };

  // Handler pembersihan input pencarian (Tombol X)
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

  // Handler saat tombol Enter ditekan
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
      {/* === 1. Baris Kontrol: Tab Tipe (Anime / Manga) & Kotak Input Pencarian === */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#12141A]/90 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
        {/* Toggle Pill: Anime vs Manga */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
          <button
            type="button"
            onClick={() => handleTypeChange("anime")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              type === "anime"
                ? "bg-[#DC2626] text-white shadow-md shadow-red-950/50"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Film size={15} />
            <span>Anime</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("manga")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              type === "manga"
                ? "bg-[#DC2626] text-white shadow-md shadow-red-950/50"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <BookOpen size={15} />
            <span>Manga</span>
          </button>
        </div>

        {/* Input Bar Pencarian */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              type === "anime"
                ? "Cari Anime Disini"
                : "Cari Manga Disini"
            }
            className="w-full rounded-xl border border-white/15 bg-black/50 py-2.5 pl-10 pr-10 text-sm font-medium text-white placeholder-neutral-500 outline-none transition-all focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20"
          />

          {/* Tombol Clear / Indikator Loading */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isLoading && (
              <Loader2 size={16} className="animate-spin text-neutral-400" />
            )}
            {query.length > 0 && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-neutral-400 transition-colors hover:text-white cursor-pointer"
                aria-label="Bersihkan pencarian"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* === 2. State: Pesan Error Ramah (MJ-094) === */}
      {error && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-red-500/30 bg-red-950/30 p-5 text-sm text-red-200 shadow-xl backdrop-blur-sm">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              {error.type === "offline" ? (
                <WifiOff size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-white text-base">
                {error.type === "rate_limit"
                  ? "Batas Kuota Tercapai"
                  : error.type === "offline"
                  ? "Koneksi Terputus"
                  : "Kendala Pencarian"}
              </p>
              <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed max-w-xl">
                {error.message || error}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => executeSearch(query, type)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#b91c1c] active:scale-95 cursor-pointer shrink-0"
          >
            <RotateCcw size={14} />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* === 3. State: Loading Skeleton Grid === */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#181A20] animate-pulse"
            >
              <div className="aspect-[3/4] w-full bg-neutral-800/60" />
              <div className="space-y-2 p-3">
                <div className="h-4 w-3/4 rounded bg-neutral-800/80" />
                <div className="h-3 w-1/2 rounded bg-neutral-800/60" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === 4. State: Hasil Ditemukan (Grid Kartu Anime/Manga) === */}
      {!isLoading && !error && results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>
              Menampilkan {results.length} hasil untuk &quot;
              <strong className="text-white">{query.trim()}</strong>&quot; ({type}):
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((item) => {
              const itemId = item.malId || item.mal_id || item.id;
              const poster = item.image || item.image_url;
              const episodeOrChapter =
                type === "anime"
                  ? item.totalEpisodes
                    ? `${item.totalEpisodes} Eps`
                    : "TBA"
                  : item.totalChapters
                  ? `${item.totalChapters} Ch`
                  : "TBA";

              return (
                <Link
                  key={`${type}-${itemId}`}
                  href={`/detail?type=${type}&id=${itemId}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#181A20] shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#DC2626]/60 hover:shadow-xl hover:shadow-red-950/30"
                >
                  {/* Poster Gambar */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                    {poster ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={poster}
                        alt={item.title || "Poster"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-600">
                        {type === "anime" ? <Film size={32} /> : <BookOpen size={32} />}
                      </div>
                    )}

                    {/* Badge Rating & Total Episode/Chapter */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star size={12} className="fill-amber-400" />
                          {typeof item.score === "number" ? item.score.toFixed(1) : "-"}
                        </span>
                        <span className="rounded bg-black/60 px-1.5 py-0.5 text-neutral-300 backdrop-blur-sm">
                          {episodeOrChapter}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Judul */}
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <h3
                      className="line-clamp-2 text-sm font-semibold text-neutral-200 transition-colors group-hover:text-[#DC2626]"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-neutral-400">
                      {item.status || type}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* === 5. State: Initial Welcome State (Saat Belum Mengetik / < 3 karakter) === */}
      {!isLoading && !error && query.trim().length < 3 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#12141A]/70 px-6 py-14 text-center shadow-xl">
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Temukan {type === "anime" ? "Anime" : "Manga"} Favoritmu!
          </h3>
        </div>
      )}

      {/* === 6. State: 'Tidak ada hasil' === */}
      {!isLoading && !error && hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#12141A]/70 px-6 py-14 text-center shadow-xl">
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Tidak Ada Hasil Ditemukan
          </h3>
          <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-400">
            Tidak ada {type} untuk &quot;
            <span className="text-white font-semibold">{query.trim()}</span>&quot;. Coba kata kunci lain.
          </p>
        </div>
      )}
    </div>
  );
}
