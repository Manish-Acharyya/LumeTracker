import { useEffect, useRef, useState } from 'react';
import { fetchMarketData } from '../utils/api';
import { driftMockAssets } from '../utils/mockData';

const REFRESH_INTERVAL_MS = 15000;

export default function useFetchPrice() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const mockTickRef = useRef(0);
  const activeControllerRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    const load = async () => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }

      const controller = new AbortController();
      activeControllerRef.current = controller;

      try {
        const data = await fetchMarketData(controller.signal);
        if (disposed || controller.signal.aborted) return;
        setAssets(data);
        setIsMock(false);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        if (disposed || controller.signal.aborted || err?.name === 'AbortError') return;
        mockTickRef.current += 1;
        const fallback = driftMockAssets(mockTickRef.current);
        setAssets(fallback);
        setIsMock(true);
        setError(err?.message ?? 'Live market data is unavailable');
        setLastUpdated(new Date());
      } finally {
        if (!disposed && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();
    const intervalId = window.setInterval(load, REFRESH_INTERVAL_MS);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
        activeControllerRef.current = null;
      }
    };
  }, []);

  return { assets, loading, error, isMock, lastUpdated };
}
