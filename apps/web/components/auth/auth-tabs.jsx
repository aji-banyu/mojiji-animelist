"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/login/", label: "Masuk" },
  { href: "/register/", label: "Daftar" },
];

export function AuthTabs() {
  const pathname = usePathname();
  const idx = pathname?.startsWith("/register") ? 1 : 0;

  return (
    <nav
      aria-label="Masuk atau daftar"
      className="relative grid grid-cols-2 rounded-xl border border-border bg-surface p-1 font-sans select-none shadow-xs"
    >
      {/* Penanda Geser Aktif: Transparansi lembut selaras dengan warna Primary Biru */}
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[10px] bg-primary/20 border border-primary/30 transition-transform duration-[250ms] ease-out pointer-events-none"
        style={{ transform: `translateX(${idx * 100}%)` }}
      />
      {TABS.map((t, i) => {
        const active = i === idx;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative z-10 flex h-10 items-center justify-center rounded-[10px] text-sm transition-colors duration-150 cursor-pointer select-none font-sans",
              active
                ? "text-text font-bold"
                : "text-text-2 hover:text-text font-medium"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
