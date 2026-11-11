"use client";

import { cn } from "@/lib/utils";

const HEIGHT_CLASSES = {
  sm: "h-8",
  md: "h-9",
};

/**
 * Full-bleed sliding segmented switch matching the Beranda filter pill control.
 */
export default function SegmentedSwitch({
  options = [],
  value,
  onChange,
  className,
  ariaLabel = "Filter Tipe",
  size = "sm",
  disabled = false,
  disabledTitle,
}) {
  if (!options.length) return null;

  const getKey = (opt) => opt.id ?? opt.value ?? opt.key;
  const activeIndex = options.findIndex((opt) => getKey(opt) === value);
  const safeIdx = activeIndex >= 0 ? activeIndex : 0;
  const count = options.length;
  const heightClass = HEIGHT_CLASSES[size] || HEIGHT_CLASSES.sm;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      title={disabled ? disabledTitle : undefined}
      className={cn(
        "relative grid rounded-xl border border-border bg-surface font-sans select-none shadow-sm overflow-hidden transition-opacity",
        disabled && "opacity-60",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {/* Penanda Geser Halus Full-Bleed */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 rounded-xl bg-switch-pill border border-switch-border transition-transform duration-[250ms] ease-out pointer-events-none shadow-sm"
        style={{
          width: `${100 / count}%`,
          transform: `translateX(${safeIdx * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const key = getKey(opt);
        const isActive = key === value;
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={opt.ariaLabel}
            title={disabled ? disabledTitle : opt.title}
            onClick={() => {
              if (!disabled) onChange?.(key);
            }}
            className={cn(
              "relative z-10 flex items-center justify-center text-xs font-medium transition-colors duration-150 select-none",
              heightClass,
              disabled ? "cursor-not-allowed" : "cursor-pointer",
              isActive
                ? "text-switch-text"
                : disabled
                ? "text-text-2"
                : "text-text-2 hover:text-text"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

