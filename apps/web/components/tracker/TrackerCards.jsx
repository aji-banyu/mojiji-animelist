"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  BookOpen,
  Trash2,
  ExternalLink,
  ChevronDown,
  Check,
  Clock,
  Pause,
  SlidersHorizontal,
} from "lucide-react";
import { getTrackerStatusTheme } from "@/lib/trackerHelper";

const STATUS_OPTIONS_ANIME = [
  { value: "watching", label: "Watching" },
  { value: "plan", label: "Plan to Watch" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On-Hold" },
];

const STATUS_OPTIONS_MANGA = [
  { value: "reading", label: "Reading" },
  { value: "plan", label: "Plan to Read" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On-Hold" },
];

const STATUS_BADGE_META = {
  watching: { label: "Watching", icon: Film },
  reading: { label: "Reading", icon: BookOpen },
  completed: { label: "Completed", icon: Check },
  finished: { label: "Completed", icon: Check },
  plan: { label: "Plan", icon: Clock },
  plan_to_watch: { label: "Plan", icon: Clock },
  plan_to_read: { label: "Plan", icon: Clock },
  planned: { label: "Plan", icon: Clock },
  on_hold: { label: "On-Hold", icon: Pause },
  paused: { label: "On-Hold", icon: Pause },
};

// Konfigurasi warna status yang selaras dengan pilihan di pop-up modal untuk tema Gelap & Terang
export function getStatusBadgeConfig(status) {
  const norm = String(status || "").toLowerCase();
  const meta = STATUS_BADGE_META[norm] || { label: norm, icon: Film };
  return {
    ...meta,
    color: getTrackerStatusTheme(norm).badgeColor,
  };
}

export function getStatusLabel(status, mediaType) {
  const options = mediaType === "manga" ? STATUS_OPTIONS_MANGA : STATUS_OPTIONS_ANIME;
  const found = options.find((opt) => opt.value === status);
  return found ? found.label : status;
}

export function TrackerPosterImage({ poster, title, mediaType, iconSize = 18 }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [poster]);

  if (poster && !imgError) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={poster}
        alt={title || "Poster"}
        onError={() => setImgError(true)}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-2 text-text-3">
      {mediaType === "manga" ? <BookOpen size={iconSize} /> : <Film size={iconSize} />}
    </div>
  );
}

export function TrackerStatusBadge({ item, mediaType, onSelect, overPoster = false }) {
  const statusConfig = getStatusBadgeConfig(item.status);
  const label = getStatusLabel(item.status, mediaType);

  const button = (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`inline-flex max-w-full items-center gap-1 border font-semibold transition-all active:scale-95 cursor-pointer ${
        overPoster
          ? "h-full rounded-md pl-2 pr-1.5 text-[9px] sm:text-[10px] leading-[1.35]"
          : "rounded-full py-0.5 pl-2.5 pr-1.5 text-[10px] sm:text-[11px] hover:scale-105"
      } ${statusConfig.color}`}
      title="Klik untuk ubah status atau kelola progres"
    >
      <span className="truncate">{label}</span>
      <ChevronDown size={10} className="opacity-90 shrink-0" />
    </button>
  );

  if (overPoster) {
    return (
      <span className="inline-flex h-[22px] max-w-full items-center rounded-md shadow-md">
        {button}
      </span>
    );
  }

  return button;
}

export function TrackerActionButtons({
  item,
  detailHref,
  isActionLoading,
  onEdit,
  onDelete,
  variant = "grid",
}) {
  const isGrid = variant === "grid";

  return (
    <div className="pointer-events-none flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className={`pointer-events-auto inline-flex items-center justify-center gap-1.5 border border-border bg-surface-2 font-semibold text-text transition-all duration-200 hover:border-secondary hover:bg-secondary hover:text-white cursor-pointer active:scale-95 shadow-xs group/btn ${
          isGrid
            ? "h-7 flex-1 min-w-0 rounded-lg px-2 text-[11px]"
            : "h-8 shrink-0 rounded-xl px-2.5 text-xs"
        }`}
        title="Kelola status & progres"
      >
        <SlidersHorizontal
          size={isGrid ? 12 : 13}
          className="text-text-2 transition-colors duration-200 group-hover/btn:text-white shrink-0"
        />
        <span className={isGrid ? "truncate" : "hidden sm:inline"}>Kelola</span>
      </button>

      <Link
        href={detailHref}
        scroll={true}
        className={`pointer-events-auto inline-flex items-center justify-center gap-1 border border-border bg-surface-2 font-semibold text-text-2 transition-all hover:border-border-hover hover:bg-surface hover:text-text cursor-pointer active:scale-95 shadow-xs shrink-0 ${
          isGrid
            ? "h-7 w-7 rounded-lg text-[11px]"
            : "h-8 w-8 sm:w-auto sm:px-2.5 rounded-xl text-xs"
        }`}
        title="Lihat detail katalog"
        aria-label={`Lihat detail ${item.title || "item"}`}
      >
        {!isGrid && <span className="hidden sm:inline">Detail</span>}
        <ExternalLink size={12} />
      </Link>

      <button
        type="button"
        onClick={() => onDelete(item)}
        disabled={isActionLoading}
        className={`pointer-events-auto inline-flex shrink-0 items-center justify-center border border-border bg-surface-2 text-text-2 transition-colors hover:border-border-hover hover:bg-surface hover:text-text cursor-pointer active:scale-95 shadow-xs disabled:opacity-40 ${
          isGrid ? "h-7 w-7 rounded-lg" : "h-8 w-8 rounded-xl"
        }`}
        title="Hapus dari tracker"
        aria-label={`Hapus ${item.title || "item"} dari tracker`}
      >
        <Trash2 size={isGrid ? 12 : 13} />
      </button>
    </div>
  );
}

export function TrackerCardOverlayButton({ title, onSelect, roundedClass = "" }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset ${roundedClass}`.trim()}
      aria-label={`Kelola status dan progres ${title || "item"}`}
      title={
        title ? `${title} — Klik untuk kelola` : "Klik untuk kelola status & progres"
      }
    />
  );
}

