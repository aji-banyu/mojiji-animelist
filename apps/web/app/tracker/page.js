"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import TrackerList from "@/components/TrackerList";

export default function TrackerPage() {
  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#0F1015] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Title & Navigation */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2.5">
                <Layers className="text-[#DC2626]" size={26} />
                <span>Dashboard Tracker</span>
              </h1>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                Kelola status tontonan/bacaan, perbarui progres, dan saring koleksi anime & manga pribadimu.
              </p>
            </div>

            <div>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#b91c1c] active:scale-95"
              >
                <span>+ Cari di Katalog</span>
              </Link>
            </div>
          </div>

          {/* Komponen TrackerList (Langkah 1, 2, 3, 4, 5) */}
          <TrackerList />
        </div>
      </div>
    </AuthGuard>
  );
}
