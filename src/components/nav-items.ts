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
} from "lucide-react";

export const navItems = [
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

export function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}
