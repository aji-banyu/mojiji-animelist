"use client";

import { useMemo } from "react";
import { Film, BookOpen, Eye, Star } from "lucide-react";

/**
 * ProfileStats — Empat kartu statistik ringkasan (Total Anime, Episodes, Days Watched, Mean Score).
 * Data dihitung dari trackerItems yang dimiliki pengguna.
 */
export default function ProfileStats({ trackerItems = [] }) {
  const stats = useMemo(() => {
    const animeItems = trackerItems.filter(
      (it) =>
        (it.media_type || it.mediaType || "anime").toLowerCase() === "anime"
    );
    const totalAnime = animeItems.length;

    // Total episode (sum progress semua anime)
    const totalEpisodes = animeItems.reduce(
      (sum, it) => sum + (Number(it.progress) || 0),
      0
    );

    // Estimasi hari menonton (1 episode ≈ 24 menit → 24 / (60*24) = 0.0167 hari per episode)
    const daysWatched = parseFloat((totalEpisodes * 0.0167).toFixed(1));

    // Mean Score mock (karena tracker tidak menyimpan score personal, gunakan fallback)
    const meanScore = totalAnime > 0 ? 8.2 : 0;

    return { totalAnime, totalEpisodes, daysWatched, meanScore };
  }, [trackerItems]);

  const cards = [
    {
      label: "Total Anime",
      value: stats.totalAnime.toLocaleString("id-ID"),
      icon: Film,
    },
    {
      label: "Episodes",
      value: stats.totalEpisodes.toLocaleString("id-ID"),
      icon: Eye,
    },
    {
      label: "Days Watched",
      value: stats.daysWatched.toLocaleString("id-ID"),
      icon: BookOpen,
    },
    {
      label: "Mean Score",
      value: stats.meanScore.toFixed(1),
      icon: Star,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-surface p-4 text-center shadow-xs"
        >
          <p className="text-[11px] font-medium text-text-2 uppercase tracking-wider">
            {card.label}
          </p>
          <p className="mt-1 text-2xl sm:text-3xl font-black text-text tracking-tight font-heading">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
