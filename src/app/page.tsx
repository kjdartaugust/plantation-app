"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sprout,
  Users,
  Boxes,
  CloudSun,
  BarChart3,
  Wallet,
  MapPinned,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import { FloatingNav } from "@/components/floating-nav";
import { AppMockup, FloatingBadges } from "@/components/app-mockup";
import { Reveal, RevealGroup, RevealItem, motion } from "@/components/motion";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const partners = [
  "COCOBOD",
  "GreenHarvest",
  "AgriBank",
  "Yara",
  "SeedCo",
  "FarmGate",
  "AgroVentures",
  "TerraTrade",
];

const features = [
  { icon: Sprout, title: "Crop Lifecycle", desc: "Track every block from planting through growth stages to harvest with health scoring.", image: "photo-1416879595882-3373a0480b5b" },
  { icon: Users, title: "Labor & Payroll", desc: "Worker registry, one-tap attendance and automatic monthly payroll.", image: "photo-1464226184884-fa280b87c399" },
  { icon: Boxes, title: "Smart Inventory", desc: "Seeds, fertilizer, fuel and equipment with live reorder alerts.", image: "photo-1574943320219-553eb213f72d" },
  { icon: CloudSun, title: "Live Weather", desc: "Open-Meteo forecasts and agronomic advisories per plantation.", image: "photo-1500382017468-9049fed747ef" },
];

const platform = [
  {
    tag: "Operations",
    title: "Your whole plantation, one calm dashboard",
    desc: "Real-time yield, revenue, soil and labor signals — composed into a single editorial view your whole team can read at a glance.",
    image: "photo-1625246333195-78d9c38ad449",
    points: ["Live KPIs & alerts", "Per-farm drill-down", "Export-ready reports"],
  },
  {
    tag: "Intelligence",
    title: "Decisions grounded in the field",
    desc: "Expected-vs-actual yields, financial margins and weather windows come together so you act before problems compound.",
    image: "photo-1592982537447-7440770cbfc9",
    points: ["Yield variance analytics", "Revenue vs expense", "Weather-aware planning"],
  },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <FloatingNav />

      {/* ============== HERO ============== */}
      <section className="hero-glow relative px-4 pb-20 pt-36 sm:pt-40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="badge gap-2 bg-primary/10 text-primary"
            >
              <Leaf className="h-3.5 w-3.5" /> The plantation operating system
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Grow more,
              <br />
              <span className="text-primary">guess less.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-md text-lg text-muted-foreground"
            >
              TerraFarm unifies crops, labor, inventory, finance, weather and yield
              analytics into one beautifully simple control center for modern
              agri-business.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
                Launch the platform <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#features" className="btn-ghost px-6 py-3 text-base">
                Explore features
              </a>
            </motion.div>

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Runs free in demo mode — no signup required.
            </div>
          </div>

          {/* floating mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <FloatingBadges />
            <AppMockup />
          </motion.div>
        </div>
      </section>

      {/* ============== MARQUEE ============== */}
      <section className="border-y border-border/60 bg-card/40 py-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Trusted across the value chain
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="marquee-track gap-12 pr-12">
            {[...partners, ...partners].map((p, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-xl font-bold tracking-tight text-foreground/40"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FEATURES ============== */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="badge bg-accent/15 text-accent">Everything in one place</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            A complete toolkit for the field
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Nine connected modules, designed to feel like one calm product.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <RevealItem key={f.title}>
              <div className="card card-interactive group h-full overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={img(f.image)}
                    alt={f.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex rounded-full bg-background/90 p-2.5 text-primary backdrop-blur">
                    <f.icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="mt-2 text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============== PLATFORM (alternating) ============== */}
      <section id="platform" className="space-y-28 px-4 py-12">
        {platform.map((p, idx) => (
          <div
            key={p.title}
            className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2"
          >
            <Reveal
              className={idx % 2 === 1 ? "lg:order-2" : ""}
              y={32}
            >
              <span className="badge bg-primary/10 text-primary">{p.tag}</span>
              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                {p.title}
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-3">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-primary">
                      <Sprout className="h-3.5 w-3.5" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal
              className={`relative ${idx % 2 === 1 ? "lg:order-1" : ""}`}
              y={40}
            >
              <div className="relative overflow-hidden rounded-[var(--radius)] border border-border/60 bg-muted shadow-xl">
                <img
                  src={img(p.image)}
                  alt={p.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
              </div>
              {/* floating mockup overlay */}
              <div className="absolute -bottom-6 left-1/2 w-[78%] -translate-x-1/2">
                <AppMockup compact />
              </div>
            </Reveal>
          </div>
        ))}
      </section>

      {/* ============== SHOWCASE ============== */}
      <section id="showcase" className="mx-auto max-w-5xl px-4 py-28">
        <Reveal className="text-center">
          <span className="badge bg-accent/15 text-accent">See it in motion</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Designed to be lived in
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Editorial typography, soft sage palette and warm earth tones — an
            agri-tech aesthetic that feels premium on every screen.
          </p>
        </Reveal>
        <Reveal className="relative mt-12" y={48}>
          <AppMockup />
        </Reveal>
      </section>

      {/* ============== CTA ============== */}
      <section className="px-4 pb-28">
        <Reveal className="mx-auto max-w-5xl">
          <div className="hero-glow relative overflow-hidden rounded-[2rem] border border-border/60 bg-primary px-8 py-16 text-center text-primary-foreground">
            <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Run your plantation like a modern enterprise
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
              Start exploring TerraFarm in seconds — your data, beautifully
              organised.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-base font-semibold text-foreground transition hover:opacity-90 active:scale-[0.97]"
              >
                Open the dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="text-lg font-bold">TerraFarm</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js 14, Supabase &amp; Tailwind · Deploy-ready for Vercel
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#platform" className="hover:text-foreground">Platform</a>
            <Link href="/dashboard" className="hover:text-foreground">App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
