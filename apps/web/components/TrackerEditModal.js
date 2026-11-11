"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Trash2,
  RotateCcw,
} from "lucide-react";
import {
  resolveTrackerTotal,
  calculateProgressPercent,
  getTrackerStatusTheme,
} from "@/lib/trackerHelper";

export default function TrackerEditModal({
  item,
  onClose,
  onSave,
  onDelete,
  isLoading,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Draft lokal: Perubahan hanya disimpan ke database jika user klik "Selesai"
  const initialProg = Number(item?.progress) || 0;
  const initialStat = item?.status || "plan";
  const [draftStatus, setDraftStatus] = useState(initialStat);
  const [draftProgress, setDraftProgress] = useState(() => {
    if (initialStat === "completed" && initialProg === 0) {
      const resolved = resolveTrackerTotal(item);
      const tot = resolved > 0 ? resolved : Number(item?.total) || 0;
      if (tot > 0) return tot;
    }
    return initialProg;
  });

  const mediaType = (item?.mediaType || item?.media_type || "anime").toLowerCase();

  // Riwayat perubahan state (progress & status) agar bisa di-undo secara sinkron
  const [history, setHistory] = useState([]);

  // Ikon Keluar (ArrowLeft), Backdrop, atau Escape: Tutup modal TANPA menyimpan perubahan dengan animasi turun
  const handleCloseWithoutSaving = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 240);
  }, [isClosing, onClose]);

  // Tutup dengan Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseWithoutSaving();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseWithoutSaving]);

  // Tombol Selesai: Simpan perubahan status & progress secara resmi
  const handleSaveAndClose = () => {
    if (isClosing) return;
    if (onSave) {
      onSave(item, draftStatus, draftProgress);
    }
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 240);
  };

  if (!item) return null;

  const poster = item.imageUrl || item.image_url;
  const resolvedTotal = resolveTrackerTotal(item);
  const total = resolvedTotal > 0 ? resolvedTotal : Number(item.total) || 0;
  const percent = calculateProgressPercent(draftProgress, total, draftStatus);

  // Status options: menggunakan palet bersama agar konsisten dengan indikator status di card
  const isManga = mediaType === "manga";
  const statusOptions = [
    {
      value: "plan",
      label: isManga ? "Plan to Read" : "Plan to Watch",
      ...getTrackerStatusTheme("plan"),
    },
    {
      value: "on_hold",
      label: "On-Hold",
      ...getTrackerStatusTheme("on_hold"),
    },
    {
      value: isManga ? "reading" : "watching",
      label: isManga ? "Reading" : "Watching",
      ...getTrackerStatusTheme("watching"),
    },
    {
      value: "completed",
      label: "Completed",
      ...getTrackerStatusTheme("completed"),
    },
  ];

  // Pemilihan status: mencatat state sebelumnya ke riwayat
  const handleStatusSelect = (optValue) => {
    if (draftStatus === optValue) return;
    setHistory((prev) => [...prev, { progress: draftProgress, status: draftStatus }]);
    setDraftStatus(optValue);

    if (optValue === "completed") {
      if (total > 0 && draftProgress < total) {
        setDraftProgress(total);
      }
    } else if (draftStatus === "completed" && optValue !== "completed") {
      if (total > 0 && draftProgress >= total) {
        setDraftProgress(Math.max(0, total - 1));
      }
    }
  };

  // Tambah progress (+1, +5, +10): mencatat state sebelumnya ke riwayat
  const handleIncrementClick = (amount) => {
    setHistory((prev) => [...prev, { progress: draftProgress, status: draftStatus }]);
    const nextProg = total > 0 ? Math.min(total, draftProgress + amount) : draftProgress + amount;
    setDraftProgress(nextProg);
    if (total > 0 && nextProg >= total) {
      setDraftStatus("completed");
    }
  };

  const canUndo = history.length > 0;

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setDraftProgress(lastState.progress);
    setDraftStatus(lastState.status);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-tracker-title"
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 transition-opacity duration-200 ease-out ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={handleCloseWithoutSaving}
    >
      <div
        className={`relative w-full max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl border border-border bg-surface p-4 shadow-2xl sm:max-w-sm space-y-3 ${
          isClosing ? "animate-modal-slide-down pointer-events-none" : "animate-modal-slide-up"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Poster & Info Judul + Tombol Tutup (X) Sendirian di Pojok Kanan Atas */}
        <div className="relative flex items-start gap-3 border-b border-border pb-3">
          <button
            type="button"
            onClick={handleCloseWithoutSaving}
            className="absolute top-0 right-0 z-10 rounded-full border border-border bg-surface-2 p-1.5 text-text-2 hover:bg-surface hover:text-text transition-all cursor-pointer active:scale-95"
            aria-label="Tutup"
            title="Tutup (Batal simpan)"
          >
            <X size={15} />
          </button>

          {/* Thumbnail Poster */}
          <div className="relative h-24 w-[68px] shrink-0 overflow-hidden rounded-xl border border-border bg-surface-2 shadow-xs">
            {poster ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={poster}
                alt={item.title || "Poster"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-text-3">
                {mediaType === "manga" ? "MANGA" : "ANIME"}
              </div>
            )}
          </div>

          {/* Info Judul & Tag Status/Episode */}
          <div className="flex-1 min-w-0 pt-0.5 pr-9 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="rounded-full bg-surface-2 border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-2">
                {mediaType}
              </span>
              <span className="text-[11px] font-medium text-text-2">
                {total > 0 ? `${total} ${mediaType === "manga" ? "Chapters" : "Episodes"}` : "Total TBA"}
              </span>
            </div>

            <h3
              id="modal-tracker-title"
              className="text-sm sm:text-base font-black text-text line-clamp-2 leading-snug tracking-tight font-['Bricolage_Grotesque']"
              title={item.title}
            >
              {item.title}
            </h3>
          </div>
        </div>

        {/* Ketika delete ditekan, bagian status tertutup menjadi dialog konfirmasi hapus */}
        {confirmDelete ? (
          <div className="rounded-xl border border-destructive/30 bg-surface-2 p-3.5 space-y-2 animate-in fade-in duration-150">
            <div className="text-xs sm:text-sm font-bold text-text leading-snug">
              Yakin ingin menghapus &ldquo;{item.title}&rdquo;?
            </div>
            <p className="text-[11px] text-text-2 leading-tight">
              Item ini akan dihapus permanen dari daftar tracker Anda.
            </p>
            <div className="flex items-center gap-2 pt-1.5">
              <button
                type="button"
                onClick={() => onDelete(item.id, item.title)}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 px-3 py-2 text-xs font-bold text-white shadow-sm active:scale-95 transition-all cursor-pointer text-center"
              >
                Ya, Hapus Sekarang
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-2 hover:bg-surface-2 hover:text-text transition-all cursor-pointer text-center"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          /* Status Section (Grid 2x2) */
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-text-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((opt) => {
                const isSelected = draftStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleStatusSelect(opt.value)}
                    disabled={isLoading}
                    className={`rounded-xl py-2 px-2.5 text-xs text-center outline-none transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? `font-bold ${opt.optionActive}`
                        : `bg-surface-2 font-medium hover:bg-surface-2-hover ${opt.inactiveText}`
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Box Progress */}
        <div
          className={`space-y-2.5 rounded-xl border border-border bg-surface-2 p-3 transition-all duration-200 ${
            confirmDelete ? "opacity-30 pointer-events-none select-none cursor-not-allowed" : ""
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-text-2">Progress</span>
            <span className="text-text tabular-nums font-mono">
              {mediaType === "manga" ? "Ch" : "Ep"} {draftProgress} / {total > 0 ? total : "TBA"} ({percent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface border border-border/50">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Baris Kontrol Progres (+1, +5, +10, Undo) */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => handleIncrementClick(1)}
              disabled={isLoading || confirmDelete || (total > 0 && draftProgress >= total)}
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-surface px-2.5 py-2 text-xs font-bold text-text transition-all hover:border-accent hover:bg-accent hover:text-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>+1 {mediaType === "manga" ? "Chapter" : "Episode"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleIncrementClick(5)}
              disabled={isLoading || confirmDelete || (total > 0 && draftProgress >= total)}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-text transition-all hover:border-accent hover:bg-accent hover:text-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={`+5 ${mediaType === "manga" ? "Chapter" : "Episode"}`}
            >
              <span>+5</span>
            </button>

            <button
              type="button"
              onClick={() => handleIncrementClick(10)}
              disabled={isLoading || confirmDelete || (total > 0 && draftProgress >= total)}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-text transition-all hover:border-accent hover:bg-accent hover:text-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={`+10 ${mediaType === "manga" ? "Chapter" : "Episode"}`}
            >
              <span>+10</span>
            </button>

            <button
              type="button"
              onClick={handleUndo}
              disabled={isLoading || confirmDelete || !canUndo}
              className={`inline-flex items-center justify-center rounded-xl border p-2 transition-all cursor-pointer active:scale-95 ${
                canUndo && !confirmDelete
                  ? "border-border bg-surface text-text hover:border-accent/50 hover:bg-surface-2"
                  : "border-border/50 bg-transparent text-text-3 cursor-not-allowed opacity-30"
              }`}
              title={
                canUndo
                  ? "Undo perubahan sebelumnya"
                  : "Belum ada riwayat perubahan progres"
              }
              aria-label="Undo"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Footer: Tombol Hapus & Selesai */}
        {!confirmDelete && (
          <div className="pt-0.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={isLoading}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 text-text-2 transition-colors hover:border-border-hover hover:bg-surface hover:text-text cursor-pointer active:scale-95 disabled:opacity-40"
              title="Hapus dari tracker"
              aria-label="Hapus item dari tracker"
            >
              <Trash2 size={15} />
            </button>

            <button
              type="button"
              onClick={handleSaveAndClose}
              disabled={isLoading}
              className="flex-1 h-9 inline-flex items-center justify-center rounded-xl bg-accent hover:bg-primary-hover px-4 text-xs sm:text-sm font-bold text-white shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
