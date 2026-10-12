import { Trash2 } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatQuantity } from '../../utils/format';

export default function HoldingsList({ rows, onRemove }) {
  const { formatMoney, formatMoneyCompact } = useCurrency();

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
        <p className="text-sm font-semibold text-slate-700">No holdings yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Add your first position to start tracking live valuation.
        </p>
      </div>
    );
  }

  const maxAllocation = rows.reduce((max, row) => Math.max(max, row.allocation), 0) || 1;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-5">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th scope="col" className="rounded-l-xl px-3 py-3">Asset</th>
              <th scope="col" className="px-3 py-3 text-right">Qty</th>
              <th scope="col" className="px-3 py-3 text-right">Price</th>
              <th scope="col" className="px-3 py-3 text-right">Value</th>
              <th scope="col" className="px-3 py-3 text-right">Share</th>
              <th scope="col" className="rounded-r-xl px-3 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-3 py-3.5">
                  <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {row.symbol}
                  </p>
                </td>
                <td className="px-3 py-3.5 text-right text-sm font-medium tabular-nums text-slate-600">
                  {formatQuantity(row.quantity)}
                </td>
                <td className="px-3 py-3.5 text-right text-sm font-medium tabular-nums text-slate-600">
                  {formatMoney(row.price)}
                </td>
                <td className="px-3 py-3.5 text-right text-sm font-bold tabular-nums text-slate-900">
                  {formatMoneyCompact(row.value)}
                </td>
                <td className="px-3 py-3.5 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold tabular-nums text-slate-600">
                      {row.allocation.toFixed(1)}%
                    </span>
                    <span
                      className="h-1 rounded-full bg-cyan-500"
                      style={{ width: `${Math.max((row.allocation / maxAllocation) * 56, 4)}px` }}
                      aria-hidden="true"
                    />
                  </div>
                </td>
                <td className="px-3 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(row.id)}
                    aria-label={`Remove ${row.name} from portfolio`}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
