"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Film, Bookmark, Sparkles, Compass } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import useAuthStore from "@/store/authStore";
import { logoutApi } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // Abaikan error pada mock mode
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#0F1015] px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header Card Profil */}
          <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#181A20] p-6 sm:flex-row sm:items-center sm:justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/30">
                <User size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">
                    Halo, {user?.username || "dika_dev"}! 👋
                  </h1>
                  <span className="rounded bg-[#FF4655]/20 px-2.5 py-0.5 text-xs font-semibold text-[#FF4655]">
                    {user?.id || "usr_mock_123"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {user?.email || "dika@mojiji.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 active:scale-95"
            >
              <LogOut size={16} />
              Keluar (Logout)
            </button>
          </div>

          {/* Statistik Cepat */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#181A20] p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Sedang Ditonton</span>
                <Film size={18} className="text-[#FF4655]" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-white">3</p>
              <p className="mt-1 text-xs text-neutral-400">Anime aktif dalam tracker</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Sedang Dibaca</span>
                <Bookmark size={18} className="text-[#FF4655]" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-white">2</p>
              <p className="mt-1 text-xs text-neutral-400">Manga aktif dalam tracker</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Status Akun</span>
                <Sparkles size={18} className="text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-emerald-400">Terverifikasi</p>
              <p className="mt-1 text-xs text-neutral-400">Sesi Smart Mock Staging Aktif</p>
            </div>
          </div>

          {/* Navigasi / Aksi Cepat */}
          <div className="rounded-xl border border-white/10 bg-[#181A20] p-6 shadow-sm">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass size={18} className="text-[#FF4655]" />
              Aksi Cepat
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Jelajahi anime dan manga favorit atau kelola progres tontonan Anda.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="rounded-lg bg-[#FF4655] px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                Cari Anime & Manga
              </Link>
              <Link
                href="/tracker"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10"
              >
                Buka Tracker Saya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
