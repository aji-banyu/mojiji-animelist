"use client";

import AuthGuard from "@/components/AuthGuard";
import TrackerList from "@/components/TrackerList";

export default function TrackerPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg px-4 py-8 sm:py-12 text-text sm:px-6 lg:px-8 pb-24 selection:bg-accent/30 selection:text-text">
        <div className="mx-auto max-w-7xl">
          {/* Komponen TrackerList */}
          <TrackerList />
        </div>
      </div>
    </AuthGuard>
  );
}
