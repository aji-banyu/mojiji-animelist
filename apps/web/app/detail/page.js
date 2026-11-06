"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Film,
  BookOpen,
  ArrowLeft,
  AlertCircle,
  PlusCircle,
  SearchX,
  ChevronDown,
  CheckCircle2,
  Loader2,
  X,
  Play,
  Search,
  RotateCcw,
  WifiOff,
  Home,
  Bookmark,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import {
  getCatalogDetailApi,
  getTrackerItemApi,
  addTrackerApi,
} from "@/lib/api";
import { enrichCatalogDetail } from "@/lib/catalogEnricher";

const RATING_OPTIONS = [
  { value: "", label: "Beri Rating" },
  { value: "10", label: "10 - Masterpiece" },
  { value: "9", label: "9 - Great" },
  { value: "8", label: "8 - Very Good" },
  { value: "7", label: "7 - Good" },
  { value: "6", label: "6 - Fine" },
  { value: "5", label: "5 - Average" },
  { value: "4", label: "4 - Bad" },
  { value: "3", label: "3 - Very Bad" },
  { value: "2", label: "2 - Horrible" },
  { value: "1", label: "1 - Appalling" },
];

function formatStatNumber(val) {
  if (!val || val === "-") return "-";
  if (typeof val === "string") {
    if (val.startsWith("#")) return val;
    const cleanNum = Number(val.replace(/,/g, ""));
    if (!Number.isNaN(cleanNum) && cleanNum > 0) {
      if (cleanNum >= 1000000) return (cleanNum / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
      if (cleanNum >= 1000) return (cleanNum / 1000).toFixed(1).replace(/\.0$/, "") + "k";
      return cleanNum.toLocaleString();
    }
    return val;
  }
  if (typeof val === "number") {
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
    if (val >= 1000) return (val / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return val.toString();
  }
  return val;
}

/**
 * DetailContent — Membaca query parameter ?type=&id= dan menyajikan detail lengkap
 * dengan tipografi sans-serif modern yang tegas, proporsional, dan nyaman dibaca.
 */
function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "anime"; // "anime" | "manga"
  const id = searchParams.get("id"); // MAL ID

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  // State Pelacakan Tracker & Rating
  const [trackedItem, setTrackedItem] = useState(null);
  const [isSavingTracker, setIsSavingTracker] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [toast, setToast] = useState(null);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);

  const isAnime = type === "anime";

  // Auto-dismiss toast setelah 4 detik
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Muat rating lokal tersimpan
  useEffect(() => {
    if (!id) return;
    try {
      const savedRating = localStorage.getItem(`mojiji_rating_${type}_${id}`);
      if (savedRating) {
        setUserRating(savedRating);
      }
    } catch {
      // LocalStorage tidak tersedia / SSR fallback
    }
  }, [type, id]);

  // Ambil detail katalog dan status tracker saat ini
  useEffect(() => {
    if (!id) {
      setError("Parameter ID katalog tidak ditemukan pada URL.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      try {
        const response = await getCatalogDetailApi(type, id);

        if (isMounted) {
          if (response && response.success && response.data) {
            const enriched = enrichCatalogDetail(response.data, type, id);
            setData(enriched);
          } else {
            setIsNotFound(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          if (err?.status === 404 || err?.error?.code === "NOT_FOUND") {
            setIsNotFound(true);
          } else if (
            err?.status === 429 ||
            err?.error?.code === "RATE_LIMIT_EXCEEDED" ||
            err?.error?.code === "RATE_LIMITED"
          ) {
            setError("Batas permintaan tercapai. Tunggu beberapa detik lalu coba lagi.");
          } else if (
            err?.isOffline ||
            err?.status === 503 ||
            err?.error?.code === "SERVER_OFFLINE" ||
            err?.code === "ERR_NETWORK"
          ) {
            setError("Tidak dapat terhubung ke server katalog. Silakan muat ulang.");
          } else {
            setError(err?.error?.message || "Gagal memuat data detail. Silakan coba lagi.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetail();

    // Periksa status tracker pengguna
    getTrackerItemApi(type, id)
      .then((item) => {
        if (isMounted && item) {
          setTrackedItem(item);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [type, id]);

  // Handler tambah judul ke tracker
  const handleToggleTracker = async () => {
    if (trackedItem) {
      setToast({
        type: "info",
        message: "Judul ini sudah tersimpan di daftar Tracker Anda.",
      });
      return;
    }

    setIsSavingTracker(true);
    const defaultStatus = isAnime ? "watching" : "reading";

    try {
      const res = await addTrackerApi({
        type,
        malId: id,
        status: defaultStatus,
        progress: 0,
      });

      if (res && res.data) {
        setTrackedItem(res.data);
      } else {
        const item = await getTrackerItemApi(type, id);
        setTrackedItem(item || { malId: id, mediaType: type, status: defaultStatus, progress: 0 });
      }

      setToast({
        type: "success",
        message: `Berhasil menambahkan "${data?.title || "Judul"}" ke tracker!`,
      });
    } catch (err) {
      if (err?.status === 401 || err?.error?.code === "UNAUTHORIZED") {
        router.push("/login");
        return;
      }

      if (err?.status === 409 || err?.error?.code === "CONFLICT") {
        setToast({
          type: "info",
          message: "Judul ini sudah tersimpan di daftar tracker Anda.",
        });
        const item = await getTrackerItemApi(type, id);
        if (item) setTrackedItem(item);
        return;
      }

      setToast({
        type: "error",
        message: err?.error?.message || "Gagal menyimpan item ke tracker.",
      });
    } finally {
      setIsSavingTracker(false);
    }
  };

  // Handler rating bintang (disimpan ke localStorage)
  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
    try {
      if (newRating) {
        localStorage.setItem(`mojiji_rating_${type}_${id}`, newRating);
        setToast({
          type: "success",
          message: `Rating tersimpan: ${newRating}/10 Bintang`,
        });
      } else {
        localStorage.removeItem(`mojiji_rating_${type}_${id}`);
      }
    } catch {
      // LocalStorage fallback
    }
  };

  const poster = data?.image || data?.imageUrl || data?.image_url;
  const malId = data?.malId || data?.mal_id || data?.id || id;
  const totalCount = isAnime
    ? data?.information?.episodes || data?.totalEpisodes || "?"
    : data?.information?.chapters || data?.totalChapters || "?";

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/explore");
    }
  };

  const genres = data?.information?.genres || [];
  const studioOrAuthor = isAnime
    ? data?.information?.studios?.[0] || data?.information?.studios?.join(", ") || "-"
    : data?.information?.authors?.[0] || data?.information?.authors?.join(", ") || "-";
  const formatType = data?.information?.type || (isAnime ? "Anime (TV)" : "Manga");

  return (
    <div
      style={{
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
      className="relative min-h-[calc(100vh-3.5rem)] bg-[#0A0D14] text-neutral-100 font-sans font-normal pb-20 selection:bg-[#6D4AFF] selection:text-white"
    >
      {/* Toast Notification Floating Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-base font-semibold shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/95 text-emerald-200"
              : toast.type === "info"
              ? "border-[#6D4AFF]/40 bg-[#1F1F23]/95 text-white"
              : "border-red-500/40 bg-red-950/95 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={20} className="shrink-0 text-[#6D4AFF]" />
          )}
          <span className="max-w-sm">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 rounded-lg p-1 text-neutral-400 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* === KONDISI 1: Loading Skeleton Shimmer === */}
      {isLoading && (
        <div className="animate-pulse">
          <div className="relative h-[360px] md:h-[420px] w-full bg-[#151924]" />
          <div className="max-w-7xl mx-auto px-5 md:px-8 -mt-[210px] md:-mt-[260px] relative z-20 space-y-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="h-[240px] w-[160px] md:h-[288px] md:w-[193px] rounded-lg bg-neutral-800 shrink-0" />
              <div className="space-y-4 w-full md:w-2/3 pb-2">
                <div className="h-10 w-3/4 rounded-lg bg-neutral-800" />
                <div className="h-6 w-1/4 rounded-lg bg-neutral-800/60" />
              </div>
            </div>
            <div className="h-16 w-full rounded-xl bg-neutral-800/40" />
            <div className="h-28 w-full rounded-xl bg-neutral-800/30" />
          </div>
        </div>
      )}

      {/* === KONDISI 2: 404 Not Found === */}
      {!isLoading && isNotFound && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#121620] px-6 py-20 text-center shadow-xl">
            <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
              <SearchX size={38} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white tracking-tight">Item Katalog Tidak Ditemukan</h2>
            <p className="mt-2.5 max-w-md text-sm sm:text-base leading-relaxed text-neutral-400">
              Data {type} dengan ID <strong className="text-white">#{id}</strong> tidak ditemukan dalam katalog.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#b91c1c] active:scale-95"
              >
                <Search size={17} />
                <span>Jelajahi Katalog Lainnya</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1E293B] px-6 py-3 text-sm font-bold text-neutral-200 transition-all hover:bg-[#334155] hover:text-white active:scale-95"
              >
                <ArrowLeft size={17} />
                <span>Kembali ke Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* === KONDISI 3: Upstream Error (MJ-094 Pesan Ramah) === */}
      {!isLoading && !isNotFound && error && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-base text-red-200 shadow-xl backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30">
                <WifiOff size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Gagal Memuat Detail Katalog</h3>
                <p className="text-sm sm:text-base text-red-200/90 leading-relaxed max-w-xl">{error}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#b91c1c] active:scale-95 cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>Muat Ulang Halaman</span>
              </button>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1E293B] px-5 py-2.5 text-sm font-bold text-neutral-200 transition-all hover:bg-[#334155] hover:text-white active:scale-95"
              >
                <Search size={16} />
                <span>Ke Pencarian</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* === KONDISI 4: Data Berhasil Dimuat (UI Hero Banner yang Hidup) === */}
      {!isLoading && !isNotFound && !error && data && (
        <>
          {/* ===== 1. CINEMATIC HERO BANNER (Tinggi ±420px) ===== */}
          <div className="relative h-[360px] md:h-[420px] w-full overflow-hidden bg-[#09090B]">
            {/* Background Poster Terlihat Hidup (Blur Ringan & Poster Terlihat Jelas) */}
            {poster && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center blur-[3px] scale-102 opacity-85 brightness-[0.85] pointer-events-none select-none transition-all duration-700"
                style={{ backgroundImage: `url(${poster})` }}
                aria-hidden="true"
              />
            )}

            {/* Gradient Overlay Transparan Lembut -> #0A0D14 */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-[#0A0D14] pointer-events-none"
              aria-hidden="true"
            />

            {/* Tombol Bulat di Pojok Atas: Kiri (ArrowLeft) & Kanan (Home) */}
            <button
              type="button"
              onClick={handleBack}
              aria-label="Kembali"
              className="absolute top-[24px] md:top-[30px] left-[20px] md:left-[32px] z-30 flex h-12 w-12 md:h-[56px] md:w-[56px] items-center justify-center rounded-full border border-white/15 bg-black/50 text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:bg-black/75 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6D4AFF] cursor-pointer"
            >
              <ArrowLeft size={24} strokeWidth={2.2} />
            </button>

            <Link
              href="/home"
              aria-label="Beranda"
              className="absolute top-[24px] md:top-[30px] right-[20px] md:right-[32px] z-30 flex h-12 w-12 md:h-[56px] md:w-[56px] items-center justify-center rounded-full border border-white/15 bg-black/50 text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:bg-black/75 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6D4AFF] cursor-pointer"
            >
              <Home size={24} strokeWidth={2.2} />
            </Link>
          </div>

          {/* ===== 2. KONTEN UTAMA: COVER OVERLAPPING, AKSI & STATISTIK ===== */}
          <div className="relative px-5 md:px-[32px] -mt-[210px] md:-mt-[270px] z-20 max-w-7xl mx-auto space-y-8">
            {/* Header: Cover + Judul & Status */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-[30px]">
              {/* Cover Potret ±193×288px */}
              <div className="relative h-[240px] w-[160px] md:h-[288px] md:w-[193px] shrink-0 overflow-hidden rounded-lg border border-white/20 bg-[#181A20] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {poster ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={poster}
                    alt={data.title || "Poster"}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover select-none"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-600">
                    {isAnime ? <Film size={48} /> : <BookOpen size={48} />}
                  </div>
                )}
              </div>

              {/* Judul & Status */}
              <div className="flex flex-1 flex-col text-center md:text-left min-w-0 pb-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2.5">
                  <span className="rounded-full bg-[#6D4AFF]/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#7C5CFF] border border-[#6D4AFF]/30">
                    {isAnime ? "Anime" : "Manga"}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-neutral-200 border border-white/15">
                    {data.status || "Status Unknown"}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-neutral-400">
                    MAL #{malId}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-tight line-clamp-2">
                  {data.title || "Untitled"}
                </h1>
                <p className="mt-2 md:mt-[16px] text-base md:text-[22px] font-medium text-[#D4D4D8]">
                  {data.status || "Updating"}
                </p>
              </div>
            </div>

            {/* ===== 3. BARIS AKSI & STATISTIK (Sejajar dengan bagian bawah cover) ===== */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-4 border-b border-white/10 pb-8">
              {/* Kiri: Tombol Aksi (Tambah ke Tracker & Rating Bintang) */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* 1. Tombol Tambah ke Tracker (Tanpa dobel plus) */}
                <button
                  type="button"
                  onClick={handleToggleTracker}
                  disabled={isSavingTracker}
                  className={`flex h-[56px] md:h-[64px] items-center justify-center gap-2.5 rounded-lg px-6 text-base md:text-[18px] font-bold shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
                    trackedItem
                      ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30"
                      : "bg-[#6D4AFF] text-white hover:bg-[#7C5CFF] shadow-[#6D4AFF]/20"
                  }`}
                >
                  {isSavingTracker ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : trackedItem ? (
                    <>
                      <CheckCircle2 size={20} className="text-emerald-400" />
                      <span>Sudah di Tracker</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={20} />
                      <span>Tambah ke Tracker</span>
                    </>
                  )}
                </button>

                {/* 2. Rating Star Dropdown (Bersih: Beri Rating) */}
                <div className="relative flex items-center h-[56px] md:h-[64px]">
                  <div className="absolute left-4 text-amber-400 pointer-events-none">
                    <Star size={18} className={userRating ? "fill-amber-400" : ""} />
                  </div>
                  <select
                    value={userRating}
                    onChange={(e) => handleRatingChange(e.target.value)}
                    className="h-full appearance-none rounded-lg border border-white/10 bg-[#1F1F23] pl-11 pr-10 text-sm md:text-base font-semibold text-white shadow-inner focus:border-[#6D4AFF] focus:outline-none transition-all cursor-pointer hover:bg-[#2A2A30]"
                    aria-label="Beri Rating"
                  >
                    {RATING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#181D2A] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 text-neutral-400" />
                </div>
              </div>

              {/* Kanan: Statistik Score & Members (Popularity & Ranked dipindah ke Information) */}
              <div className="flex items-center justify-around sm:justify-end gap-4 sm:gap-6 py-2">
                {/* Score */}
                <div className="flex items-center gap-2 cursor-help" title={`Score: ${data.statistics?.score || "-"}`}>
                  <Star size={22} className="fill-[#FF7A3D] text-[#FF7A3D] shrink-0" />
                  <span className="text-lg md:text-[22px] font-semibold text-white">
                    {data.statistics?.score || "-"}
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-white/15" aria-hidden="true" />

                {/* Members / Bookmark */}
                <div className="flex items-center gap-2 cursor-help" title={`Members: ${data.statistics?.members || "-"}`}>
                  <Bookmark size={22} className="fill-[#22A6E8] text-[#22A6E8] shrink-0" />
                  <span className="text-lg md:text-[22px] font-semibold text-white">
                    {formatStatNumber(data.statistics?.members) || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* ===== 4. SINOPSIS (Lebar Penuh dengan Read More & Text Justify) ===== */}
            {(() => {
              const synopsisText = (data.synopsis || "Sinopsis belum tersedia untuk judul ini.")
                .replace(/\[Written by MAL Rewrite\]/gi, "")
                .replace(/\(Source:[^)]+\)/gi, "")
                .trim();

              return (
                <section aria-label="Sinopsis" className="w-full pt-2">
                  {!isSynopsisExpanded ? (
                    <div className="relative">
                      <p className="line-clamp-3 text-base md:text-[20px] md:leading-[30px] text-[#E4E4E7] font-normal text-justify pr-4 select-text">
                        {synopsisText}
                      </p>
                      <div className="absolute bottom-0 right-0 flex items-center bg-gradient-to-l from-[#0A0D14] via-[#0A0D14] to-transparent pl-10">
                        <button
                          type="button"
                          onClick={() => setIsSynopsisExpanded(true)}
                          className="text-[#7C5CFF] font-bold text-base md:text-[20px] leading-[30px] hover:text-[#9B82FF] transition-colors cursor-pointer bg-[#0A0D14] pl-1 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] rounded"
                        >
                          ... Read More
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-base md:text-[20px] md:leading-[30px] text-[#E4E4E7] font-normal leading-relaxed text-justify select-text transition-all duration-300">
                        {synopsisText}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSynopsisExpanded(false)}
                        className="text-[#7C5CFF] font-bold text-sm md:text-[18px] hover:text-[#9B82FF] transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] rounded inline-block"
                      >
                        Show Less
                      </button>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* ===== 5. METADATA CHIPS (Label + Chips) ===== */}
            <section aria-label="Metadata" className="w-full pt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                {/* Genre */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="w-[115px] shrink-0 text-base md:text-[18px] font-bold text-white tracking-tight">
                    Genre
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {genres.length > 0 ? (
                      genres.map((g) => (
                        <Link
                          key={g}
                          href={`/explore?genre=${encodeURIComponent(g)}`}
                          className="inline-flex h-[38px] md:h-[42px] items-center justify-center rounded-md bg-[#27272A] px-3.5 text-xs md:text-sm text-[#D4D4D8] transition-all hover:bg-[#35353A] hover:text-white cursor-pointer"
                        >
                          {g}
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs text-neutral-500">-</span>
                    )}
                  </div>
                </div>

                <div className="hidden lg:block h-[32px] w-[1px] bg-white/15" aria-hidden="true" />

                {/* Studio / Author */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="w-[100px] shrink-0 text-base md:text-[18px] font-bold text-white tracking-tight">
                    {isAnime ? "Studio" : "Author"}
                  </span>
                  <span className="inline-flex h-[38px] md:h-[42px] items-center justify-center rounded-md bg-[#27272A] px-3.5 text-xs md:text-sm text-[#D4D4D8]">
                    {studioOrAuthor}
                  </span>
                </div>

                <div className="hidden lg:block h-[32px] w-[1px] bg-white/15" aria-hidden="true" />

                {/* Format / Type */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="w-[100px] shrink-0 text-base md:text-[18px] font-bold text-white tracking-tight">
                    Format
                  </span>
                  <span className="inline-flex h-[38px] md:h-[42px] items-center justify-center rounded-md bg-[#27272A] px-3.5 text-xs md:text-sm text-[#D4D4D8]">
                    {formatType}
                  </span>
                </div>

                <div className="hidden lg:block h-[32px] w-[1px] bg-white/15" aria-hidden="true" />

                {/* Episodes / Chapters */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="w-[100px] shrink-0 text-base md:text-[18px] font-bold text-white tracking-tight">
                    {isAnime ? "Episode" : "Chapter"}
                  </span>
                  <span className="inline-flex h-[38px] md:h-[42px] items-center justify-center rounded-md bg-[#27272A] px-3.5 text-xs md:text-sm text-[#D4D4D8]">
                    {totalCount} {isAnime ? "Eps" : "Ch"}
                  </span>
                </div>
              </div>
            </section>

            {/* ===== 6. DETAIL MENDALAM: CHARACTERS, STAFF, THEMES & INFO ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/10 items-start">
              {/* Kolom Kiri (Sidebar Info Tambahan) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-white/10 bg-[#121620] p-5 space-y-6 shadow-lg">
                  {/* Alternative Titles */}
                  <div>
                    <h3 className="font-bold text-white text-base tracking-tight border-b border-white/10 pb-2.5 mb-3">
                      Alternative Titles
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm text-neutral-300">
                      {data.alternativeTitles?.synonyms && (
                        <p className="leading-relaxed">
                          <span className="font-semibold text-neutral-400">Synonyms:</span>{" "}
                          <span className="text-neutral-100">
                            {Array.isArray(data.alternativeTitles.synonyms)
                              ? data.alternativeTitles.synonyms.join(", ")
                              : data.alternativeTitles.synonyms}
                          </span>
                        </p>
                      )}
                      {data.alternativeTitles?.japanese && (
                        <p className="leading-relaxed">
                          <span className="font-semibold text-neutral-400">Japanese:</span>{" "}
                          <span className="text-white font-medium">
                            {data.alternativeTitles.japanese}
                          </span>
                        </p>
                      )}
                      {data.alternativeTitles?.english && (
                        <p className="leading-relaxed">
                          <span className="font-semibold text-neutral-400">English:</span>{" "}
                          <span className="text-neutral-100">{data.alternativeTitles.english}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Informasi Rinci Lengkap Sesuai Data API */}
                  <div>
                    <h3 className="font-bold text-white text-base tracking-tight border-b border-white/10 pb-2.5 mb-3">
                      Information
                    </h3>
                    <div className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
                      <p>
                        <span className="font-semibold text-neutral-400">Type:</span>{" "}
                        <span className="text-white font-semibold">
                          {data.information?.type || (isAnime ? "TV" : "Manga")}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold text-neutral-400">
                          {isAnime ? "Episodes:" : "Chapters:"}
                        </span>{" "}
                        <span className="text-white font-semibold">{totalCount}</span>
                      </p>

                      {!isAnime && data.information?.volumes && (
                        <p>
                          <span className="font-semibold text-neutral-400">Volumes:</span>{" "}
                          <span className="text-neutral-100">{data.information.volumes}</span>
                        </p>
                      )}

                      <p>
                        <span className="font-semibold text-neutral-400">Status:</span>{" "}
                        <span className="text-white font-semibold">
                          {data.information?.status || data.status || "-"}
                        </span>
                      </p>

                      {/* Ranked & Popularity (Dipindahkan dari Banner) */}
                      <p>
                        <span className="font-semibold text-neutral-400">Ranked:</span>{" "}
                        <span className="text-[#8B5CF6] font-bold">
                          {data.statistics?.ranked || "-"}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold text-neutral-400">Popularity:</span>{" "}
                        <span className="text-neutral-200 font-bold">
                          {data.statistics?.popularity || "-"}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold text-neutral-400">Members:</span>{" "}
                        <span className="text-neutral-100">
                          {data.statistics?.members || "-"}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold text-neutral-400">Favorites:</span>{" "}
                        <span className="text-neutral-100">
                          {data.statistics?.favorites || "-"}
                        </span>
                      </p>

                      {isAnime ? (
                        <>
                          <p>
                            <span className="font-semibold text-neutral-400">Aired:</span>{" "}
                            <span className="text-neutral-100">{data.information?.aired || "-"}</span>
                          </p>
                          {data.information?.premiered && (
                            <p>
                              <span className="font-semibold text-neutral-400">Premiered:</span>{" "}
                              <span className="text-[#7C5CFF] font-bold">
                                {data.information.premiered}
                              </span>
                            </p>
                          )}
                          {data.information?.broadcast && (
                            <p>
                              <span className="font-semibold text-neutral-400">Broadcast:</span>{" "}
                              <span className="text-neutral-100">{data.information.broadcast}</span>
                            </p>
                          )}
                          {data.information?.producers && (
                            <p className="leading-relaxed">
                              <span className="font-semibold text-neutral-400">Producers:</span>{" "}
                              <span className="text-neutral-100">
                                {Array.isArray(data.information.producers)
                                  ? data.information.producers.join(", ")
                                  : data.information.producers}
                              </span>
                            </p>
                          )}
                          {data.information?.studios && (
                            <p>
                              <span className="font-semibold text-neutral-400">Studios:</span>{" "}
                              <span className="text-[#7C5CFF] font-bold">
                                {Array.isArray(data.information.studios)
                                  ? data.information.studios.join(", ")
                                  : data.information.studios}
                              </span>
                            </p>
                          )}
                          {data.information?.duration && (
                            <p>
                              <span className="font-semibold text-neutral-400">Duration:</span>{" "}
                              <span className="text-neutral-100">
                                {data.information.duration}
                              </span>
                            </p>
                          )}
                          {data.information?.rating && (
                            <p>
                              <span className="font-semibold text-neutral-400">Rating:</span>{" "}
                              <span className="text-neutral-100">
                                {data.information.rating}
                              </span>
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p>
                            <span className="font-semibold text-neutral-400">Published:</span>{" "}
                            <span className="text-neutral-100">{data.information?.published || "-"}</span>
                          </p>
                          {data.information?.authors && (
                            <p>
                              <span className="font-semibold text-neutral-400">Authors:</span>{" "}
                              <span className="text-[#7C5CFF] font-bold">
                                {Array.isArray(data.information.authors)
                                  ? data.information.authors.join(", ")
                                  : data.information.authors}
                              </span>
                            </p>
                          )}
                          {data.information?.serialization && (
                            <p>
                              <span className="font-semibold text-neutral-400">Serialization:</span>{" "}
                              <span className="text-neutral-100">
                                {Array.isArray(data.information.serialization)
                                  ? data.information.serialization.join(", ")
                                  : data.information.serialization}
                              </span>
                            </p>
                          )}
                        </>
                      )}

                      {data.information?.licensors && (
                        <p className="leading-relaxed">
                          <span className="font-semibold text-neutral-400">Licensors:</span>{" "}
                          <span className="text-neutral-100">
                            {Array.isArray(data.information.licensors)
                              ? data.information.licensors.join(", ")
                              : data.information.licensors}
                          </span>
                        </p>
                      )}

                      <p>
                        <span className="font-semibold text-neutral-400">Source:</span>{" "}
                        <span className="text-neutral-100">{data.information?.source || "Original"}</span>
                      </p>

                      {data.information?.genres && (
                        <p className="leading-relaxed">
                          <span className="font-semibold text-neutral-400">Genres:</span>{" "}
                          <span className="text-neutral-100">
                            {Array.isArray(data.information.genres)
                              ? data.information.genres.join(", ")
                              : data.information.genres}
                          </span>
                        </p>
                      )}

                      {data.information?.themes && (
                        <p className="leading-relaxed">
                          <span className="font-semibold text-neutral-400">Themes:</span>{" "}
                          <span className="text-neutral-100">
                            {Array.isArray(data.information.themes)
                              ? data.information.themes.join(", ")
                              : data.information.themes}
                          </span>
                        </p>
                      )}

                      {data.information?.demographics && (
                        <p className="leading-relaxed">
                          <span className="font-semibold text-neutral-400">Demographic:</span>{" "}
                          <span className="text-neutral-100">
                            {Array.isArray(data.information.demographics)
                              ? data.information.demographics.join(", ")
                              : data.information.demographics}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan (Konten Karakter, Staff & Lagu Tema) */}
              <div className="lg:col-span-8 space-y-7">
                {/* Characters */}
                {data.characters && data.characters.length > 0 && (
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-[#121620] p-5 sm:p-6 shadow-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="text-lg font-bold tracking-tight text-white">
                        {isAnime ? "Characters & Voice Actors" : "Characters"}
                      </h3>
                      {data.characters.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setShowAllCharacters((prev) => !prev)}
                          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#7C5CFF] font-semibold hover:text-[#9B82FF] transition-colors cursor-pointer"
                        >
                          <span>
                            {showAllCharacters
                              ? "Show Less"
                              : isAnime
                              ? "More characters & voices"
                              : "More characters"}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              showAllCharacters ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    {/* Mode List Vertikal: 1 di atas, 2 di bawah 1, dst. */}
                    <div className="flex flex-col gap-3 pt-1">
                      {(showAllCharacters ? data.characters : data.characters.slice(0, 4)).map((char, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-[#151924] p-3 sm:p-3.5 transition-colors hover:border-white/20 overflow-hidden min-w-0"
                        >
                          {/* Character Left */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-800 border border-white/10">
                              {char.image ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={char.image}
                                  alt={char.name}
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-400 text-sm font-bold">
                                  ?
                                </div>
                              )}
                            </div>
                            <div className="overflow-hidden min-w-0 flex-1">
                              <p className="text-sm sm:text-base font-bold text-white truncate">{char.name}</p>
                              <p className="text-xs sm:text-sm text-neutral-400 truncate mt-0.5">{char.role}</p>
                            </div>
                          </div>

                          {/* Voice Actor Right (Ruang lega di mode list) */}
                          {isAnime && char.voiceActor && (
                            <div className="flex items-center justify-end gap-3 text-right pl-3 shrink-0 max-w-[50%] overflow-hidden min-w-0">
                              <div className="overflow-hidden min-w-0 flex-1">
                                <p className="text-xs sm:text-sm md:text-base font-semibold text-[#7C5CFF] truncate">
                                  {char.voiceActor.name}
                                </p>
                                <p className="text-xs text-neutral-400 truncate mt-0.5">
                                  {char.voiceActor.language}
                                </p>
                              </div>
                              <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-800 border border-white/10">
                                {char.voiceActor.image ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={char.voiceActor.image}
                                    alt={char.voiceActor.name}
                                    referrerPolicy="no-referrer"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-400 text-sm font-bold">
                                    ?
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Staff */}
                {data.staff && data.staff.length > 0 && (
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-[#121620] p-5 sm:p-6 shadow-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="text-lg font-bold tracking-tight text-white">Staff</h3>
                      {data.staff.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setShowAllStaff((prev) => !prev)}
                          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#7C5CFF] font-semibold hover:text-[#9B82FF] transition-colors cursor-pointer"
                        >
                          <span>{showAllStaff ? "Show Less" : "More staff"}</span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              showAllStaff ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    {/* Mode List Vertikal: 1 di atas, 2 di bawah 1, dst. */}
                    <div className="flex flex-col gap-2.5 pt-1">
                      {(showAllStaff ? data.staff : data.staff.slice(0, 4)).map((st, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-[#151924] p-3 sm:p-3.5 transition-colors hover:border-white/20 overflow-hidden min-w-0"
                        >
                          <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-800 border border-white/10">
                            {st.image ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={st.image}
                                alt={st.name}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-400 text-sm font-bold">
                                ?
                              </div>
                            )}
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <p className="text-sm sm:text-base font-bold text-white truncate">{st.name}</p>
                            <p className="text-xs sm:text-sm text-neutral-400 truncate mt-0.5">{st.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Theme Songs (Opening & Ending - Anime Only) */}
                {isAnime && (data.openings?.length > 0 || data.endings?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data.openings?.length > 0 && (
                      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121620] p-5 shadow-md">
                        <h3 className="text-base font-bold tracking-tight text-white border-b border-white/10 pb-3">
                          Opening Theme
                        </h3>
                        <div className="space-y-2 pt-1">
                          {data.openings.slice(0, 3).map((op, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#151924] p-3 text-xs"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6D4AFF]/20 text-[#7C5CFF]">
                                  <Play size={12} className="fill-[#7C5CFF] ml-0.5" />
                                </div>
                                <div className="truncate">
                                  <p className="font-semibold text-white truncate">&quot;{op.title}&quot;</p>
                                  <p className="text-neutral-400 truncate mt-0.5">by {op.artist}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.endings?.length > 0 && (
                      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121620] p-5 shadow-md">
                        <h3 className="text-base font-bold tracking-tight text-white border-b border-white/10 pb-3">
                          Ending Theme
                        </h3>
                        <div className="space-y-2 pt-1">
                          {data.endings.slice(0, 3).map((ed, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#151924] p-3 text-xs"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
                                  <Play size={12} className="fill-emerald-400 ml-0.5" />
                                </div>
                                <div className="truncate">
                                  <p className="font-semibold text-white truncate">&quot;{ed.title}&quot;</p>
                                  <p className="text-neutral-400 truncate mt-0.5">by {ed.artist}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DetailPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#0A0D14]">
            <p className="text-base text-neutral-400 animate-pulse">Memuat data katalog...</p>
          </div>
        }
      >
        <DetailContent />
      </Suspense>
    </AuthGuard>
  );
}
