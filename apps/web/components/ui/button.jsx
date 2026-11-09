import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(function Button(
  { className, type = "button", loading = false, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg bg-[#6B68C6] hover:bg-[#5E5AB8] text-white px-4 text-sm font-semibold shadow-sm shadow-[#6B68C6]/25 transition-all duration-150 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="size-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
