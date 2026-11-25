"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Film, BookOpen, Plus, Trash2, ArrowUp, Check } from "lucide-react";

/**
 * ProfileHistory — Timeline kronologis semua perubahan pada tracker.
 * Disusun dari data tracker items berdasarkan updated_at.
 */

function getActionMeta(item) {
  const status = (item.status || "").toLowerCase();
  const isAnime =
    (item.media_type || item.mediaType || "anime").toLowerCase() === "anime";
  const progress = Number(item.progress) || 0;

  if (status === "watching" || status === "reading") {
    return {
      icon: isAnime ? Film : BookOpen,
      iconColor: "text-primary",
      label: `${isAnime ? "Watched" : "Read"} episode ${progress}`,
    };
  }
  if (status === "completed" || status === "finished") {
    return {
      icon: Check,
      iconColor: "text-success",
      label: "Completed",
    };
  }
  if (status === "plan") {
    return {
      icon: Plus,
      iconColor: "text-secondary-text",
      label: "Added to Watchlist",
    };
  }
  if (status === "on_hold") {
    return {
      icon: ArrowUp,
      iconColor: "text-st-hold-muted",
      label: "Put on hold",
    };
  }
  if (status === "dropped") {
    return {
      icon: Trash2,
      iconColor: "text-destructive",
      label: "Dropped",
    };
  }
  return {
    icon: Film,
    iconColor: "text-text-3",
    label: "Updated",
  };
}

export default function ProfileHistory({ trackerItems = [] }) {
  const historyItems = useMemo(() => {
    return [...trackerItems]
      .filter((it) => it.updated_at)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 20);
  }, [trackerItems]);

  if (historyItems.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <Film size={28} className="mx-auto text-text-3" strokeWidth={1.5} />
        <p className="mt-2 text-sm text-text-2">Belum ada riwayat aktivitas.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
      <div className="divide-y divide-border">
        {historyItems.map((item) => {
          const malId = item.mal_id || item.malId;
          const type = (
            item.media_type ||
            item.mediaType ||
            "anime"
          ).toLowerCase();
          const meta = getActionMeta(item);
          const Icon = meta.icon;

          const dateStr = new Date(item.updated_at).toLocaleDateString(
            "id-ID",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );

          const timeStr = new Date(item.updated_at).toLocaleTimeString(
            "id-ID",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          return (
            <div
              key={item.id + item.updated_at}
              className="flex items-start gap-3 px-4 py-3 hover:bg-surface-2/30 transition-colors"
            >
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 ${meta.iconColor}`}
              >
                <Icon size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-2">
                  <span className="font-medium">{meta.label}</span>
                  {" — "}
                  <Link
                    href={`/detail/?type=${type}&id=${malId}`}
                    className="font-semibold text-primary-text hover:underline"
                  >
                    {item.title}
                  </Link>
                </p>
                <p className="text-[11px] text-text-3">
                  {dateStr} · {timeStr}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
