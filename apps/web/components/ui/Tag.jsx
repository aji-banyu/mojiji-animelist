import * as React from "react";
import { cn } from "@/lib/utils";

const TAG_VARIANTS = {
  // Varian utama Taksonomi (Genre, Format, Tipe, Demografi) dengan latar lembut tanpa border
  secondary:
    "bg-tag-soft-bg text-tag-soft-text font-semibold border-0",
  accent:
    "bg-accent-soft text-accent-text border border-accent/30 font-semibold",
  outline:
    "bg-transparent text-text-2 border border-border hover:bg-surface-2 hover:border-border-hover hover:text-text font-medium",
  filter:
    "bg-surface-2 text-text-2 border border-border hover:bg-surface-2-hover hover:border-border-hover hover:text-text font-medium",
  neutral:
    "bg-surface text-text border border-border font-medium",
  active:
    "bg-secondary text-white border border-secondary font-bold shadow-sm",
};

const TAG_SIZES = {
  sm: "px-2 py-0.5 text-[10px] rounded-md gap-1",
  default: "px-2.5 py-1 text-xs rounded-lg gap-1.5",
  pill: "px-3 py-1 text-xs rounded-full gap-1.5",
};

export function Tag({
  children,
  variant = "secondary",
  size = "default",
  className,
  as: Component = "span",
  ...props
}) {
  const variantClass = TAG_VARIANTS[variant] || TAG_VARIANTS.secondary;
  const sizeClass = TAG_SIZES[size] || TAG_SIZES.default;

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center transition-colors select-none",
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Tag;
