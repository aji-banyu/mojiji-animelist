"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

/**
 * Root Route (/) — Smart Router / Auto-Redirect
 * 1. Pengguna yang belum login dialihkan langsung ke /login.
 * 2. Pengguna yang sudah login dialihkan langsung ke /home.
 */
export default function RootPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().checkSession();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [mounted, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0D14]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#DC2626] border-t-transparent" />
        <p className="text-xs font-medium text-neutral-400 animate-pulse">
          Mengarahkan...
        </p>
      </div>
    </div>
  );
}
