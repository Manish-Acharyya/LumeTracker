export const CURRENCIES = ["USD", "EUR", "INR"];

export const FX_RATES = Object.freeze({
  USD: 1,
  EUR: 0.92,
  INR: 83.4,
});

const LOCALE_BY_CURRENCY = Object.freeze({
  USD: "en-US",
  EUR: "de-DE",
  INR: "en-IN",
});

function resolveCurrency(currency) {
  return FX_RATES[currency] ? currency : "USD";
}

export function convertFromUsd(usdValue, currency) {
  const code = resolveCurrency(currency);
  const value = Number(usdValue);
  if (!Number.isFinite(value)) return 0;
  return value * FX_RATES[code];
}

export function formatMoney(usdValue, currency, maximumFractionDigits) {
  const code = resolveCurrency(currency);
  const value = convertFromUsd(usdValue, code);

  const digits =
    typeof maximumFractionDigits === "number"
      ? maximumFractionDigits
      : Math.abs(value) >= 1000
        ? 2
        : Math.abs(value) >= 1
          ? 2
          : Math.abs(value) >= 0.01
            ? 4
            : 6;

  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[code], {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatMoneyCompact(usdValue, currency) {
  const code = resolveCurrency(currency);
  const value = convertFromUsd(usdValue, code);

  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[code], {
    style: "currency",
    currency: code,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}
