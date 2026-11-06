"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bookmark,
  Film,
  BookOpen,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { fetchHomeCategoryData } from "@/lib/homeData";

const slides = [
  "/images/slide1.webp",
  "/images/slide2.webp",
  "/images/slide3.webp",
  "/images/slide4.webp",
];

/**
 * Komponen Card Item Katalog Beranda (Format Grid sesuai Gambar 2)
 */
function CatalogCard({ item, mediaType }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/detail?type=${mediaType}&id=${item.malId || item.id}`}
      scroll={true}
      className="group flex flex-col overflow-hidden rounded-xl bg-[#151924] border border-white/10 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#6D4AFF]/50 hover:shadow-xl hover:shadow-[#6D4AFF]/10 cursor-pointer"
    >
      {/* Poster Potret dengan Badges di Pojok Atas */}
      <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-lg bg-[#181A20]">
        {!imgError && item.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-500">
            {mediaType === "anime" ? <Film size={32} /> : <BookOpen size={32} />}
          </div>
        )}

        {/* Badge Kiri Atas: Status Waktu / Rilis (sesuai Gambar 2) */}
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shadow-md backdrop-blur-md border border-white/10">
          <Clock size={11} className="text-[#8B5CF6] shrink-0" />
          <span className="truncate max-w-[65px]">{item.statusBadge || "UP"}</span>
        </div>

        {/* Badge Kanan Atas: Bendera / Asal Negara (sesuai Gambar 2) */}
        <div className="absolute top-2 right-2 flex items-center justify-center rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-white shadow-md backdrop-blur-md border border-white/10">
          <span>{item.country || "🇯🇵"}</span>
        </div>
      </div>

      {/* Judul Anime / Manga */}
      <h3
        title={item.title}
        className="mt-2.5 text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#7C5CFF] transition-colors leading-snug"
      >
        {item.title}
      </h3>

      {/* Metadata Chip Bagian Bawah: Views / Total Count (sesuai Gambar 2) */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 font-medium pt-1 border-t border-white/5">
        <span className="flex items-center gap-1 text-neutral-300">
          <Eye size={12} className="text-neutral-500" />
          <span>{item.views || "1.2m"}</span>
        </span>
        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-neutral-300 border border-white/5">
          {item.metaCount}
        </span>
      </div>
    </Link>
  );
}

/**
 * Komponen Pagination Kotak Rounded (Sesuai Gambar 3)
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-6 sm:pt-8" aria-label="Navigasi Halaman">
      {/* Tombol Panah Kiri (<) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Halaman Sebelumnya"
        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-white/10 bg-[#1F1F23] text-white transition-all hover:bg-[#2A2A30] hover:border-white/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>

      {/* Tombol Nomor Halaman [ 1 ] [ 2 ] [ 3 ] [ 4 ] */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl text-sm sm:text-base font-bold transition-all active:scale-95 cursor-pointer ${
              isActive
                ? "bg-[#6D4AFF] text-white shadow-lg shadow-[#6D4AFF]/30 border border-[#7C5CFF]"
                : "border border-white/5 bg-[#1F1F23] text-neutral-200 hover:bg-[#2A2A30] hover:text-white"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Tombol Panah Kanan (>) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Halaman Selanjutnya"
        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-white/10 bg-[#1F1F23] text-white transition-all hover:bg-[#2A2A30] hover:border-white/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/**
 * Komponen Section Katalog (Top Rated & Klasik Legendaris)
 */
function CatalogSection({ category, title, mediaType, delayMs = 0 }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], pagination: { currentPage: 1, totalPages: 4 } });
  const [isLoading, setIsLoading] = useState(true);

  // Muat data saat kategori, tipe media, atau halaman berubah dengan jeda bertahap
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (delayMs > 0 && page === 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      const res = await fetchHomeCategoryData(category, mediaType, page, 12);
      if (res && res.items) {
        setData(res);
      }
    } catch {
      // Fallback ditangani di dalam fetchHomeCategoryData
    } finally {
      setIsLoading(false);
    }
  }, [category, mediaType, page, delayMs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page ke 1 saat mediaType berubah
  useEffect(() => {
    setPage(1);
  }, [mediaType]);

  return (
    <section className="space-y-5 pt-4">
      {/* Header Section (Murni Teks Judul Bersih Tanpa Sort / Label Tambahan) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          {title}
        </h2>
        <span className="text-xs sm:text-sm font-semibold text-neutral-400">
          Halaman {page} dari {data.pagination?.totalPages || 4}
        </span>
      </div>

      {/* Grid Katalog 12 Kartu (2 baris x 6 kolom) */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-[#151924] p-2.5 space-y-3">
              <div className="aspect-[3/4.2] w-full rounded-lg bg-neutral-800" />
              <div className="h-4 w-3/4 rounded bg-neutral-800" />
              <div className="h-3 w-1/2 rounded bg-neutral-800/60" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {data.items.map((item) => (
            <CatalogCard key={item.malId || item.id} item={item} mediaType={mediaType} />
          ))}
        </div>
      )}

      {/* Pagination Kontrol */}
      <Pagination
        currentPage={page}
        totalPages={data.pagination?.totalPages || 4}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </section>
  );
}

export default function HomePage() {
  // State Slider Carousel (Aset dari Landing Page)
  const [currentSlide, setCurrentSlide] = useState(0);

  // State Tunggal Global Switcher Media: "anime" | "manga" (untuk ketiga section)
  const [mediaType, setMediaType] = useState("anime");

  // Timer otomatis pergantian slide hero setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-5.25rem)] bg-[#09090B] text-white selection:bg-[#6D4AFF] selection:text-white pb-24">
        {/* ========================================================================= */}
        {/* 1. FULL-WIDTH CINEMATIC HERO BANNER (Layout Full Edge-to-Edge)            */}
        {/* ========================================================================= */}
        <section className="relative w-full h-[calc(100vh-5.25rem)] min-h-[500px] max-h-[640px] overflow-hidden bg-black">
          {/* 4 Background Slides dengan Efek Crossfade Halus */}
          {slides.map((src, idx) => (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}

          {/* Lapisan Gradasi: Film Gelap, Gradasi Kiri Teks, & Gradasi Bawah Melebur ke Halaman */}
          <div className="pointer-events-none absolute inset-0 bg-black/25" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/80 via-35% to-transparent to-75%" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#09090B] via-[#09090B]/75 to-transparent" />

          {/* Konten Hero: Digeser ke Kiri agar Proporsional & Tidak Menutupi Wajah Eren */}
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-10 lg:px-14">
            <div className="max-w-xl space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-white drop-shadow-2xl leading-[1.12]">
                Perjalanan Dalam <br /> Satu Ruang
              </h1>

              <p className="text-sm sm:text-base text-neutral-200/95 leading-relaxed drop-shadow max-w-lg">
                Temukan anime dan manga favoritmu, lacak progres, dan ikuti episode terbaru setiap musimnya.
              </p>

              <div className="pt-2">
                <Link
                  href="/tracker"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-red-950/40 transition-all hover:bg-[#b91c1c] active:scale-95 cursor-pointer"
                >
                  <Bookmark size={16} />
                  <span>Buka Tracker Saya</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Indikator Titik (Dots) Slide Posisi Center di Bawah Banner */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? "w-8 bg-[#DC2626] shadow-md shadow-red-900/50"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. GLOBAL SWITCHER BAR (Tunggal untuk 3 Section Sekaligus: Anime & Manga)  */}
        {/* ========================================================================= */}
        <div className="sticky top-14 z-30 border-b border-white/10 bg-[#09090B]/90 backdrop-blur-md py-3.5 shadow-lg">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400">
                Pilih Kategori:
              </span>
            </div>

            {/* Switcher Pill Anime & Manga */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#181A20] border border-white/10 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMediaType("anime")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mediaType === "anime"
                    ? "bg-[#6D4AFF] text-white shadow-md shadow-[#6D4AFF]/30"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Film size={16} />
                <span>Anime</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType("manga")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mediaType === "manga"
                    ? "bg-[#6D4AFF] text-white shadow-md shadow-[#6D4AFF]/30"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <BookOpen size={16} />
                <span>Manga</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DUA SECTION KATALOG: TOP RATED & KLASIK LEGENDARIS                     */}
        {/* ========================================================================= */}
        <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-8 space-y-16">
          {/* Section 1: Top Rated */}
          <CatalogSection
            category="top_rated"
            title="Top Rated"
            mediaType={mediaType}
            delayMs={0}
          />

          {/* Section 2: Klasik Legendaris */}
          <CatalogSection
            category="classic"
            title="Klasik Legendaris"
            mediaType={mediaType}
            delayMs={250}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
