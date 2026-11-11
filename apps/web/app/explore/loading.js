export default function ExploreLoading() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-bg lg:flex animate-pulse">
      {/* Sidebar Filter Skeleton (Desktop) */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-border bg-surface/50 p-5 space-y-6">
        <div className="h-9 w-full rounded-full bg-surface-2" />
        <div className="space-y-2.5">
          <div className="h-4 w-20 rounded bg-surface-2" />
          <div className="h-9 w-full rounded-xl bg-surface-2/80" />
          <div className="flex flex-wrap gap-2 pt-1">
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <div key={g} className="h-7 w-20 rounded-full bg-surface-2" />
            ))}
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="h-4 w-20 rounded bg-surface-2" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((f) => (
              <div key={f} className="h-7 w-16 rounded-full bg-surface-2" />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 min-w-0 pb-24">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-44 rounded-xl bg-surface-2" />
            <div className="h-6 w-36 rounded-full bg-surface border border-border" />
          </div>

          <div className="h-12 w-full rounded-xl bg-surface border border-border" />

          <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-3 sm:gap-3.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-sm"
              >
                <div className="aspect-[3/4] w-full bg-surface-2" />
                <div className="p-2.5 sm:p-3 space-y-2 border-t border-border">
                  <div className="h-3.5 bg-surface-2 rounded w-4/5" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-surface-2 rounded w-1/3" />
                    <div className="h-3 bg-surface-2 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

