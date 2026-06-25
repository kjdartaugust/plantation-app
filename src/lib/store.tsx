"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PlantationData } from "./types";
import { seedData } from "./seed";

type Collections = keyof PlantationData;

type StoreContextValue = {
  data: PlantationData;
  ready: boolean;
  add: <K extends Collections>(key: K, item: PlantationData[K][number]) => void;
  update: <K extends Collections>(
    key: K,
    id: string,
    patch: Partial<PlantationData[K][number]>
  ) => void;
  remove: <K extends Collections>(key: K, id: string) => void;
  reset: () => void;
};

const STORAGE_KEY = "plantation-app-data-v1";

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PlantationData>(seedData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full / disabled */
    }
  }, [data, ready]);

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
      ready,
      add: (key, item) =>
        setData((d) => ({ ...d, [key]: [item, ...(d[key] as any[])] })),
      update: (key, id, patch) =>
        setData((d) => ({
          ...d,
          [key]: (d[key] as any[]).map((it) =>
            it.id === id ? { ...it, ...patch } : it
          ),
        })),
      remove: (key, id) =>
        setData((d) => ({
          ...d,
          [key]: (d[key] as any[]).filter((it) => it.id !== id),
        })),
      reset: () => setData(seedData),
    }),
    [data, ready]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
