export default function ProfileLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg px-4 pt-24 pb-28 sm:px-6 md:pb-16 flex items-center justify-center animate-pulse">
      <div className="w-full max-w-lg rounded-2xl border border-border/80 bg-surface/85 p-8 sm:p-10 space-y-4">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-surface-2" />
        <div className="mx-auto h-5 w-24 rounded-full bg-surface-2" />
        <div className="mx-auto h-7 w-3/4 rounded-xl bg-surface-2" />
        <div className="mx-auto h-12 w-full rounded-xl bg-surface-2/70" />
      </div>
    </div>
  );
}

