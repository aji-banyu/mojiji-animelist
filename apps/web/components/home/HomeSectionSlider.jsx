"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import SegmentedSwitch from "@/components/ui/SegmentedSwitch";

const SECTION_TABS = [
  { id: "all", label: "Semua" },
  { id: "anime", label: "Anime" },
  { id: "manga", label: "Manga" },
];

/**
 * Horizontal catalog slider section with type filter switch and scroll arrows.
 */
export default function HomeSectionSlider({
  title,
  sortBy = "popularity",
  currentTab,
  onTabChange,
  items = [],
  isLoading = false,
}) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -520 : 520;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const exploreParams = new URLSearchParams();
  if (currentTab === "anime" || currentTab === "manga") {
    exploreParams.set("type", currentTab);
  }
  if (sortBy && sortBy !== "popularity") {
    exploreParams.set("sort", sortBy);
  }
  const exploreQuery = exploreParams.toString();
  const exploreHref = exploreQuery ? `/explore/?${exploreQuery}` : "/explore/";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-1 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight font-heading select-none">
            {title}
          </h2>
          <Link
            href={exploreHref}
            className="group inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover py-1 transition-colors cursor-pointer"
          >
            <span className="group-hover:underline underline-offset-4">Lihat semua</span>
            <ChevronRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <SegmentedSwitch
          options={SECTION_TABS}
          value={currentTab}
          onChange={onTabChange}
          className="w-52 sm:w-60"
          ariaLabel={`Filter Tipe ${title}`}
          variant="transparent"
        />
      </div>

      <div className="relative group/slider">
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label={`Geser ${title} ke kiri`}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface/95 text-text hover:text-primary-foreground hover:bg-primary hover:border-primary shadow-xl backdrop-blur-md transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label={`Geser ${title} ke kanan`}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface/95 text-text hover:text-primary-foreground hover:bg-primary hover:border-primary shadow-xl backdrop-blur-md transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
        >
          <ChevronRight size={18} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-3.5 overflow-x-auto scroll-smooth pb-3 pt-1 scrollbar-none snap-x snap-mandatory px-1"
        >
          {isLoading && items.length === 0
            ? [1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={`${title}-skeleton-${idx}`}
                className="w-36 sm:w-40 md:w-[176px] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-surface animate-pulse"
              >
                <div className="aspect-[3/4] w-full bg-surface-2" />
                <div className="p-2.5 space-y-2 border-t border-border">
                  <div className="h-3.5 w-4/5 rounded bg-surface-2" />
                  <div className="h-3 w-1/2 rounded bg-surface-2/70" />
                </div>
              </div>
            ))
            : items.map((item) => (
              <CatalogCard
                key={`${title}-${item.type}-${item.id}`}
                item={item}
                className="w-36 sm:w-40 md:w-[176px] shrink-0 snap-start"
              />
            ))}
        </div>
      </div>
    </section>
  );
}

