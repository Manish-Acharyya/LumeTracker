import { useState } from 'react';
import { Activity, ChartNoAxesCombined, Layers } from 'lucide-react';
import useFetchPrice from '../hooks/useFetchPrice';
import { useCurrency } from '../context/CurrencyContext';
import { formatPercent } from '../utils/format';
import AssetTable from '../components/table/AssetTable';
import PriceChart from '../components/chart/PriceChart';
import StatCard from '../components/ui/StatCard';
import ErrorBanner from '../components/ui/ErrorBanner';
import { StatCardSkeletonRow } from '../components/skeletons/StatCardSkeleton';
import TableSkeleton from '../components/skeletons/TableSkeleton';
import ChartSkeleton from '../components/skeletons/ChartSkeleton';

export default function DashboardPage() {
  const { assets, loading, isMock, lastUpdated } = useFetchPrice();
  const { formatMoneyCompact, currency } = useCurrency();
  const [selectedId, setSelectedId] = useState(null);

  const selectedAsset = assets.find((asset) => asset.id === selectedId) || assets[0] || null;
  const totalMarketCap = assets.reduce((sum, asset) => sum + asset.marketCap, 0);
  const averageChange = assets.length
    ? assets.reduce((sum, asset) => sum + asset.change24h, 0) / assets.length
    : 0;
  const gainers = assets.filter((asset) => asset.change24h > 0).length;
  const isLoadingFirstPayload = loading && assets.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Market Overview</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · auto-refreshes every 15s`
              : 'Connecting to market feed…'}
          </p>
        </div>
        {isMock ? (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Simulated feed (live API rate-limited)
          </span>
        ) : (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Live · CoinGecko · {currency}
          </span>
        )}
      </div>

      {isMock ? (
        <ErrorBanner message="Live market data is currently unavailable (network error or rate limit). The dashboard is showing a simulated fallback feed so nothing breaks." />
      ) : null}

      {isLoadingFirstPayload ? (
        <StatCardSkeletonRow />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Top 25 Market Cap"
            value={formatMoneyCompact(totalMarketCap)}
            sub="Aggregate of tracked assets"
            icon={Layers}
            tone="cyan"
          />
          <StatCard
            label="Average 24h Change"
            value={formatPercent(averageChange)}
            sub="Across all tracked assets"
            icon={Activity}
            tone={averageChange >= 0 ? 'success' : 'danger'}
          />
          <StatCard
            label="Market Breadth"
            value={`${gainers} / ${assets.length || 25}`}
            sub="Assets trading green (24h)"
            icon={ChartNoAxesCombined}
            tone={gainers >= (assets.length || 0) / 2 ? 'success' : 'danger'}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {isLoadingFirstPayload ? (
            <TableSkeleton rows={8} />
          ) : (
            <AssetTable
              assets={assets}
              selectedId={selectedAsset?.id ?? null}
              onSelect={setSelectedId}
            />
          )}
        </div>
        <div className="lg:col-span-2">
          {isLoadingFirstPayload ? (
            <ChartSkeleton />
          ) : selectedAsset ? (
            <PriceChart key={selectedAsset.id} asset={selectedAsset} />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-8 text-center text-sm font-medium text-slate-400">
              No asset selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
