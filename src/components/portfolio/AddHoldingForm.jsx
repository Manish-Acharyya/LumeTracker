import { useEffect, useState } from 'react';
import { Plus, WalletCards } from 'lucide-react';

export default function AddHoldingForm({ assets, onAdd }) {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (assets.length > 0 && !symbol) {
      setSymbol(assets[0].symbol);
    }
  }, [assets, symbol]);

  const selectedAsset = assets.find((asset) => asset.symbol === symbol) || null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const qty = Number(quantity);

    if (!selectedAsset) {
      setMessage({ tone: 'error', text: 'Select an asset to add.' });
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setMessage({ tone: 'error', text: 'Quantity must be a positive number.' });
      return;
    }

    const merged = !onAdd({
      id: selectedAsset.id,
      symbol: selectedAsset.symbol,
      name: selectedAsset.name,
      quantity: qty,
    });

    setMessage({
      tone: merged ? 'info' : 'success',
      text: merged
        ? `Merged ${qty} ${selectedAsset.symbol} into your existing position.`
        : `Added ${qty} ${selectedAsset.symbol} to your portfolio.`,
    });
    setQuantity('');
  };

  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-400 shadow-sm shadow-slate-200/50">
        Waiting for live market data before positions can be added…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 ring-1 ring-violet-100">
          <Plus className="h-4 w-4 text-violet-600" aria-hidden="true" />
        </span>
        <h2 className="text-sm font-bold text-slate-900">Add position</h2>
      </div>

      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Asset
        <select
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        >
          {assets.map((asset) => (
            <option key={asset.id} value={asset.symbol}>
              {asset.name} ({asset.symbol})
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Quantity
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="e.g. 0.5"
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm tabular-nums text-slate-800 shadow-sm placeholder:text-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </label>

      {selectedAsset ? (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <WalletCards className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          Live price:{' '}
          {selectedAsset.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
      ) : null}

      {message ? (
        <p
          role="status"
          className={`mt-3 text-xs font-semibold ${
            message.tone === 'error'
              ? 'text-rose-500'
              : message.tone === 'info'
                ? 'text-amber-600'
                : 'text-emerald-600'
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-gradient-to-b from-cyan-500 to-cyan-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-200 transition-all hover:from-cyan-400 hover:to-cyan-500 hover:shadow-lg hover:shadow-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-white"
      >
        Add to portfolio
      </button>
    </form>
  );
}
