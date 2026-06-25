"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PlantationData } from "./types";
import { seedData } from "./seed";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import { TABLES, fromRow, toRow, EMPTY_DATA, Collections } from "./mappers";
import { uid } from "./utils";

export type Notice = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
};

type StoreContextValue = {
  data: PlantationData;
  ready: boolean;
  mode: "demo" | "cloud";
  userEmail: string | null;
  notices: Notice[];
  dismissNotice: (id: string) => void;
  add: <K extends Collections>(key: K, item: PlantationData[K][number]) => void;
  update: <K extends Collections>(
    key: K,
    id: string,
    patch: Partial<PlantationData[K][number]>
  ) => void;
  remove: <K extends Collections>(key: K, id: string) => void;
  reset: () => void;
  seedSampleData: () => Promise<void>;
};

const STORAGE_KEY = "plantation-app-data-v1";
const StoreContext = createContext<StoreContextValue | null>(null);

function newId(prefix: string) {
  if (typeof globalThis.crypto?.randomUUID === "function")
    return globalThis.crypto.randomUUID();
  return uid(prefix);
}

async function fetchAll(
  supabase: NonNullable<ReturnType<typeof getSupabaseClient>>
): Promise<PlantationData> {
  const keys = Object.keys(TABLES) as Collections[];
  const next: PlantationData = { ...EMPTY_DATA };
  await Promise.all(
    keys.map(async (k) => {
      const { data, error } = await supabase.from(TABLES[k]).select("*");
      if (error) throw error;
      (next as Record<string, unknown>)[k] = (data ?? []).map((r) =>
        fromRow(k, r)
      );
    })
  );
  return next;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // `cloud` is derived from public env vars so it is identical on the server
  // and the client — avoiding a hydration mismatch. The browser client itself
  // is only instantiated in the browser (it touches cookies/localStorage).
  const cloud = isSupabaseConfigured();
  const [supabase] = useState(() =>
    cloud && typeof window !== "undefined" ? getSupabaseClient() : null
  );

  const [data, setData] = useState<PlantationData>(cloud ? EMPTY_DATA : seedData);
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);

  const dismissNotice = useCallback(
    (id: string) => setNotices((n) => n.filter((x) => x.id !== id)),
    []
  );

  const pushNotice = useCallback(
    (type: Notice["type"], message: string) => {
      const id = newId("notice");
      setNotices((n) => [...n, { id, type, message }]);
      setTimeout(() => dismissNotice(id), 4500);
    },
    [dismissNotice]
  );

  // Demo mode: hydrate from localStorage.
  useEffect(() => {
    if (cloud) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, [cloud]);

  // Demo mode: persist to localStorage.
  useEffect(() => {
    if (cloud || !ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full / disabled */
    }
  }, [data, ready, cloud]);

  // Cloud mode: load the signed-in user's rows and react to auth changes.
  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const load = async (email: string | null | undefined) => {
      setUserEmail(email ?? null);
      if (email) {
        try {
          const d = await fetchAll(supabase);
          if (active) setData(d);
        } catch (e) {
          console.error("Failed to load data", e);
        }
      } else {
        setData(EMPTY_DATA);
      }
      if (active) setReady(true);
    };

    supabase.auth.getUser().then(({ data }) => load(data.user?.email));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      load(session?.user?.email)
    );
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<StoreContextValue>(() => {
    const optimisticAdd = (key: Collections, item: unknown) =>
      setData((d) => ({ ...d, [key]: [item, ...(d[key] as unknown[])] }));

    const onError = (error: { message: string } | null) => {
      if (error) {
        console.error(error);
        pushNotice("error", error.message || "Save failed — please retry.");
      }
    };

    return {
      data,
      ready,
      mode: cloud ? "cloud" : "demo",
      userEmail,
      notices,
      dismissNotice,
      add: (key, item) => {
        if (supabase) {
          const row = { ...(item as Record<string, unknown>), id: newId(key) };
          optimisticAdd(key, row);
          supabase
            .from(TABLES[key])
            .insert(toRow(key, row))
            .then(({ error }) => onError(error));
        } else {
          optimisticAdd(key, item);
        }
        pushNotice("success", "Saved");
      },
      update: (key, id, patch) => {
        setData((d) => ({
          ...d,
          [key]: (d[key] as { id: string }[]).map((it) =>
            it.id === id ? { ...it, ...patch } : it
          ),
        }));
        if (supabase) {
          supabase
            .from(TABLES[key])
            .update(toRow(key, patch as Record<string, unknown>))
            .eq("id", id)
            .then(({ error }) => onError(error));
        }
        pushNotice("success", "Updated");
      },
      remove: (key, id) => {
        setData((d) => ({
          ...d,
          [key]: (d[key] as { id: string }[]).filter((it) => it.id !== id),
        }));
        if (supabase) {
          supabase
            .from(TABLES[key])
            .delete()
            .eq("id", id)
            .then(({ error }) => onError(error));
        }
        pushNotice("info", "Deleted");
      },
      reset: () => {
        if (!supabase) setData(seedData);
      },
      seedSampleData: async () => {
        if (!supabase) {
          setData(seedData);
          pushNotice("success", "Sample data loaded");
          return;
        }
        try {
        // Remap demo string-ids to UUIDs, preserving farm references.
        const farmIds = new Map<string, string>();
        const farms = seedData.farms.map((f) => {
          const id = newId("farm");
          farmIds.set(f.id, id);
          return { ...f, id };
        });
        const remapFarm = (fid?: string) =>
          fid ? farmIds.get(fid) ?? fid : undefined;
        const crops = seedData.crops.map((c) => ({
          ...c,
          id: newId("crop"),
          farmId: remapFarm(c.farmId)!,
        }));
        const transactions = seedData.transactions.map((t) => ({
          ...t,
          id: newId("tx"),
          farmId: remapFarm(t.farmId),
        }));
        const yields = seedData.yields.map((y) => ({
          ...y,
          id: newId("yld"),
          farmId: remapFarm(y.farmId)!,
        }));
        const workers = seedData.workers.map((w) => ({ ...w, id: newId("wk") }));
        const inventory = seedData.inventory.map((i) => ({ ...i, id: newId("inv") }));
        const sales = seedData.sales.map((s) => ({ ...s, id: newId("sale") }));

        const insert = (key: Collections, rows: unknown[]) =>
          supabase
            .from(TABLES[key])
            .insert(rows.map((r) => toRow(key, r as Record<string, unknown>)));

        // Parents before children to satisfy foreign keys.
        await insert("farms", farms);
        await insert("workers", workers);
          await Promise.all([
            insert("crops", crops),
            insert("inventory", inventory),
            insert("transactions", transactions),
            insert("sales", sales),
            insert("yields", yields),
          ]);
          const d = await fetchAll(supabase);
          setData(d);
          pushNotice("success", "Sample data loaded");
        } catch (e) {
          console.error(e);
          pushNotice(
            "error",
            "Could not load sample data — is the database schema applied?"
          );
        }
      },
    };
  }, [data, ready, cloud, supabase, userEmail, notices, dismissNotice, pushNotice]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
