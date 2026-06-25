"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Leaf, TrendingUp, Droplets, Sprout, Sun } from "lucide-react";

// A stylized dashboard UI used as the floating hero/section visual.
export function AppMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="card overflow-hidden border-border/60 shadow-2xl">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <div className="ml-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Leaf className="h-3.5 w-3.5 text-primary" /> TerraFarm
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">
        {/* stat tiles */}
        {[
          { label: "Net Yield", value: "1,422 t", icon: Sprout, tone: "primary" },
          { label: "Revenue", value: "₵ 84k", icon: TrendingUp, tone: "accent" },
          { label: "Soil Moist.", value: "61%", icon: Droplets, tone: "primary" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/60 bg-background/60 p-3">
            <div
              className={`mb-2 inline-flex rounded-lg p-1.5 ${
                s.tone === "accent" ? "bg-accent/15 text-accent" : "bg-primary/12 text-primary"
              }`}
            >
              <s.icon className="h-3.5 w-3.5" />
            </div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="text-sm font-bold">{s.value}</p>
          </div>
        ))}

        {/* chart */}
        <div className="col-span-2 rounded-xl border border-border/60 bg-background/60 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Yield vs Target
          </p>
          <div className="flex h-20 items-end gap-1.5">
            {[40, 62, 48, 75, 58, 84, 70, 92].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-primary/80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* side list */}
        <div className="rounded-xl border border-border/60 bg-background/60 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Today
          </p>
          {[
            { i: Sun, t: "Irrigate Block C" },
            { i: Sprout, t: "Scout pests" },
            { i: Leaf, t: "Fertilize palms" },
          ].map((r, i) => (
            <div key={i} className="mb-1.5 flex items-center gap-1.5 text-[11px]">
              <r.i className="h-3 w-3 text-primary" />
              <span className="truncate text-foreground/80">{r.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const badges = [
  { label: "Harvest Ready", icon: Sprout, tone: "primary", pos: "left-[-8%] top-[18%]", d: 0 },
  { label: "Rain Reported", icon: Droplets, tone: "accent", pos: "right-[-6%] top-[8%]", d: 0.4 },
  { label: "Yield Up 12%", icon: TrendingUp, tone: "primary", pos: "right-[-10%] bottom-[14%]", d: 0.8 },
];

export function FloatingBadges() {
  const reduce = useReducedMotion();
  return (
    <>
      {badges.map((b) => (
        <motion.div
          key={b.label}
          className={`absolute z-20 hidden md:flex ${b.pos}`}
          initial={reduce ? false : { opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6 + b.d, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={reduce ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 3.5 + b.d, repeat: Infinity, ease: "easeInOut" }}
            className="pill flex items-center gap-2 px-3.5 py-2 shadow-lg"
          >
            <span
              className={`inline-flex rounded-full p-1 ${
                b.tone === "accent" ? "bg-accent/20 text-accent" : "bg-primary/15 text-primary"
              }`}
            >
              <b.icon className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold">{b.label}</span>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
