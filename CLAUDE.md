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
The app is **demo-first so it runs with zero config**, with Supabase as an optional cloud backend:
- `src/lib/store.tsx` — `StoreProvider` holds **all** entities in React state, seeded from `src/lib/seed.ts`, persisted to `localStorage` (`plantation-app-data-v1`). `useStore()` exposes `data`, `add/update/remove/reset`. Every dashboard page reads and mutates through this hook.
- `src/lib/supabase.ts` — `getSupabaseClient()` returns `null` unless `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set (and `NEXT_PUBLIC_DEMO_MODE !== "true"`). `isSupabaseConfigured()` drives the "Demo data" vs "Supabase" badge in the topbar.
- `src/lib/types.ts` — the canonical entity shapes (`Farm`, `Crop`, `Worker`, `AttendanceRecord`, `InventoryItem`, `Transaction`, `SaleRecord`, `YieldRecord`) used by both the store and the SQL schema. **Keep `types.ts`, `seed.ts`, and `supabase/schema.sql` in sync.**

When wiring real Supabase persistence, mirror the store's `add/update/remove` signatures so pages don't change.

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
