'use client';
import { useEffect, useState } from 'react';

/** Persist any serialisable value under a key in localStorage */
export function useLocalStorage<T>(key: string, defaultVal: T) {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : defaultVal;
    } catch { return defaultVal; }
  });

  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(val)); }
    catch { /* quota exceeded */ }
  }, [key, val]);

  return [val, setVal] as const;
}
