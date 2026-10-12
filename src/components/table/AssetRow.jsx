import { useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatPercent } from '../../utils/format';

function CoinIcon({ asset }) {
  const [failed, setFailed] = useState(false);

  if (asset.image && !failed) {
    return (
      <img
        src={asset.image}
        alt=""
        loading="lazy"
        width={32}
        height={32}
        onError={() => setFailed(true)}
        className="h-8 w-8 shrink-0 rounded-full bg-slate-100 shadow-sm"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-200 text-[10px] font-bold text-cyan-700"
    >
      {asset.symbol.slice(0, 3)}
    </span>
  );
}

export default function AssetRow({ asset, selected, onSelect }) {
  const { formatMoney, formatMoneyCompact } = useCurrency();
  const isUp = asset.change24h >= 0;

  return (
    <tr
      onClick={() => onSelect(asset.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(asset.id);
        }
      }}
      tabIndex={0}
      aria-selected={selected}
      className={`cursor-pointer border-b border-slate-100 transition-colors last:border-b-0 focus:outline-none focus-visible:bg-cyan-50/60 ${
        selected ? 'bg-cyan-50/70 hover:bg-cyan-50' : 'hover:bg-slate-50'
      }`}
    >
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-3">
          <CoinIcon asset={asset} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{asset.name}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {asset.symbol}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5 text-right">
        <p className="text-sm font-semibold tabular-nums text-slate-900">
          {formatMoney(asset.price)}
        </p>
      </td>
      <td className="px-3 py-3.5 text-right">
        <span
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold tabular-nums ${
            isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
          }`}
        >
          {isUp ? (
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-3 w-3" aria-hidden="true" />
          )}
          {formatPercent(asset.change24h)}
        </span>
      </td>
      <td className="hidden px-3 py-3.5 text-right sm:table-cell">
        <p className="text-sm font-medium tabular-nums text-slate-600">
          {formatMoneyCompact(asset.marketCap)}
        </p>
      </td>
    </tr>
  );
}
