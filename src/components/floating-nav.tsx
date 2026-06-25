"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase";

const links = [
  { href: "#features", label: "Features" },
  { href: "#platform", label: "Platform" },
  { href: "#showcase", label: "Showcase" },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const cloud = isSupabaseConfigured();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className={cn(
          "flex w-full max-w-5xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300",
          scrolled
            ? "border border-border/70 bg-card/70 shadow-lg backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2 pl-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">TerraFarm</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {cloud && (
            <Link href="/login" className="hidden btn-ghost py-2 sm:inline-flex">
              Sign in
            </Link>
          )}
          <Link
            href={cloud ? "/login" : "/dashboard"}
            className="btn-primary py-2"
          >
            {cloud ? "Get started" : "Open app"}
          </Link>
        </div>
      </nav>
    </div>
  );
}
