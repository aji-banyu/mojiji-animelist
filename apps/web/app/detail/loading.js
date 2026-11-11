export default function DetailLoading() {
  return (
    <div className="min-h-screen bg-bg animate-pulse">
      <div className="relative h-[285px] sm:h-[340px] md:h-[385px] lg:h-[415px] w-full bg-surface-2" />
      <div className="relative z-10 -mt-12 sm:-mt-14 md:-mt-16 rounded-t-2xl sm:rounded-t-3xl border-t border-border/70 bg-bg pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 sm:gap-7">
            <div className="-mt-24 sm:-mt-28 md:-mt-32 h-[200px] w-[135px] sm:h-[234px] sm:w-[158px] md:h-[262px] md:w-[176px] rounded-xl bg-surface shrink-0 border border-border shadow-xl" />
            <div className="space-y-3 w-full md:w-2/3 pt-2 md:pb-2">
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-surface-2" />
                <div className="h-6 w-24 rounded-full bg-surface-2" />
              </div>
              <div className="h-9 w-3/4 rounded-xl bg-surface border border-border" />
              <div className="h-5 w-1/4 rounded-lg bg-surface-2" />
            </div>
          </div>
          <div className="h-12 w-52 rounded-xl bg-surface border border-border" />
          <div className="h-28 w-full rounded-2xl bg-surface border border-border" />
        </div>
      </div>
    </div>
  );
}

