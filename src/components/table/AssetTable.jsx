import { useState } from 'react';
import { SearchX } from 'lucide-react';
import SearchBar from './SearchBar';
import SortHeader from './SortHeader';
import AssetRow from './AssetRow';

export default function AssetTable({ assets, selectedId, onSelect }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: 'marketCap', dir: 'desc' });

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'name' ? 'asc' : 'desc' },
    );
  };

  const normalizedQuery = query.trim().toLowerCase();

  const rows = assets
    .filter((asset) => {
      if (!normalizedQuery) return true;
      return (
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.symbol.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((a, b) => {
      const direction = sort.dir === 'asc' ? 1 : -1;
      if (sort.key === 'name') {
        return a.name.localeCompare(b.name) * direction;
      }
      return ((a[sort.key] ?? 0) - (b[sort.key] ?? 0)) * direction;
    });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SearchBar value={query} onChange={setQuery} />
        <p className="text-xs font-medium text-slate-400">
          {rows.length} of {assets.length} assets
        </p>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              <SortHeader
                label="Asset"
                sortKey="name"
                sort={sort}
                onSort={handleSort}
                align="left"
                className="w-[38%] rounded-l-xl"
              />
              <SortHeader label="Price" sortKey="price" sort={sort} onSort={handleSort} />
              <SortHeader label="24h %" sortKey="change24h" sort={sort} onSort={handleSort} />
              <SortHeader
                label="Market Cap"
                sortKey="marketCap"
                sort={sort}
                onSort={handleSort}
                className="hidden rounded-r-xl sm:table-cell"
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((asset) => (
              <AssetRow
                key={asset.id}
                asset={asset}
                selected={asset.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
            <SearchX className="h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-700">No assets match “{query}”</p>
            <p className="text-xs text-slate-400">Try a different name or ticker symbol.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