export function TrackerGridCard({
  item,
  mediaType,
  detailHref,
  poster,
  progress,
  total,
  percent,
  isActionLoading,
  onEdit,
  onDelete,
}) {
  const unit = mediaType === "manga" ? "Ch" : "Ep";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-border-hover hover:shadow-md">
      <TrackerCardOverlayButton
        title={item.title}
        onSelect={() => onEdit(item)}
        roundedClass="rounded-xl"
      />

      {/* Bagian Atas: Poster Vertikal 4:5 */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2">
        <div className="h-full w-full">
          <TrackerPosterImage
            poster={poster}
            title={item.title}
            mediaType={mediaType}
            iconSize={26}
          />
        </div>

        {/* Gradien halus di tepi atas agar badge overlay selalu terbaca jelas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/35 via-black/10 to-transparent"
        />

        {/* Badge Overlay Atas: Kiri Tipe Media, Kanan Status Klik-Ubah */}
        <div className="pointer-events-none absolute top-2 inset-x-2 z-20 flex items-center justify-between gap-1.5">
          <span className="inline-flex h-[22px] items-center rounded-md border border-border/80 bg-surface/95 dark:bg-bg/95 px-2 text-[9px] sm:text-[10px] leading-[1.35] font-bold uppercase tracking-wider text-text shadow-md backdrop-blur-sm shrink-0">
            {mediaType}
          </span>

          <div className="pointer-events-auto inline-flex items-center max-w-[68%] shrink-0">
            <TrackerStatusBadge
              item={item}
              mediaType={mediaType}
              onSelect={onEdit}
              overPoster
            />
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Judul Ringkas, Progres, & Tombol Aksi */}
      <div className="flex flex-1 flex-col justify-between gap-1.5 border-t border-border bg-surface p-2.5 min-w-0">
        <h3 className="block truncate text-xs sm:text-[13px] font-bold text-text transition-colors group-hover:text-accent-text leading-snug tracking-tight">
          {item.title || "Untitled"}
        </h3>

        <div className="space-y-1.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-semibold text-text-2">
              <span className="truncate tabular-nums font-mono">
                {unit} {progress} / {total > 0 ? total : "TBA"}
              </span>
              <span className="shrink-0 text-text/80 tabular-nums font-mono">
                {percent}%
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="relative z-20 pt-0.5 pointer-events-none">
            <TrackerActionButtons
              item={item}
              detailHref={detailHref}
              isActionLoading={isActionLoading}
              onEdit={onEdit}
              onDelete={onDelete}
              variant="grid"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrackerListRow({
  item,
  mediaType,
  detailHref,
  poster,
  progress,
  total,
  percent,
  isActionLoading,
  onEdit,
  onDelete,
}) {
  const unit = mediaType === "manga" ? "Ch" : "Ep";
  const progressText = `${unit} ${progress}/${total > 0 ? total : "TBA"}`;

  return (
    <div className="group relative flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 transition-colors hover:bg-surface-2/40 md:grid md:grid-cols-[minmax(0,1fr)_130px_175px_215px] md:gap-4">
      <TrackerCardOverlayButton
        title={item.title}
        onSelect={() => onEdit(item)}
      />

      {/* Kolom 1: Thumbnail Kecil + Judul + Badge Mobile */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative h-14 w-10 sm:h-15 sm:w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2 shadow-xs">
          <TrackerPosterImage
            poster={poster}
            title={item.title}
            mediaType={mediaType}
            iconSize={16}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <span className="block truncate text-xs sm:text-sm font-bold text-text transition-colors group-hover:text-accent-text">
            {item.title || "Untitled"}
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-surface-2 border border-border px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-text-2 shrink-0">
              {mediaType}
            </span>

            <div className="relative z-20 md:hidden">
              <TrackerStatusBadge
                item={item}
                mediaType={mediaType}
                onSelect={onEdit}
              />
            </div>

            <span className="md:hidden text-[10px] font-semibold text-text-2 tabular-nums font-mono">
              {progressText} ({percent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Kolom 2 (Desktop): Status */}
      <div className="relative z-20 hidden md:flex items-center pointer-events-none">
        <div className="pointer-events-auto">
          <TrackerStatusBadge
            item={item}
            mediaType={mediaType}
            onSelect={onEdit}
          />
        </div>
      </div>

      {/* Kolom 3 (Desktop): Progres Bar + Counter */}
      <div className="hidden md:flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-text-2 tabular-nums font-mono">
          <span>{progressText}</span>
          <span className="text-text/80">{percent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2 border border-border/60">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Kolom 4: Aksi */}
      <div className="relative z-20 flex items-center justify-end shrink-0 pointer-events-none">
        <TrackerActionButtons
          item={item}
          detailHref={detailHref}
          isActionLoading={isActionLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          variant="list"
        />
      </div>
    </div>
  );
}
