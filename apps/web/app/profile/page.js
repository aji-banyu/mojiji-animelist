"use client";

import Link from "next/link";
import { ArrowLeft, BookMarked, Wrench } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg px-4 pt-24 pb-28 sm:px-6 md:pb-16 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-border/80 bg-surface/85 p-8 sm:p-10 text-center shadow-xl backdrop-blur-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent-soft text-accent-text shadow-inner">
            <Wrench size={26} strokeWidth={2} />
          </div>

          <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            Segera Hadir
          </span>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-text font-['Bricolage_Grotesque'] sm:text-3xl">
            Halaman Profil Sedang Dalam Pengerjaan
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-text-2">
            Fitur profil akun dan ringkasan statistik sedang kami persiapkan agar tersinkronisasi penuh dengan akun dan koleksi tracker kamu. Sementara itu, semua fitur Beranda, Jelajah, dan Tracker sudah bisa digunakan seperti biasa.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/home/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              href="/tracker/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-surface-3 active:scale-[0.98]"
            >
              <BookMarked size={16} />
              <span>Lihat Koleksi Tracker</span>
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
