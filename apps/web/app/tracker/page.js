"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Film,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  Check,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import {
  getTrackerListApi,
  incrementProgressApi,
  deleteTrackerApi,
} from "@/lib/api";

const STATUS_FILTERS = [
  { key: "all", label: "Semua" },
  { key: "watching", label: "Sedang Menonton" },
  { key: "reading", label: "Sedang Membaca" },
  { key: "completed", label: "Selesai" },
  { key: "plan", label: "Rencana" },
  { key: "on_hold", label: "Ditunda" },
  { key: "dropped", label: "Dibatalkan" },
];

function getStatusBadgeConfig(status) {
  const norm = String(status || "").toLowerCase();
  switch (norm) {
    case "watching":
      return { label: "Menonton", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
    case "reading":
      return { label: "Membaca", color: "bg-teal-500/15 text-teal-400 border-teal-500/30" };
    case "completed":
      return { label: "Selesai", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" };
    case "plan":
    case "plan_to_watch":
    case "planned":
      return { label: "Rencana", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" };
    case "on_hold":
    case "paused":
      return { label: "Ditunda", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
    case "dropped":
      return { label: "Dibatalkan", color: "bg-red-500/15 text-red-400 border-red-500/30" };
    default:
      return { label: norm, color: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30" };
  }
}

export default function TrackerPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load tracker list from API Gateway
  const fetchTrackers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTrackerListApi();
      if (response && response.success && Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError(
        err?.error?.message ||
          "Gagal memuat daftar tracker. Pastikan server tracker service sedang aktif."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackers();
  }, []);

  // Quick increment progress (+1 Episode / +1 Chapter)
  const handleIncrement = async (item) => {
    const totalCount = Number(item.total) || 0;
    const currentProgress = Number(item.progress) || 0;

    if (totalCount > 0 && currentProgress >= totalCount) {
      setToast({
        type: "info",
        message: `Progres sudah mencapai total maksimal (${totalCount}).`,
      });
      return;
    }

    setActionLoadingId(item.id);
    try {
      const res = await incrementProgressApi(item.id);
      const updated = res?.data;

      setItems((prev) =>
        prev.map((it) => {
          if (it.id === item.id) {
            const nextProgress = updated?.progress ?? currentProgress + 1;
            const nextStatus =
              updated?.status ??
              (totalCount > 0 && nextProgress >= totalCount ? "completed" : it.status);
            return {
              ...it,
              progress: nextProgress,
              status: nextStatus,
            };
          }
          return it;
        })
      );

      const unit = (item.mediaType || item.media_type) === "manga" ? "Chapter" : "Episode";
      setToast({
        type: "success",
        message: `+1 ${unit} berhasil dicatat untuk "${item.title}"!`,
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err?.error?.message || "Gagal menambah progres.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete item from tracker
  const handleDelete = async (id, title) => {
    setActionLoadingId(id);
    try {
      await deleteTrackerApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      setDeletingId(null);
      setToast({
        type: "success",
        message: `"${title || "Item"}" berhasil dihapus dari tracker.`,
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err?.error?.message || "Gagal menghapus item dari tracker.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter & Search processing
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const statusMatch =
        activeFilter === "all" ? true : String(item.status || "").toLowerCase() === activeFilter;

      const q = searchQuery.trim().toLowerCase();
      const titleMatch = q
        ? String(item.title || "").toLowerCase().includes(q)
        : true;

      return statusMatch && titleMatch;
    });
  }, [items, activeFilter, searchQuery]);

  // Statistik cepat
  const stats = useMemo(() => {
    const total = items.length;
    const watching = items.filter((i) => i.status === "watching").length;
    const reading = items.filter((i) => i.status === "reading").length;
    const completed = items.filter((i) => i.status === "completed").length;
    const plan = items.filter((i) => ["plan", "plan_to_watch", "planned"].includes(i.status)).length;
    return { total, watching, reading, completed, plan };
  }, [items]);

  return (
    <AuthGuard>
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

        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Title & Refresh */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2.5">
                <Layers className="text-[#FF4655]" size={26} />
                <span>Tracker Saya</span>
              </h1>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                Kelola dan pantau seluruh progres tontonan anime dan bacaan manga kamu di satu tempat.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchTrackers}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#181A20] px-4 py-2 text-xs font-semibold text-neutral-300 transition-all hover:border-[#FF4655]/40 hover:text-white active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                <span>Perbarui Data</span>
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF4655] px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#e03d4a] active:scale-95"
              >
                <span>+ Cari Katalog</span>
              </Link>
            </div>
          </div>

          {/* Statistik Cepat Tracker */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Total Tersimpan
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-white">{stats.total}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Film size={12} /> Menonton
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-emerald-400">{stats.watching}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <BookOpen size={12} /> Membaca
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-teal-400">{stats.reading}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Check size={12} /> Selesai
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-blue-400">{stats.completed}</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Clock size={12} /> Rencana
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-purple-400">{stats.plan}</p>
            </div>
          </div>

          {/* Bar Kontrol: Filter Status Tabs & Input Pencarian */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#181A20] p-4 shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {STATUS_FILTERS.map((tab) => {
                  const isActive = activeFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveFilter(tab.key)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20"
                          : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Quick Search Input */}
              <div className="relative min-w-[220px]">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Cari di tracker kamu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#12141A] py-2 pl-9 pr-8 text-xs text-white placeholder-neutral-500 focus:border-[#FF4655] focus:outline-none focus:ring-1 focus:ring-[#FF4655]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-200">
              <AlertCircle size={18} className="shrink-0 text-red-400" />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={fetchTrackers}
                className="rounded-lg bg-red-500/20 px-3 py-1 font-bold text-red-200 hover:bg-red-500/30"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Loading Shimmer State */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[#181A20] p-4 animate-pulse"
                >
                  <div className="h-32 w-24 rounded-xl bg-neutral-800 shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-5 w-3/4 rounded bg-neutral-800" />
                    <div className="h-4 w-1/3 rounded bg-neutral-800/60" />
                    <div className="h-2 w-full rounded bg-neutral-800/40 mt-4" />
                    <div className="h-8 w-full rounded bg-neutral-800/50 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#12141A] px-6 py-16 text-center shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-neutral-400 border border-white/10">
                <Sparkles size={28} className="text-[#FF4655]" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">
                {items.length === 0 ? "Tracker Kamu Masih Kosong" : "Tidak Ada Judul yang Cocok"}
              </h2>
              <p className="mt-1.5 max-w-sm text-xs text-neutral-400 leading-relaxed">
                {items.length === 0
                  ? "Mulai jelajahi katalog anime atau manga favoritmu lalu tambahkan ke daftar pantauan!"
                  : `Tidak ditemukan item dengan filter "${activeFilter}" atau pencarian saat ini.`}
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF4655] px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#e03d4a] active:scale-95"
                >
                  <Plus size={14} />
                  <span>Jelajahi Katalog di Dashboard</span>
                </Link>
              </div>
            </div>
          )}

          {/* Grid Kartu Tracker */}
          {!isLoading && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const mediaType = (item.mediaType || item.media_type || "anime").toLowerCase();
                const malId = item.malId || item.mal_id;
                const poster = item.imageUrl || item.image_url;
                const progress = Number(item.progress) || 0;
                const total = Number(item.total) || 0;
                const percent =
                  total > 0 ? Math.min(100, Math.round((progress / total) * 100)) : 0;
                const statusBadge = getStatusBadgeConfig(item.status);
                const isActionLoading = actionLoadingId === item.id;
                const isDeleting = deletingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#181A20] p-4 shadow-md transition-all hover:border-white/20 hover:shadow-xl"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail Poster */}
                      <Link
                        href={`/detail?type=${mediaType}&id=${malId}`}
                        className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-sm"
                      >
                        {poster ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={poster}
                            alt={item.title || "Poster"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-600">
                            {mediaType === "manga" ? <BookOpen size={24} /> : <Film size={24} />}
                          </div>
                        )}
                      </Link>

                      {/* Info & Badges */}
                      <div className="flex flex-1 flex-col justify-between overflow-hidden">
                        <div>
                          {/* Row Badges */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-full bg-[#FF4655]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF4655] border border-[#FF4655]/30">
                              {mediaType}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusBadge.color}`}
                            >
                              {statusBadge.label}
                            </span>
                          </div>

                          {/* Judul Anime/Manga */}
                          <Link
                            href={`/detail?type=${mediaType}&id=${malId}`}
                            className="mt-1.5 block line-clamp-2 text-sm font-bold text-white transition-colors hover:text-[#FF4655]"
                            title={item.title}
                          >
                            {item.title || "Untitled"}
                          </Link>
                        </div>

                        {/* Progress Bar & Counter */}
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400">
                            <span>
                              {mediaType === "manga" ? "Ch" : "Ep"} {progress} / {total > 0 ? total : "TBA"}
                            </span>
                            <span className="text-white/60">{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF4655] to-amber-500 transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Interaksi Cepat: +1 Progres & Hapus Item */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                      <Link
                        href={`/detail?type=${mediaType}&id=${malId}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 transition-colors hover:text-white"
                      >
                        <span>Detail</span>
                        <ExternalLink size={11} />
                      </Link>

                      <div className="flex items-center gap-2">
                        {/* Tombol Hapus / Konfirmasi Hapus */}
                        {isDeleting ? (
                          <div className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/60 px-2 py-1 text-[11px]">
                            <span className="text-red-300">Yakin?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.title)}
                              disabled={isActionLoading}
                              className="font-bold text-red-400 hover:text-red-200 cursor-pointer"
                            >
                              Ya
                            </button>
                            <span className="text-neutral-500">|</span>
                            <button
                              type="button"
                              onClick={() => setDeletingId(null)}
                              className="text-neutral-400 hover:text-white cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingId(item.id)}
                            disabled={isActionLoading}
                            className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                            title="Hapus dari tracker"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}

                        {/* Tombol Cepat +1 Episode/Chapter */}
                        <button
                          type="button"
                          onClick={() => handleIncrement(item)}
                          disabled={isActionLoading || (total > 0 && progress >= total)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#FF4655]/30 bg-[#FF4655]/15 px-3 py-1 text-xs font-bold text-[#FF4655] transition-all hover:bg-[#FF4655] hover:text-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          title={`Tambah progres ${mediaType === "manga" ? "Chapter" : "Episode"} +1`}
                        >
                          <Plus size={13} />
                          <span>+1 {mediaType === "manga" ? "Ch" : "Ep"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
