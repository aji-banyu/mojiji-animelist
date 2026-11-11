"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import CatalogSearch from "@/components/CatalogSearch";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const typeParam = (searchParams.get("type") || "").toLowerCase();
  const initialType = typeParam === "manga" ? "manga" : "anime";

  return <CatalogSearch initialType={initialType} initialQuery={query} />;
}

export default function SearchPage() {
  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg px-4 py-8 text-text sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-text sm:text-3xl lg:text-4xl">
              Pencarian Anime & Manga
            </h1>
            <p className="mt-1.5 text-xs text-text-2 sm:text-sm max-w-3xl leading-relaxed">
              Cari anime dan manga favoritmu di katalog lengkap, temukan detail informasi, dan tambahkan langsung ke tracker.
            </p>
          </div>

          <Suspense fallback={<p className="text-sm text-text-2 animate-pulse">Memuat pencarian...</p>}>
            <SearchContent />
          </Suspense>
        </div>
      </div>
    </AuthGuard>
  );
}
