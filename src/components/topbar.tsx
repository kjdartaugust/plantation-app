"use client";

import { ThemeToggle } from "./theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Database, HardDrive } from "lucide-react";

export function Topbar({ title }: { title: string }) {
  const cloud = isSupabaseConfigured();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <span
          className="badge gap-1.5 bg-muted text-muted-foreground"
          title={
            cloud
              ? "Connected to Supabase"
              : "Running on local demo data (no Supabase configured)"
          }
        >
          {cloud ? (
            <Database className="h-3 w-3" />
          ) : (
            <HardDrive className="h-3 w-3" />
          )}
          {cloud ? "Supabase" : "Demo data"}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
