"use client";

import { useTheme } from "next-themes";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { SectionCard, StatCard } from "@/components/ui";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Database,
  HardDrive,
  Download,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ShieldCheck,
  Boxes,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function AdminPage() {
  const { data, mode, userEmail, reset, seedSampleData } = useStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const cloud = mode === "cloud";

  const totalRecords = Object.values(data).reduce(
    (s, arr) => s + (arr as unknown[]).length,
    0
  );

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "terrafarm-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const signOut = async () => {
    await getSupabaseClient()?.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const collections = Object.entries(data) as [string, unknown[]][];

  return (
    <>
      <Topbar title="Admin" />
      <div className="space-y-6 p-5">
        <div className="stagger grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Storage Mode"
            value={cloud ? "Cloud" : "Demo"}
            hint={cloud ? "Supabase, per-user" : "Local browser storage"}
            icon={cloud ? Database : HardDrive}
          />
          <StatCard
            label="Total Records"
            value={formatNumber(totalRecords)}
            hint="Across all modules"
            icon={Boxes}
            tone="accent"
          />
          <StatCard
            label="Security"
            value={cloud ? "RLS Active" : "Open"}
            hint={cloud ? "Row-level isolation" : "No auth in demo"}
            icon={ShieldCheck}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Account">
            <div className="space-y-4 text-sm">
              <Row label="Signed in as" value={userEmail ?? "Demo user (no account)"} />
              <Row
                label="Workspace"
                value={cloud ? "Private cloud workspace" : "Shared local demo"}
              />
              {cloud && userEmail && (
                <button onClick={signOut} className="btn-ghost">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Appearance">
            <p className="mb-3 text-sm text-muted-foreground">
              Choose how TerraFarm looks on this device.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "light", label: "Light", icon: Sun },
                { v: "dark", label: "Dark", icon: Moon },
                { v: "system", label: "System", icon: Monitor },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setTheme(opt.v)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${
                    theme === opt.v
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <opt.icon className="h-5 w-5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Data Management">
          <div className="flex flex-wrap gap-3">
            <button onClick={seedSampleData} className="btn-primary">
              <Sparkles className="h-4 w-4" /> Load sample data
            </button>
            <button onClick={exportJson} className="btn-ghost">
              <Download className="h-4 w-4" /> Export as JSON
            </button>
            {!cloud && (
              <button onClick={reset} className="btn-ghost">
                <RotateCcw className="h-4 w-4" /> Reset to sample data
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {cloud
              ? "Sample data is written to your Supabase workspace. Existing rows are preserved."
              : "Demo data lives in this browser only and never leaves your device."}
          </p>
        </SectionCard>

        <SectionCard title="Workspace Contents">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Module</th>
                  <th className="py-2 pr-4 text-right">Records</th>
                </tr>
              </thead>
              <tbody>
                {collections.map(([name, arr]) => (
                  <tr key={name} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 font-medium capitalize">{name}</td>
                    <td className="py-2.5 pr-4 text-right">{arr.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
