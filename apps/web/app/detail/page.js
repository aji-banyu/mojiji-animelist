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
  ChevronUp,
  CheckCircle2,
  Loader2,
  X,
  Play,
  Users,
  Music,
  UserCheck,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import {
  getCatalogDetailApi,
  getTrackerItemApi,
  addTrackerApi,
} from "@/lib/api";
import { enrichCatalogDetail } from "@/lib/catalogEnricher";

const RATING_OPTIONS = [
  { value: "", label: "★ Beri Rating (Select)" },
  { value: "10", label: "★ (10) Masterpiece" },
  { value: "9", label: "★ (9) Great" },
  { value: "8", label: "★ (8) Very Good" },
  { value: "7", label: "★ (7) Good" },
  { value: "6", label: "★ (6) Fine" },
  { value: "5", label: "★ (5) Average" },
  { value: "4", label: "★ (4) Bad" },
  { value: "3", label: "★ (3) Very Bad" },
  { value: "2", label: "★ (2) Horrible" },
  { value: "1", label: "★ (1) Appalling" },
];

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
            setError(
              "Batas kuota permintaan ke penyedia katalog tercapai. Harap tunggu beberapa detik lalu coba lagi."
            );
          } else if (
            err?.isOffline ||
            err?.status === 503 ||
            err?.error?.code === "SERVER_OFFLINE"
          ) {
            setError(
              "Tidak dapat terhubung ke server Catalog. Pastikan service API Gateway dan Docker backend aktif."
            );
          } else {
            setError(err?.error?.message || "Terjadi kesalahan saat mengambil detail anime/manga.");
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

  return (
    <div
      style={{
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
      className="relative min-h-[calc(100vh-3.5rem)] bg-[#0A0D14] px-4 py-8 text-neutral-100 sm:px-6 lg:px-8 font-sans font-normal"
    >
      {/* Toast Notification Floating Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-base font-semibold shadow-2xl backdrop-blur-md transition-all ${
            toast.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/95 text-emerald-200"
              : toast.type === "info"
              ? "border-blue-500/40 bg-blue-950/95 text-blue-200"
              : "border-red-500/40 bg-red-950/95 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={20} className="shrink-0" />
          )}
          <span className="max-w-sm">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 rounded-lg p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-7">
        {/* Tombol Navigasi Kembali */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#121620] px-5 py-2.5 text-sm font-bold text-neutral-200 shadow-sm transition-all hover:border-[#FF4655]/40 hover:bg-[#181D2A] hover:text-white active:scale-95"
          >
            <ArrowLeft size={17} />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        {/* === KONDISI 1: Loading Skeleton Shimmer === */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-3 space-y-4">
              <div className="aspect-[3/4] w-full rounded-2xl bg-neutral-800/60 border border-white/10" />
              <div className="h-48 w-full rounded-xl bg-neutral-800/40" />
            </div>
            <div className="lg:col-span-9 space-y-6">
              <div className="h-14 w-2/3 rounded-lg bg-neutral-800/70" />
              <div className="h-36 w-full rounded-2xl bg-neutral-800/50" />
              <div className="h-16 w-full rounded-xl bg-neutral-800/40" />
              <div className="h-52 w-full rounded-xl bg-neutral-800/40" />
            </div>
          </div>
        )}

        {/* === KONDISI 2: 404 Not Found === */}
        {!isLoading && isNotFound && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#121620] px-6 py-20 text-center shadow-xl">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              <SearchX size={38} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">Item Katalog Tidak Ditemukan</h2>
            <p className="mt-2.5 max-w-md text-base leading-relaxed text-neutral-400">
              Kami tidak dapat menemukan data untuk {type} dengan ID{" "}
              <strong className="text-white">#{id}</strong> pada sistem database Catalog.
            </p>
            <div className="mt-7">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF4655] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#e03d4a] active:scale-95"
              >
                <ArrowLeft size={17} />
                <span>Cari Judul Lain di Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        {/* === KONDISI 3: Upstream Error === */}
        {!isLoading && !isNotFound && error && (
          <div className="flex items-start gap-4 rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-base text-red-200 shadow-xl">
            <AlertCircle size={26} className="mt-0.5 shrink-0 text-red-400" />
            <div className="flex-1 space-y-1.5">
              <h3 className="text-lg font-bold text-white">Gagal Memuat Detail</h3>
              <p className="text-sm sm:text-base text-red-300/90 leading-relaxed">{error}</p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-red-500/20 px-5 py-2 text-sm font-bold text-red-200 transition-colors hover:bg-red-500/30 cursor-pointer"
                >
                  Muat Ulang Halaman
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === KONDISI 4: Data Berhasil Dimuat === */}
        {!isLoading && !isNotFound && !error && data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ============================================================== */}
            {/* KOLOM KIRI (SIDEBAR): Gambar 1 - Poster, Info, & Statistics   */}
            {/* ============================================================== */}
            <div className="lg:col-span-3 space-y-6">
              {/* Poster Card */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#121620] shadow-2xl">
                {poster ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={poster}
                    alt={data.title || "Poster"}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-600">
                    {isAnime ? <Film size={60} /> : <BookOpen size={60} />}
                  </div>
                )}
              </div>

              {/* Sidebar Content Card */}
              <div className="rounded-2xl border border-white/10 bg-[#121620] p-5 space-y-6 shadow-lg">
                {/* 1. Alternative Titles */}
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight border-b border-white/10 pb-2.5 mb-3.5">
                    Alternative Titles
                  </h3>
                  <div className="space-y-2.5 text-sm sm:text-base text-neutral-300">
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

                {/* 2. Information */}
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight border-b border-white/10 pb-2.5 mb-3.5">
                    Information
                  </h3>
                  <div className="space-y-3 text-sm sm:text-base text-neutral-300">
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

                    <p>
                      <span className="font-semibold text-neutral-400">Status:</span>{" "}
                      <span className="text-white font-semibold">
                        {data.information?.status || data.status || "-"}
                      </span>
                    </p>

                    {isAnime ? (
                      <>
                        <p>
                          <span className="font-semibold text-neutral-400">Aired:</span>{" "}
                          <span className="text-neutral-100">{data.information?.aired || "-"}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-neutral-400">Premiered:</span>{" "}
                          <span className="text-blue-400 font-bold">
                            {data.information?.premiered || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-neutral-400">Broadcast:</span>{" "}
                          <span className="text-neutral-100">{data.information?.broadcast || "-"}</span>
                        </p>
                        <p className="leading-relaxed">
                          <span className="font-semibold text-neutral-400">Producers:</span>{" "}
                          <span className="text-neutral-100">
                            {data.information?.producers?.join(", ") || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-neutral-400">Licensors:</span>{" "}
                          <span className="text-neutral-100">
                            {data.information?.licensors?.join(", ") || "None found"}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-neutral-400">Studios:</span>{" "}
                          <span className="text-blue-400 font-bold">
                            {data.information?.studios?.join(", ") || "-"}
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <span className="font-semibold text-neutral-400">Published:</span>{" "}
                          <span className="text-neutral-100">{data.information?.published || "-"}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-neutral-400">Authors:</span>{" "}
                          <span className="text-blue-400 font-bold">
                            {data.information?.authors?.join(", ") || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-neutral-400">Serialization:</span>{" "}
                          <span className="text-neutral-100">
                            {data.information?.serialization?.join(", ") || "-"}
                          </span>
                        </p>
                      </>
                    )}

                    <p>
                      <span className="font-semibold text-neutral-400">Source:</span>{" "}
                      <span className="text-neutral-100">{data.information?.source || "Original"}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-neutral-400">Genres:</span>{" "}
                      <span className="text-blue-400 font-bold">
                        {data.information?.genres?.join(", ") || "-"}
                      </span>
                    </p>

                    <p>
                      <span className="font-semibold text-neutral-400">Themes:</span>{" "}
                      <span className="text-neutral-100">{data.information?.themes?.join(", ") || "-"}</span>
                    </p>

                    {isAnime && (
                      <>
                        <p>
                          <span className="font-semibold text-neutral-400">Duration:</span>{" "}
                          <span className="text-neutral-100">
                            {data.information?.duration || "24 min. per ep."}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-neutral-400">Rating:</span>{" "}
                          <span className="text-neutral-100">
                            {data.information?.rating || "PG-13"}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Statistics */}
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight border-b border-white/10 pb-2.5 mb-3.5">
                    Statistics
                  </h3>
                  <div className="space-y-3 text-sm sm:text-base text-neutral-300">
                    <p>
                      <span className="font-semibold text-neutral-400">Score:</span>{" "}
                      <strong className="text-white text-lg">{data.statistics?.score || "-"}</strong>{" "}
                      <span className="text-xs text-neutral-400">
                        (scored by {data.statistics?.scoredBy} users)
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-400">Ranked:</span>{" "}
                      <strong className="text-white font-bold">{data.statistics?.ranked || "-"}</strong>
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-400">Popularity:</span>{" "}
                      <strong className="text-white font-bold">{data.statistics?.popularity || "-"}</strong>
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-400">Members:</span>{" "}
                      <span className="text-white font-medium">{data.statistics?.members || "-"}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-400">Favorites:</span>{" "}
                      <span className="text-white font-medium">{data.statistics?.favorites || "-"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* KOLOM KANAN (KONTEN UTAMA): Header, Action Bar, Sinopsis     */}
            {/* ============================================================== */}
            <div className="lg:col-span-9 space-y-7">
              {/* Judul & Badge Tipe */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-[#FF4655]/20 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FF4655] border border-[#FF4655]/30">
                    {isAnime ? "Anime" : "Manga"}
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-neutral-200 border border-white/15">
                    {data.status || "Unknown Status"}
                  </span>
                  <span className="rounded-full bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-neutral-400 border border-white/10">
                    MAL ID: #{malId}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {data.title || "Untitled"}
                </h1>
              </div>

              {/* ========================================================== */}
              {/* SCORE & METRICS CARD (LEGA, BERSIH, TANPA PV TRAILER)      */}
              {/* ========================================================== */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121620] shadow-xl">
                {/* Score & Metrics Bar */}
                <div className="p-6 sm:p-7 bg-[#151924]">
                  <div className="flex flex-wrap items-center gap-8 sm:gap-10">
                    {/* Big Score Box */}
                    <div className="flex items-center gap-4 pr-8 border-r border-white/15">
                      <div className="space-y-1.5">
                        <span className="inline-block rounded-md bg-blue-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                          SCORE
                        </span>
                        <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                          {data.statistics?.score || "-"}
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-400 font-medium">
                          {data.statistics?.scoredBy} users
                        </div>
                      </div>
                    </div>

                    {/* Rank, Popularity, Members & Sub-info */}
                    <div className="space-y-3.5 flex-1 min-w-[280px]">
                      <div className="flex flex-wrap items-center gap-5 sm:gap-7 text-lg sm:text-xl font-bold">
                        <span className="text-neutral-300">
                          Ranked <strong className="text-white">{data.statistics?.ranked || "-"}</strong>
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-300">
                          Popularity <strong className="text-white">{data.statistics?.popularity || "-"}</strong>
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-300">
                          Members <strong className="text-white">{data.statistics?.members || "-"}</strong>
                        </span>
                      </div>

                      {/* Sub-info: Season | Type | Studio/Author */}
                      <div className="flex items-center gap-3 text-sm sm:text-base text-neutral-300 font-medium">
                        {isAnime ? (
                          <>
                            <span className="text-blue-400 font-bold">
                              {data.information?.premiered || "TBA"}
                            </span>
                            <span className="text-neutral-500">|</span>
                            <span className="text-white font-semibold">{data.information?.type || "TV"}</span>
                            <span className="text-neutral-500">|</span>
                            <span className="text-neutral-200">
                              {data.information?.studios?.[0] || "Unknown Studio"}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-blue-400 font-bold">Manga</span>
                            <span className="text-neutral-500">|</span>
                            <span className="text-white font-semibold">
                              {data.information?.serialization?.[0] || "Serial"}
                            </span>
                            <span className="text-neutral-500">|</span>
                            <span className="text-neutral-200">
                              {data.information?.authors?.[0] || "Author"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Bar (Hanya Tambah ke Tracker & Rating Bintang) */}
                <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6 bg-[#121620] border-t border-white/10">
                  {/* 1. Tombol Tambah ke Tracker */}
                  <button
                    type="button"
                    onClick={handleToggleTracker}
                    disabled={isSavingTracker}
                    className={`flex items-center gap-2.5 rounded-xl px-6 py-3 text-base font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                      trackedItem
                        ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30"
                        : "bg-blue-600 text-white hover:bg-blue-500"
                    }`}
                  >
                    {isSavingTracker ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : trackedItem ? (
                      <>
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        <span>Sudah di Tracker</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle size={18} />
                        <span>+ Tambah ke Tracker</span>
                      </>
                    )}
                  </button>

                  {/* 2. Star Rating Select */}
                  <div className="relative flex items-center min-w-[220px]">
                    <div className="absolute left-4 text-amber-400 pointer-events-none">
                      <Star size={18} className={userRating ? "fill-amber-400" : ""} />
                    </div>
                    <select
                      value={userRating}
                      onChange={(e) => handleRatingChange(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/15 bg-[#181D2A] pl-11 pr-10 py-3 text-base font-semibold text-white shadow-inner focus:border-amber-400 focus:outline-none transition-all cursor-pointer"
                    >
                      {RATING_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#181D2A] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-neutral-400">
                      <ChevronDown size={17} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================== */}
              {/* SYNOPSIS & BACKGROUND                                      */}
              {/* ========================================================== */}
              <div className="space-y-6 rounded-2xl border border-white/10 bg-[#121620] p-6 sm:p-8 shadow-md">
                {/* Synopsis */}
                {(() => {
                  const synopsisText = (data.synopsis || "Sinopsis belum tersedia untuk judul ini.")
                    .replace(/\[Written by MAL Rewrite\]/gi, "")
                    .replace(/\(Source:[^)]+\)/gi, "")
                    .trim();
                  const isLongSynopsis = synopsisText.length > 250;

                  return (
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white border-b border-white/10 pb-3 mb-4">
                        Synopsis
                      </h2>

                      {/* Kontainer Teks Sinopsis dengan Clamp & Efek Fade */}
                      <div className="relative">
                        <p
                          className={`text-base sm:text-lg leading-relaxed text-neutral-200 whitespace-pre-line font-normal transition-all duration-300 ${
                            !isSynopsisExpanded && isLongSynopsis
                              ? "line-clamp-3 sm:line-clamp-4"
                              : ""
                          }`}
                        >
                          {synopsisText}
                        </p>

                        {/* Efek Gradasi Fade-Out Halus saat Sinopsis Tertutup */}
                        {!isSynopsisExpanded && isLongSynopsis && (
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#121620] via-[#121620]/80 to-transparent" />
                        )}
                      </div>

                      {/* Tombol Interaktif "Selengkapnya" / "Sembunyikan" */}
                      {isLongSynopsis && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setIsSynopsisExpanded((prev) => !prev)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-colors hover:border-[#FF4655]/40 hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            {isSynopsisExpanded ? (
                              <>
                                <span>Sembunyikan</span>
                                <ChevronUp size={14} className="text-[#FF4655]" />
                              </>
                            ) : (
                              <>
                                <span>Selengkapnya</span>
                                <ChevronDown size={14} className="text-[#FF4655]" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Background */}
                <div className="pt-5 border-t border-white/10">
                  <h3 className="text-lg font-bold tracking-tight text-white mb-3">Background</h3>
                  <p className="text-base sm:text-lg leading-relaxed text-neutral-300 font-normal">
                    {data.background || "Belum ada informasi latar belakang khusus untuk judul ini."}
                  </p>
                </div>
              </div>

              {/* ========================================================== */}
              {/* CHARACTERS & VOICE ACTORS                                  */}
              {/* ========================================================== */}
              <div className="space-y-5 rounded-2xl border border-white/10 bg-[#121620] p-6 sm:p-8 shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    {isAnime ? "Characters & Voice Actors" : "Characters"}
                  </h2>
                  <span className="text-sm sm:text-base text-blue-400 font-semibold hover:underline cursor-pointer">
                    More characters
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {data.characters?.map((char, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-[#151924] p-3.5 transition-colors hover:border-white/20"
                    >
                      {/* Sisi Karakter (Kiri) */}
                      <div className="flex items-center gap-3.5">
                        <div className="h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-neutral-800 border border-white/10">
                          {char.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={char.image}
                              alt={char.name}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-500">
                              <Users size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-bold text-white leading-snug">{char.name}</p>
                          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">{char.role}</p>
                        </div>
                      </div>

                      {/* Sisi Voice Actor (Kanan) - Khusus Anime */}
                      {isAnime && char.voiceActor && (
                        <div className="flex items-center gap-3.5 text-right pl-2">
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-blue-400 leading-snug">
                              {char.voiceActor.name}
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                              {char.voiceActor.language}
                            </p>
                          </div>
                          <div className="h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-neutral-800 border border-white/10">
                            {char.voiceActor.image ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={char.voiceActor.image}
                                alt={char.voiceActor.name}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-neutral-500">
                                <UserCheck size={20} />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ========================================================== */}
              {/* STAFF                                                      */}
              {/* ========================================================== */}
              <div className="space-y-5 rounded-2xl border border-white/10 bg-[#121620] p-6 sm:p-8 shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <h2 className="text-xl font-bold tracking-tight text-white">Staff</h2>
                  <span className="text-sm sm:text-base text-blue-400 font-semibold hover:underline cursor-pointer">
                    More staff
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  {data.staff?.map((st, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-[#151924] p-3 transition-colors hover:border-white/20"
                    >
                      <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-800 border border-white/10">
                        {st.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={st.image}
                            alt={st.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-500 text-sm font-bold">
                            ?
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm sm:text-base font-bold text-white truncate">{st.name}</p>
                        <p className="text-xs sm:text-sm text-neutral-400 truncate mt-0.5">{st.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ========================================================== */}
              {/* THEME SONGS (OPENING & ENDING - ANIME ONLY)                */}
              {/* ========================================================== */}
              {isAnime && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Opening Theme */}
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-[#121620] p-6 shadow-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                      <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2.5">
                        <Music size={19} className="text-blue-400" />
                        <span>Opening Theme</span>
                      </h2>
                      <span className="text-xs text-neutral-400">Edit</span>
                    </div>

                    <div className="space-y-3 pt-1">
                      {data.openings?.map((op, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#151924] p-3.5 text-sm sm:text-base"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                              <Play size={14} className="fill-blue-400 ml-0.5" />
                            </div>
                            <div className="truncate">
                              <p className="font-semibold text-white truncate">&quot;{op.title}&quot;</p>
                              <p className="text-xs sm:text-sm text-neutral-400 truncate mt-0.5">by {op.artist}</p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded bg-white/10 px-2 py-0.5 text-xs font-bold text-neutral-300">
                            MV
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ending Theme */}
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-[#121620] p-6 shadow-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                      <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2.5">
                        <Music size={19} className="text-emerald-400" />
                        <span>Ending Theme</span>
                      </h2>
                      <span className="text-xs text-neutral-400">Edit</span>
                    </div>

                    <div className="space-y-3 pt-1">
                      {data.endings?.map((ed, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#151924] p-3.5 text-sm sm:text-base"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                              <Play size={14} className="fill-emerald-400 ml-0.5" />
                            </div>
                            <div className="truncate">
                              <p className="font-semibold text-white truncate">&quot;{ed.title}&quot;</p>
                              <p className="text-xs sm:text-sm text-neutral-400 truncate mt-0.5">by {ed.artist}</p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded bg-white/10 px-2 py-0.5 text-xs font-bold text-neutral-300">
                            MV
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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
