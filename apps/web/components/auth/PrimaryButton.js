"use client";

import { Loader2 } from "lucide-react";

export default function PrimaryButton({
  children,
  type = "submit",
  isLoading = false,
  disabled = false,
  icon: Icon,
  compact = false,
  className = "",
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`group relative w-full ${
        compact ? "h-[50px]" : "h-[56px] sm:h-[60px]"
      } rounded-xl bg-accent px-6 text-sm sm:text-base font-bold text-white shadow-md shadow-accent/25 transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 cursor-pointer flex items-center justify-center text-center gap-2.5 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 size={19} className="animate-spin text-white" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {Icon && (
            <Icon
              size={19}
              strokeWidth={2}
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          )}
          <span className="text-center">{children}</span>
        </>
      )}
    </button>
  );
}
