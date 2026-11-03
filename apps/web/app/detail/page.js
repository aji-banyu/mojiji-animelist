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
  Layers,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Check,
  Loader2,
  X,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import {
  getCatalogDetailApi,
  getTrackerItemApi,
  addTrackerApi,
  updateTrackerStatusApi,
} from "@/lib/api";

/**
 * Pilihan 5 status standar untuk anime dan manga
 */
const STATUS_OPTIONS_ANIME = [
  { value: "watching", label: "Sedang Menonton" },
  { value: "plan", label: "Rencana Nonton" },
  { value: "completed", label: "Selesai Ditonton" },
  { value: "on_hold", label: "Ditunda (On-Hold)" },
  { value: "dropped", label: "Dibatalkan (Dropped)" },
];

const STATUS_OPTIONS_MANGA = [
  { value: "reading", label: "Sedang Membaca" },
  { value: "plan", label: "Rencana Baca" },
  { value: "completed", label: "Selesai Dibaca" },
  { value: "on_hold", label: "Ditunda (On-Hold)" },
  { value: "dropped", label: "Dibatalkan (Dropped)" },
];

function getStatusLabel(status, type) {
  const options = type === "manga" ? STATUS_OPTIONS_MANGA : STATUS_OPTIONS_ANIME;
  const found = options.find((opt) => opt.value === status);
  return found ? found.label : status;
}

/**
 * DetailContent — Membaca query parameter ?type=&id= dan menyajikan detail lengkap.
 * Wajib berada di dalam <Suspense> untuk kompatibilitas Next.js static export.
 */
