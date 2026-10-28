"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

/**
 * AuthGuard — Komponen pembungkus untuk halaman yang memerlukan login.
 *
 * Cara kerja:
 * 1. Mengecek apakah user sudah login melalui authStore.
 * 2. Jika belum login → otomatis redirect ke /login.
 * 3. Selama proses pengecekan → tampilkan loading.
 * 4. Jika sudah login → render halaman (children).
 *
 * Cara pakai di halaman yang butuh auth:
 *
 *   import AuthGuard from "@/components/AuthGuard";
 *
 *   export default function DashboardPage() {
 *     return (
 *       <AuthGuard>
 *         <div>Konten dashboard yang dilindungi</div>
 *       </AuthGuard>
 *     );
 *   }
 */
export default function AuthGuard({ children }) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();

  useEffect(() => {
    // Tunggu sampai proses pengecekan sesi selesai
    if (isLoading) return;

    // Jika tidak ada user (belum login), redirect ke /login
    if (!user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Tampilkan loading saat sedang mengecek sesi
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Memeriksa sesi...</p>
      </div>
    );
  }

  // Jika belum login, jangan render apapun (sedang proses redirect)
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Mengalihkan ke login...</p>
      </div>
    );
  }

  // User sudah login — render halaman
  return children;
}

