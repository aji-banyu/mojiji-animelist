"use client";

import { cn } from "@/lib/utils";

const HEIGHT_CLASSES = {
  xs: "h-7",
  sm: "h-8",
  md: "h-9",
};

const VARIANT_STYLES = {
  transparent: {
    container: "rounded-full border border-border/70 dark:border-white/15 bg-transparent p-1 shadow-none",
    pill: "rounded-full bg-[#9685ed]/25 dark:bg-[#30427b]/35 border-transparent shadow-none",
    textActive: "text-[#453596] dark:text-[#d4e4ed] font-semibold",
    textInactive: "text-[#64748b] dark:text-[#a5aac0] hover:text-[#453596] dark:hover:text-[#d4e4ed]",
    rounded: "rounded-full",
    hasPadding: true,
  },
  capsule: {
    container: "rounded-full border border-border/70 dark:border-white/15 bg-transparent p-1 shadow-none",
    pill: "rounded-full bg-[#9685ed]/25 dark:bg-[#30427b]/35 border-transparent shadow-none",
    textActive: "text-[#453596] dark:text-[#d4e4ed] font-semibold",
    textInactive: "text-[#64748b] dark:text-[#a5aac0] hover:text-[#453596] dark:hover:text-[#d4e4ed]",
    rounded: "rounded-full",
    hasPadding: true,
  },
  secondary: {
    container: "rounded-full bg-surface border border-border p-1 shadow-none",
    pill: "rounded-full bg-secondary border-transparent shadow-none",
    textActive: "text-secondary-foreground font-bold",
    rounded: "rounded-full",
    hasPadding: true,
  },
  primary: {
    container: "rounded-xl bg-surface border border-border shadow-sm",
    pill: "rounded-xl bg-primary border-primary/80",
    textActive: "text-primary-foreground font-bold",
    rounded: "rounded-xl",
  },
  accent: {
    container: "rounded-xl bg-surface border border-border shadow-sm",
    pill: "rounded-xl bg-accent border-accent/80",
    textActive: "text-accent-foreground font-bold",
    rounded: "rounded-xl",
  },
  default: {
    container: "rounded-xl bg-surface border border-border shadow-sm",
    pill: "rounded-xl bg-switch-pill border-switch-border",
    textActive: "text-switch-text font-bold",
    rounded: "rounded-xl",
  },
};

/**
 * Full-bleed sliding segmented switch matching the Beranda & Jelajah filter pill control.
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
  variant = "secondary",
  rounded,
}) {
  if (!options.length) return null;

  const getKey = (opt) => opt.id ?? opt.value ?? opt.key;
  const activeIndex = options.findIndex((opt) => getKey(opt) === value);
  const safeIdx = activeIndex >= 0 ? activeIndex : 0;
  const count = options.length;
  const heightClass = HEIGHT_CLASSES[size] || HEIGHT_CLASSES.sm;
  const currentVariant = VARIANT_STYLES[variant] || VARIANT_STYLES.secondary;
  const baseRounded = currentVariant.rounded || "rounded-xl";
  const outerRoundedClass =
    rounded === "lg"
      ? "rounded-lg"
      : rounded === "xl"
        ? "rounded-xl"
        : rounded === "full"
          ? "rounded-full"
          : baseRounded;
  const innerRoundedClass =
    rounded === "lg"
      ? "rounded-md"
      : rounded === "xl"
        ? "rounded-lg"
        : outerRoundedClass;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      title={disabled ? disabledTitle : undefined}
      className={cn(
        "relative grid font-sans select-none overflow-hidden transition-opacity",
        currentVariant.container || "border border-border bg-surface shadow-sm",
        outerRoundedClass,
        disabled && "opacity-60",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {/* Penanda Geser Halus Full-Bleed / Capsule Floating */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute border transition-transform duration-[250ms] ease-out pointer-events-none",
          currentVariant.hasPadding
            ? "inset-y-1 left-1"
            : "inset-y-0 left-0 shadow-sm",
          currentVariant.pill,
          innerRoundedClass
        )}
        style={{
          width: currentVariant.hasPadding
            ? `calc(${100 / count}% - ${8 / count}px)`
            : `${100 / count}%`,
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
              "relative z-10 flex items-center justify-center font-medium transition-all duration-150 select-none",
              size === "xs" ? "text-[11px]" : "text-xs",
              innerRoundedClass,
              heightClass,
              disabled ? "cursor-not-allowed" : "cursor-pointer",
              isActive
                ? cn(
                    currentVariant.textActive,
                    "hover:bg-black/10 dark:hover:bg-black/20 active:bg-black/20 dark:active:bg-black/35 active:scale-[0.98]"
                  )
                : disabled
                ? "text-text-2"
                : cn(
                    currentVariant.textInactive || "text-text-2 hover:text-text",
                    "hover:bg-black/5 dark:hover:bg-black/15 active:bg-black/10 dark:active:bg-black/25 active:scale-[0.98]"
                  )
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

