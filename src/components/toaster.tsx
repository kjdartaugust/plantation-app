"use client";

import { useStore } from "@/lib/store";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TONE = {
  success: "border-primary/40 bg-primary/10 text-foreground",
  error: "border-red-500/40 bg-red-500/10 text-foreground",
  info: "border-border bg-card text-foreground",
};

export function Toaster() {
  const { notices, dismissNotice } = useStore();
  if (notices.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-xs flex-col gap-2">
      {notices.map((n) => {
        const Icon = ICON[n.type];
        return (
          <div
            key={n.id}
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm shadow-lg animate-fade-in",
              TONE[n.type]
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                n.type === "success" && "text-primary",
                n.type === "error" && "text-red-500",
                n.type === "info" && "text-muted-foreground"
              )}
            />
            <span className="flex-1">{n.message}</span>
            <button
              onClick={() => dismissNotice(n.id)}
              className="text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
