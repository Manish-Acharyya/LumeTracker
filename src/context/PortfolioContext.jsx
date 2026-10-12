import { createContext, useCallback, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'lumen.portfolio.holdings.v1';

const PortfolioContext = createContext(null);

function makeHoldingId(symbol) {
  return `holding-${String(symbol).toLowerCase()}`;
}

function normalizeHoldings(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeStore(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

export function PortfolioProvider({ children }) {
  const { user, loading } = useAuth();
  const [store, setStore] = useLocalStorage(STORAGE_KEY, {});

  useEffect(() => {
    if (loading || !user) return;
    if (!Array.isArray(store)) return;
    setStore({ [user.id]: normalizeHoldings(store) });
  }, [loading, user, store, setStore]);

  const setHoldings = useCallback(
    (nextOrUpdater) => {
      if (!user) return;
      setStore((prev) => {
        const map = normalizeStore(prev);
        const current = normalizeHoldings(map[user.id]);
        const next =
          typeof nextOrUpdater === 'function' ? nextOrUpdater(current) : nextOrUpdater;
        return { ...map, [user.id]: normalizeHoldings(next) };
      });
    },
    [user, setStore],
  );

  const holdings = user ? normalizeHoldings(store[user.id]) : [];

  const addHolding = useCallback(
    ({ id, symbol, name, quantity }) => {
      const qty = Number(quantity);
      if (!id || !symbol || !Number.isFinite(qty) || qty <= 0) return false;

      let merged = false;
      setHoldings((prev) => {
        const list = normalizeHoldings(prev);
        const existingIndex = list.findIndex((item) => item.symbol === symbol);
        if (existingIndex >= 0) {
          merged = true;
          const next = [...list];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + qty,
          };
          return next;
        }
        return [...list, { id: makeHoldingId(symbol), symbol, name, quantity: qty }];
      });
      return !merged;
    },
    [setHoldings],
  );

  const removeHolding = useCallback(
    (id) => {
      setHoldings((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item.id !== id) : prev,
      );
    },
    [setHoldings],
  );

  const clearHoldings = useCallback(() => setHoldings([]), [setHoldings]);

  const value = { holdings, addHolding, removeHolding, clearHoldings };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
