export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-bg pb-24 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="w-full min-h-[480px] sm:min-h-[540px] bg-surface-2/60 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-surface border border-border" />
            <div className="h-6 w-24 rounded-full bg-surface border border-border" />
          </div>
          <div className="h-9 sm:h-11 w-2/3 max-w-lg rounded-xl bg-surface border border-border" />
          <div className="h-4 w-full max-w-xl rounded-lg bg-surface/80" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-36 rounded-xl bg-surface border border-border" />
            <div className="h-10 w-32 rounded-xl bg-surface border border-border" />
          </div>
        </div>
      </div>

      {/* Section Sliders Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="h-7 w-44 rounded-xl bg-surface-2" />
              <div className="h-9 w-48 sm:w-56 rounded-full bg-surface border border-border" />
            </div>
            <div className="flex gap-3 sm:gap-3.5 overflow-hidden pt-1">
              {[1, 2, 3, 4, 5, 6].map((card) => (
                <div
                  key={card}
                  className="w-36 sm:w-40 md:w-[176px] shrink-0 overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <div className="aspect-[3/4] w-full bg-surface-2" />
                  <div className="p-2.5 space-y-2 border-t border-border">
                    <div className="h-3.5 w-4/5 rounded bg-surface-2" />
                    <div className="h-3 w-1/2 rounded bg-surface-2/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

