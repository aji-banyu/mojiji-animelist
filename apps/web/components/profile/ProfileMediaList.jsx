"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Film, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/components/tracker/TrackerCards";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
  { value: "plan", label: "Plan to Watch" },
  { value: "on_hold", label: "On-Hold" },
  { value: "dropped", label: "Dropped" },
];

const MANGA_STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "reading", label: "Reading" },
  { value: "completed", label: "Completed" },
  { value: "plan", label: "Plan to Read" },
  { value: "on_hold", label: "On-Hold" },
  { value: "dropped", label: "Dropped" },
];

/**
 * ProfileMediaList — Tabel daftar anime atau manga pengguna pada tab Anime List / Manga List.
 */
export default function ProfileMediaList({
  trackerItems = [],
  mediaType = "anime",
}) {
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("title"); // title | score | progress | updated

  const isAnime = mediaType === "anime";
  const filters = isAnime ? STATUS_FILTERS : MANGA_STATUS_FILTERS;

  const filteredItems = useMemo(() => {
    let items = trackerItems.filter((it) => {
      const type = (
        it.media_type ||
        it.mediaType ||
        "anime"
      ).toLowerCase();
      return type === mediaType;
    });

    if (statusFilter) {
      items = items.filter((it) => {
        const s = (it.status || "").toLowerCase();
        if (statusFilter === "watching") return s === "watching" || s === "reading";
        return s === statusFilter;
      });
    }

    // Sort
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return (Number(b.progress) || 0) - (Number(a.progress) || 0);
        case "updated":
          return (
            new Date(b.updated_at || 0).getTime() -
            new Date(a.updated_at || 0).getTime()
          );
        case "title":
        default:
          return (a.title || "").localeCompare(b.title || "");
      }
    });

    return items;
  }, [trackerItems, mediaType, statusFilter, sortBy]);

  const MediaIcon = isAnime ? Film : BookOpen;

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none border",
              statusFilter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface border-border text-text-2 hover:bg-surface-2 hover:text-text"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabel */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <MediaIcon size={28} className="mx-auto text-text-3" strokeWidth={1.5} />
          <p className="mt-2 text-sm text-text-2">
            {statusFilter
              ? `Belum ada ${isAnime ? "anime" : "manga"} dengan status ini.`
              : `Belum ada ${isAnime ? "anime" : "manga"} di daftar.`}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_100px_120px] gap-3 px-4 py-2.5 border-b border-border bg-surface-2/50 text-[11px] font-semibold text-text-2 uppercase tracking-wider">
            <span>Judul</span>
            <span className="text-center">Status</span>
            <span className="text-center">Progres</span>
            <span className="text-right">Terakhir</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {filteredItems.map((item) => {
              const malId = item.mal_id || item.malId;
              const type = (
                item.media_type ||
                item.mediaType ||
                "anime"
              ).toLowerCase();
              const progress = Number(item.progress) || 0;
              const total = Number(item.total) || "?";
              const status = getStatusLabel(item.status, type);
              const updatedAt = item.updated_at
                ? new Date(item.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-";

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_120px] gap-1 sm:gap-3 px-4 py-3 hover:bg-surface-2/30 transition-colors items-center"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {(item.image_url || item.imageUrl) ? (
                      <Link
                        href={`/detail/?type=${type}&id=${malId}`}
                        className="shrink-0 w-9 h-12 rounded-md overflow-hidden bg-surface-2"
                      >
                        <img
                          src={item.image_url || item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </Link>
                    ) : (
                      <div className="shrink-0 w-9 h-12 rounded-md bg-surface-2 flex items-center justify-center">
                        <MediaIcon size={14} className="text-text-3" />
                      </div>
                    )}
                    <Link
                      href={`/detail/?type=${type}&id=${malId}`}
                      className="text-sm font-semibold text-text hover:text-primary-text truncate transition-colors"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <span className="text-xs text-text-2 text-center hidden sm:block">
                    {status}
                  </span>
                  <span className="text-xs text-text-2 text-center hidden sm:block tabular-nums">
                    {progress} / {total}
                  </span>
                  <span className="text-[11px] text-text-3 text-right hidden sm:block">
                    {updatedAt}
                  </span>
                  {/* Mobile meta */}
                  <div className="flex items-center gap-3 text-[11px] text-text-3 sm:hidden">
                    <span>{status}</span>
                    <span>•</span>
                    <span>
                      {progress}/{total}
                    </span>
                    <span>•</span>
                    <span>{updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[11px] text-text-3 text-center">
        {filteredItems.length}{" "}
        {isAnime ? "anime" : "manga"} ditemukan
      </p>
    </div>
  );
}
