"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(function Input(
  { className, type = "text", label, error, hint, id, ...props },
  ref
) {
  const generatedId = React.useId();
  const inputId = id || (label ? `input-${generatedId}` : undefined);
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  const inputElement = (
    <div className="relative w-full">
      <input
        ref={ref}
        id={inputId}
        type={actualType}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "h-11 w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text placeholder:text-text-3 transition-colors outline-none",
          "hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/30",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
          isPassword && "pr-10",
          error && "border-destructive focus:border-destructive focus:ring-destructive/30",
          className
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text transition-colors p-1 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="size-4" strokeWidth={1.8} />
          ) : (
            <Eye className="size-4" strokeWidth={1.8} />
          )}
        </button>
      )}
    </div>
  );

  if (!label && !error && !hint) {
    return inputElement;
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-2">
          {label}
        </label>
      )}
      {inputElement}
      {hint && !error && (
        <p className="text-xs text-text-3">{hint}</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
