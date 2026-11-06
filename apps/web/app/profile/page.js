"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Film, BookOpen, Bookmark, ArrowLeft, Check, Clock } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import useAuthStore from "@/store/authStore";
import { getTrackerListApi } from "@/lib/api";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  // State Statistik Real-Time dari Tracker
  const [stats, setStats] = useState({
    total: 0,
    watching: 0,
    reading: 0,
    completed: 0,
    plan: 0,
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
          const completed = items.filter((i) => i.status === "completed").length;
          const plan = items.filter((i) => ["plan", "plan_to_watch", "planned"].includes(i.status)).length;
          setStats({
            total: items.length,
            watching,
            reading,
            completed,
            plan,
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
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#DC2626]/10 text-[#DC2626] border-2 border-[#DC2626]/30 shadow-inner">
                <User size={38} />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user?.username || "dika_dev"}
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

          {/* Statistik Aktivitas Tracker (5 Kartu) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Statistik Aktivitas Tracker
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {/* Total Tersimpan */}
              <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Total Tersimpan
                </span>
                <p className="mt-1.5 text-2xl font-extrabold text-white">{stats.total}</p>
              </div>

              {/* Menonton */}
              <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Film size={12} /> Menonton
                </span>
                <p className="mt-1.5 text-2xl font-extrabold text-emerald-400">{stats.watching}</p>
              </div>

              {/* Membaca */}
              <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                  <BookOpen size={12} /> Membaca
                </span>
                <p className="mt-1.5 text-2xl font-extrabold text-teal-400">{stats.reading}</p>
              </div>

              {/* Selesai */}
              <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                  <Check size={12} /> Selesai
                </span>
                <p className="mt-1.5 text-2xl font-extrabold text-blue-400">{stats.completed}</p>
              </div>

              {/* Rencana */}
              <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <Clock size={12} /> Rencana
                </span>
                <p className="mt-1.5 text-2xl font-extrabold text-purple-400">{stats.plan}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
