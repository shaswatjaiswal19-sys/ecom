import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      <LoadingSpinner size="xl" label="Loading fresh experience..." />
    </div>
  );
}
