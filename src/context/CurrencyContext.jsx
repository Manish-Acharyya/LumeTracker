import { createContext, useCallback, useContext, useState } from 'react';
import { CURRENCIES, convertFromUsd, formatMoney, formatMoneyCompact } from '../utils/currency';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState('USD');

  const setCurrency = useCallback((next) => {
    setCurrencyState(CURRENCIES.includes(next) ? next : 'USD');
  }, []);

  const convert = useCallback((usdValue) => convertFromUsd(usdValue, currency), [currency]);

  const formatMoneyInCurrency = useCallback(
    (usdValue, maximumFractionDigits) => formatMoney(usdValue, currency, maximumFractionDigits),
    [currency],
  );

  const formatMoneyCompactInCurrency = useCallback(
    (usdValue) => formatMoneyCompact(usdValue, currency),
    [currency],
  );

  const value = {
    currency,
    setCurrency,
    convert,
    formatMoney: formatMoneyInCurrency,
    formatMoneyCompact: formatMoneyCompactInCurrency,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
