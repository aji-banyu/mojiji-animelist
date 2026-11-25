"use client";

import { useMemo } from "react";

/**
 * Data genre mock untuk favorit. Di masa depan bisa dihitung dari metadata tracker.
 */
const MOCK_GENRES = [
  { name: "Drama", percent: 40.2, color: "bg-accent" },
  { name: "Action", percent: 20.5, color: "bg-primary" },
  { name: "Fantasy", percent: 20.5, color: "bg-secondary" },
  { name: "Sci-Fi", percent: 15.7, color: "bg-primary/60" },
];

/**
 * TopGenres — Menampilkan bar chart horizontal genre favorit pengguna.
 */
export default function TopGenres({ trackerItems = [] }) {
  const genres = useMemo(() => {
    // Di masa depan, bisa hitung dari trackerItems → catalog lookup → genre list
    // Saat ini gunakan data mock
    return MOCK_GENRES;
  }, [trackerItems]);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
      <h3 className="text-sm font-bold text-text tracking-tight">
        Top Genres
      </h3>
      <div className="mt-4 space-y-3">
        {genres.map((genre) => (
          <div key={genre.name} className="flex items-center gap-3">
            <span className="w-14 text-xs font-medium text-text-2 shrink-0">
              {genre.name}
            </span>
            <div className="relative flex-1 h-2.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${genre.color} transition-all duration-500`}
                style={{ width: `${genre.percent}%` }}
              />
            </div>
            <span className="w-10 text-right text-[11px] font-semibold text-text-2 tabular-nums">
              {genre.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
