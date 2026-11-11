"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchX, RotateCcw, Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import CatalogCard from "@/components/CatalogCard";
import ExploreFilterSidebar from "@/components/ExploreFilterSidebar";
import ExploreToolbar from "@/components/ExploreToolbar";
import Pagination from "@/components/ui/Pagination";
import SegmentedSwitch from "@/components/ui/SegmentedSwitch";
import Tag from "@/components/ui/Tag";
import { Button } from "@/components/ui/button";
import { fetchExploreCatalog } from "@/lib/homeData";
import useFilterStore, { buildExploreCacheKey } from "@/store/filterStore";

const ALL_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Historical",
  "Horror",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

const ALL_GENRE_LOWER_MAP = new Map(
  ALL_GENRES.map((genre) => [genre.toLowerCase(), genre])
);
ALL_GENRE_LOWER_MAP.set("suspense", "Thriller");

function parseGenreParam(rawGenre) {
  if (!rawGenre) return [];
  const seen = new Set();
  const parsed = [];
  for (const token of String(rawGenre).split(",")) {
    const matched = ALL_GENRE_LOWER_MAP.get(token.trim().toLowerCase());
    if (matched && !seen.has(matched)) {
      seen.add(matched);
      parsed.push(matched);
    }
  }
  return parsed;
}

function buildExploreUrl({ q = "", type = "all", genres = [] } = {}) {
  const params = new URLSearchParams();
  const trimmedQ = String(q || "").trim();
  if (trimmedQ) params.set("q", trimmedQ);
  if (type === "anime" || type === "manga") params.set("type", type);
  if (Array.isArray(genres) && genres.length > 0) {
    params.set("genre", genres.join(","));
  }
  const qs = params.toString();
  return qs ? `/explore/?${qs}` : "/explore/";
}

const TYPE_OPTIONS = [
  { id: "all", label: "Semua" },
  { id: "anime", label: "Anime" },
  { id: "manga", label: "Manga" },
];

