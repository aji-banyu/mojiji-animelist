"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Film,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  LayoutGrid,
  List,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import SegmentedSwitch from "@/components/ui/SegmentedSwitch";
import Tag from "@/components/ui/Tag";
import { Button } from "@/components/ui/button";
import TrackerEditModal from "@/components/TrackerEditModal";
import {
  TrackerGridCard,
  TrackerListRow,
  getStatusLabel,
} from "@/components/tracker/TrackerCards";
import {
  resolveTrackerTotal,
  calculateProgressPercent,
} from "@/lib/trackerHelper";
import useFilterStore from "@/store/filterStore";
import useTrackerStore from "@/store/trackerStore";

// Status filter tabs dalam Bahasa Inggris (Urutan: All - Plan - Watching - Reading - On-Hold - Completed)
const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "plan", label: "Plan" },
  { key: "watching", label: "Watching" },
  { key: "reading", label: "Reading" },
  { key: "on_hold", label: "On-Hold" },
  { key: "completed", label: "Completed" },
];

const TYPE_FILTERS = [
  { id: "all", label: "Semua" },
  { id: "anime", label: "Anime" },
  { id: "manga", label: "Manga" },
];

const VIEW_MODES = [
  { id: "grid", label: <LayoutGrid size={16} />, ariaLabel: "Tampilan Grid", title: "Tampilan Grid" },
  { id: "list", label: <List size={16} />, ariaLabel: "Tampilan List", title: "Tampilan List" },
];

const ITEMS_PER_PAGE = 24;

