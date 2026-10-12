import { useId, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CandlestickChart, TrendingUp } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { generatePriceSeries } from '../../utils/mockData';

const RANGES = ['7D', '30D', '90D'];

function ChartTooltip({ active, payload, label, formatMoney }) {
  if (!active || !payload?.length) return null;
  const point = payload[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg shadow-slate-200/60 backdrop-blur-sm">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold tabular-nums text-cyan-700">
        {formatMoney(point.value)}
      </p>
    </div>
  );
}

export default function PriceChart({ asset }) {
  const { formatMoney, formatMoneyCompact } = useCurrency();
  const [mode, setMode] = useState('area');
  const [range, setRange] = useState('30D');
  const gradientId = `price-gradient-${useId().replace(/:/g, '')}`;

  const series = generatePriceSeries(asset.symbol, range, asset.price);
  const first = series[0]?.price ?? 0;
  const last = series[series.length - 1]?.price ?? 0;
  const trajectory = last >= first ? 'Upward' : 'Downward';
  const changePercent = first > 0 ? ((last - first) / first) * 100 : 0;

  const axisStroke = '#94a3b8';
  const gridStroke = '#e2e8f0';
  const tooltipContent = (props) => (
    <ChartTooltip {...props} formatMoney={formatMoney} />
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 ring-1 ring-cyan-100">
              <TrendingUp className="h-4 w-4 text-cyan-600" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">{asset.name}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {asset.symbol} · {range}
              </p>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {formatMoney(asset.price)}
          </p>
          <p
            className={`mt-1 text-xs font-semibold ${
              changePercent >= 0 ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {trajectory} {Math.abs(changePercent).toFixed(2)}% over {range}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            role="group"
            aria-label="Chart type"
            className="flex rounded-xl border border-slate-200 bg-slate-100/80 p-0.5"
          >
            {['area', 'line'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                aria-pressed={mode === option}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                  mode === option
                    ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CandlestickChart className="h-3.5 w-3.5" aria-hidden="true" />
                {option}
              </button>
            ))}
          </div>
          <div
            role="group"
            aria-label="Time range"
            className="flex rounded-xl border border-slate-200 bg-slate-100/80 p-0.5"
          >
            {RANGES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                aria-pressed={range === option}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  range === option
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-64 w-full sm:h-80" role="img" aria-label={`${asset.name} ${range} price chart`}>
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'area' ? (
            <AreaChart data={series} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="label"
                stroke={axisStroke}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                stroke={axisStroke}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={58}
                tickFormatter={(value) => formatMoneyCompact(value)}
              />
              <Tooltip content={tooltipContent} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#0891b2"
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: '#0891b2', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={series} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="label"
                stroke={axisStroke}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                stroke={axisStroke}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={58}
                tickFormatter={(value) => formatMoneyCompact(value)}
              />
              <Tooltip content={tooltipContent} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: '#7c3aed', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
