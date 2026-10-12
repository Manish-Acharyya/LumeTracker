import Skeleton from './Skeleton';

export default function TableSkeleton({ rows = 8 }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-3 px-2">
          <Skeleton className="col-span-5 h-3" />
          <Skeleton className="col-span-3 h-3" />
          <Skeleton className="col-span-2 h-3" />
          <Skeleton className="col-span-2 hidden h-3 sm:block" />
        </div>
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-12 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-2 py-3"
          >
            <div className="col-span-6 flex items-center gap-3 sm:col-span-5">
              <Skeleton shape="circle" className="h-8 w-8 shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            <div className="col-span-3 space-y-2 sm:col-span-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2.5 w-12" />
            </div>
            <div className="col-span-3 sm:col-span-2">
              <Skeleton className="h-3 w-14" />
            </div>
            <div className="col-span-2 hidden sm:block">
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
