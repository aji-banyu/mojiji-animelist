"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SEARCH_VARIANTS = {
  default: {
    icon: "text-text-3",
    input:
      "rounded-xl bg-surface-2 pl-8 pr-7 text-xs placeholder:text-text-3 hover:border-secondary/40 focus:border-secondary focus:bg-surface focus:ring-1 focus:ring-secondary/40",
  },
  surface: {
    icon: "text-text-2",
    input:
      "rounded-full bg-surface pl-8.5 pr-8 text-xs shadow-xs placeholder:font-medium placeholder:text-text-2/75 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/35",
  },
  navbar: {
    icon: "text-text-2",
    input:
      "rounded-full bg-surface pl-8.5 pr-8 text-xs sm:text-sm shadow-xs placeholder:font-medium placeholder:text-text-2/75 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/35",
  },
};

/**
 * Reusable soft search input matching Tracker, Explore, and Navbar toolbars.
 */
const SearchInput = React.forwardRef(function SearchInput(
  {
    value,
    onChange,
    onClear,
    onKeyDown,
    placeholder = "Cari...",
    variant = "default",
    disabled = false,
    title,
    clearAriaLabel = "Hapus pencarian",
    className,
    inputClassName,
    ...props
  },
  ref
) {
  const variantStyles = SEARCH_VARIANTS[variant] || SEARCH_VARIANTS.default;

  return (
    <div className={cn("relative h-9 w-full", className)}>
      <Search
        size={14}
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
          variantStyles.icon
        )}
      />
      <input
        ref={ref}
        type="text"
        disabled={disabled}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        title={title}
        className={cn(
          "h-full w-full border border-border text-text outline-none transition-colors focus:outline-none",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-surface-2/40",
          variantStyles.input,
          inputClassName
        )}
        {...props}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearAriaLabel}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-2 hover:text-text transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = "SearchInput";

export { SearchInput };
export default SearchInput;

