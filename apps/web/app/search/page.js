"use client";

import AuthGuard from "@/components/AuthGuard";
import CatalogSearch from "@/components/CatalogSearch";

export default function SearchPage() {
  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#0F1015] px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Pencarian Anime & Manga
            </h1>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              Temukan judul anime atau manga favoritmu dengan jeda pencarian cerdas.
            </p>
          </div>

          <CatalogSearch />
        </div>
      </div>
    </AuthGuard>
  );
}
