"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useAuthStore from "@/store/authStore";
import TrackerList from "@/components/TrackerList";

export default function TrackerPage() {
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cegah flash layout sebelum status auth terhidrasi
  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg px-4 py-16 text-text flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="text-xs text-text-2">Memuat pelacak...</span>
        </div>
      </div>
    );
  }

  // Jika pengunjung sudah login, tampilkan antarmuka TrackerList penuh
  if (user) {
    return (
      <div className="min-h-screen bg-bg px-4 py-8 sm:py-12 text-text sm:px-6 lg:px-8 pb-24 selection:bg-accent/30 selection:text-text">
        <div className="mx-auto max-w-7xl">
          <TrackerList />
        </div>
      </div>
    );
  }

  // Jika pengunjung publik (Guest), tampilkan Clean Guest Landing Teaser
  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg px-4 py-16 sm:py-24 text-text flex items-center justify-center selection:bg-accent/30 selection:text-text">
      <div className="mx-auto max-w-2xl text-center space-y-6 sm:space-y-8">
        {/* Hero Title & Value Proposition */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text font-heading leading-tight">
            Pantau & Kelola Koleksi <br className="hidden sm:inline" />
            Anime & Manga Kamu
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-text-2 leading-relaxed">
            Catat progres episode tontonan dalam 1–2 klik, saring status koleksi secara instan,
            dan nikmati pengalaman pelacakan bersih tanpa gangguan iklan.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/register/?redirect=/tracker/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all select-none hover:shadow-lg"
          >
            <span>Daftar Akun Gratis</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login/?redirect=/tracker/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface hover:bg-surface-2 hover:border-border-hover px-6 py-3 text-sm font-semibold text-text shadow-sm transition-all select-none"
          >
            <span>Masuk ke Akun</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
