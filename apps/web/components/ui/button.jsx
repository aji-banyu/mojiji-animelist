import * as React from "react";
import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  primary:
    "bg-accent hover:bg-primary-hover text-white shadow-sm shadow-accent/25 border border-transparent",
  secondary:
    "bg-secondary hover:bg-secondary-hover text-white shadow-sm shadow-secondary/25 border border-transparent",
  outline:
    "border border-border bg-surface hover:bg-surface-2 hover:border-border-hover text-text shadow-sm",
  surface:
    "border border-border bg-surface-2 hover:bg-surface-2-hover hover:border-border-hover text-text-2 hover:text-text",
  ghost:
    "text-text-2 hover:text-text hover:bg-surface-2 border border-transparent",
};

const SIZE_CLASSES = {
  sm: "h-9 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-xs sm:text-sm rounded-xl font-semibold",
  default: "h-11 px-4 text-sm rounded-xl font-semibold",
  lg: "h-12 px-6 text-base rounded-xl font-bold",
  icon: "h-9 w-9 p-0 rounded-lg flex items-center justify-center",
  iconMd: "h-10 w-10 p-0 rounded-xl flex items-center justify-center",
};

const Button = React.forwardRef(function Button(
  {
    className,
    variant = "primary",
    size = "default",
    type = "button",
    loading = false,
    disabled,
    children,
    ...props
  },
  ref
) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.default;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="size-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Memproses...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
