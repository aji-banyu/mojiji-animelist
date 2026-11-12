"use client";

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
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
  CheckCircle2,
  X,
  Search,
  RotateCcw,
  WifiOff,
  Home,
  Bookmark,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import DetailInfoSidebar from "@/components/detail/DetailInfoSidebar";
import DetailMediaSections, {
  DetailSynopsis,
} from "@/components/detail/DetailMediaSections";
import { Button } from "@/components/ui/button";
import RatingBadge from "@/components/ui/RatingBadge";
import Tag from "@/components/ui/Tag";
import { getCatalogDetailApi } from "@/lib/api";
import {
  enrichCatalogDetail,
  HERO_TRAILER_BANNERS,
  fetchAniListMediaDetails,
  fetchTenraiDetailSupplement,
  fetchTenraiCreditsSupplement,
  mergeCatalogDetailSources,
} from "@/lib/catalogEnricher";
import { cn } from "@/lib/utils";
import useTrackerStore, { getTrackerCompositeKey } from "@/store/trackerStore";

const DETAIL_CACHE_TTL_MS = 5 * 60 * 1000;
const DETAIL_CACHE_MAX_ENTRIES = 30;
const detailCache = new Map();

function getCachedDetail(type, id) {
  if (!id) return null;
  const key = `${String(type || "anime").toLowerCase()}:${String(id)}`;
  const entry = detailCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > DETAIL_CACHE_TTL_MS) {
    detailCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedDetail(type, id, payload) {
  if (!id || !payload) return;
  const key = `${String(type || "anime").toLowerCase()}:${String(id)}`;
  if (detailCache.has(key)) {
    detailCache.delete(key);
  }
  detailCache.set(key, { data: payload, fetchedAt: Date.now() });
  if (detailCache.size > DETAIL_CACHE_MAX_ENTRIES) {
    const oldestKey = detailCache.keys().next().value;
    detailCache.delete(oldestKey);
  }
}

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
 * DetailContent — Menampilkan detail katalog dengan banner horizontal parallax
 * dan sheet konten utama yang selaras dengan halaman Beranda, Jelajah, dan Tracker.
 */
function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "anime"; // "anime" | "manga"
  const id = searchParams.get("id"); // MAL ID

  const initialCached = id ? getCachedDetail(type, id) : null;
  const [data, setData] = useState(initialCached);
  const [isLoading, setIsLoading] = useState(!initialCached);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  // State Pelacakan Tracker terpusat dari store
  const trackerItems = useTrackerStore((state) => state.items);
  const checkTrackerItem = useTrackerStore((state) => state.checkTrackerItem);
  const addTrackerItem = useTrackerStore((state) => state.addTrackerItem);

  const trackedItem = useMemo(() => {
    if (!id) return null;
    const targetKey = getTrackerCompositeKey(type, id);
    return (
      trackerItems.find(
        (it) =>
          getTrackerCompositeKey(
            it?.mediaType || it?.media_type,
            it?.malId ?? it?.mal_id
          ) === targetKey
      ) || null
    );
  }, [trackerItems, type, id]);

  const [isSavingTracker, setIsSavingTracker] = useState(false);
  const [toast, setToast] = useState(null);

  // State Banner 16:9 Fallback Index & Parallax Layer Ref
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerLayerRef = useRef(null);

  // State Deteksi Error Pemutar Trailer (YouTube Embed)
  const [trailerHasError, setTrailerHasError] = useState(false);

  const isAnime = type === "anime";
  const itemKey = `${type}:${id || ""}`;

  // Reset status banner & trailer saat berpindah judul
  useEffect(() => {
    setTrailerHasError(false);
    setBannerIdx(0);
  }, [type, id]);

  // Efek parallax halus: background banner tetap tertahan & sedikit bergeser ke bawah saat scroll
  useEffect(() => {
    let rafId = null;

    const updateParallax = () => {
      rafId = null;
      if (!bannerLayerRef.current) return;
      const shift = Math.min(window.scrollY * 0.14, 56);
      bannerLayerRef.current.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [isLoading, data]);

  // Pre-check ketersediaan embed video YouTube via oEmbed API publik
  useEffect(() => {
    const youtubeId = data?.trailer?.youtubeId;
    setTrailerHasError(false);
    if (!isAnime || !youtubeId) return;

    let isCancelled = false;

    fetch(
      `https://www.youtube-nocookie.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
    )
      .then((res) => {
        if (!isCancelled && !res.ok) {
          setTrailerHasError(true);
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [isAnime, data?.trailer?.youtubeId]);

  // Listener event postMessage dari YouTube IFrame Player
  useEffect(() => {
    const handleYouTubeMessage = (event) => {
      try {
        const origin = event.origin || "";
        if (
          !origin.includes("youtube.com") &&
          !origin.includes("youtube-nocookie.com")
        ) {
          return;
        }

        let payload = event.data;
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload);
          } catch {
            return;
          }
        }

        if (
          payload &&
          (payload.event === "onError" ||
            payload.event === "onPlayerError" ||
            (payload.event === "infoDelivery" && payload.info?.errorCode))
        ) {
          setTrailerHasError(true);
        }
      } catch {}
    };

    window.addEventListener("message", handleYouTubeMessage);
    return () => window.removeEventListener("message", handleYouTubeMessage);
  }, []);

  // Auto-dismiss toast setelah 4 detik
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Pastikan halaman detail selalu mulai dari posisi scroll paling atas
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const raf = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [type, id, isLoading]);

  // Ambil detail katalog (gunakan cache 5 menit jika tersedia) dan cek status tracker store
  useEffect(() => {
    if (!id) {
      setError("Parameter ID katalog tidak ditemukan pada URL.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    checkTrackerItem(type, id).catch(() => {});

    const cached = getCachedDetail(type, id);
    if (cached) {
      setData(cached);
      setError(null);
      setIsNotFound(false);
      setIsLoading(false);
      setBannerIdx(0);
      return () => {
        isMounted = false;
        controller.abort();
      };
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      try {
        const anilistPromise = fetchAniListMediaDetails(id, type, {
          signal: controller.signal,
        }).catch((err) => {
          if (controller.signal.aborted || err?.name === "AbortError") {
            throw err;
          }
          return null;
        });

        const response = await getCatalogDetailApi(type, id, controller.signal);

        if (!isMounted || controller.signal.aborted) return;

        if (response && response.success && response.data) {
          const rawDetail = response.data;
          const hasDateField = isAnime
            ? Boolean(rawDetail.aired)
            : Boolean(rawDetail.published);
          const hasCoreStats =
            rawDetail.rank != null ||
            rawDetail.popularity != null ||
            rawDetail.members != null ||
            rawDetail.favorites != null;
          const hasBackendInformation = Boolean(
            Object.prototype.hasOwnProperty.call(rawDetail, "rank") &&
              Object.prototype.hasOwnProperty.call(rawDetail, "popularity") &&
              Object.prototype.hasOwnProperty.call(
                rawDetail,
                isAnime ? "aired" : "published"
              ) &&
              (hasCoreStats || hasDateField)
          );

          // Bila backend mengirim skema ringkas/parsial, segera panggil Tenrai /full paralel dengan AniList
          const tenraiMainPromise = !hasBackendInformation
            ? fetchTenraiDetailSupplement(type, id, {
                signal: controller.signal,
                includeCharacters: false,
                includeStaff: false,
              }).catch((err) => {
                if (controller.signal.aborted || err?.name === "AbortError") {
                  throw err;
                }
                return null;
              })
            : Promise.resolve(null);

          const [anilistRes, tenraiRes] = await Promise.allSettled([
            anilistPromise,
            tenraiMainPromise,
          ]);

          if (!isMounted || controller.signal.aborted) return;

          const anilist =
            anilistRes.status === "fulfilled" ? anilistRes.value : null;
          let tenraiSupplement =
            tenraiRes.status === "fulfilled" ? tenraiRes.value : null;

          // Ambil karakter/staf dari Tenrai hanya jika baik backend maupun AniList belum menyediakannya
          const missingCharacters =
            (!Array.isArray(rawDetail.characters) ||
              rawDetail.characters.length === 0) &&
            (!Array.isArray(anilist?.characters) ||
              anilist.characters.length === 0);
          const missingStaff =
            isAnime &&
            (!Array.isArray(rawDetail.staff) || rawDetail.staff.length === 0) &&
            (!Array.isArray(anilist?.staff) || anilist.staff.length === 0);

          if (missingCharacters || missingStaff) {
            const credits = await fetchTenraiCreditsSupplement(type, id, {
              signal: controller.signal,
              includeCharacters: missingCharacters,
              includeStaff: missingStaff,
            }).catch((err) => {
              if (controller.signal.aborted || err?.name === "AbortError") {
                throw err;
              }
              return { characters: [], staff: [] };
            });

            if (!isMounted || controller.signal.aborted) return;

            tenraiSupplement = {
              ...(tenraiSupplement || {}),
              characters:
                credits.characters.length > 0
                  ? credits.characters
                  : tenraiSupplement?.characters || [],
              staff:
                credits.staff.length > 0
                  ? credits.staff
                  : tenraiSupplement?.staff || [],
            };
          }

          const mergedRaw = mergeCatalogDetailSources(
            rawDetail,
            tenraiSupplement,
            anilist
          );
          const enriched = enrichCatalogDetail(mergedRaw, type, id);
          const numericMalId = Number(id || enriched.malId || enriched.id);

          const hydratedPayload = {
            ...enriched,
            anilistBanner: anilist?.bannerImage || null,
            anilistTrailerThumb: anilist?.trailerThumbnail || null,
            hasHeroPresetBanner: Boolean(
              isAnime && HERO_TRAILER_BANNERS[numericMalId]
            ),
          };

          const hasCacheableDetails = Boolean(
            hydratedPayload.statistics?.ranked ||
              hydratedPayload.statistics?.popularity ||
              hydratedPayload.statistics?.members ||
              hydratedPayload.information?.aired ||
              hydratedPayload.information?.published
          );
          if (hasCacheableDetails) {
            setCachedDetail(type, id, hydratedPayload);
          }

          setData(hydratedPayload);
          setBannerIdx(0);
        } else {
          setIsNotFound(true);
        }
      } catch (err) {
        if (
          controller.signal.aborted ||
          err?.isCanceled ||
          err?.name === "AbortError" ||
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED"
        ) {
          return;
        }
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
        if (isMounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [type, id, isAnime, checkTrackerItem]);

  // Handler tambah judul ke tracker terpusat via store
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
    const resolvedPoster = data?.image || data?.imageUrl || data?.image_url || "";
    const resolvedTotal = isAnime
      ? data?.information?.episodes ?? data?.totalEpisodes ?? 0
      : data?.information?.chapters ?? data?.totalChapters ?? 0;

    try {
      const result = await addTrackerItem({
        type,
        malId: id,
        status: defaultStatus,
        progress: 0,
        metadata: {
          title: data?.title || "Untitled",
          imageUrl: resolvedPoster,
          total: Number(resolvedTotal) || 0,
        },
      });

      if (result?.alreadyExists) {
        setToast({
          type: "info",
          message: "Judul ini sudah tersimpan di daftar tracker Anda.",
        });
      } else {
        setToast({
          type: "success",
          message: `Berhasil menambahkan "${data?.title || "Judul"}" ke tracker!`,
        });
      }
    } catch (err) {
      if (err?.status === 401 || err?.error?.code === "UNAUTHORIZED") {
        router.push("/login/");
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

  const poster = data?.image || data?.imageUrl || data?.image_url;
  const malId = data?.malId || data?.mal_id || data?.id || id;
  const totalCount = isAnime
    ? data?.information?.episodes ?? data?.totalEpisodes ?? null
    : data?.information?.chapters ?? data?.totalChapters ?? null;

  // Susun kandidat URL banner horizontal (Hero Beranda -> AniList Banner Horizontal -> Trailer FHD -> Poster)
  const bannerCandidates = useMemo(() => {
    const heroMatched = isAnime ? HERO_TRAILER_BANNERS[Number(malId)] : null;
    const ytId = data?.trailer?.youtubeId;
    const raw = [
      heroMatched,
      data?.anilistBanner,
      data?.bannerImage,
      data?.trailer?.images?.maximum_image_url,
      ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null,
      data?.anilistTrailerThumb,
      ytId ? `https://img.youtube.com/vi/${ytId}/hq720.jpg` : null,
      ytId ? `https://img.youtube.com/vi/${ytId}/sddefault.jpg` : null,
      data?.trailer?.images?.large_image_url,
      data?.trailer?.image,
      poster,
    ].filter(Boolean);

    return Array.from(new Set(raw));
  }, [data, poster, isAnime, malId]);

  const activeBannerUrl = bannerCandidates[bannerIdx] || poster || null;
  const isUsingPosterFallback = Boolean(
    activeBannerUrl && poster && activeBannerUrl === poster
  );

  const handleBannerError = () => {
    setBannerIdx((prev) =>
      prev + 1 < bannerCandidates.length ? prev + 1 : prev
    );
  };

  const handleBannerLoad = (e) => {
    const img = e.currentTarget;
    // YouTube mengembalikan thumbnail placeholder 120x90 jika resolusi maxresdefault tidak tersedia
    const isYoutubeUrl =
      activeBannerUrl?.includes("img.youtube.com") ||
      activeBannerUrl?.includes("i.ytimg.com");
    if (
      isYoutubeUrl &&
      img.naturalWidth <= 120 &&
      bannerIdx + 1 < bannerCandidates.length
    ) {
      setBannerIdx((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/explore/");
    }
  };

  const genres = Array.isArray(data?.information?.genres) ? data.information.genres : [];
  const studioOrAuthor = isAnime
    ? data?.information?.studios?.length > 0
      ? data.information.studios.join(", ")
      : "-"
    : data?.information?.authors?.length > 0
    ? data.information.authors.join(", ")
    : "-";
  const formatType = data?.information?.type || "-";

  return (
    <div className="relative min-h-screen bg-bg text-text font-sans font-normal selection:bg-accent/30 selection:text-text transition-colors duration-200">
      {/* Toast Notification Floating Feedback (Selaras Beranda & Tracker) */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border/60 bg-surface px-4 py-3 text-xs sm:text-sm font-semibold text-text shadow-sm backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={17} className="text-secondary shrink-0" />
          ) : toast.type === "info" ? (
            <AlertCircle size={17} className="shrink-0 text-accent" />
          ) : (
            <AlertCircle size={17} className="shrink-0 text-destructive" />
          )}
          <span className="max-w-sm">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Tutup notifikasi"
            className="ml-1 rounded-lg p-1 text-text-2 hover:bg-surface-2 hover:text-text transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* === KONDISI 1: Loading Skeleton Shimmer === */}
      {isLoading && (
        <div className="animate-pulse">
          <div className="relative h-[285px] sm:h-[340px] md:h-[385px] lg:h-[415px] w-full bg-surface-2" />
          <div className="relative z-10 -mt-12 sm:-mt-14 md:-mt-16 rounded-t-2xl sm:rounded-t-3xl border-t border-border/70 bg-bg pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-5 sm:gap-7">
                <div className="-mt-24 sm:-mt-28 md:-mt-32 h-[200px] w-[135px] sm:h-[234px] sm:w-[158px] md:h-[262px] md:w-[176px] rounded-xl bg-surface shrink-0 border border-border shadow-xl" />
                <div className="space-y-3 w-full md:w-2/3 pt-2 md:pb-2">
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-surface-2" />
                    <div className="h-6 w-24 rounded-full bg-surface-2" />
                  </div>
                  <div className="h-9 w-3/4 rounded-xl bg-surface border border-border" />
                  <div className="h-5 w-1/4 rounded-lg bg-surface-2" />
                </div>
              </div>
              <div className="h-12 w-52 rounded-xl bg-surface border border-border" />
              <div className="h-28 w-full rounded-2xl bg-surface border border-border" />
            </div>
          </div>
        </div>
      )}

      {/* === KONDISI 2: 404 Not Found === */}
      {!isLoading && isNotFound && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-20 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <SearchX size={32} />
            </div>
            <h2 className="mt-5 text-xl sm:text-2xl font-black text-text tracking-tight font-['Bricolage_Grotesque']">
              Item Katalog Tidak Ditemukan
            </h2>
            <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-text-2">
              Data {type} dengan ID <strong className="text-text">#{id}</strong> tidak ditemukan dalam katalog.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/explore/"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent hover:bg-primary-hover px-5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-95"
              >
                <Search size={15} />
                <span>Jelajahi Katalog Lainnya</span>
              </Link>
              <Link
                href="/home/"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 hover:bg-surface-2-hover hover:border-border-hover px-5 text-xs sm:text-sm font-semibold text-text-2 hover:text-text transition-all active:scale-95"
              >
                <ArrowLeft size={15} />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* === KONDISI 3: Upstream Error === */}
      {!isLoading && !isNotFound && error && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-destructive/30 bg-surface p-5 sm:p-6 text-sm text-text shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/25">
                <WifiOff size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-text tracking-tight font-['Bricolage_Grotesque']">
                  Gagal Memuat Detail Katalog
                </h3>
                <p className="text-xs sm:text-sm text-text-2 leading-relaxed max-w-xl">{error}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={() => window.location.reload()}
                className="bg-destructive hover:bg-destructive-hover shadow-none"
              >
                <RotateCcw size={15} />
                <span>Muat Ulang</span>
              </Button>
              <Link
                href="/explore/"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 hover:bg-surface-2-hover hover:border-border-hover px-4 text-xs sm:text-sm font-semibold text-text-2 hover:text-text transition-all active:scale-95"
              >
                <Search size={15} />
                <span>Ke Jelajah</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* === KONDISI 4: Data Berhasil Dimuat (Sticky 16:9 Parallax Banner + Rising Sheet) === */}
      {!isLoading && !isNotFound && !error && data && (
        <>
          {/* ===== 1. STICKY PARALLAX HERO BANNER (Horizontal FHD) ===== */}
          <div className="sticky top-0 z-0 h-[285px] sm:h-[340px] md:h-[385px] lg:h-[415px] w-full overflow-hidden bg-bg">
            {/* Layer Gambar Parallax — diam tertahan di atas & bergeser lembut ke bawah saat di-scroll */}
            <div
              ref={bannerLayerRef}
              className="absolute inset-0 h-full w-full will-change-transform origin-center"
              style={{ transform: "translate3d(0, 0px, 0) scale(1.08)" }}
            >
              {activeBannerUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activeBannerUrl}
                  alt={`${data.title || "Catalog"} Banner`}
                  referrerPolicy="no-referrer"
                  onLoad={handleBannerLoad}
                  onError={handleBannerError}
                  className={cn(
                    "h-full w-full object-cover object-center select-none transition-opacity duration-500",
                    isUsingPosterFallback && "blur-[3px] opacity-85"
                  )}
                />
              ) : (
                <div className="h-full w-full bg-surface-2" />
              )}
            </div>

            {/* Scrim Atas Halus untuk keterbacaan Header Transparan */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-28"
              style={{
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, var(--bg) 65%, transparent) 0%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* Scrim Bawah Halus memudar ke latar belakang dinamis --bg */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40"
              style={{
                background:
                  "linear-gradient(to top, var(--bg) 0%, color-mix(in srgb, var(--bg) 72%, transparent) 45%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* Tombol Bulat Mengambang (Diposisikan Aman di Bawah Header Transparan 64px) */}
            <div className="pointer-events-none absolute inset-x-0 top-[76px] sm:top-[82px] z-20">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <button
                  type="button"
                  onClick={handleBack}
                  aria-label="Kembali"
                  title="Kembali"
                  className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-surface/85 text-text shadow-md backdrop-blur-md transition-all duration-200 hover:bg-surface hover:border-border-hover hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
                >
                  <ArrowLeft size={18} strokeWidth={2.2} />
                </button>

                <Link
                  href="/home/"
                  aria-label="Beranda"
                  title="Beranda"
                  className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-surface/85 text-text shadow-md backdrop-blur-md transition-all duration-200 hover:bg-surface hover:border-border-hover hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
                >
                  <Home size={18} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>

          {/* ===== 2. ELEMEN INTI PENUTUP BANNER (z-10 solid bg-bg dari Card ke bawah) ===== */}
          <div className="relative z-10 -mt-12 sm:-mt-14 md:-mt-16 rounded-t-2xl sm:rounded-t-3xl border-t border-border/70 bg-bg pt-2 pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
              {/* Header: Cover Poster + Badge & Judul */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-5 sm:gap-7">
                {/* Cover Potret menonjol ke atas menyentuh banner */}
                <div className="relative -mt-24 sm:-mt-28 md:-mt-32 h-[200px] w-[135px] sm:h-[234px] sm:w-[158px] md:h-[262px] md:w-[176px] shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
                  {poster ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={poster}
                      alt={data.title || "Poster"}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover select-none"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-2 text-text-2">
                      {isAnime ? <Film size={44} /> : <BookOpen size={44} />}
                    </div>
                  )}
                </div>

                {/* Judul, RatingBadge & Tags (Selaras Beranda) */}
                <div className="flex flex-1 flex-col text-center md:text-left min-w-0 pt-1 md:pb-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                    {data.statistics?.score ? (
                      <RatingBadge score={data.statistics.score} size="hero" />
                    ) : (
                      <Tag variant="neutral" size="pill" className="gap-1.5 font-semibold">
                        <Star size={12} className="text-text-3" />
                        <span>Belum ada skor</span>
                      </Tag>
                    )}
                    <Tag variant="secondary" size="pill" className="uppercase tracking-wider font-bold">
                      {isAnime ? "Anime" : "Manga"}
                    </Tag>
                    <Tag variant="neutral" size="pill">
                      {data.status || "-"}
                    </Tag>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text tracking-tight leading-[1.15] font-['Bricolage_Grotesque'] line-clamp-2">
                    {data.title || "Untitled"}
                  </h1>
                  <p className="mt-2 text-sm sm:text-base font-medium text-text-2">
                    {data.status || "-"}
                  </p>
                </div>
              </div>

              {/* ===== 3. BARIS AKSI & STATISTIK ===== */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <Button
                    variant={trackedItem ? "secondary" : "primary"}
                    size="lg"
                    loading={isSavingTracker}
                    onClick={handleToggleTracker}
                  >
                    {trackedItem ? (
                      <>
                        <CheckCircle2 size={18} className="text-white" />
                        <span>Sudah di Tracker</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle size={18} />
                        <span>Tambah ke Tracker</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Kartu Mini Statistik Score & Members */}
                <div className="flex items-center justify-center sm:justify-end gap-4 rounded-xl border border-border bg-surface px-4 py-2.5 shadow-sm self-center sm:self-auto">
                  <div
                    className="flex items-center gap-2 cursor-help"
                    title={`Score: ${data.statistics?.score || "-"}`}
                  >
                    <Star size={18} className="fill-detail-star text-detail-star shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-text tabular-nums">
                      {data.statistics?.score || "-"}
                    </span>
                  </div>
                  <div className="h-5 w-[1px] bg-border" aria-hidden="true" />
                  <div
                    className="flex items-center gap-2 cursor-help"
                    title={`Members: ${data.statistics?.members || "-"}`}
                  >
                    <Bookmark size={18} className="fill-detail-members text-detail-members shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-text tabular-nums">
                      {formatStatNumber(data.statistics?.members) || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ===== 4. SINOPSIS ===== */}
              <DetailSynopsis key={itemKey} synopsis={data.synopsis} />

              {/* ===== 5. METADATA CHIPS (Reusable Tag) ===== */}
              <section aria-label="Metadata" className="w-full space-y-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  {/* Genre */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-text-3">
                      Genre
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {genres.length > 0 ? (
                        genres.map((g) => (
                          <Link key={g} href={`/explore/?genre=${encodeURIComponent(g)}`}>
                            <Tag
                              variant="secondary"
                              size="default"
                              className="px-3 py-1.5 hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                            >
                              {g}
                            </Tag>
                          </Link>
                        ))
                      ) : (
                        <span className="text-xs text-text-2">-</span>
                      )}
                    </div>
                  </div>

                  <div className="hidden lg:block h-6 w-[1px] bg-border" aria-hidden="true" />

                  {/* Studio / Author */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-text-3">
                      {isAnime ? "Studio" : "Author"}
                    </span>
                    <Tag variant="filter" size="default" className="px-3 py-1.5 text-text">
                      {studioOrAuthor}
                    </Tag>
                  </div>

                  <div className="hidden lg:block h-6 w-[1px] bg-border" aria-hidden="true" />

                  {/* Format */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-text-3">
                      Format
                    </span>
                    <Tag variant="filter" size="default" className="px-3 py-1.5 text-text">
                      {formatType}
                    </Tag>
                  </div>

                  <div className="hidden lg:block h-6 w-[1px] bg-border" aria-hidden="true" />

                  {/* Episodes / Chapters */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-text-3">
                      {isAnime ? "Episode" : "Chapter"}
                    </span>
                    <Tag variant="filter" size="default" className="px-3 py-1.5 text-text tabular-nums">
                      {totalCount !== null ? `${totalCount} ${isAnime ? "Eps" : "Ch"}` : "-"}
                    </Tag>
                  </div>
                </div>
              </section>

              {/* ===== 6. DETAIL MENDALAM: CHARACTERS, STAFF, THEMES & INFO ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-6 border-t border-border items-start">
                <DetailInfoSidebar
                  data={data}
                  isAnime={isAnime}
                  totalCount={totalCount}
                />
                <DetailMediaSections
                  key={itemKey}
                  data={data}
                  isAnime={isAnime}
                  trailerHasError={trailerHasError}
                />
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
          <div className="flex min-h-screen items-center justify-center bg-bg pt-16 text-text-2">
            <p className="text-base text-text-2 animate-pulse">Memuat data katalog...</p>
          </div>
        }
      >
        <DetailContent />
      </Suspense>
    </AuthGuard>
  );
}
