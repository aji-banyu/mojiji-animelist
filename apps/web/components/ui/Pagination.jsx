"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIVE_CLASSES = {
  accent: "bg-accent text-white shadow-sm border border-accent",
  secondary: "bg-secondary text-white shadow-sm border border-secondary",
};

const SIZE_CLASSES = {
  sm: {
    container: "space-y-2.5 pt-4 pb-0.5",
    row: "gap-1 sm:gap-1.5",
    button: "h-8 w-8 rounded-lg",
    pageText: "text-xs",
    icon: 14,
  },
  md: {
    container: "space-y-3 pt-6 pb-2",
    row: "gap-1.5 sm:gap-2",
    button: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl",
    pageText: "text-xs sm:text-sm",
    icon: 17,
  },
};

/**
 * Shared 4-page sliding window pagination aligned with the Mojiji design system.
 */
export default function Pagination({
  currentPage,
  totalPages = 1,
  onPageChange,
  activeColor = "accent",
  size = "md",
  totalItems,
  itemsPerPage,
  itemLabel = "koleksi",
  ariaLabel = "Navigasi Halaman",
  className,
}) {
  if (totalPages <= 1) return null;

  const windowGroup = Math.floor((currentPage - 1) / 4);
  const startPage = windowGroup * 4 + 1;
  const endPage = Math.min(startPage + 3, totalPages);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const hasSummary =
    typeof totalItems === "number" &&
    typeof itemsPerPage === "number" &&
    totalItems > 0 &&
    itemsPerPage > 0;
  const startItem = hasSummary ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = hasSummary ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const navButtonClass = cn(
    "flex items-center justify-center border border-border bg-surface text-text-2 transition-all hover:bg-surface-2 hover:text-text hover:border-border-hover active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer shadow-sm",
    sizeConfig.button
  );
  const activeClass = ACTIVE_CLASSES[activeColor] || ACTIVE_CLASSES.accent;

  return (
    <div className={cn(sizeConfig.container, className)}>
      {hasSummary && (
        <p className="text-center text-xs text-text-3">
          Menampilkan{" "}
          <span className="font-semibold text-text-2 tabular-nums">
            {startItem}–{endItem}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-text-2 tabular-nums">
            {totalItems}
          </span>{" "}
          {itemLabel}
        </p>
      )}

      <div
        className={cn("flex flex-wrap items-center justify-center", sizeConfig.row)}
        aria-label={ariaLabel}
      >
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="Halaman Pertama"
          title="Halaman Pertama"
          className={navButtonClass}
        >
          <ChevronsLeft size={sizeConfig.icon} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman Sebelumnya"
          title="Halaman Sebelumnya"
          className={navButtonClass}
        >
          <ChevronLeft size={sizeConfig.icon} strokeWidth={2.5} />
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center justify-center font-bold transition-all active:scale-95 cursor-pointer",
                sizeConfig.button,
                sizeConfig.pageText,
                isActive
                  ? activeClass
                  : "border border-border bg-surface text-text-2 hover:bg-surface-2 hover:text-text hover:border-border-hover shadow-sm"
              )}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman Selanjutnya"
          title="Halaman Selanjutnya"
          className={navButtonClass}
        >
          <ChevronRight size={sizeConfig.icon} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman Terakhir"
          title="Halaman Terakhir"
          className={navButtonClass}
        >
          <ChevronsRight size={sizeConfig.icon} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

