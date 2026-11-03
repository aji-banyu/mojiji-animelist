"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, BookMarked, LogIn, UserPlus, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { logoutApi } from "@/lib/api";

const navLinks = [
  { href: "/search", label: "Cari", icon: Search },
  { href: "/tracker", label: "Tracker", icon: BookMarked },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ambil state autentikasi dari Zustand
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Mencegah hydration mismatch antara static export HTML dan client session
  useEffect(() => {
    setMounted(true);
    // Verifikasi sesi cookie ke backend saat web pertama kali dimuat
    useAuthStore.getState().checkSession();
  }, []);

  const isActive = (href) => pathname === href;

  // Normalisasi rute (buang trailing slash agar cocok dengan trailingSlash: true)
  const normalizedPath = (pathname || "").replace(/\/+$/, "") || "/";
  const hideNavbarRoutes = ["/", "/login", "/register"];

  // Navbar HANYA muncul ketika user sudah login (memiliki sesi aktif)
  // dan disembunyikan di landing page, login, atau register
  if (!mounted || !user || hideNavbarRoutes.includes(normalizedPath)) {
    return null;
  }

  const handleLogout = async () => {
    setMobileOpen(false);
    try {
      await logoutApi();
    } catch (e) {
      // Abaikan error pada mock mode atau jaringan
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo Mojiji */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-foreground transition-opacity hover:opacity-85"
        >
          <Image
            src="/images/logo_mojiji.png"
            alt="Logo Mojiji"
            width={28}
            height={20}
            className="h-6 w-auto"
            priority
          />
          <span className="text-base font-bold tracking-tight">Mojiji</span>
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
          {mounted && user ? (
            // Tampilan saat SUDAH LOGIN: Menampilkan Username, Profil, dan Tombol Keluar
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                title="Dashboard Saya"
              >
                <User size={15} className="text-[#FF4655]" />
                <span className="font-semibold">{user.username}</span>
              </Link>

              <Link
                href="/profile"
                className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive("/profile")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                title="Profil Pengguna"
              >
                Profil
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                title="Keluar dari akun"
              >
                <LogOut size={13} />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            // Tampilan saat BELUM LOGIN
            <>
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
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden cursor-pointer"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-border bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
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

            <div className="my-2 border-t border-border" />

            {mounted && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-foreground"
                >
                  <User size={16} className="text-[#FF4655]" />
                  <span>{user.username} (Dashboard)</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Profil Pengguna</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-border py-2 text-sm font-medium"
                >
                  <LogIn size={15} />
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground"
                >
                  <UserPlus size={15} />
                  Daftar
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
