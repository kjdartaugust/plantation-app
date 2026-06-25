"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  MapPinned,
  Users,
  Boxes,
  Wallet,
  Ship,
  CloudSun,
  BarChart3,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/farms", label: "Farms & Mapping", icon: MapPinned },
  { href: "/dashboard/crops", label: "Crop Lifecycle", icon: Sprout },
  { href: "/dashboard/workers", label: "Labor & Payroll", icon: Users },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/finance", label: "Finance", icon: Wallet },
  { href: "/dashboard/sales", label: "Sales & Export", icon: Ship },
  { href: "/dashboard/weather", label: "Weather", icon: CloudSun },
  { href: "/dashboard/analytics", label: "Yield Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/50 lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Verdant</p>
          <p className="text-[11px] text-muted-foreground">Plantation OS</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4 text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Verdant Agri
      </div>
    </aside>
  );
}
