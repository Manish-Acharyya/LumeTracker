export default function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="skeleton h-3 w-24 rounded-md" />
          <div className="skeleton h-7 w-40 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-9 w-20 rounded-md" />
          <div className="skeleton h-9 w-24 rounded-md" />
        </div>
      </div>
      <svg
        viewBox="0 0 600 260"
        className="h-64 w-full sm:h-80"
        role="img"
        aria-label="Loading price chart"
      >
        <defs>
          <linearGradient id="chart-skeleton-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[64, 112, 160, 208].map((y) => (
          <line key={y} x1="48" y1={y} x2="584" y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
        ))}
        <rect x="48" y="230" width="536" height="12" rx="4" fill="#f1f5f9" />
        <path
          d="M48 190 L120 168 L190 176 L260 132 L330 148 L400 98 L470 118 L540 78 L584 92 L584 230 L48 230 Z"
          fill="url(#chart-skeleton-gradient)"
        />
        <path
          d="M48 190 L120 168 L190 176 L260 132 L330 148 L400 98 L470 118 L540 78 L584 92"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
