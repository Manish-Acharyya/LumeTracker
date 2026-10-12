import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function ErrorBanner({ message, onRetry }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm shadow-amber-100/50"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
      <p className="min-w-0 flex-1 font-medium">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-amber-300 bg-white/70 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
        >
          Retry now
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss alert"
        className="rounded-md p-1 text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
