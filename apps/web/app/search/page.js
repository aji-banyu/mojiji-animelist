"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import CatalogSearch from "@/components/CatalogSearch";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return <CatalogSearch initialQuery={query} />;
}

export default function SearchPage() {
  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-5.25rem)] bg-[#0A0E17] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Pencarian Anime & Manga
            </h1>
          </div>

          <Suspense fallback={<p className="text-sm text-neutral-400 animate-pulse">Memuat pencarian...</p>}>
            <SearchContent />
          </Suspense>
        </div>
      </div>
    </AuthGuard>
  );
}
