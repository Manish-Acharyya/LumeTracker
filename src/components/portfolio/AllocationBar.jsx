import { useCurrency } from '../../context/CurrencyContext';

const SEGMENT_COLORS = [
  '#0891b2',
  '#7c3aed',
  '#059669',
  '#d97706',
  '#db2777',
  '#2563eb',
  '#e11d48',
  '#16a34a',
];

export default function AllocationBar({ rows }) {
  const { formatMoneyCompact } = useCurrency();

  if (rows.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
      <h2 className="text-sm font-bold text-slate-900">Allocation</h2>
      <p className="mt-1 text-xs font-medium text-slate-400">
        Share of total portfolio value per position.
      </p>

      <div
        className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200"
        role="img"
        aria-label="Portfolio allocation breakdown"
      >
        {rows.map((row, index) => (
          <span
            key={row.id}
            className="h-full transition-all duration-500"
            style={{
              width: `${row.allocation}%`,
              backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
            }}
            title={`${row.symbol}: ${row.allocation.toFixed(1)}%`}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2.5">
        {rows.map((row, index) => (
          <li key={row.id} className="flex items-center gap-2.5 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate font-semibold text-slate-700">{row.name}</span>
            <span className="font-medium tabular-nums text-slate-400">
              {row.allocation.toFixed(1)}%
            </span>
            <span className="w-24 text-right font-bold tabular-nums text-slate-900">
              {formatMoneyCompact(row.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
