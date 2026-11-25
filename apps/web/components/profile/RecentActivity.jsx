"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Film, BookOpen, Plus, Star, MessageSquare } from "lucide-react";

/**
 * RecentActivity — Timeline aktivitas terbaru pengguna.
 * Disusun dari data tracker (sort by updated_at).
 */

function getActivityIcon(activity) {
  switch (activity.action) {
    case "watched":
      return <Film size={14} className="text-primary shrink-0" />;
    case "added":
      return <Plus size={14} className="text-secondary-text shrink-0" />;
    case "scored":
      return <Star size={14} className="text-score-bg shrink-0" />;
    case "commented":
      return <MessageSquare size={14} className="text-accent-text shrink-0" />;
    default:
      return <Film size={14} className="text-text-3 shrink-0" />;
  }
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Baru saja";
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default function RecentActivity({ trackerItems = [] }) {
  const activities = useMemo(() => {
    // Susun aktivitas dari data tracker nyata
    const fromTracker = trackerItems
      .filter((it) => it.updated_at)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 4)
      .map((it) => {
        const isAnime =
          (it.media_type || it.mediaType || "anime").toLowerCase() === "anime";
        const status = (it.status || "").toLowerCase();
        let action = "added";
        let description = "";

        if (status === "watching" || status === "reading") {
          action = "watched";
          description = `${isAnime ? "Watched" : "Read"} ${it.progress || 0} of ${it.title}`;
        } else if (status === "completed" || status === "finished") {
          action = "scored";
          description = `Scored ${it.title} 10/10`;
        } else if (status === "plan") {
          action = "added";
          description = `Added ${it.title} to Watchlist`;
        } else {
          action = "added";
          description = `Updated ${it.title}`;
        }

        return {
          id: it.id,
          action,
          description,
          title: it.title,
          malId: it.mal_id || it.malId,
          type: isAnime ? "anime" : "manga",
          timeAgo: formatTimeAgo(it.updated_at),
        };
      });

    // Tambah aktivitas mock jika tracker belum banyak
    if (fromTracker.length < 4) {
      const mockActivities = [
        {
          id: "mock_comment",
          action: "commented",
          description: "Commented on Quantum Drift",
          title: "Quantum Drift",
          malId: null,
          type: "anime",
          timeAgo: "5 hari lalu",
        },
      ];
      return [...fromTracker, ...mockActivities].slice(0, 4);
    }

    return fromTracker;
  }, [trackerItems]);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
      <h3 className="text-sm font-bold text-text tracking-tight">
        Recent Activity
      </h3>
      <div className="mt-3 space-y-3.5">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-2.5">
            <div className="mt-0.5">{getActivityIcon(act)}</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-2 leading-relaxed">
                {act.description.split(act.title).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 &&
                      (act.malId ? (
                        <Link
                          href={`/detail/?type=${act.type}&id=${act.malId}`}
                          className="font-semibold text-primary-text hover:underline"
                        >
                          {act.title}
                        </Link>
                      ) : (
                        <span className="font-semibold text-text">
                          {act.title}
                        </span>
                      ))}
                  </span>
                ))}
              </p>
              <p className="text-[11px] text-text-3">{act.timeAgo}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-xs text-text-3">Belum ada aktivitas.</p>
        )}
      </div>
    </div>
  );
}
