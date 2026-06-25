# 🌱 Verdant — Plantation Management Platform

A premium full-stack agri-business application for running plantations: farm mapping,
crop lifecycle tracking, labor & payroll, inventory, finance, sales/export records,
live weather and yield analytics — with dark/light mode.

Built with **Next.js 14 (App Router)**, **Supabase**, **Tailwind CSS** and **Recharts**.
Deploy-ready for **Vercel**.

## Features

- **Farms & Mapping** — register estates with geo-coordinates, embedded OpenStreetMap, soil & area data
- **Crop Lifecycle** — 8-stage tracking (planned → harvest), health scores, progress bars, stage advancement
- **Labor & Payroll** — worker registry, one-click daily attendance, auto-computed monthly payroll
- **Inventory** — seeds/fertilizer/equipment/fuel with live reorder-level alerts and stock valuation
- **Finance** — income vs expense, cash-flow chart, category breakdowns, net profit
- **Sales & Export** — buyer contracts with status pipeline (pending → shipped → delivered → paid)
- **Weather** — live 7-day Open-Meteo forecast per farm + agronomic advisories (no API key)
- **Yield Analytics** — expected vs actual yields, variance table, CSV export
- **Premium UI** — responsive dashboard, dark/light theme, animated charts

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

The app runs immediately on a **built-in demo dataset** (persisted to `localStorage`) —
no database required.

## Connecting Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor (creates tables, RLS policies and a storage bucket).
3. Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

The topbar badge switches from **Demo data** to **Supabase** when configured.

## Deploy to Vercel

Push to GitHub, import the repo in Vercel, add the two `NEXT_PUBLIC_SUPABASE_*`
environment variables (optional), and deploy. No other configuration needed.

## Architecture

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture overview.
