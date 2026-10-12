import { useEffect, useRef, useState } from 'react';

function readValue(key, initialValue) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initialValue;
    const parsed = JSON.parse(raw);
    return Array.isArray(initialValue) && !Array.isArray(parsed) ? initialValue : parsed;
  } catch {
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));
  const syncedKeyRef = useRef(key);

  useEffect(() => {
    if (syncedKeyRef.current !== key) {
      syncedKeyRef.current = key;
      setValue(readValue(key, initialValue));
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode / quota) — state still works in-memory */
    }
  }, [key, value]);

  return [value, setValue];
}
