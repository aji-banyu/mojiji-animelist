"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function InputField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  autoComplete,
  compact = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5">
      {/* Label Terhubung dengan htmlFor/id */}
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm sm:text-base font-semibold text-white tracking-tight"
        >
          {label}
          {required && <span className="text-[#DC2626] ml-1">*</span>}
        </label>
      )}

      {/* Input Container dengan Focus State dan Ikon */}
      <div
        className={`group relative flex items-center w-full rounded-2xl border bg-[#050A14] transition-all duration-200 ${
          error
            ? "border-red-500/80 ring-2 ring-red-500/20"
            : "border-[#1E293B] focus-within:border-[#DC2626] focus-within:ring-2 focus-within:ring-[#DC2626]/25 hover:border-slate-600"
        }`}
      >
        {/* Ikon di Sisi Kiri Dalam */}
        {Icon && (
          <div className="pointer-events-none absolute left-4 flex items-center justify-center text-slate-400 transition-colors group-focus-within:text-white">
            <Icon size={19} strokeWidth={1.75} />
          </div>
        )}

        {/* Elemen Input Utama */}
        <input
          id={id || name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base outline-none transition-colors ${
            compact ? "h-[50px]" : "h-[54px] sm:h-[56px]"
          } ${Icon ? "pl-12" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"}`}
        />

        {/* Toggle Lihat / Sembunyikan Password (Ikon Mata di Sisi Kanan) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            tabIndex={0}
            className="absolute right-4 flex items-center justify-center text-slate-400 transition-colors hover:text-white cursor-pointer p-1"
          >
            {showPassword ? (
              <EyeOff size={19} strokeWidth={1.75} />
            ) : (
              <Eye size={19} strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>

      {/* Pesan Error Singkat */}
      {error && (
        <div className="flex items-center gap-1.5 pt-0.5 text-xs text-[#DC2626]">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
