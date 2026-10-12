import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export default function SortHeader({ label, sortKey, sort, onSort, align = 'right', className = '' }) {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;

  return (
    <th scope="col" className={`px-3 py-3 ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        aria-label={`Sort by ${label}`}
        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
          align === 'right' ? 'justify-end' : 'justify-start'
        } w-full ${active ? 'text-cyan-700' : 'text-slate-400 hover:text-slate-700'}`}
      >
        {label}
        <Icon className={`h-3.5 w-3.5 ${active ? 'opacity-100' : 'opacity-40'}`} aria-hidden="true" />
      </button>
    </th>
  );
}
