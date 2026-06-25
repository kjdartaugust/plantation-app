"use client";

import { useEffect } from "react";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "accent" | "muted";
}) {
  const toneCls =
    tone === "accent"
      ? "bg-accent/15 text-accent"
      : tone === "muted"
      ? "bg-muted text-muted-foreground"
      : "bg-primary/12 text-primary";
  return (
    <div className="stat-card flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className={cn("rounded-lg p-2.5", toneCls)}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card p-5 animate-fade-in", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-backdrop-in"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="btn-ghost h-8 w-8 px-0">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

const stageTones: Record<string, string> = {
  paid: "bg-primary/15 text-primary",
  delivered: "bg-primary/15 text-primary",
  shipped: "bg-accent/20 text-accent",
  pending: "bg-muted text-muted-foreground",
  present: "bg-primary/15 text-primary",
  absent: "bg-red-500/15 text-red-500",
  leave: "bg-accent/20 text-accent",
  active: "bg-primary/15 text-primary",
  inactive: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("badge capitalize", stageTones[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </span>
  );
}
