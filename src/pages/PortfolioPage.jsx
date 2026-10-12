import { PieChart, RefreshCcw, Wallet } from 'lucide-react';
import useFetchPrice from '../hooks/useFetchPrice';
import { useCurrency } from '../context/CurrencyContext';
import { usePortfolio } from '../context/PortfolioContext';
import { formatMoney } from '../utils/currency';
import { formatPercent } from '../utils/format';
import StatCard from '../components/ui/StatCard';
import AddHoldingForm from '../components/portfolio/AddHoldingForm';
import HoldingsList from '../components/portfolio/HoldingsList';
import AllocationBar from '../components/portfolio/AllocationBar';
import { StatCardSkeletonRow } from '../components/skeletons/StatCardSkeleton';
import TableSkeleton from '../components/skeletons/TableSkeleton';

export default function PortfolioPage() {
  const { assets, loading } = useFetchPrice();
  const { currency, formatMoneyCompact } = useCurrency();
  const { holdings, addHolding, removeHolding, clearHoldings } = usePortfolio();

  const rows = holdings.map((holding) => {
    const live = assets.find((asset) => asset.symbol === holding.symbol);
    const priceUsd = live ? live.price : 0;
    const valueUsd = priceUsd * holding.quantity;
    return {
      ...holding,
      price: priceUsd,
      value: valueUsd,
      allocation: 0,
      isLive: Boolean(live),
    };
  });

  const totalValueUsd = rows.reduce((sum, row) => sum + row.value, 0);
  const enrichedRows = rows.map((row) => ({
    ...row,
    allocation: totalValueUsd > 0 ? (row.value / totalValueUsd) * 100 : 0,
  }));
  const topHolding = enrichedRows.reduce(
    (best, row) => (best && best.allocation >= row.allocation ? best : row),
    null,
  );
  const isLoadingFirstPayload = loading && assets.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Portfolio</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Holdings are saved to your account and valued live in {currency}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {holdings.length > 0 ? (
            <button
              type="button"
              onClick={clearHoldings}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-rose-300 hover:text-rose-600"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Clear all
            </button>
          ) : null}
        </div>
      </div>

      {isLoadingFirstPayload ? (
        <StatCardSkeletonRow />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Value"
            value={formatMoneyCompact(totalValueUsd)}
            sub={`${enrichedRows.length} position${enrichedRows.length === 1 ? '' : 's'} · ${currency}`}
            icon={Wallet}
            tone="cyan"
          />
          <StatCard
            label="Largest Position"
            value={topHolding ? `${topHolding.allocation.toFixed(1)}%` : '—'}
            sub={topHolding ? topHolding.name : 'Add a holding to see allocation'}
            icon={PieChart}
            tone="default"
          />
          <StatCard
            label="Best 24h Mover"
            value={
              enrichedRows.length > 0
                ? formatPercent(
                    enrichedRows.reduce((best, row) => {
                      const change = assets.find((a) => a.symbol === row.symbol)?.change24h ?? 0;
                      return change > best ? change : best;
                    }, -Infinity),
                  )
                : '—'
            }
            sub="Across your holdings"
            icon={RefreshCcw}
            tone="default"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isLoadingFirstPayload ? (
            <TableSkeleton rows={5} />
          ) : (
            <HoldingsList rows={enrichedRows} onRemove={removeHolding} />
          )}
        </div>
        <div className="space-y-6">
          <AddHoldingForm assets={assets} onAdd={addHolding} />
          <AllocationBar rows={enrichedRows} />
        </div>
      </div>

      {enrichedRows.some((row) => !row.isLive) && assets.length > 0 ? (
        <p className="text-xs font-medium text-slate-400">
          Some holdings are outside the tracked top-25 list and are valued at {formatMoney(0)} until
          they appear in the live feed.
        </p>
      ) : null}
    </div>
  );
}
