# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build (run before deploy / to typecheck)
npm run start      # serve the production build
npm run lint       # Next.js / ESLint
```

There is no test runner configured. `npm run build` is the primary correctness gate (TypeScript is `strict`).

## Architecture

Next.js 14 **App Router** + TypeScript + Tailwind. Premium agri-business UI ("Verdant") for plantation management. Path alias `@/*` → `src/*`.

### Data layer — dual mode
The app is **demo-first so it runs with zero config**, with Supabase as the optional cloud backend. The same `useStore()` API drives both modes — pages never branch on mode:
- `src/lib/store.tsx` — `StoreProvider` holds **all** entities in React state. `useStore()` exposes `data`, `mode` (`"demo" | "cloud"`), `userEmail`, `add/update/remove/reset`, and `seedSampleData`. In **demo** mode it seeds from `src/lib/seed.ts` and persists to `localStorage` (`plantation-app-data-v1`). In **cloud** mode it loads the signed-in user's rows from Supabase, write-through on every mutation, and reacts to `onAuthStateChange`.
- `src/lib/supabase.ts` — `getSupabaseClient()` returns `null` (→ demo) unless `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set (and `NEXT_PUBLIC_DEMO_MODE !== "true"`). `isSupabaseConfigured()` drives the badge + auth UI.
- `src/lib/mappers.ts` — `FIELD_MAP`/`toRow`/`fromRow` translate camelCase store objects ↔ snake_case Postgres columns (partial-safe for updates). New columns must be added here too.
- `src/lib/types.ts` — canonical entity shapes used by store, mappers and SQL. **Keep `types.ts`, `seed.ts`, `mappers.ts`, and `supabase/schema.sql` in sync.**

### Auth & routing
- `src/middleware.ts` — when Supabase is configured, refreshes the session cookie and guards `/dashboard/*` (→ `/login`) / bounces authed users off `/login`. When **not** configured it's a no-op so demo mode stays open. Matcher: `/dashboard/:path*`, `/login`, `/signup`.
- `src/app/login/page.tsx` — combined sign-in / sign-up (email+password) via the browser client; cloud-mode IDs are UUIDs (`crypto.randomUUID`), and `seedSampleData` remaps demo string-ids to UUIDs preserving farm FKs.

### UI structure
- `src/app/page.tsx` — public landing page.
- `src/app/dashboard/layout.tsx` — renders `Sidebar` + main area; each page renders its own `<Topbar title=... />`.
- One route per feature under `src/app/dashboard/*` (farms, crops, workers, inventory, finance, sales, weather, analytics).
- `src/components/ui.tsx` — shared primitives: `StatCard`, `SectionCard`, `Modal`, `EmptyState`, `StatusBadge`. `charts.tsx` wraps Recharts (theme-aware via CSS vars). Prefer these over bespoke markup.
- Theming: `next-themes` (class strategy). Colors are HSL CSS variables in `globals.css` (`:root` / `.dark`) surfaced through `tailwind.config.ts`. Use semantic tokens (`bg-primary`, `text-muted-foreground`) — never hard-coded colors — so dark/light both work. Component classes (`.btn-primary`, `.card`, `.input`, `.badge`) live in the `@layer components` block.

### Conventions
- Pages that use the store, charts, or browser APIs must be Client Components (`"use client"`).
- IDs for new records: `uid(prefix)` from `src/lib/utils.ts`. Currency: `formatCurrency` (GHS). Dataset is modelled on a Ghanaian agri-business.
- Weather uses the free **Open-Meteo** API (no key) keyed off each farm's `latitude`/`longitude`.