function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "anime"; // "anime" | "manga"
  const id = searchParams.get("id"); // MAL ID (integer)

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  // State Pelacakan Tracker (Tiket MJ-061)
  const defaultStatus = type === "manga" ? "reading" : "watching";
  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
  const [trackedItem, setTrackedItem] = useState(null);
  const [isSavingTracker, setIsSavingTracker] = useState(false);
  const [toast, setToast] = useState(null);

  const statusOptions = type === "manga" ? STATUS_OPTIONS_MANGA : STATUS_OPTIONS_ANIME;

  // Auto-dismiss toast setelah 4 detik
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

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
        // Langkah 1: Panggil GET /api/catalog/:type/:malId via API Gateway
        const response = await getCatalogDetailApi(type, id);

        if (isMounted) {
          if (response && response.success && response.data) {
            setData(response.data);
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

    // Langkah 5: Periksa apakah judul ini sudah ada di tracker user
    getTrackerItemApi(type, id)
      .then((item) => {
        if (isMounted && item) {
          setTrackedItem(item);
          if (item.status) {
            setSelectedStatus(item.status);
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [type, id]);

  // Handler simpan/perbarui status ke tracker (Langkah 2, 3, 4, 5 Tiket MJ-061)
  const handleSaveTracker = async () => {
    setIsSavingTracker(true);
    try {
      if (trackedItem) {
        // Jika sudah ada di tracker: Ubah status (Opsi A)
        await updateTrackerStatusApi(trackedItem.id, selectedStatus);
        setTrackedItem((prev) => ({ ...prev, status: selectedStatus }));
        setToast({
          type: "success",
          message: `Status berhasil diperbarui menjadi ${getStatusLabel(selectedStatus, type)}!`,
        });
      } else {
        // Jika belum ada di tracker: Tambahkan item baru (POST /api/tracker)
        const res = await addTrackerApi({
          type,
          malId: id,
          status: selectedStatus,
          progress: 0,
        });

        if (res && res.data) {
          setTrackedItem(res.data);
        } else {
          const item = await getTrackerItemApi(type, id);
          setTrackedItem(item || { malId: id, mediaType: type, status: selectedStatus });
        }

        setToast({
          type: "success",
          message: `Berhasil menambahkan "${data?.title || "Judul"}" ke tracker!`,
        });
      }
    } catch (err) {
      // Langkah 3: Bila belum login atau sesi habis (401), arahkan ke /login
      if (err?.status === 401 || err?.error?.code === "UNAUTHORIZED") {
        router.push("/login");
        return;
      }

      // Penanganan 409 Conflict: item sudah ada di tracker
      if (err?.status === 409 || err?.error?.code === "CONFLICT") {
        setToast({
          type: "info",
          message: "Judul ini sudah tersimpan di daftar tracker Anda.",
        });
        const item = await getTrackerItemApi(type, id);
        if (item) setTrackedItem(item);
        return;
      }

      // Langkah 4: Tampilkan notifikasi gagal
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
  const totalEpisodeOrChapter =
    type === "anime"
      ? data?.totalEpisodes
        ? `${data.totalEpisodes} Episode`
        : "TBA"
      : data?.totalChapters
      ? `${data.totalChapters} Chapter`
      : "TBA";

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-[#0F1015] px-4 py-8 text-white sm:px-6 lg:px-8">
      {/* Toast Notification Floating Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all sm:text-sm ${
            toast.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-200"
              : toast.type === "info"
              ? "border-amber-500/40 bg-amber-950/90 text-amber-200"
              : "border-red-500/40 bg-red-950/90 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={18} className="shrink-0" />
          )}
          <span className="max-w-xs sm:max-w-sm">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 rounded-lg p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Tombol Navigasi Kembali */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#181A20] px-4 py-2 text-xs font-semibold text-neutral-300 shadow-sm transition-all hover:border-[#FF4655]/40 hover:bg-[#181A20]/80 hover:text-white active:scale-95"
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        {/* === KONDISI 1: Loading Skeleton Shimmer === */}
        {isLoading && (
          <div className="flex flex-col gap-8 md:flex-row animate-pulse">
            <div className="w-full md:w-[300px] shrink-0">
              <div className="aspect-[3/4] w-full rounded-2xl bg-neutral-800/60 border border-white/10" />
              <div className="mt-4 h-24 w-full rounded-xl bg-neutral-800/40" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-neutral-800/70" />
                <div className="h-6 w-24 rounded-full bg-neutral-800/50" />
                <div className="h-6 w-16 rounded-full bg-neutral-800/50" />
              </div>
              <div className="h-10 w-3/4 rounded-lg bg-neutral-800/80" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="h-16 rounded-xl bg-neutral-800/50" />
                <div className="h-16 rounded-xl bg-neutral-800/50" />
                <div className="h-16 rounded-xl bg-neutral-800/50" />
              </div>
              <div className="space-y-2 pt-4">
                <div className="h-4 w-1/4 rounded bg-neutral-800/60" />
                <div className="h-4 w-full rounded bg-neutral-800/40" />
                <div className="h-4 w-full rounded bg-neutral-800/40" />
                <div className="h-4 w-2/3 rounded bg-neutral-800/40" />
              </div>
            </div>
          </div>
        )}

        {/* === KONDISI 2: 404 Not Found === */}
        {!isLoading && isNotFound && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#12141A] px-6 py-16 text-center shadow-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              <SearchX size={32} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">Item Katalog Tidak Ditemukan</h2>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-400 sm:text-sm">
              Kami tidak dapat menemukan data untuk {type} dengan ID{" "}
              <strong className="text-white">#{id}</strong> pada sistem database Catalog.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF4655] px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#e03d4a] active:scale-95"
              >
                <ArrowLeft size={14} />
                <span>Cari Judul Lain di Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        {/* === KONDISI 3: Upstream Error === */}
        {!isLoading && !isNotFound && error && (
          <div className="flex items-start gap-3.5 rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-sm text-red-200 shadow-xl">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-400" />
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-white">Gagal Memuat Detail</h3>
              <p className="text-xs text-red-300/90 leading-relaxed">{error}</p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-red-500/20 px-4 py-1.5 text-xs font-bold text-red-200 transition-colors hover:bg-red-500/30 cursor-pointer"
                >
                  Muat Ulang Halaman
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === KONDISI 4: Data Berhasil Dimuat (Tiket MJ-060 & MJ-061) === */}
        {!isLoading && !isNotFound && !error && data && (
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Kolom Kiri: Poster Gambar & Kontrol Tracker */}
            <div className="w-full md:w-[300px] shrink-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#181A20] shadow-2xl">
                {poster ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={poster}
                    alt={data.title || "Poster"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-600">
                    {type === "anime" ? <Film size={48} /> : <BookOpen size={48} />}
                  </div>
                )}

                {/* Score Pill Overlay */}
                <div className="absolute right-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-amber-400 backdrop-blur-md border border-white/15 flex items-center gap-1 shadow-lg">
                  <Star size={13} className="fill-amber-400" />
                  <span>{typeof data.score === "number" ? data.score.toFixed(2) : "-"}</span>
                </div>
              </div>

              {/* Kontrol Tracker (Tiket MJ-061: Opsi A - Dropdown 5 Status & Tombol Simpan) */}
              <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-[#181A20] p-4 shadow-lg">
                <div className="space-y-1.5">
                  <label
                    htmlFor="tracker-status-select"
                    className="block text-xs font-semibold text-neutral-300"
                  >
                    Pilihan Status Tracker
                  </label>
                  <div className="relative">
                    <select
                      id="tracker-status-select"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={isSavingTracker}
                      className="w-full appearance-none rounded-xl border border-white/15 bg-[#12141A] px-3.5 py-2.5 text-xs font-medium text-white shadow-inner focus:border-[#FF4655] focus:outline-none focus:ring-1 focus:ring-[#FF4655] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {statusOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-[#181A20] text-white"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Tombol Simpan / Perbarui Tracker */}
                <button
                  type="button"
                  onClick={handleSaveTracker}
                  disabled={isSavingTracker}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF4655] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FF4655]/20 transition-all hover:bg-[#e03d4a] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSavingTracker ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : trackedItem ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Perbarui Status</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={15} />
                      <span>+ Tambah ke Tracker</span>
                    </>
                  )}
                </button>

                {/* Indikator Status Saat Ini (Langkah 5) */}
                {trackedItem && (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] font-medium text-emerald-300">
                    <span className="flex items-center gap-1.5 truncate">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span className="truncate">
                        Status: <strong>{getStatusLabel(trackedItem.status, type)}</strong>
                      </span>
                    </span>
                    <Link
                      href="/tracker"
                      className="ml-2 font-bold text-emerald-400 underline hover:text-emerald-200 shrink-0"
                    >
                      Buka Tracker →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Kanan: Judul, Badges, Metadata, & Sinopsis */}
            <div className="flex-1 space-y-6">
              {/* Row Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#FF4655]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FF4655] border border-[#FF4655]/30">
                  {type === "anime" ? "Anime" : "Manga"}
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-neutral-300 border border-white/15">
                  {data.status || "Unknown Status"}
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-400 border border-white/10">
                  ID: #{malId}
                </span>
              </div>

              {/* Judul Utama */}
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.6rem] leading-tight">
                {data.title || "Untitled"}
              </h1>

              {/* Grid Metadata Cepat */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Layers size={16} className="text-[#FF4655]" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {type === "anime" ? "Episode" : "Chapter"}
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">{totalEpisodeOrChapter}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Star size={16} className="text-amber-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Rating</span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-amber-400">
                    {typeof data.score === "number" ? `${data.score.toFixed(2)} / 10` : "Belum Ada"}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Sparkles size={16} className="text-emerald-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Format</span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-white capitalize">{type}</p>
                </div>
              </div>

              {/* Sinopsis */}
              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#181A20]/80 p-5 shadow-sm sm:p-6">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-300">
                  <BookOpen size={16} className="text-[#FF4655]" />
                  <span>Sinopsis</span>
                </h2>
                <p className="text-sm leading-relaxed text-neutral-300/90 whitespace-pre-line sm:text-base font-normal">
                  {data.synopsis || "Sinopsis belum tersedia untuk judul ini."}
                </p>
              </div>
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
          <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#0F1015]">
            <p className="text-sm text-neutral-400 animate-pulse">Memuat data katalog...</p>
          </div>
        }
      >
        <DetailContent />
      </Suspense>
    </AuthGuard>
  );
}
