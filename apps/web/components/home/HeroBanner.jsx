"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus, BookMarked, X } from "lucide-react";
import RatingBadge from "@/components/ui/RatingBadge";
import useAuthStore from "@/store/authStore";
import useFilterStore from "@/store/filterStore";
import useTrackerStore, { getTrackerCompositeKey } from "@/store/trackerStore";

/**
 * Isolated Hero Carousel Banner for Beranda so 6s auto-slide ticks do not re-render sliders.
 */
export default function HeroBanner({ heroItems = [], onNotify }) {
  const router = useRouter();
  const currentHeroIndex = useFilterStore((state) => state.homeHeroIndex);
  const setCurrentHeroIndex = useFilterStore((state) => state.setHomeHeroIndex);

  const trackerItems = useTrackerStore((state) => state.items);
  const addTrackerItem = useTrackerStore((state) => state.addTrackerItem);

  const [submittingId, setSubmittingId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showAuthModal) {
        setShowAuthModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAuthModal]);

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

  // Auto-slide 6 detik sinkron dengan timer animasi progress bar (Opsi 1)
  useEffect(() => {
    if (heroItems.length <= 1) return;
    const timer = setTimeout(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [heroItems.length, currentHeroIndex, setCurrentHeroIndex]);

  const safeHeroIndex =
    heroItems.length > 0 ? currentHeroIndex % heroItems.length : 0;
  const activeHero = heroItems[safeHeroIndex] || heroItems[0];

  if (!activeHero) return null;

  const heroType = activeHero.type || "anime";
  const heroFormat = (() => {
    const raw = activeHero.format || activeHero.typeLabel;
    if (raw && raw.toLowerCase() !== heroType.toLowerCase()) {
      return raw;
    }
    return heroType === "anime" ? "TV" : null;
  })();
  const isTracked = trackedKeys.has(getTrackerCompositeKey(heroType, activeHero.id));
  const isSubmitting = submittingId === activeHero.id;

  const handleQuickAdd = async (item) => {
    if (isSubmitting) return;

    const user = useAuthStore.getState().user;
    if (!user) {
      setShowAuthModal(true);
      return;
    }

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
        <div className="max-w-2xl space-y-3 sm:space-y-4 pb-3">
          {/* Judul — di atas (Opsi A) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text tracking-tight leading-[1.1] font-heading select-none">
            {activeHero.title}
          </h1>

          {/* Badge metadata: RatingBadge (tetap) + Tahun + Format + Tipe + Genre — di bawah judul */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Rating dipertahankan 100% seperti semula */}
            <RatingBadge score={activeHero.score} size="hero" />

            {/* Tahun rilis */}
            {activeHero.year ? (
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-surface-2 text-text dark:text-[#d4e4ed] border border-border/70 text-xs font-semibold select-none">
                {activeHero.year}
              </span>
            ) : null}

            {/* Format (TV, ONA, Movie, dsb) */}
            {heroFormat ? (
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-surface-2 text-text dark:text-[#d4e4ed] border border-border/70 text-xs font-semibold select-none">
                {heroFormat}
              </span>
            ) : null}

            {/* Tipe Media — Anime / Manga (hanya jika berbeda dari heroFormat) */}
            {heroType && heroType.toLowerCase() !== heroFormat?.toLowerCase() ? (
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-surface-2 text-text dark:text-[#d4e4ed] border border-border/70 text-xs font-semibold select-none capitalize">
                {heroType}
              </span>
            ) : null}

            {/* Genre pertama saja */}
            {activeHero.genres?.[0] ? (
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-surface-2 text-text dark:text-[#d4e4ed] border border-border/70 text-xs font-semibold select-none">
                {activeHero.genres[0]}
              </span>
            ) : null}
          </div>

          <p className="text-sm sm:text-[15px] font-medium text-text leading-relaxed line-clamp-3 max-w-xl">
            {activeHero.synopsis}
          </p>

          {/* Tombol Aksi Hero */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/detail/?type=${heroType}&id=${activeHero.id}`}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm shadow-sm shadow-primary/25 transition-all active:scale-95 cursor-pointer"
            >
              Lihat detail
            </Link>

            <button
              type="button"
              onClick={() => handleQuickAdd(activeHero)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-secondary hover:bg-secondary-hover text-secondary-foreground transition-all active:scale-95 cursor-pointer shadow-sm shadow-secondary/25 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : isTracked ? (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  <span>Di Tracker</span>
                </>
              ) : (
                <>
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Tracker</span>
                </>
              )}
            </button>
          </div>

          {/* Indikator Banner (6 Strip dengan Animasi Progress Bar Aksen Pink Pengisi Waktu 6 Detik) */}
          <div className="flex items-center gap-2 pt-6 pb-1">
            {heroItems.map((_, idx) => {
              const isActive = safeHeroIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentHeroIndex(idx)}
                  aria-label={`Pindah ke slide ${idx + 1}`}
                  className={`relative h-1.5 w-7 sm:w-8 rounded-full overflow-hidden transition-colors duration-300 cursor-pointer ${isActive
                    ? "bg-indicator-inactive shadow-xs"
                    : "bg-indicator-inactive hover:bg-indicator-inactive-hover"
                    }`}
                >
                  {isActive && (
                    <span
                      key={safeHeroIndex}
                      className="absolute inset-y-0 left-0 rounded-full bg-accent shadow-xs"
                      style={{
                        animation: "heroProgressBar 6s linear forwards",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Prompt Auth — Desain Sinematik untuk Tamu yang Mengklik + Tracker di Hero Banner */}
      {showAuthModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hero-auth-modal-title"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md rounded-t-xl sm:rounded-xl overflow-hidden shadow-2xl text-text bg-surface border border-border animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-250"
          >
            {/* ── ZONA HEADER: Banner sinematik + gradient scrim bawah ── */}
            <div className="relative h-[220px] sm:h-[260px] w-full overflow-hidden bg-surface-2">
              {/* Gambar banner hero (bannerImage lebih lebar, fallback ke poster) */}
              {activeHero.bannerImage || activeHero.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activeHero.bannerImage || activeHero.image}
                  alt={activeHero.title || "Banner"}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover object-center select-none scale-105"
                  style={{ filter: "brightness(0.78)" }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-surface-2 to-surface" />
              )}

              {/* Scrim bawah — menyatu halus ke konten kartu */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-surface via-surface/80 to-transparent" />

              {/* Tombol close ✕ pojok kanan atas */}
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                aria-label="Tutup"
                className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-2/80 text-text hover:bg-surface-2 border border-border/40 transition-colors cursor-pointer backdrop-blur-sm"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* ── ZONA KONTEN: Di atas background semantik kartu ── */}
            <div className="bg-surface px-5 pb-6 pt-0 space-y-4 -mt-1">
              {/* Judul & Badge Metadata */}
              <div className="space-y-2">
                <h3
                  id="hero-auth-modal-title"
                  className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-text font-heading"
                >
                  {activeHero.title || "Untitled"}
                </h3>

                {/* Badge kapsul metadata */}
                <div className="flex flex-wrap items-center gap-2">
                  {activeHero.year ? (
                    <span className="rounded-md bg-surface-2 border border-border/60 px-2 py-0.5 text-[11px] font-semibold text-text dark:text-[#d4e4ed]">
                      {activeHero.year}
                    </span>
                  ) : null}
                  <span className="rounded-md bg-surface-2 border border-border/60 px-2 py-0.5 text-[11px] font-semibold text-text dark:text-[#d4e4ed] capitalize">
                    {heroType}
                  </span>
                  {activeHero.score ? (
                    <span className="rounded-md bg-surface-2 border border-border/60 px-2 py-0.5 text-[11px] font-semibold text-text dark:text-[#d4e4ed]">
                      ★ {activeHero.score}
                    </span>
                  ) : null}
                  {activeHero.genres?.[0] ? (
                    <span className="rounded-md bg-surface-2 border border-border/60 px-2 py-0.5 text-[11px] font-semibold text-text dark:text-[#d4e4ed]">
                      {activeHero.genres[0]}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Sinopsis ringkas — maks 3 baris */}
              {activeHero.synopsis ? (
                <p className="text-xs sm:text-sm text-text-2 leading-relaxed line-clamp-3">
                  {activeHero.synopsis}
                </p>
              ) : null}

              {/* CTA utama: Masuk sesuai warna tema + tautan daftar */}
              <div className="pt-1 space-y-3">
                <Link
                  href="/login/?redirect=/"
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary hover:bg-primary-hover active:scale-95 px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all select-none"
                >
                  <span>Masuk untuk Melacak</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>

                <p className="text-center text-xs text-text-3">
                  Belum punya akun?{" "}
                  <Link
                    href="/register/?redirect=/"
                    className="font-semibold text-primary underline underline-offset-2 hover:opacity-85 transition-opacity"
                  >
                    Daftar Akun Gratis
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

