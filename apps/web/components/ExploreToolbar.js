"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  Loader2,
  ChevronDown,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/SearchInput";
import { cn } from "@/lib/utils";

/**
 * Reusable search bar, mobile filter trigger, sort dropdown, and active search banner for Explore.
 */
export default function ExploreToolbar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  sortBy,
  sortOptions = [],
  onSortChange,
  activeFilterCount = 0,
  onOpenMobileSidebar,
  isLoading = false,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Tutup sort dropdown saat klik di luar area menu atau tekan Escape
  useEffect(() => {
    if (!sortOpen) return;

    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSortOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortOpen]);

  const activeSortLabel =
    sortOptions.find((s) => s.value === sortBy)?.label || "Urutkan";

  return (
    <div className="space-y-4">
      {/* Bar Kontrol: Mobile Filter + Search + Sort Dropdown */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Tombol Buka Filter Mobile */}
          <div className="relative lg:hidden shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenMobileSidebar}
              aria-label="Buka Filter"
              className="rounded-xl"
            >
              <SlidersHorizontal size={16} />
            </Button>
            {activeFilterCount > 0 && (
              <span className="pointer-events-none absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </div>

          {/* Search Bar Inline */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearchSubmit?.();
            }}
            onClear={onClearSearch}
            placeholder="Cari anime atau manga..."
            clearAriaLabel="Hapus pencarian"
            className="flex-1 min-w-0"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0" ref={sortRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOpen((prev) => !prev)}
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
            className="w-full sm:w-auto rounded-xl px-3.5 text-xs font-semibold justify-between sm:justify-center"
          >
            <span>{activeSortLabel}</span>
            <ChevronDown
              size={15}
              className={cn(
                "text-text-2 transition-transform duration-150",
                sortOpen && "rotate-180"
              )}
            />
          </Button>

          {sortOpen && (
            <div
              role="listbox"
              aria-label="Urutkan berdasarkan"
              className="absolute right-0 top-full mt-2 z-30 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-lg animate-in fade-in zoom-in-95 duration-150"
            >
              {sortOptions.map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSortChange(opt.value);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-xs sm:text-sm transition-colors cursor-pointer",
                      isSelected
                        ? "bg-accent-soft text-accent-text font-bold"
                        : "font-medium text-text-2 hover:text-text hover:bg-surface-2"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} className="text-accent-text" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Banner Pencarian Aktif */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between flex-wrap gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-2.5 text-xs sm:text-sm shadow-sm">
          <div className="flex items-center gap-2 text-text">
            <Search size={14} className="text-accent-text shrink-0" />
            <span>
              Hasil untuk:{" "}
              <strong className="text-text">&quot;{searchQuery}&quot;</strong>
            </span>
            {isLoading && (
              <Loader2 size={13} className="animate-spin text-accent-text" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className="h-7 px-2.5 text-xs font-bold"
          >
            <X size={13} />
            <span>Hapus</span>
          </Button>
        </div>
      )}
    </div>
  );
}

