"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { getSupabaseClient } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { Database, HardDrive, LogOut } from "lucide-react";

export function Topbar({ title }: { title: string }) {
  const router = useRouter();
  const { mode, userEmail } = useStore();
  const cloud = mode === "cloud";

  const signOut = async () => {
    await getSupabaseClient()?.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-5">
      <div className="flex items-center gap-2">
        <MobileNav />
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <span
          className="badge gap-1.5 bg-muted text-muted-foreground"
          title={
            cloud
              ? "Connected to Supabase"
              : "Running on local demo data (no Supabase configured)"
          }
        >
          {cloud ? <Database className="h-3 w-3" /> : <HardDrive className="h-3 w-3" />}
          <span className="hidden sm:inline">{cloud ? "Supabase" : "Demo data"}</span>
        </span>

        {cloud && userEmail && (
          <>
            <span className="hidden max-w-[14rem] truncate text-sm text-muted-foreground md:inline">
              {userEmail}
            </span>
            <button
              onClick={signOut}
              title="Sign out"
              className="btn-ghost h-9 w-9 px-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}
