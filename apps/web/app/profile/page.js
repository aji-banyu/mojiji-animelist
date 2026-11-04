"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Film, Bookmark, ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import useAuthStore from "@/store/authStore";
import { getTrackerListApi } from "@/lib/api";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  // State Statistik Real-Time dari Tracker
  const [stats, setStats] = useState({
    watching: 0,
    reading: 0,
    total: 0,
  });

  // Ambil data statistik dari API Tracker
  useEffect(() => {
    let isMounted = true;
    getTrackerListApi()
      .then((res) => {
        if (isMounted && res && res.success && Array.isArray(res.data)) {
          const items = res.data;
          const watching = items.filter((i) => i.status === "watching").length;
          const reading = items.filter((i) => i.status === "reading").length;
          setStats({
            watching,
            reading,
            total: items.length,
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#0F1015] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Tombol Navigasi Kembali */}
          <div>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#181A20] px-4 py-2 text-xs font-semibold text-neutral-300 shadow-sm transition-all hover:border-[#DC2626]/40 hover:bg-[#181A20]/80 hover:text-white active:scale-95"
            >
              <ArrowLeft size={15} />
              <span>Kembali ke Home</span>
            </Link>
          </div>

          {/* Kartu Profil Pengguna */}
          <div className="rounded-2xl border border-white/10 bg-[#181A20] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#FF4655]/10 text-[#FF4655] border-2 border-[#FF4655]/30 shadow-inner">
                <User size={38} />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Halo, {user?.username || "dika_dev"}! 👋
                </h1>
                <p className="text-sm text-neutral-400">
                  {user?.email || "dika@mojiji.com"}
                </p>
                <div className="pt-2">
                  <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    Akun Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Personal Pengguna (Sedang Ditonton & Sedang Dibaca) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Statistik Aktivitas Tracker
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Kartu 1: Sedang Ditonton */}
              <div className="rounded-2xl border border-white/10 bg-[#181A20] p-6 shadow-md transition-all hover:border-white/20">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Sedang Ditonton
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/20">
                    <Film size={18} />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-black text-white">{stats.watching}</p>
                <p className="mt-1 text-xs text-neutral-400">Judul anime aktif dalam daftar tontonan</p>
                <div className="mt-4 pt-3 border-t border-white/5">
                  <Link
                    href="/tracker?type=anime"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Buka Tracker Anime →
                  </Link>
                </div>
              </div>

              {/* Kartu 2: Sedang Dibaca */}
              <div className="rounded-2xl border border-white/10 bg-[#181A20] p-6 shadow-md transition-all hover:border-white/20">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Sedang Dibaca
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/20">
                    <Bookmark size={18} />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-black text-white">{stats.reading}</p>
                <p className="mt-1 text-xs text-neutral-400">Judul manga aktif dalam daftar bacaan</p>
                <div className="mt-4 pt-3 border-t border-white/5">
                  <Link
                    href="/tracker?type=manga"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Buka Tracker Manga →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
