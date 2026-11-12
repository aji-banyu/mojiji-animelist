"use client";

import { useState, useEffect } from "react";
import { RotateCcw, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/SearchInput";
import SegmentedSwitch from "@/components/ui/SegmentedSwitch";
import Tag from "@/components/ui/Tag";

const TYPE_OPTIONS = [
  { id: "all", label: "Semua" },
  { id: "anime", label: "Anime" },
  { id: "manga", label: "Manga" },
];

/**
 * Collapsible accordion section for explore filter panels.
 */
export function SidebarSection({ title, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3.5 text-sm font-bold text-text transition-colors hover:text-accent-text cursor-pointer"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp size={16} className="text-text-2" />
        ) : (
          <ChevronDown size={16} className="text-text-2" />
        )}
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

/**
 * Reusable Explore filter sidebar rendered as a sticky desktop card and mobile slide-over drawer.
 */
export default function ExploreFilterSidebar({
  selectedType,
  onTypeChange,
  genres,
  selectedGenres,
  onToggleGenre,
  genreSearch,
  onGenreSearchChange,
  formats,
  selectedFormat,
  onSelectFormat,
  activeFilterCount,
  onReset,
  mobileOpen,
  onCloseMobile,
}) {
  // Tutup mobile drawer menggunakan tombol Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCloseMobile?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const formatTitle =
    selectedType === "anime"
      ? "Format (Anime)"
      : selectedType === "manga"
      ? "Format (Manga)"
      : "Format";

  const sidebarContent = (
    <div className="space-y-1">
      {/* 1. Tipe Section (Diselaraskan dengan Sliding SegmentedSwitch Beranda) */}
      <SidebarSection title="Tipe" defaultOpen={true}>
        <SegmentedSwitch
          options={TYPE_OPTIONS}
          value={selectedType}
          onChange={onTypeChange}
          className="w-full"
          ariaLabel="Filter Tipe Media"
        />
      </SidebarSection>

      {/* 2. Genre Section */}
      <SidebarSection title="Genre" defaultOpen={true}>
        <SearchInput
          value={genreSearch}
          onChange={(e) => onGenreSearchChange(e.target.value)}
          onClear={() => onGenreSearchChange("")}
          placeholder="Cari Genre..."
          clearAriaLabel="Hapus pencarian genre"
          className="mb-3"
        />

        {genres.length === 0 ? (
          <p className="py-1 text-xs text-text-3">Genre tidak ditemukan.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {genres.map((genre) => {
              const isActive = selectedGenres.includes(genre);
              return (
                <Tag
                  key={genre}
                  as="button"
                  type="button"
                  size="default"
                  variant={isActive ? "active" : "filter"}
                  aria-pressed={isActive}
                  onClick={() => onToggleGenre(genre)}
                  className="cursor-pointer transition-all active:scale-95"
                >
                  {genre}
                </Tag>
              );
            })}
          </div>
        )}
      </SidebarSection>

      {/* 3. Format Section (Dinamis Sesuai Tipe) */}
      <SidebarSection title={formatTitle} defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {formats.map((fmt) => {
            const isSelected = selectedFormat === fmt;
            return (
              <Tag
                key={fmt}
                as="button"
                type="button"
                size="default"
                variant={isSelected ? "active" : "filter"}
                aria-pressed={isSelected}
                onClick={() => onSelectFormat(fmt)}
                className="cursor-pointer transition-all active:scale-95"
              >
                {fmt}
              </Tag>
            );
          })}
        </div>
      </SidebarSection>

      {/* Tombol Reset Filter */}
      {activeFilterCount > 0 && (
        <div className="pt-3">
          <Button
            variant="surface"
            size="sm"
            onClick={onReset}
            className="w-full rounded-xl font-bold"
          >
            <RotateCcw size={13} />
            <span>Reset Semua Filter ({activeFilterCount})</span>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Docked Left Sidebar (Menempel Kiri-Atas-Bawah di Bawah Navbar dengan Tampilan Soft) */}
      <aside
        aria-label="Sidebar Filter Katalog"
        className="hidden lg:flex lg:flex-col lg:self-start sticky top-[65px] h-[calc(100vh-65px)] w-[272px] xl:w-[288px] shrink-0 border-r border-border/60 bg-surface/65 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-text-3 select-none">
            Filter Katalog
          </span>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-text hover:text-accent transition-colors cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-2 scrollbar-none">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filter Katalog">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-surface border-r border-border p-5 overflow-y-auto scrollbar-none shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-text tracking-tight font-['Bricolage_Grotesque']">
                Filter
              </h3>
              <Button
                variant="surface"
                size="icon"
                onClick={onCloseMobile}
                aria-label="Tutup Filter"
                className="rounded-xl"
              >
                <X size={16} />
              </Button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

