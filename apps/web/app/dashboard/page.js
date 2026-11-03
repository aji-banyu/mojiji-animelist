"use client";

import { useState, useEffect } from "react";
import { User, Film, Bookmark, Sparkles, Compass } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import useAuthStore from "@/store/authStore";
import CatalogSearch from "@/components/CatalogSearch";
import { getTrackerListApi } from "@/lib/api";

export default function DashboardPage() {
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
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header Card Profil */}
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#181A20] p-6 sm:flex-row sm:items-center sm:justify-between shadow-lg">
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
                    {user?.id || "usr_session"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {user?.email || "dika@mojiji.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Statistik Cepat Real-Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#181A20] p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Sedang Ditonton</span>
                <Film size={18} className="text-[#FF4655]" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-white">{stats.watching}</p>
              <p className="mt-1 text-xs text-neutral-400">Anime aktif dalam tracker</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Sedang Dibaca</span>
                <Bookmark size={18} className="text-[#FF4655]" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-white">{stats.reading}</p>
              <p className="mt-1 text-xs text-neutral-400">Manga aktif dalam tracker</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Status Akun</span>
                <Sparkles size={18} className="text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-emerald-400">Terverifikasi</p>
              <p className="mt-1 text-xs text-neutral-400">Sesi Akun Aktif</p>
            </div>
          </div>

          {/* Section Fitur Pencarian Terintegrasi (Tiket MJ-059) */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass size={20} className="text-[#FF4655]" />
                <span>Jelajahi & Cari Katalog</span>
              </h2>
              <p className="mt-0.5 text-xs text-neutral-400">
                Cari anime atau manga favoritmu untuk ditambahkan ke daftar tontonan
              </p>
            </div>

            <CatalogSearch />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
