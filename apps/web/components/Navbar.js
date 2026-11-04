"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
  BookMarked,
  Compass,
  Search,
  Home as HomeIcon,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { logoutApi } from "@/lib/api";

const NAV_ITEMS = [
  { label: "Home", href: "/home", aliases: ["/home", "/dashboard"] },
  { label: "Explore", href: "/explore", aliases: ["/explore"] },
  { label: "Tracker", href: "/tracker", aliases: ["/tracker"] },
  { label: "Search", href: "/search", aliases: ["/search"] },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // State User & Auth
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);

  // State Avatar Dropdown Menu
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  // State Mobile Menu Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State Tema Dark/Light
  const [isDark, setIsDark] = useState(true);

  // Cek sesi dan muat preferensi tema
  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().checkSession();

    try {
      const savedTheme = localStorage.getItem("mojiji_theme");
      if (savedTheme === "light") {
        setIsDark(false);
      }
    } catch {}
  }, []);

  // Event listener klik di luar untuk menutup avatar dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Normalisasi rute halaman aktif
  const normalizedPath = (pathname || "").replace(/\/+$/, "") || "/";
  const hideNavbarRoutes = ["/", "/login", "/register"];

  // Navbar hanya muncul saat user sudah login dan bukan di halaman login/register
  if (!mounted || !user || hideNavbarRoutes.includes(normalizedPath)) {
    return null;
  }

  // Helper inisial pengguna (misal: "andika" -> "AS" atau "AD")
  const getInitials = (name) => {
    if (!name) return "MJ";
    const parts = name.trim().split(/[\s_]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Handler toggle tema
  const handleToggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      localStorage.setItem("mojiji_theme", newTheme ? "dark" : "light");
    } catch {}
  };

  // Handler keluar akun (Logout)
  const handleLogout = async () => {
    setAvatarMenuOpen(false);
    setMobileMenuOpen(false);
    try {
      await logoutApi();
    } catch {}
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#0F172A]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 1. KIRI: LOGO RESMI MOJIJI & TEKS                                          */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image
              src="/images/logo_mojiji.png"
              alt="Logo Mojiji"
              width={34}
              height={24}
              className="h-7 w-auto drop-shadow-md"
              priority
            />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Mojiji
            </span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 2. TENGAH: MENU NAVIGASI (4 Item: Home, Explore, Tracker, Search)         */}
        {/* ========================================================================= */}
        <nav
          aria-label="Utama"
          className="hidden md:flex items-center gap-10 lg:gap-14 [font-family:var(--font-poppins)]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.aliases.includes(normalizedPath);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[17px] font-medium transition-colors duration-150 relative py-1 ${
                  isActive
                    ? "text-white after:content-[''] after:absolute after:-bottom-2 after:inset-x-0 after:h-[2.5px] after:bg-[#6D4AFF] after:rounded-full"
                    : "text-neutral-300 hover:text-[#A78BFA]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ========================================================================= */}
        {/* 3. KANAN: TOMBOL TEMA + AVATAR PENGGUNA                                    */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Tombol Tema (Moon / Sun) */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Ganti tema"
            className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#334155]/60 bg-transparent text-slate-300 transition-all hover:border-slate-400 hover:bg-white/5 cursor-pointer"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Avatar Pengguna (Lingkaran Hijau #43A047 dengan Inisial) */}
          <div className="relative" ref={avatarRef}>
            <button
              type="button"
              onClick={() => setAvatarMenuOpen((prev) => !prev)}
              aria-label="Menu pengguna"
              aria-expanded={avatarMenuOpen}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#43A047] text-white text-base font-bold shadow-md transition-all hover:ring-2 hover:ring-emerald-400/50 cursor-pointer select-none"
            >
              {getInitials(user?.username)}
            </button>

            {/* Menu Popover Avatar */}
            {avatarMenuOpen && (
              <div className="absolute right-0 top-[56px] z-50 w-52 rounded-2xl border border-[#334155]/60 bg-[#0F172A] p-2 shadow-2xl shadow-black/80 animate-fade-in">
                <div className="border-b border-white/10 px-3 py-2.5">
                  <p className="truncate text-sm font-bold text-white">
                    {user?.username}
                  </p>
                  <p className="truncate text-xs text-neutral-400">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <User size={15} />
                    <span>Profil Saya</span>
                  </Link>

                  <Link
                    href="/tracker"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <BookMarked size={15} />
                    <span>Tracker Saya</span>
                  </Link>
                </div>

                <div className="border-t border-white/10 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tombol Hamburger Khusus Mobile (<768px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#334155]/60 text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer ml-1"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (<768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1E293B] bg-[#0F172A] px-4 py-4 space-y-2">
          <Link
            href="/home"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              normalizedPath === "/home" || normalizedPath === "/dashboard"
                ? "bg-[#6D4AFF] text-white"
                : "text-neutral-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <HomeIcon size={17} />
            <span>Home</span>
          </Link>

          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              normalizedPath === "/explore"
                ? "bg-[#6D4AFF] text-white"
                : "text-neutral-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Compass size={17} />
            <span>Explore</span>
          </Link>

          <Link
            href="/tracker"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              normalizedPath === "/tracker"
                ? "bg-[#6D4AFF] text-white"
                : "text-neutral-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <BookMarked size={17} />
            <span>Tracker</span>
          </Link>

          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              normalizedPath === "/search"
                ? "bg-[#6D4AFF] text-white"
                : "text-neutral-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Search size={17} />
            <span>Search</span>
          </Link>
        </div>
      )}
    </header>
  );
}
