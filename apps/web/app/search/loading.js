export default function SearchLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-surface-2" />
          <div className="h-4 w-96 max-w-full rounded bg-surface-2/70" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 w-full sm:w-48 rounded-full bg-surface border border-border" />
          <div className="h-10 flex-1 rounded-xl bg-surface border border-border" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-3 sm:gap-3.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-sm"
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
    </div>
  );
}

