export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-10 w-32 bg-amber-500/20 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="h-7 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800/80 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-64 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl" />
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800/80 space-y-4">
          <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-48 w-48 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800/50" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/40">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
