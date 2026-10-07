"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, BookMarked, LogIn, UserPlus, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/search", label: "Cari", icon: Search },
  { href: "/tracker", label: "Tracker", icon: BookMarked },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          <span className="text-xl">🎌</span>
          <span className="text-base tracking-tight">Mojiji</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive("/login")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <LogIn size={15} />
            Masuk
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <UserPlus size={15} />
            Daftar
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/login")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <LogIn size={16} />
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <UserPlus size={16} />
              Daftar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
