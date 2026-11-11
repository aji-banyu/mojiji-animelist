"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Plus } from "lucide-react";
import RatingBadge from "@/components/ui/RatingBadge";
import useFilterStore from "@/store/filterStore";
import useTrackerStore, { getTrackerCompositeKey } from "@/store/trackerStore";

/**
 * Isolated Hero Carousel Banner for Beranda so 6s auto-slide ticks do not re-render sliders.
 */
export default function HeroBanner({ heroItems = [], onNotify }) {
  const currentHeroIndex = useFilterStore((state) => state.homeHeroIndex);
  const setCurrentHeroIndex = useFilterStore((state) => state.setHomeHeroIndex);

  const trackerItems = useTrackerStore((state) => state.items);
  const addTrackerItem = useTrackerStore((state) => state.addTrackerItem);

  const [submittingId, setSubmittingId] = useState(null);

  const trackedKeys = useMemo(() => {
    const keys = new Set();
    for (const it of trackerItems) {
      keys.add(
        getTrackerCompositeKey(
          it.mediaType || it.media_type || "anime",
          it.malId ?? it.mal_id
        )
      );
    }
    return keys;
  }, [trackerItems]);

  useEffect(() => {
    if (heroItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroItems.length, setCurrentHeroIndex]);

  const safeHeroIndex =
    heroItems.length > 0 ? currentHeroIndex % heroItems.length : 0;
  const activeHero = heroItems[safeHeroIndex] || heroItems[0];

  if (!activeHero) return null;

  const heroType = activeHero.type || "anime";
  const isTracked = trackedKeys.has(getTrackerCompositeKey(heroType, activeHero.id));
  const isSubmitting = submittingId === activeHero.id;

  const handleQuickAdd = async (item) => {
    if (isSubmitting) return;

    const itemType = item.type || "anime";
    if (trackedKeys.has(getTrackerCompositeKey(itemType, item.id))) {
      onNotify?.(`"${item.title}" sudah ada di Tracker kamu.`, "info");
      return;
    }

    setSubmittingId(item.id);
    try {
      const result = await addTrackerItem({
        type: itemType,
        malId: item.id,
        status: "plan",
        progress: 0,
        metadata: {
          title: item.title,
          imageUrl: item.image,
        },
      });

      if (result.alreadyExists) {
        onNotify?.(`"${item.title}" sudah ada di Tracker kamu.`, "info");
      } else {
        onNotify?.(`"${item.title}" ditambahkan ke Tracker.`, "success");
      }
    } catch (err) {
      const msg =
        err?.status === 401
          ? "Sesi login berakhir. Silakan masuk kembali."
          : err?.isOffline || err?.status === 503 || err?.code === "ERR_NETWORK"
          ? "Koneksi terputus. Gagal menambahkan ke Tracker."
          : err?.error?.message || "Gagal menambahkan ke Tracker.";
      onNotify?.(msg, "error");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <section className="relative w-full bg-bg min-h-[480px] sm:min-h-[540px] flex flex-col justify-end overflow-hidden">
      {/* Latar Belakang Wallpaper/Backdrop Anime HD 1080p */}
      {activeHero.bannerImage || activeHero.image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={activeHero.bannerImage || activeHero.image}
          alt={activeHero.title}
          className="absolute inset-0 h-full w-full object-cover object-center select-none scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}

      {/* Scrim Radial Mobile (< sm) */}
      <div
        className="sm:hidden absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 80% at 0% 85%, var(--bg) 0%, var(--bg) 35%, color-mix(in srgb, var(--bg) 90%, transparent) 55%, color-mix(in srgb, var(--bg) 40%, transparent) 75%, transparent 100%)",
        }}
      />

      {/* Scrim Radial Desktop (>= sm) */}
      <div
        className="hidden sm:block absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 62% 80% at 0% 80%, var(--bg) 0%, var(--bg) 26%, color-mix(in srgb, var(--bg) 90%, transparent) 44%, color-mix(in srgb, var(--bg) 68%, transparent) 58%, color-mix(in srgb, var(--bg) 42%, transparent) 72%, color-mix(in srgb, var(--bg) 20%, transparent) 85%, color-mix(in srgb, var(--bg) 6%, transparent) 95%, transparent 100%)",
        }}
      />

      {/* Masking Halus Batas Bawah */}
      <div
        className="absolute inset-x-0 bottom-0 h-14 sm:h-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--bg) 0%, color-mix(in srgb, var(--bg) 85%, transparent) 30%, color-mix(in srgb, var(--bg) 30%, transparent) 65%, transparent 100%)",
        }}
      />

      {/* Konten Hero Kiri */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-7 sm:pb-9 flex flex-col justify-end">
        <div className="max-w-2xl space-y-4 sm:space-y-5 pb-3">
          {/* Chip Skor & Genre */}
          <div className="flex items-center gap-2 flex-wrap">
            <RatingBadge score={activeHero.score} size="hero" />

            {(activeHero.genres || ["Aksi", "Petualangan"]).slice(0, 2).map((genre, idx) => {
              const isSecond = idx === 1;
              return (
                <span
                  key={genre}
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold transition-all select-none shadow-xs ${
                    isSecond
                      ? "bg-surface text-accent-text border border-accent/30 hover:border-accent/50"
                      : "bg-surface text-secondary-text border border-secondary/35 hover:border-secondary/60"
                  }`}
                >
                  {genre}
                </span>
              );
            })}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text tracking-tight leading-[1.1] font-['Bricolage_Grotesque'] select-none">
            {activeHero.title}
          </h1>

          <p className="text-sm sm:text-[15px] font-medium text-text leading-relaxed line-clamp-3 max-w-xl">
            {activeHero.synopsis}
          </p>

          {/* Tombol Aksi Hero */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/detail/?type=${heroType}&id=${activeHero.id}`}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-accent hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Lihat detail
            </Link>

            <button
              type="button"
              onClick={() => handleQuickAdd(activeHero)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-secondary hover:bg-secondary-hover text-white transition-all active:scale-95 cursor-pointer shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : isTracked ? (
                <>
                  <Check size={14} />
                  <span>Di Tracker</span>
                </>
              ) : (
                <>
                  <Plus size={14} />
                  <span>Tracker</span>
                </>
              )}
            </button>
          </div>

          {/* Indikator Banner (6 Strip) */}
          <div className="flex items-center gap-2 pt-6 pb-1">
            {heroItems.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentHeroIndex(idx)}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  safeHeroIndex === idx
                    ? "w-8 bg-indicator-active shadow-xs"
                    : "w-8 bg-indicator-inactive hover:bg-indicator-inactive-hover"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

