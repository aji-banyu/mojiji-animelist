"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Komponen dalam yang membaca query parameter.
 * Wajib dibungkus <Suspense> agar Next.js static export tidak error saat build.
 *
 * Contoh URL: /detail?type=anime&id=20
 */
function DetailContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // "anime" atau "manga"
  const id = searchParams.get("id");     // MAL ID (integer)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Detail {type || "..."}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Menampilkan detail untuk <strong>type:</strong> {type || "-"},{" "}
        <strong>id:</strong> {id || "-"}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Implementasi lengkap menyusul setelah integrasi Catalog API.
      </p>
    </div>
  );
}

export default function DetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm text-muted-foreground">Memuat detail...</p>
        </div>
      }
    >
      <DetailContent />
    </Suspense>
  );
}

