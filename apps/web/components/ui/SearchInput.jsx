"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable soft search input matching Tracker and Explore toolbars.
 */
const SearchInput = React.forwardRef(function SearchInput(
  {
    value,
    onChange,
    onClear,
    onKeyDown,
    placeholder = "Cari...",
    disabled = false,
    title,
    clearAriaLabel = "Hapus pencarian",
    className,
    inputClassName,
    ...props
  },
  ref
) {
  return (
    <div className={cn("relative h-9 w-full", className)}>
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-3"
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
          "h-full w-full rounded-xl border border-border bg-surface-2 pl-8 pr-7 text-xs text-text placeholder:text-text-3 outline-none transition-all",
          "hover:border-secondary/40 focus:border-secondary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-secondary/40",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-surface-2/40",
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

