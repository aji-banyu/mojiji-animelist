"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import RatingBadge from "@/components/ui/RatingBadge";

// Helper inisial judul cerdas untuk fallback visual jika poster gagal dimuat
function getTitleInitials(title = "") {
  if (!title) return "MJ";
  const clean = title.replace(/[^\w\s]/gi, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  if (words.length >= 2) {
    if (words[1].toLowerCase() === "no" && words.length >= 2) {
      return words[0][0].toUpperCase() + "n";
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
}

// Format skor desimal dengan koma (misal: 8.6 -> 8,6)
function formatScore(score) {
  if (!score) return "8,5";
  const str = String(score).replace(",", ".");
  const num = parseFloat(str);
  if (isNaN(num)) return "8,5";
  return num.toFixed(1).replace(".", ",");
}

// Format episode sesuai kontrak: "12 Eps" (atau "Ch" untuk manga)
function formatEpisodes(item) {
  const eps = item.episodes || item.metaCount || "";
  const str = String(eps).trim();
  if (!str) return item.type === "manga" ? "Manga" : "TV";

  // Sudah berupa "12 Eps"
  if (/^\d+\s*eps$/i.test(str)) {
    const num = str.match(/\d+/)[0];
    return `${num} Eps`;
  }
  // Berupa "EPS. 12" atau "eps. 12"
  if (/^eps\.?\s*\d+/i.test(str)) {
    const num = str.match(/\d+/)?.[0];
    return num ? `${num} Eps` : str;
  }
  // Berupa angka saja
  if (/^\d+$/.test(str)) {
    return `${str} ${item.type === "manga" ? "Ch" : "Eps"}`;
  }
  // Berupa "CH. 120" atau "ch 120"
  if (/^ch\.?\s*\d+/i.test(str)) {
    const num = str.match(/\d+/)?.[0];
    return num ? `${num} Ch` : str;
  }
  return str;
}

// Format tahun (misal: "2024")
function formatYear(item) {
  if (item.year) {
    const str = String(item.year).trim();
    const match = str.match(/\d{4}/);
    if (match) return match[0];
    return str;
  }
  return "2024";
}

// Format total watch / views (misal: "2.1m", "850k")
function formatViews(item) {
  if (item.views) return String(item.views).trim();
  return "1.2m";
}

export default function CatalogCard({ item, className = "" }) {
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const type = item.type || "anime";
  const id = item.malId || item.id;
  const title = item.title || item.title_english || "Untitled";
  const eps = formatEpisodes(item);
  const year = formatYear(item);
  const views = formatViews(item);
  const score = formatScore(item.score);
  const formatBadge = item.typeLabel || item.format || (type === "anime" ? "TV" : "Manga");
  const initials = item.initials || getTitleInitials(title);

  return (
    <Link
      href={`/detail/?type=${type}&id=${id}`}
      scroll={true}
      className={`group relative flex flex-col rounded-xl overflow-hidden border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-border-hover shadow-sm hover:shadow-md cursor-pointer select-none ${className}`}
    >
      {/* Bagian Atas: Gambar Poster Asli */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg">
        {!imgError && item.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image}
            alt={title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface">
            <span className="text-2xl sm:text-3xl font-black text-text/80 font-['Bricolage_Grotesque']">
              {initials}
            </span>
          </div>
        )}

        {/* Badge Atas: Kiri Rating Kuning Solid, Kanan Tipe Pekat Solid (Tidak Bertabrakan) */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none">
          {/* Badge Rating Reusable: Background Kuning Solid, Teks & Ikon Hitam Pekat */}
          <RatingBadge score={score} />

          {/* Badge Tipe/Format: Background Pekat Gelap Solid (Tidak Tembus / Tidak Bertabrakan dengan Poster) */}
          <div className="inline-flex items-center rounded-md bg-bg border border-border px-2 py-0.5 text-[11px] font-bold text-text shadow-md">
            <span>{formatBadge}</span>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Background Sendiri Berisi Judul & Metadata (12 Eps, Tahun, Total Watch) */}
      <div className="p-2.5 sm:p-3 bg-surface border-t border-border flex flex-col justify-between flex-1 gap-1.5 min-w-0">
        <h3
          title={title}
          className="text-xs sm:text-[13px] font-bold text-text line-clamp-1 group-hover:text-accent-text transition-colors leading-snug tracking-tight"
        >
          {title}
        </h3>

        {/* Metadata Baris: [12 Eps • 2024] [👁 2.1m] */}
        <div className="flex items-center justify-between text-[11px] text-text-2 font-medium pt-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-text/90">{eps}</span>
            <span className="text-text-3 text-[9px]">•</span>
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-text-2 shrink-0 pl-1">
            <Eye size={11} className="text-text-3" />
            <span className="tabular-nums font-mono">{views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

