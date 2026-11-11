"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Loader2, Film, BookOpen } from "lucide-react";
import { searchCatalogApi } from "@/lib/api";
import { fetchExploreCatalog } from "@/lib/homeData";

export default function NavbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Alihkan pencarian ke halaman Explore saat enter ditekan atau panah diklik
  const handleGoToExplore = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    inputRef.current?.blur();
    router.push(`/explore/?q=${encodeURIComponent(trimmed)}`);
  }, [query, router]);

  // Eksekusi pencarian gabungan (Anime & Manga) dengan AbortController
  const executeSearch = useCallback(async (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const [animeRes, mangaRes] = await Promise.allSettled([
        searchCatalogApi({ q: trimmed, type: "anime", limit: 3 }, controller.signal),
        searchCatalogApi({ q: trimmed, type: "manga", limit: 3 }, controller.signal),
      ]);

      const merged = [];

      const buildSearchSubtitle = (item, defaultFormat) => {
        const format = item.format || defaultFormat;
        const genreList = Array.isArray(item.genres)
          ? item.genres
              .map((g) => (typeof g === "string" ? g : g?.name))
              .filter(Boolean)
              .slice(0, 3)
          : [];
        return genreList.length > 0 ? `${format}, ${genreList.join(", ")}` : format;
      };

      const appendResults = (res, type, defaultFormat) => {
        if (res.status !== "fulfilled" || !res.value?.data) return;
        const list = Array.isArray(res.value.data) ? res.value.data : [];
        list.forEach((item) => {
          merged.push({
            id: item.mal_id || item.id,
            type,
            title: item.title,
            image: item.image || item.image_url,
            subtitle: buildSearchSubtitle(item, defaultFormat),
          });
        });
      };

      appendResults(animeRes, "anime", "TV");
      appendResults(mangaRes, "manga", "Manga");

      // Jika searchCatalogApi belum menghasilkan (misal backend lokal tidak aktif), gunakan fallback Tenrai
      if (merged.length === 0) {
        try {
          const fallbackRes = await fetchExploreCatalog({
            type: "all",
            query: trimmed,
            limit: 6,
          });
          const fallbackItems = Array.isArray(fallbackRes)
            ? fallbackRes
            : fallbackRes?.items || [];
          fallbackItems.forEach((item) => {
            merged.push({
              id: item.malId || item.id,
              type: item.type || "anime",
              title: item.title,
              image: item.image,
              subtitle: buildSearchSubtitle(item, item.type === "manga" ? "Manga" : "TV"),
            });
          });
        } catch {
          // ignore fallback error
        }
      }

      // Tampilkan hingga 5–6 hasil teratas
      setResults(merged.slice(0, 6));
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handler input dengan jeda debounce 280ms
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!val.trim()) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsOpen(true);
    setIsLoading(true);

    timerRef.current = setTimeout(() => {
      executeSearch(val);
    }, 280);
  };

  // Navigasi keyboard (Enter untuk ke Explore, Escape untuk menutup)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGoToExplore();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Shortcut keyboard '/' untuk fokus ke input pencarian navbar
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(e.target?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
        if (query.trim()) {
          setIsOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [query]);

  // Event listener klik di luar komponen untuk menutup dropdown popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-36 sm:w-52 md:w-56 lg:w-60"
    >
      {/* ========================================================================= */}
      {/* 1. INPUT CAPSULE / PILL SEARCH BAR (Sesuai Gambar 2)                      */}
      {/* ========================================================================= */}
      <div className="relative flex h-9 w-full items-center rounded-full border border-border bg-surface px-3 shadow-xs transition-colors focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/25">
        <Search size={14} className="text-text-2 shrink-0 select-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim()) setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Cari judul..."
          aria-label="Pencarian judul"
          className="w-full bg-transparent px-2 text-xs sm:text-sm text-text placeholder:text-text-2/60 outline-none selection:bg-accent/30 selection:text-text"
        />

        {/* Ikon Dinamis: Loading Spinner vs Tombol Panah -> vs Shortcut Badge [/] */}
        <div className="flex items-center justify-center shrink-0 min-w-5">
          {isLoading ? (
            <Loader2 size={14} className="text-accent animate-spin shrink-0" />
          ) : isFocused || query.trim().length > 0 ? (
            <button
              type="button"
              onMouseDown={(e) => {
                // Cegah blur sebelum handler eksekusi berjalan
                e.preventDefault();
                handleGoToExplore();
              }}
              onClick={handleGoToExplore}
              title="Cari di Jelajah (Enter)"
              aria-label="Cari di Jelajah"
              className="text-text-2 hover:text-accent transition-colors cursor-pointer shrink-0 p-0.5"
            >
              <ArrowRight size={14} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center justify-center text-[10px] font-mono font-semibold text-text-2 bg-surface-2 px-1.5 py-0.5 rounded border border-border select-none shrink-0">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DROPDOWN POPUP HASIL PENCARIAN (Sesuai Gambar 2)                        */}
      {/* ========================================================================= */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-[280px] sm:w-[320px] md:w-[350px] z-50 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading ? (
            /* State Loading dengan Animasi Halus */
            <div className="p-6 flex items-center justify-center gap-2.5 text-text-2 text-xs sm:text-sm">
              <Loader2 size={16} className="animate-spin text-accent" />
              <span>Mencari &ldquo;{query}&rdquo;...</span>
            </div>
          ) : hasSearched && results.length === 0 ? (
            /* State Tidak Ada Hasil (Poin 3) */
            <div className="p-6 text-center">
              <p className="text-xs sm:text-sm font-medium text-text-2">
                Tidak ada hasil untuk &ldquo;<span className="text-text font-bold">{query}</span>&rdquo;
              </p>
            </div>
          ) : results.length > 0 ? (
            /* State Ada Hasil (Poin 2) - Tanpa Footer "Lihat semua..." (Poin 1) */
            <div className="divide-y divide-border/40 max-h-[380px] overflow-y-auto">
              {results.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={`/detail/?type=${item.type}&id=${item.id}`}
                  scroll={true}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-3 p-2.5 sm:p-3 transition-colors hover:bg-surface-2 cursor-pointer"
                >
                  {/* Thumbnail Poster dengan Badge Jenis Konten (ANIME / MANGA) */}
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-2 border border-border">
                    {item.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-text-2">
                        {item.type === "anime" ? <Film size={16} /> : <BookOpen size={16} />}
                      </div>
                    )}

                    {/* Badge Jenis Media: ANIME atau MANGA */}
                    <span
                      className={`absolute top-1 left-1 rounded px-1 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-xs ${
                        item.type === "manga" ? "bg-media-manga" : "bg-media-anime"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Judul & Metadata Subtitle */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-xs sm:text-sm font-bold text-text line-clamp-1 group-hover:text-secondary transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-text-2 line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