export default function TrackerList({ onStatsChange, onEmptyExploreClick }) {
  const items = useTrackerStore((state) => state.items);
  const hasFetched = useTrackerStore((state) => state.hasFetched);
  const isLoading = useTrackerStore((state) => state.isLoading);
  const isRefreshing = useTrackerStore((state) => state.isRefreshing);
  const error = useTrackerStore((state) => state.error);
  const fetchTrackerList = useTrackerStore((state) => state.fetchTrackerList);
  const updateTrackerItem = useTrackerStore((state) => state.updateTrackerItem);
  const deleteTrackerItem = useTrackerStore((state) => state.deleteTrackerItem);

  const showLoading = isLoading || (!hasFetched && !error);

  const trackerFilters = useFilterStore((state) => state.trackerFilters);
  const hydrateTrackerFilters = useFilterStore(
    (state) => state.hydrateTrackerFilters
  );
  const setTrackerFilters = useFilterStore((state) => state.setTrackerFilters);
  const { activeStatus, activeType, viewMode } = trackerFilters;
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    hydrateTrackerFilters();
  }, [hydrateTrackerFilters]);

  // Sinkronkan item modal aktif dengan data terbaru di state items
  const activeModalItem = useMemo(() => {
    if (!editingItem) return null;
    return items.find((it) => it.id === editingItem.id) || editingItem;
  }, [items, editingItem]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Ambil data tracker terpusat dari store (manfaatkan cache jika masih segar)
  const handleRefreshTrackers = useCallback(() => {
    fetchTrackerList({ force: true }).catch(() => {});
  }, [fetchTrackerList]);

  useEffect(() => {
    fetchTrackerList().catch(() => {});
  }, [fetchTrackerList]);

  // Hitung statistik realtime untuk 4 Kartu Metrik Dashboard
  const stats = useMemo(() => {
    const total = items.length;
    const animeCount = items.filter((i) => (i.mediaType || i.media_type || "anime").toLowerCase() === "anime").length;
    const mangaCount = items.filter((i) => (i.mediaType || i.media_type) === "manga").length;
    const watching = items.filter((i) => i.status === "watching").length;
    const reading = items.filter((i) => i.status === "reading").length;
    const activeCount = watching + reading;
    const completed = items.filter((i) => i.status === "completed").length;
    const plan = items.filter((i) => ["plan", "plan_to_watch", "planned"].includes(i.status)).length;
    const onHold = items.filter((i) => ["on_hold", "paused"].includes(i.status)).length;
    const queueCount = plan + onHold;
    return {
      total,
      animeCount,
      mangaCount,
      activeCount,
      watching,
      reading,
      completed,
      queueCount,
      plan,
      onHold,
    };
  }, [items]);

  // Kirim statistik ke parent jika disediakan
  useEffect(() => {
    if (onStatsChange) {
      onStatsChange(stats);
    }
  }, [stats, onStatsChange]);

  // Simpan perubahan resmi dari modal TrackerEditModal dalam SATU request tunggal via store
  const handleSaveTracker = async (item, newStatus, newProgress) => {
    const statusChanged = item.status !== newStatus;
    const progressChanged = Number(item.progress) !== Number(newProgress);

    // Jika tidak ada perubahan sama sekali, tidak perlu memanggil API
    if (!statusChanged && !progressChanged) return;

    const nextProgress = Number(newProgress) || 0;
    const mediaType = (item.mediaType || item.media_type || "anime").toLowerCase();
    const resolvedTotal = item.total || resolveTrackerTotal(item);

    setActionLoadingId(item.id);

    try {
      await updateTrackerItem(item.id, newStatus, nextProgress, resolvedTotal);

      const unit = mediaType === "manga" ? "Chapter" : "Episode";
      setToast({
        type: "success",
        message: `Perubahan "${item.title || "Item"}" berhasil disimpan (${getStatusLabel(
          newStatus,
          mediaType
        )}, ${unit} ${nextProgress})!`,
      });
    } catch (err) {
      const errorMessage =
        err?.isOffline || err?.status === 503 || err?.error?.code === "SERVER_OFFLINE"
          ? "Koneksi terputus. Perubahan dibatalkan."
          : err?.error?.message || "Gagal menyimpan perubahan status & progres.";

      setToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Hapus memanggil DELETE /api/tracker/:id via store
  const handleDelete = async (id, title) => {
    setActionLoadingId(id);
    try {
      await deleteTrackerItem(id);
      setItemToDelete(null);
      if (editingItem?.id === id) {
        setEditingItem(null);
      }
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

  // Saring berdasarkan status, tipe, dan kata kunci
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter Status
      const itemStatus = String(item.status || "").toLowerCase();
      let statusMatch = true;
      if (activeStatus === "all") {
        statusMatch = true;
      } else if (activeStatus === "plan") {
        statusMatch = ["plan", "plan_to_watch", "planned"].includes(itemStatus);
      } else if (activeStatus === "on_hold") {
        statusMatch = ["on_hold", "paused"].includes(itemStatus);
      } else if (activeStatus === "completed") {
        statusMatch = ["completed", "finished"].includes(itemStatus);
      } else {
        statusMatch = itemStatus === activeStatus;
      }

      // Filter Tipe (Anime vs Manga)
      const mediaType = (item.mediaType || item.media_type || "anime").toLowerCase();
      const typeMatch = activeType === "all" ? true : mediaType === activeType;

      // Filter Pencarian Judul
      const q = searchQuery.trim().toLowerCase();
      const titleMatch = q
        ? String(item.title || "").toLowerCase().includes(q)
        : true;

      return statusMatch && typeMatch && titleMatch;
    });
  }, [items, activeStatus, activeType, searchQuery]);

  // Filter status yang relevan dengan tipe yang aktif (Anime -> Watching, Manga -> Reading)
  const availableStatusFilters = useMemo(() => {
    return STATUS_FILTERS.filter((tab) => {
      if (activeType === "anime" && tab.key === "reading") return false;
      if (activeType === "manga" && tab.key === "watching") return false;
      return true;
    });
  }, [activeType]);

  // Pagination client-side (20 item per halaman agar Grid & List tetap rapi)
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, safeCurrentPage]);

  const handlePageChange = (page) => {
    const bounded = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(bounded);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cek apakah ada minimal 1 item di tracker untuk tipe yang aktif (Semua/Anime/Manga)
  const hasTypeItems = useMemo(() => {
    if (activeType === "all") return items.length > 0;
    return items.some(
      (item) => (item.mediaType || item.media_type || "anime").toLowerCase() === activeType
    );
  }, [items, activeType]);

  // Jika belum ada item sama sekali di tipe aktif, kunci status ke "all"
  useEffect(() => {
    if (!showLoading && !hasTypeItems && activeStatus !== "all") {
      setTrackerFilters({ activeStatus: "all" });
    }
  }, [showLoading, hasTypeItems, activeStatus, setTrackerFilters]);

  // Tutup konfirmasi hapus modal dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && itemToDelete) {
        setItemToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [itemToDelete]);

  // Handler ganti tipe (Semua / Anime / Manga): otomatis sesuaikan status menonton/membaca
  const handleTypeChange = (newType) => {
    const patch = { activeType: newType };
    if (newType === "anime" && activeStatus === "reading") {
      patch.activeStatus = "watching";
    } else if (newType === "manga" && activeStatus === "watching") {
      patch.activeStatus = "reading";
    }
    setTrackerFilters(patch);
    setCurrentPage(1);
  };

  // Konten Empty State dinamis: membedakan saat belum ada item vs saat filter status kosong
  const getEmptyStateContent = () => {
    const isManga = activeType === "manga";
    const isAll = activeType === "all";
    const mediaName = isAll ? "anime maupun manga" : isManga ? "manga" : "anime";

    // Kasus 1: Tracker benar-benar masih kosong sama sekali (items.length === 0)
    if (items.length === 0) {
      return {
        title: "Tidak ada item di tracker",
        description: null,
        action: (
          <Link
            href="/explore/"
            onClick={onEmptyExploreClick}
            className="inline-flex items-center gap-2 rounded-xl bg-accent hover:bg-primary-hover px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>Jelajahi Katalog</span>
          </Link>
        ),
      };
    }

    // Kasus 2: User sudah punya item di tracker, namun tipe yang dipilih (Anime/Manga) belum ada
    if (!hasTypeItems) {
      return {
        title: `Belum ada ${mediaName} di tracker Anda`,
        description: null,
        action: null,
      };
    }

    // Kasus 3: Hasil pencarian kata kunci kosong
    if (searchQuery) {
      return {
        title: "Tidak ada hasil pencarian",
        description: null,
        action: (
          <Button
            variant="surface"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="rounded-xl font-semibold"
          >
            Hapus Pencarian
          </Button>
        ),
      };
    }

    // Kasus 4: Filter status aktif tidak memiliki item sama sekali
    const targetSubject = isAll ? "koleksi" : mediaName;
    const statusMap = {
      plan: {
        title: `Belum ada ${targetSubject} di Plan`,
      },
      watching: {
        title: "Belum ada anime yang sedang ditonton",
      },
      reading: {
        title: "Belum ada manga yang sedang dibaca",
      },
      on_hold: {
        title: `Belum ada ${targetSubject} yang ditunda`,
      },
      completed: {
        title: `Belum ada ${targetSubject} yang selesai`,
      },
    };

    const currentStatusInfo = statusMap[activeStatus] || {
      title: `Tidak ada ${targetSubject} di status ini`,
    };

    return {
      title: currentStatusInfo.title,
      description: null,
      action: (
        <Button
          variant="surface"
          size="sm"
          onClick={() => {
            setTrackerFilters({ activeStatus: "all" });
            setCurrentPage(1);
          }}
          className="rounded-xl font-semibold"
        >
          <span>Tampilkan Semua {isAll ? "Koleksi" : isManga ? "Manga" : "Anime"}</span>
        </Button>
      ),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman Selaras dengan Beranda & Jelajah */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight font-['Bricolage_Grotesque'] select-none">
            Koleksi Tracker
          </h1>
          <Tag variant="secondary" size="pill">
            {activeType === "all"
              ? "Campuran Anime & Manga"
              : activeType === "anime"
              ? "Koleksi Anime"
              : "Koleksi Manga"}
          </Tag>
        </div>
      </header>

      {/* Toast Notification Floating Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border/60 bg-surface px-4 py-3 text-xs font-semibold text-text shadow-sm backdrop-blur-md transition-all sm:text-sm"
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} className="text-accent" />
          ) : toast.type === "info" ? (
            <AlertCircle size={16} className="text-accent" />
          ) : (
            <AlertCircle size={16} className="text-destructive" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 rounded-lg p-1 text-text-2 hover:bg-surface-2 hover:text-text cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Bar Kontrol Filter Status, Tipe, & Pencarian */}
      {!showLoading && (
        <div className="space-y-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
          {/* Row 1: Tipe Switcher (Reusable SegmentedSwitch selaras Beranda & Jelajah) */}
          <div className="flex items-center">
            <SegmentedSwitch
              options={TYPE_FILTERS}
              value={activeType}
              onChange={handleTypeChange}
              disabled={items.length === 0}
              disabledTitle="Tambahkan setidaknya 1 item ke tracker untuk beralih tipe"
              className="w-full sm:w-56"
              ariaLabel="Filter Tipe Koleksi"
            />
          </div>

          {/* Row 2: Status Filter Tabs (Kiri) & Saring Koleksi + Toggle Grid/List View (Pojok Kanan) */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-t border-border pt-3">
            {/* Status Filter Tabs (Reusable Tag selaras Jelajah) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:pb-0 min-w-0 lg:shrink-0">
              {availableStatusFilters.map((tab) => {
                const isActive = activeStatus === tab.key;
                const isAccessible = hasTypeItems;
                return (
                  <Tag
                    key={tab.key}
                    as="button"
                    type="button"
                    size="default"
                    variant={!isAccessible ? "outline" : isActive ? "active" : "filter"}
                    disabled={!isAccessible}
                    aria-pressed={isActive}
                    onClick={() => {
                      if (isAccessible) {
                        setTrackerFilters({ activeStatus: tab.key });
                        setCurrentPage(1);
                      }
                    }}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 transition-all ${
                      !isAccessible
                        ? "opacity-40 cursor-not-allowed select-none pointer-events-none"
                        : "cursor-pointer active:scale-95"
                    }`}
                    title={
                      !isAccessible
                        ? "Tambahkan setidaknya 1 item ke tracker untuk mengakses filter status"
                        : undefined
                    }
                  >
                    {tab.label}
                  </Tag>
                );
              })}
            </div>

            {/* Kontrol Saring Koleksi & Toggle Grid/List View di Pojok Kanan */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0 w-full lg:w-auto justify-between lg:justify-end">
              {/* Input Saring Koleksi Compact (Reusable soft SearchInput selaras Jelajah) */}
              <SearchInput
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                disabled={items.length === 0}
                placeholder="Saring koleksi..."
                clearAriaLabel="Hapus pencarian koleksi"
                className="flex-1 min-w-0"
                title={
                  items.length === 0
                    ? "Tambahkan setidaknya 1 item ke tracker untuk menyaring koleksi"
                    : undefined
                }
              />

              {/* Toggle Grid/List View di Pojok Kanan dengan Reusable SegmentedSwitch */}
              <SegmentedSwitch
                options={VIEW_MODES}
                value={viewMode}
                onChange={(nextMode) => setTrackerFilters({ viewMode: nextMode })}
                size="md"
                disabled={items.length === 0}
                disabledTitle="Tambahkan setidaknya 1 item ke tracker untuk mengubah tampilan"
                className="w-20 shrink-0"
                ariaLabel="Mode Tampilan Koleksi"
              />
            </div>
          </div>
        </div>
      )}

      {/* State Error */}
      {error && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-surface p-4 text-xs sm:text-sm text-text shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/30">
              <AlertCircle size={18} />
            </div>
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRefreshTrackers}
            className="inline-flex items-center gap-1.5 rounded-xl bg-destructive hover:bg-destructive/90 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <RefreshCw size={12} className={isLoading || isRefreshing ? "animate-spin" : ""} />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* State Memuat (Loading Shimmer Skeleton - Menyesuaikan Mode Grid / List) */}
      {showLoading &&
        (viewMode === "list" ? (
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm divide-y divide-border">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 animate-pulse"
              >
                <div className="h-14 w-10 sm:h-15 sm:w-11 shrink-0 rounded-lg bg-surface-2" />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 w-2/3 sm:w-1/3 rounded bg-surface-2" />
                  <div className="h-3 w-1/3 sm:w-1/5 rounded bg-surface-2/60" />
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <div className="h-8 w-8 sm:w-20 rounded-xl bg-surface-2/70" />
                  <div className="h-8 w-8 sm:w-18 rounded-xl bg-surface-2/50" />
                  <div className="h-8 w-8 rounded-xl bg-surface-2/50" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm animate-pulse"
              >
                <div className="aspect-[4/5] w-full bg-surface-2" />
                <div className="space-y-1.5 border-t border-border p-2.5">
                  <div className="h-3.5 w-4/5 rounded bg-surface-2" />
                  <div className="h-3 w-1/2 rounded bg-surface-2/60" />
                  <div className="h-1 w-full rounded-full bg-surface-2/50" />
                  <div className="flex gap-1.5 pt-0.5">
                    <div className="h-7 flex-1 rounded-lg bg-surface-2/70" />
                    <div className="h-7 w-7 rounded-lg bg-surface-2/50" />
                    <div className="h-7 w-7 rounded-lg bg-surface-2/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

      {/* State Kosong (Dinamis - Hanya Judul & Tombol Aksi) */}
      {!showLoading && !error && filteredItems.length === 0 && (() => {
        const emptyState = getEmptyStateContent();
        return (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-4 py-14 text-center shadow-sm">
            <h3 className="text-base font-black text-text sm:text-lg tracking-tight font-['Bricolage_Grotesque']">
              {emptyState.title}
            </h3>
            {emptyState.action && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {emptyState.action}
              </div>
            )}
          </div>
        );
      })()}

      {/* Kartu Tracker — Grid / List Mode & Pagination */}
      {!showLoading && filteredItems.length > 0 && (() => {
        const RowOrCard = viewMode === "list" ? TrackerListRow : TrackerGridCard;
        const itemNodes = paginatedItems.map((item) => {
          const mediaType = (item.mediaType || item.media_type || "anime").toLowerCase();
          const malId = item.malId || item.mal_id;
          const poster = item.imageUrl || item.image_url;
          const progress = Number(item.progress) || 0;
          const resolvedTotal = resolveTrackerTotal(item);
          const total = resolvedTotal > 0 ? resolvedTotal : Number(item.total) || 0;
          const percent = calculateProgressPercent(progress, total, item.status);

          return (
            <RowOrCard
              key={item.id}
              item={item}
              mediaType={mediaType}
              detailHref={`/detail/?type=${mediaType}&id=${malId}`}
              poster={poster}
              progress={progress}
              total={total}
              percent={percent}
              isActionLoading={actionLoadingId === item.id}
              onEdit={setEditingItem}
              onDelete={setItemToDelete}
            />
          );
        });

        return (
          <div className="space-y-2">
            {viewMode === "list" ? (
              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                {/* Header Kolom Tabel untuk Desktop */}
                <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_130px_175px_215px] items-center gap-4 border-b border-border bg-surface-2/70 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-text-3">
                  <span>Judul</span>
                  <span>Status</span>
                  <span>Progres</span>
                  <span className="text-right">Aksi</span>
                </div>

                <div className="divide-y divide-border">{itemNodes}</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {itemNodes}
              </div>
            )}

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filteredItems.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              activeColor="secondary"
              ariaLabel="Navigasi Halaman Tracker"
              className="space-y-3 pt-4 pb-2"
            />
          </div>
        );
      })()}

      {/* Pop-up Dialog Modal Konfirmasi Hapus Tracker */}
      {itemToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => !actionLoadingId && setItemToDelete(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Dialog: Judul, Penjelasan & Tombol Tutup */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <h3
                  id="delete-dialog-title"
                  className="text-base sm:text-lg font-bold text-text tracking-tight font-heading"
                >
                  Hapus dari Tracker?
                </h3>
                <p className="text-xs text-text-2 leading-relaxed">
                  Item ini beserta riwayat progresnya akan dihapus permanen dari daftar tracker Anda.
                </p>
              </div>
              <Button
                variant="surface"
                size="icon"
                onClick={() => setItemToDelete(null)}
                disabled={actionLoadingId === itemToDelete.id}
                className="rounded-xl shrink-0"
                aria-label="Tutup dialog"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Kartu Pratinjau Item yang Akan Dihapus */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 p-2.5">
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                {(itemToDelete.imageUrl || itemToDelete.image_url) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={itemToDelete.imageUrl || itemToDelete.image_url}
                    alt={itemToDelete.title || "Poster"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-3">
                    {(itemToDelete.mediaType || itemToDelete.media_type) === "manga" ? (
                      <BookOpen size={16} />
                    ) : (
                      <Film size={16} />
                    )}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="inline-block rounded-full bg-surface border border-border/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-2">
                  {(itemToDelete.mediaType || itemToDelete.media_type || "anime").toLowerCase()}
                </span>
                <h4 className="truncate text-xs sm:text-sm font-bold text-text" title={itemToDelete.title}>
                  {itemToDelete.title || "Untitled"}
                </h4>
                <p className="text-[11px] font-mono text-text-3">
                  Progres: {(itemToDelete.mediaType || itemToDelete.media_type) === "manga" ? "Ch" : "Ep"} {itemToDelete.progress || 0}
                </p>
              </div>
            </div>

            {/* Tombol Aksi: Batal & Ya, Hapus */}
            <div className="flex items-center gap-2.5 pt-1">
              <Button
                variant="surface"
                size="md"
                onClick={() => setItemToDelete(null)}
                disabled={actionLoadingId === itemToDelete.id}
                className="flex-1 text-xs font-semibold"
              >
                Batal
              </Button>
              <button
                type="button"
                onClick={() => handleDelete(itemToDelete.id, itemToDelete.title)}
                disabled={actionLoadingId === itemToDelete.id}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive hover:bg-destructive/90 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer text-center disabled:opacity-50"
              >
                {actionLoadingId === itemToDelete.id ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Modal Cepat Ubah Status & Kelola Progres */}
      {activeModalItem && (
        <TrackerEditModal
          item={activeModalItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveTracker}
          onDelete={handleDelete}
          isLoading={actionLoadingId === activeModalItem.id}
        />
      )}
    </div>
  );
}
