import Link from "next/link";
import {
  Leaf,
  ArrowRight,
  Sprout,
  Users,
  Boxes,
  CloudSun,
  BarChart3,
  Ship,
  MapPinned,
  Wallet,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase";

const features = [
  { icon: MapPinned, title: "Farm Mapping", desc: "Register estates with geo-coordinates, soil profiles and area tracking." },
  { icon: Sprout, title: "Crop Lifecycle", desc: "Follow every block from planting through growth stages to harvest." },
  { icon: Users, title: "Labor & Payroll", desc: "Worker records, daily attendance and automatic payroll computation." },
  { icon: Boxes, title: "Smart Inventory", desc: "Seeds, fertilizer, equipment and fuel with reorder-level alerts." },
  { icon: Wallet, title: "Financial Tracking", desc: "Revenue versus expenses, category breakdowns and profit margins." },
  { icon: Ship, title: "Sales & Export", desc: "Buyer contracts, shipment status and export documentation." },
  { icon: CloudSun, title: "Live Weather", desc: "Open-Meteo forecasts mapped to each plantation's location." },
  { icon: BarChart3, title: "Yield Analytics", desc: "Expected vs actual yields with rich, exportable visual reports." },
];

export default function Landing() {
  const cloud = isSupabaseConfigured();
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">Verdant</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {cloud && (
            <Link href="/login" className="btn-ghost">
              Sign in
            </Link>
          )}
          <Link href={cloud ? "/login" : "/dashboard"} className="btn-primary">
            {cloud ? "Get started" : "Open Dashboard"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center">
        <span className="badge bg-primary/12 text-primary">
          🌱 Agri-business intelligence
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl animate-fade-in-up text-4xl font-extrabold tracking-tight sm:text-6xl">
          Run your plantation like a
          <span className="text-primary"> modern enterprise</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl animate-fade-in-up text-lg text-muted-foreground [animation-delay:0.1s]">
          Verdant unifies mapping, crop lifecycle, labor, inventory, finance,
          weather and yield analytics into one premium control center.
        </p>
        <div className="mt-8 flex animate-fade-in-up items-center justify-center gap-3 [animation-delay:0.2s]">
          <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
            Launch the platform <ArrowRight className="h-5 w-5" />
          </Link>
          <a href="#features" className="btn-ghost px-6 py-3 text-base">
            Explore features
          </a>
        </div>
      </section>

      <section
        id="features"
        className="stagger mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card card-interactive p-5">
            <div className="mb-3 inline-flex rounded-lg bg-primary/12 p-2.5 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Built with Next.js 14, Supabase &amp; Tailwind CSS · Deploy-ready for Vercel
      </footer>
    </div>
  );
}
