export function formatPercent(value, { signed = true } = {}) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0.00%';
  const prefix = signed && num > 0 ? '+' : '';
  return `${prefix}${num.toFixed(2)}%`;
}

export function formatQuantity(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(num);
}

export function clampNumber(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}
