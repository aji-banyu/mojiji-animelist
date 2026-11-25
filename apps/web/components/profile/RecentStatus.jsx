"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Film, BookOpen } from "lucide-react";

/**
 * RecentStatus — Menampilkan item tracker terbaru yang sedang ditonton/dibaca.
 */
export default function RecentStatus({ trackerItems = [] }) {
  const recent = useMemo(() => {
    // Ambil item aktif terakhir yang sedang watching/reading
    const active = trackerItems
      .filter((it) => {
        const s = (it.status || "").toLowerCase();
        return s === "watching" || s === "reading";
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at || 0).getTime() -
          new Date(a.updated_at || 0).getTime()
      );
    return active[0] || null;
  }, [trackerItems]);

  if (!recent) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
        <h3 className="text-sm font-bold text-text tracking-tight">
          Recent Status
        </h3>
        <p className="mt-3 text-xs text-text-3">
          Belum ada anime/manga yang sedang ditonton.
        </p>
      </div>
    );
  }

  const isAnime =
    (recent.media_type || recent.mediaType || "anime").toLowerCase() ===
    "anime";
  const StatusIcon = isAnime ? Film : BookOpen;
  const statusLabel = isAnime ? "Watched" : "Read";
  const progress = Number(recent.progress) || 0;
  const total = Number(recent.total) || "?";

  const timeAgo = (() => {
    const diff = Date.now() - new Date(recent.updated_at || 0).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Baru saja";
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  })();

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
      <h3 className="text-sm font-bold text-text tracking-tight">
        Recent Status
      </h3>
      <div className="mt-3 flex items-start gap-3">
        {recent.image_url || recent.imageUrl ? (
          <Link
            href={`/detail/?type=${isAnime ? "anime" : "manga"}&id=${recent.mal_id || recent.malId}`}
            className="shrink-0 w-12 h-16 rounded-md overflow-hidden bg-surface-2"
          >
            <img
              src={recent.image_url || recent.imageUrl}
              alt={recent.title}
              className="h-full w-full object-cover"
            />
          </Link>
        ) : (
          <div className="shrink-0 w-12 h-16 rounded-md bg-surface-2 flex items-center justify-center">
            <StatusIcon size={18} className="text-text-3" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-2 flex items-center gap-1">
            <StatusIcon size={12} className="text-primary shrink-0" />
            <span>
              {statusLabel} ep {progress} of {total}
            </span>
          </p>
          <Link
            href={`/detail/?type=${isAnime ? "anime" : "manga"}&id=${recent.mal_id || recent.malId}`}
            className="text-sm font-semibold text-primary-text hover:underline truncate block"
          >
            {recent.title}
          </Link>
          <p className="text-[11px] text-text-3">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
}
