import { Check } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const OPTIONS = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'INR', symbol: '₹' },
];

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Display currency"
      className="flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = option.code === currency;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setCurrency(option.code)}
            aria-pressed={active}
            className={`relative flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 ${
              active
                ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-200'
                : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
            }`}
          >
            <span aria-hidden="true">{option.symbol}</span>
            <span>{option.code}</span>
            {active ? (
              <Check className="hidden h-3 w-3 sm:block" aria-hidden="true" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
