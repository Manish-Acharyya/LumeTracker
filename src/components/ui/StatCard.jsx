const TONES = {
  default: 'text-slate-900',
  success: 'text-emerald-600',
  danger: 'text-rose-500',
  cyan: 'text-cyan-700',
};

const ICON_TONES = {
  default: 'bg-slate-100 text-slate-500 ring-slate-200',
  success: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  danger: 'bg-rose-50 text-rose-500 ring-rose-100',
  cyan: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
};

export default function StatCard({ label, value, sub, icon: Icon, tone = 'default' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition-all hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p
            className={`mt-2 truncate text-2xl font-bold tracking-tight ${TONES[tone] ?? TONES.default}`}
          >
            {value}
          </p>
          {sub ? <p className="mt-1.5 text-xs font-medium text-slate-400">{sub}</p> : null}
        </div>
        {Icon ? (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${
              ICON_TONES[tone] ?? ICON_TONES.default
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
