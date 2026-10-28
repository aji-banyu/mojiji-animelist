"use client";

import AuthGuard from "@/components/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Tracker</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman dashboard tracker — implementasi lengkap menyusul di sprint
          berikutnya.
        </p>
      </div>
    </AuthGuard>
  );
}
