"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

/**
 * AuthGuard — Komponen pembungkus untuk halaman yang memerlukan login.
 *
 * Cara kerja:
 * 1. Menunggu client-side mount (menghindari hydration mismatch pada static export).
 * 2. Mengecek apakah user sudah login melalui authStore.
 * 3. Jika belum login → otomatis redirect ke /login.
 * 4. Jika sudah login → render halaman (children).
 */
export default function AuthGuard({ children }) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, isLoading, router, mounted]);

  // Tampilkan loading saat proses mount & pengecekan sesi
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#0F1015]">
        <p className="text-sm text-neutral-400 animate-pulse">Memeriksa sesi...</p>
      </div>
    );
  }

  // Jika belum login, jangan render apapun (sedang proses redirect)
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#0F1015]">
        <p className="text-sm text-neutral-400">Mengalihkan ke login...</p>
      </div>
    );
  }

  return children;
}
