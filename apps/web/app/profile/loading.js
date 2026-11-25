export default function ProfileLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg pb-28 md:pb-16 animate-pulse">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-20 sm:pt-22 md:pt-24 space-y-6">
        {/* Banner skeleton */}
        <div className="h-40 sm:h-48 md:h-56 w-full rounded-2xl bg-surface-2" />

        {/* Avatar + name skeleton */}
        <div className="flex items-end gap-4 -mt-14 px-4">
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-surface-2 border-4 border-bg shrink-0" />
          <div className="space-y-2 pb-1 flex-1">
            <div className="h-6 w-40 rounded-lg bg-surface-2" />
            <div className="h-4 w-56 rounded-md bg-surface-2/60" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-4 border-b border-border pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 w-16 rounded bg-surface-2" />
          ))}
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-4 space-y-2"
            >
              <div className="h-3 w-16 mx-auto rounded bg-surface-2" />
              <div className="h-8 w-12 mx-auto rounded-lg bg-surface-2" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-border bg-surface p-5 h-48" />
          <div className="rounded-xl border border-border bg-surface p-5 h-48" />
        </div>
      </div>
    </div>
  );
}