const FORMAT_OPTIONS_ALL = [
  "Semua",
  "TV",
  "Movie",
  "OVA",
  "ONA",
  "Special",
  "Manga",
  "Manhwa",
  "Light Novel",
];
const FORMAT_OPTIONS_ANIME = ["Semua", "TV", "Movie", "OVA", "ONA", "Special"];
const FORMAT_OPTIONS_MANGA = ["Semua", "Manga", "Manhwa", "Light Novel"];

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularitas" },
  { value: "newest", label: "Terbaru" },
  { value: "rating", label: "Rating" },
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const typeParam = searchParams.get("type") || "";
  const genreParam = searchParams.get("genre") || "";

  const getExploreCatalogCache = useFilterStore(
    (state) => state.getExploreCatalogCache
  );
  const setExploreCatalogCache = useFilterStore(
    (state) => state.setExploreCatalogCache
  );

  // State Filter Sidebar
  const [selectedType, setSelectedType] = useState(() => {
    if (typeParam === "anime" || typeParam === "manga") return typeParam;
    return "all";
  });
  const [selectedGenres, setSelectedGenres] = useState(() =>
    parseGenreParam(genreParam)
  );
  const [selectedFormat, setSelectedFormat] = useState("Semua");
  const [genreSearch, setGenreSearch] = useState("");

  // State Pencarian & Sorting
  const [searchQuery, setSearchQuery] = useState(qParam);
  const [sortBy, setSortBy] = useState("popularity");

  // State Data & Loading dari Tenrai API
  const [catalogItems, setCatalogItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // State Mobile Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sinkronisasi saat q parameter dari URL berubah
  useEffect(() => {
    setSearchQuery(qParam);
    setCurrentPage(1);
  }, [qParam]);

  // Sinkronisasi saat type parameter dari URL berubah (mis. navigasi Kembali / Navbar)
  const prevTypeParamRef = useRef(typeParam);
  useEffect(() => {
    if (prevTypeParamRef.current === typeParam) return;
    prevTypeParamRef.current = typeParam;
    const nextType =
      typeParam === "anime" || typeParam === "manga" ? typeParam : "all";
    setSelectedType(nextType);
    setCurrentPage(1);
  }, [typeParam]);

  // Sinkronisasi saat genre parameter dari URL berubah (mis. klik tag genre dari halaman Detail)
  const prevGenreParamRef = useRef(genreParam);
  useEffect(() => {
    if (prevGenreParamRef.current === genreParam) return;
    prevGenreParamRef.current = genreParam;
    setSelectedGenres(parseGenreParam(genreParam));
    setCurrentPage(1);
  }, [genreParam]);

  // Ambil data katalog dengan cache store TTL 5 menit sebelum memanggil Tenrai API
  useEffect(() => {
    let isMounted = true;
    const trimmedQuery = searchQuery.trim();
    const cacheKey = buildExploreCacheKey({
      type: selectedType,
      query: trimmedQuery,
      genres: selectedGenres,
      format: selectedFormat,
      sortBy,
      page: currentPage,
    });

    const cached = getExploreCatalogCache(cacheKey);
    if (cached) {
      setCatalogItems(Array.isArray(cached.items) ? cached.items : []);
      setTotalPages(Math.max(1, Number(cached.pagination?.totalPages) || 1));
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const loadCatalogData = async () => {
      try {
        const res = await fetchExploreCatalog({
          type: selectedType,
          query: trimmedQuery,
          genres: selectedGenres,
          format: selectedFormat,
          sortBy,
          page: currentPage,
          limit: 30,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const nextItems = Array.isArray(res) ? res : res?.items || [];
        const nextPagination = Array.isArray(res)
          ? { currentPage, totalPages: 1, hasNextPage: false }
          : res?.pagination || { currentPage, totalPages: 1, hasNextPage: false };

        setExploreCatalogCache(cacheKey, {
          items: nextItems,
          pagination: nextPagination,
        });

        if (isMounted) {
          setCatalogItems(nextItems);
          setTotalPages(Math.max(1, Number(nextPagination.totalPages) || 1));
        }
      } catch (err) {
        if (err?.name === "AbortError" || controller.signal.aborted) {
          return;
        }
        if (isMounted) {
          setCatalogItems([]);
          setTotalPages(1);
        }
      } finally {
        if (isMounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    const delayMs = trimmedQuery && trimmedQuery !== qParam ? 350 : 0;
    const timer = setTimeout(() => {
      loadCatalogData();
    }, delayMs);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [
    searchQuery,
    qParam,
    selectedType,
    selectedGenres,
    selectedFormat,
    sortBy,
    currentPage,
    getExploreCatalogCache,
    setExploreCatalogCache,
  ]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
    router.push(
      buildExploreUrl({
        q: "",
        type: selectedType,
        genres: selectedGenres,
      })
    );
  }, [router, selectedType, selectedGenres]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    if (!value.trim() && qParam) {
      router.push(
        buildExploreUrl({
          q: "",
          type: selectedType,
          genres: selectedGenres,
        })
      );
    }
  };

  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim();
    router.push(
      buildExploreUrl({
        q: trimmed,
        type: selectedType,
        genres: selectedGenres,
      })
    );
  };

  const toggleGenre = (genre) => {
    const nextGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(nextGenres);
    setCurrentPage(1);
    const nextGenreQuery = nextGenres.join(",");
    prevGenreParamRef.current = nextGenreQuery;
    router.replace(
      buildExploreUrl({
        q: qParam,
        type: selectedType,
        genres: nextGenres,
      }),
      { scroll: false }
    );
  };

  // Format yang tersedia sesuai Tipe yang dipilih
  const availableFormats = useMemo(() => {
    if (selectedType === "anime") return FORMAT_OPTIONS_ANIME;
    if (selectedType === "manga") return FORMAT_OPTIONS_MANGA;
    return FORMAT_OPTIONS_ALL;
  }, [selectedType]);

  // Handler ganti Tipe dengan auto-reset format & sinkronisasi URL agar bertahan saat kembali
  const handleTypeChange = (newType) => {
    setSelectedType(newType);
    setCurrentPage(1);
    if (selectedFormat !== "Semua") {
      const allowed =
        newType === "anime"
          ? FORMAT_OPTIONS_ANIME
          : newType === "manga"
          ? FORMAT_OPTIONS_MANGA
          : FORMAT_OPTIONS_ALL;
      if (!allowed.includes(selectedFormat)) {
        setSelectedFormat("Semua");
      }
    }
    prevTypeParamRef.current = newType === "all" ? "" : newType;
    router.replace(
      buildExploreUrl({
        q: qParam,
        type: newType,
        genres: selectedGenres,
      }),
      { scroll: false }
    );
  };

  const resetAll = () => {
    setSelectedType("all");
    setSelectedGenres([]);
    setSelectedFormat("Semua");
    setGenreSearch("");
    setSortBy("popularity");
    setSearchQuery("");
    setCurrentPage(1);
    prevTypeParamRef.current = "";
    prevGenreParamRef.current = "";
    router.push("/explore/");
  };

  const visibleGenres = useMemo(
    () =>
      genreSearch
        ? ALL_GENRES.filter((g) =>
            g.toLowerCase().includes(genreSearch.toLowerCase())
          )
        : ALL_GENRES,
    [genreSearch]
  );

  const sortedItems = useMemo(() => {
    const filtered = catalogItems.filter((item) => {
      const matchType = selectedType === "all" || item.type === selectedType;
      const matchGenre =
        selectedGenres.length === 0 ||
        selectedGenres.every((g) =>
          item.genres?.some(
            (ig) =>
              ig.toLowerCase() === g.toLowerCase() ||
              (g === "Thriller" && ig.toLowerCase() === "suspense")
          )
        );
      const matchFormat =
        selectedFormat === "Semua" ||
        String(item.format || "").toLowerCase() === selectedFormat.toLowerCase();
      return matchType && matchGenre && matchFormat;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "rating") return (b.score || 0) - (a.score || 0);
      if (sortBy === "newest") {
        const yearDiff = (Number(b.year) || 0) - (Number(a.year) || 0);
        return yearDiff !== 0 ? yearDiff : (b.id || 0) - (a.id || 0);
      }
      return 0;
    });
  }, [catalogItems, selectedType, selectedGenres, selectedFormat, sortBy]);

  const activeFilterCount =
    (selectedType !== "all" ? 1 : 0) +
    selectedGenres.length +
    (selectedFormat !== "Semua" ? 1 : 0);

  const catalogTypeLabel =
    selectedType === "all"
      ? "Campuran Anime & Manga"
      : selectedType === "anime"
      ? "Katalog Anime Populer"
      : "Katalog Manga Populer";

  return (
    <div className="min-h-[calc(100vh-65px)] bg-bg text-text selection:bg-accent/30 selection:text-text lg:flex">
      {/* Sidebar Filter Kiri Docked (Desktop Sticky Full-Height + Mobile Drawer) */}
      <ExploreFilterSidebar
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        genres={visibleGenres}
        selectedGenres={selectedGenres}
        onToggleGenre={toggleGenre}
        genreSearch={genreSearch}
        onGenreSearchChange={setGenreSearch}
        formats={availableFormats}
        selectedFormat={selectedFormat}
        onSelectFormat={(fmt) => {
          setSelectedFormat(fmt);
          setCurrentPage(1);
        }}
        activeFilterCount={activeFilterCount}
        onReset={resetAll}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Area Konten Utama */}
      <main className="flex-1 min-w-0 pb-24">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6">
          {/* Header Halaman Selaras dengan Section Beranda */}
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight font-['Bricolage_Grotesque'] select-none">
                Jelajah Katalog
              </h1>
              <Tag variant="secondary" size="pill">
                {catalogTypeLabel}
              </Tag>
            </div>

            {/* Switch Tipe Cepat untuk Mobile/Tablet (Desktop memakai Sidebar Kiri) */}
            <SegmentedSwitch
              options={TYPE_OPTIONS}
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full sm:w-56 lg:hidden"
              ariaLabel="Filter Tipe Media Cepat"
            />
          </header>

          <div className="space-y-5">
            <ExploreToolbar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              onClearSearch={handleClearSearch}
              sortBy={sortBy}
              sortOptions={SORT_OPTIONS}
              onSortChange={(nextSort) => {
                setSortBy(nextSort);
                setCurrentPage(1);
              }}
              activeFilterCount={activeFilterCount}
              onOpenMobileSidebar={() => setSidebarOpen(true)}
              isLoading={isLoading}
            />

            {/* Info Jumlah Judul & Halaman */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs py-0.5">
              <span className="font-semibold text-text">
                Menampilkan {sortedItems.length} judul
              </span>
              {totalPages > 1 && (
                <span className="text-text-2 font-medium text-[11px] sm:text-xs">
                  Halaman {currentPage} dari {totalPages}
                </span>
              )}
            </div>

            {/* Grid Katalog */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-3 sm:gap-3.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-sm animate-pulse"
                  >
                    <div className="aspect-[3/4] w-full bg-surface-2" />
                    <div className="p-2.5 sm:p-3 space-y-2 border-t border-border">
                      <div className="h-3.5 bg-surface-2 rounded w-4/5" />
                      <div className="flex justify-between">
                        <div className="h-3 bg-surface-2 rounded w-1/3" />
                        <div className="h-3 bg-surface-2 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-16 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-2 text-text-2 border border-border">
                  <SearchX size={26} />
                </div>
                <h3 className="mt-4 text-base font-black text-text tracking-tight font-['Bricolage_Grotesque']">
                  Tidak Ada Judul Ditemukan
                </h3>
                <p className="mt-1 max-w-sm text-xs text-text-2 leading-relaxed">
                  {searchQuery.trim()
                    ? `Tidak ada judul yang cocok dengan "${searchQuery}".`
                    : "Coba ubah filter atau reset untuk melihat lebih banyak judul."}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={resetAll}
                  className="mt-5 text-xs font-bold"
                >
                  <RotateCcw size={13} />
                  <span>Reset Semua Filter</span>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-3 sm:gap-3.5">
                  {sortedItems.map((item) => (
                    <CatalogCard key={`${item.type}-${item.id}`} item={item} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  activeColor="accent"
                  onPageChange={(newPage) => {
                    setCurrentPage(newPage);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="pt-8 pb-4"
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen bg-bg flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-accent" />
          </div>
        }
      >
        <ExploreContent />
      </Suspense>
    </AuthGuard>
  );
}
