"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Search,
  BookMarked,
  Compass,
  Home as HomeIcon,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import useThemeStore from "@/store/themeStore";
import useTrackerStore from "@/store/trackerStore";
import { logoutApi } from "@/lib/api";
import NavbarSearch from "@/components/NavbarSearch";

const NAV_ITEMS = [
  { label: "Beranda", href: "/home/", aliases: ["/home", "/dashboard"] },
  { label: "Jelajah", href: "/explore/", aliases: ["/explore", "/detail"] },
  { label: "Tracker", href: "/tracker/", aliases: ["/tracker"] },
];

const MOBILE_NAV_ITEMS = [
  { label: "Beranda", href: "/home/", aliases: ["/home", "/dashboard"], icon: HomeIcon },
  { label: "Jelajah", href: "/explore/", aliases: ["/explore", "/detail"], icon: Compass },
  { label: "Tracker", href: "/tracker/", aliases: ["/tracker"], icon: BookMarked },
  { label: "Cari", href: "/search/", aliases: ["/search"], icon: Search },
];

const HIDE_NAVBAR_ROUTES = ["/", "/login", "/register"];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // State User & Auth
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const resetTracker = useTrackerStore((s) => s.reset);
  const [mounted, setMounted] = useState(false);

  // State Avatar Dropdown Menu
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  // State Konfirmasi Modal Logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // State Tema Dark/Light terpusat dari themeStore
  const theme = useThemeStore((s) => s.theme);
  const initTheme = useThemeStore((s) => s.initTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  // State Scroll untuk Efek Transparan Halus Header di Beranda & Detail
  const [isScrolled, setIsScrolled] = useState(false);

  // Normalisasi rute halaman aktif
  const normalizedPath = (pathname || "").replace(/\/+$/, "") || "/";
  const isTransparentHeaderPage =
    normalizedPath === "/home" ||
    normalizedPath === "/dashboard" ||
    normalizedPath === "/detail";

  // Hangatkan prefetch rute navigasi utama agar transisi lebih responsif
  useEffect(() => {
    if (!mounted || !user || HIDE_NAVBAR_ROUTES.includes(normalizedPath)) return;
    NAV_ITEMS.forEach((item) => {
      try {
        router.prefetch(item.href);
      } catch { }
    });
  }, [mounted, user, normalizedPath, router]);

  // Deteksi scroll layar untuk transisi background header (threshold 35px agar smooth)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 35) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cek sesi dan muat preferensi tema
  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().checkSession();
    initTheme();
  }, [initTheme]);


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

  // Tutup modal konfirmasi logout dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showLogoutModal && !isLoggingOut) {
        setShowLogoutModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLogoutModal, isLoggingOut]);

  // Navbar hanya muncul saat user sudah login dan bukan di halaman login/register
  if (!mounted || !user || HIDE_NAVBAR_ROUTES.includes(normalizedPath)) {
    return null;
  }

  // Helper inisial pengguna (misal: "andika" -> "AN")
  const getInitials = (name) => {
    if (!name) return "AN";
    const parts = name.trim().split(/[\s_]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Handler toggle tema terpusat via themeStore
  const handleToggleTheme = () => {
    toggleTheme();
  };

  // Handler keluar akun (Logout) resmi setelah dikonfirmasi di modal dialog
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch { }
    resetTracker();
    logout();
    setShowLogoutModal(false);
    setIsLoggingOut(false);
    router.push("/login/");
  };

  // Hitung indeks navigasi aktif langsung dari rute yang sedang terbuka (slider bergerak saat halaman dituju sudah dibuka)
  const activeNavIndex = NAV_ITEMS.findIndex((item) =>
    item.aliases.includes(normalizedPath)
  );
  const hasActiveNav = activeNavIndex >= 0;
  const safeNavIndex = hasActiveNav ? activeNavIndex : 0;

  return (
    <>
      <header
      className={`w-full transition-all duration-300 ease-in-out z-50 ${
        isTransparentHeaderPage
          ? `fixed top-0 inset-x-0 ${
              isScrolled
                ? "border-b border-border bg-bg/90 backdrop-blur-md shadow-md"
                : "border-b border-transparent bg-transparent shadow-none"
            }`
          : "sticky top-0 border-b border-border bg-bg/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 1. KIRI: LOGO RESMI MOJIJI & TEKS                                          */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3">
          <Link
            href="/home/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Image
              src="/images/logo_mojiji.png"
              alt="Logo Mojiji"
              width={28}
              height={22}
              className="h-6 w-auto drop-shadow-sm select-none"
              priority
            />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-text font-['Bricolage_Grotesque'] select-none drop-shadow-sm">
              Mojiji
            </span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 2. TENGAH: SEGMENTED PILL DENGAN ANIMASI GESER (Beranda | Jelajah | Tracker) */}
        {/* ========================================================================= */}
        <nav
          aria-label="Navigasi Utama"
          className="relative hidden md:grid grid-cols-3 w-72 rounded-full border border-border bg-surface p-1 font-sans select-none"
        >
          {/* Penanda Aktif Geser Halus — mengikuti perubahan rute aktif secara sinkron */}
          <span
            aria-hidden
            className={`absolute inset-y-1 left-1 w-[calc(33.333%-2.67px)] rounded-full bg-accent transition-[transform,opacity] duration-300 ease-out pointer-events-none shadow-sm ${
              hasActiveNav ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: `translateX(${safeNavIndex * 100}%)` }}
          />

          {NAV_ITEMS.map((item, idx) => {
            const isActive = hasActiveNav && idx === safeNavIndex;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onMouseEnter={() => router.prefetch(item.href)}
                onFocus={() => router.prefetch(item.href)}
                className={`relative z-10 flex h-8 items-center justify-center rounded-full text-xs sm:text-sm font-bold tracking-tight transition-colors duration-150 cursor-pointer select-none ${
                  isActive
                    ? "text-white"
                    : "text-text-2 hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ========================================================================= */}
        {/* 3. KANAN: TOMBOL PENCARIAN (COMPACT + /) + TOMBOL TEMA + AVATAR UNGU      */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Komponen Pencarian Navbar Interaktif (Autocomplete & Enter ke Explore) */}
          <NavbarSearch />

          {/* Tombol Tema (Moon / Sun) */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Ganti tema"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-2 hover:text-text hover:border-accent/50 transition-all cursor-pointer shrink-0"
          >
            {isDark ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Avatar Pengguna (Lingkaran Ungu Konsisten dengan Inisial) */}
          <div className="relative shrink-0" ref={avatarRef}>
            <button
              type="button"
              onClick={() => setAvatarMenuOpen((prev) => !prev)}
              aria-label="Menu profil pengguna"
              aria-expanded={avatarMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white text-xs font-bold shadow-sm hover:ring-2 hover:ring-accent/50 transition-all cursor-pointer select-none"
            >
              {getInitials(user?.username)}
            </button>

            {/* Menu Dropdown Avatar */}
            {avatarMenuOpen && (
              <div className="absolute right-0 top-[46px] z-50 w-52 rounded-xl border border-border bg-surface p-1.5 shadow-xl">
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-xs font-bold text-text">
                    {user?.username}
                  </p>
                  <p className="truncate text-[11px] text-text-2">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile/"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-text transition-colors hover:bg-surface-2"
                  >
                    <User size={14} className="text-text-2" />
                    <span>Profil Saya</span>
                  </Link>

                  <Link
                    href="/tracker/"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-text transition-colors hover:bg-surface-2"
                  >
                    <BookMarked size={14} className="text-text-2" />
                    <span>Tracker Saya</span>
                  </Link>
                </div>

                <div className="border-t border-border pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM TAB BAR KHUSUS MOBILE (< 768px)                                */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-bg/95 backdrop-blur-lg px-4 py-2 flex items-center justify-around safe-area-bottom">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.aliases.includes(normalizedPath);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? "text-accent-text" : "text-text-2"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>

    {/* ========================================================================= */}
    {/* 5. MODAL KONFIRMASI LOGOUT (OPSI A - DIALOG DI TENGAH LAYAR)              */}
    {/* ========================================================================= */}
    {showLogoutModal && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        onClick={() => !isLoggingOut && setShowLogoutModal(false)}
      >
        <div
          className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Dialog: Judul & Info Akun */}
          <div className="space-y-1.5">
            <h3
              id="logout-modal-title"
              className="text-base sm:text-lg font-black tracking-tight text-text font-['Bricolage_Grotesque'] leading-snug"
            >
              Keluar dari Akun
            </h3>
            <p className="text-xs sm:text-sm text-text-2 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun <span className="font-bold text-text">{user?.username || "ini"}</span>?
            </p>
          </div>

          {/* Tombol Aksi: Batal & Ya, Keluar */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-text-2 hover:bg-surface hover:text-text hover:border-border-hover transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-destructive hover:bg-destructive-hover px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoggingOut ? <span>Keluar...</span> : <span>Ya, Keluar</span>}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
