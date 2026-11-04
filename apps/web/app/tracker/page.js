"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, Film, BookOpen, Check, Clock } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import TrackerList from "@/components/TrackerList";

export default function TrackerPage() {
  const [stats, setStats] = useState({
    total: 0,
    watching: 0,
    reading: 0,
    completed: 0,
    plan: 0,
  });

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#0F1015] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Title & Navigation */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2.5">
                <Layers className="text-[#FF4655]" size={26} />
                <span>Dashboard Tracker</span>
              </h1>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                Kelola status tontonan/bacaan, perbarui progres, dan saring koleksi anime & manga pribadimu.
              </p>
            </div>

            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF4655] px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#e03d4a] active:scale-95"
              >
                <span>+ Cari di Katalog</span>
              </Link>
            </div>
          </div>

          {/* Statistik Cepat Tracker */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Total Tersimpan
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-white">{stats.total}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Film size={12} /> Menonton
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-emerald-400">{stats.watching}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <BookOpen size={12} /> Membaca
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-teal-400">{stats.reading}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Check size={12} /> Selesai
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-blue-400">{stats.completed}</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-[#181A20] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Clock size={12} /> Rencana
              </span>
              <p className="mt-1.5 text-2xl font-extrabold text-purple-400">{stats.plan}</p>
            </div>
          </div>

          {/* Komponen TrackerList (Langkah 1, 2, 3, 4, 5) */}
          <TrackerList onStatsChange={setStats} />
        </div>
      </div>
    </AuthGuard>
  );
}
