export default function TrackerLoading() {
  return (
    <div className="min-h-screen bg-bg px-4 py-8 sm:py-12 sm:px-6 lg:px-8 pb-24 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-44 rounded-xl bg-surface-2" />
          <div className="h-6 w-28 rounded-full bg-surface border border-border" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div className="h-9 w-full sm:w-56 rounded-full bg-surface-2" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((t) => (
              <div key={t} className="h-8 w-20 rounded-full bg-surface-2" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-3 sm:gap-3.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
            >
              <div className="aspect-[4/5] w-full bg-surface-2" />
              <div className="p-2.5 space-y-2 border-t border-border">
                <div className="h-3.5 w-4/5 rounded bg-surface-2" />
                <div className="h-2.5 w-full rounded-full bg-surface-2/80" />
                <div className="h-7 w-full rounded-lg bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

