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
  ShieldCheck,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/farms", label: "Farms & Mapping", icon: MapPinned },
  { href: "/dashboard/crops", label: "Crop Tracker", icon: Sprout },
  { href: "/dashboard/workers", label: "Worker Management", icon: Users },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/finance", label: "Financials", icon: Wallet },
  { href: "/dashboard/sales", label: "Sales & Export", icon: Ship },
  { href: "/dashboard/weather", label: "Weather", icon: CloudSun },
  { href: "/dashboard/analytics", label: "Yield Analytics", icon: BarChart3 },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
];

export function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}
