import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Format angka skor desimal dengan koma (misal: 8.6 -> 8,6)
 */
export function formatScore(score) {
  if (!score) return "8,5";
  const str = String(score).replace(",", ".");
  const num = parseFloat(str);
  if (isNaN(num)) return "8,5";
  return num.toFixed(1).replace(".", ",");
}

/**
 * RatingBadge — Komponen reusable untuk badge skor anime/manga
 * Memakai background kuning solid (--score-bg) dan teks/bintang hitam pekat (--score-text)
 */
export function RatingBadge({
  score,
  size = "default",
  className,
  showStar = true,
}) {
  const isHero = size === "hero" || size === "pill" || size === "lg";
  const formattedScore = formatScore(score);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 bg-score-bg text-score-text font-black shadow-md select-none shrink-0",
        isHero
          ? "px-3 py-1 rounded-full text-xs"
          : "px-1.5 py-0.5 rounded-md text-[11px]",
        className
      )}
    >
      {showStar && (
        <Star
          size={isHero ? 12 : 10}
          className="fill-score-text text-score-text shrink-0"
          strokeWidth={2.5}
        />
      )}
      <span>{formattedScore}</span>
    </div>
  );
}

export default RatingBadge;

