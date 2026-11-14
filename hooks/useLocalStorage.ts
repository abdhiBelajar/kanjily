"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const getSnapshot = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => JSON.stringify(initialValue), [initialValue]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value: T = useMemo(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  }, [raw, initialValue]);

  const setValue = useCallback(
    (valOrFn: T | ((val: T) => T)) => {
      try {
        const current = window.localStorage.getItem(key);
        const prev: T = current !== null ? JSON.parse(current) : initialValue;
        const next = valOrFn instanceof Function ? valOrFn(prev) : valOrFn;
        window.localStorage.setItem(key, JSON.stringify(next));
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, initialValue]
  );

  return [value, setValue];
}
