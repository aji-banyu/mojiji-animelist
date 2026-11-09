"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/login", label: "Masuk" },
  { href: "/register", label: "Daftar" },
];

export function AuthTabs() {
  const pathname = usePathname();
  const idx = pathname?.startsWith("/register") ? 1 : 0;

  return (
    <nav
      aria-label="Masuk atau daftar"
      className="relative grid grid-cols-2 rounded-xl border border-[#2B2D38] bg-[#1E1F24] p-1 font-sans"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[10px] bg-[#2A2B3D] border border-[#3C3E56] transition-transform duration-[250ms] ease-out pointer-events-none shadow-sm"
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
              "relative z-10 flex h-10 items-center justify-center rounded-[10px] text-sm font-semibold transition-colors duration-150 cursor-pointer select-none font-sans",
              active ? "text-[#C4C3E8]" : "text-[#9EA2B3] hover:text-[#ECEEF6]"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
