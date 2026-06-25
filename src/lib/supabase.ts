import { createBrowserClient } from "@supabase/ssr";

/**
 * Returns a Supabase browser client, or null when env vars are absent.
 * The app falls back to the local demo store when this is null so it
 * runs out-of-the-box. Provide credentials in .env.local to enable cloud sync.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (demo || !url || !key) return null;
  return createBrowserClient(url, key);
}

export const isSupabaseConfigured = () =>
  process.env.NEXT_PUBLIC_DEMO_MODE !== "true" &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
