"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1015] text-neutral-400">
      <p className="animate-pulse text-sm">Mengalihkan ke Beranda...</p>
    </div>
  );
}
