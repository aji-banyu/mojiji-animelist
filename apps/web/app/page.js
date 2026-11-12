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
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let active = true;
    setMounted(true);
    Promise.resolve(useAuthStore.getState().checkSession())
      .catch(() => null)
      .finally(() => {
        if (active) setSessionChecked(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted || !sessionChecked) return;

    if (user) {
      router.replace("/home/");
    } else {
      router.replace("/login/");
    }
  }, [mounted, sessionChecked, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-xs font-medium text-text-2 animate-pulse">
          Mengarahkan...
        </p>
      </div>
    </div>
  );
}
