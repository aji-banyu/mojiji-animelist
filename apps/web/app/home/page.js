"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy Route (/home/)
 * Seluruh akses ke /home/ dialihkan langsung ke root domain (/)
 * demi backward compatibility untuk bookmark/tautan lama.
 */
export default function LegacyHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
