"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { StatCard, SectionCard } from "@/components/ui";
import {
  RevenueAreaChart,
  CategoryPie,
  YieldBarChart,
} from "@/components/charts";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  MapPinned,
  Sprout,
  Users,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Loader2,
} from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardPage() {
  const { data, ready, mode, seedSampleData } = useStore();
  const [seeding, setSeeding] = useState(false);
  const empty =
    ready &&
    mode === "cloud" &&
    data.farms.length === 0 &&
    data.crops.length === 0;

  const loadSample = async () => {
    setSeeding(true);
    try {
      await seedSampleData();
    } finally {
      setSeeding(false);
    }
  };

  const metrics = useMemo(() => {
    const income = data.transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = data.transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const activeCrops = data.crops.filter(
      (c) => !["completed"].includes(c.stage)
    ).length;
    const lowStock = data.inventory.filter(
      (i) => i.quantity <= i.reorderLevel
    ).length;
    return { income, expense, profit: income - expense, activeCrops, lowStock };
  }, [data]);

  const revenueSeries = useMemo(() => {
    const map = new Map<number, { income: number; expense: number }>();
    for (const t of data.transactions) {
      const m = new Date(t.date).getMonth();
      const cur = map.get(m) ?? { income: 0, expense: 0 };
      cur[t.type] += t.amount;
      map.set(m, cur);
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([m, v]) => ({ month: MONTHS[m], ...v }));
  }, [data]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of data.transactions.filter((t) => t.type === "expense")) {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [data]);

  const yieldSeries = useMemo(
    () =>
      data.yields.map((y) => ({
        name: y.cropName,
        expected: y.expectedTons,
        actual: y.actualTons,
      })),
    [data]
  );

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="space-y-6 p-5">
        {empty && (
          <div className="card flex flex-col items-start gap-3 border-primary/30 bg-primary/8 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Welcome to TerraFarm 🌱</p>
              <p className="text-sm text-muted-foreground">
                Your workspace is empty. Load a realistic sample plantation to
                explore, or start adding your own farms.
              </p>
            </div>
            <button
              className="btn-primary shrink-0"
              onClick={loadSample}
              disabled={seeding}
            >
              {seeding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Load sample data
            </button>
          </div>
        )}
        <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Net Profit"
            value={formatCurrency(metrics.profit)}
            hint={`${formatCurrency(metrics.income)} revenue`}
            icon={TrendingUp}
          />
          <StatCard
            label="Active Crops"
            value={formatNumber(metrics.activeCrops)}
            hint={`${data.farms.length} farms · ${formatNumber(
              data.farms.reduce((s, f) => s + f.areaHectares, 0)
            )} ha`}
            icon={Sprout}
            tone="accent"
          />
          <StatCard
            label="Workforce"
            value={formatNumber(
              data.workers.filter((w) => w.status === "active").length
            )}
            hint={`${data.workers.length} total registered`}
            icon={Users}
          />
          <StatCard
            label="Low Stock Items"
            value={formatNumber(metrics.lowStock)}
            hint="At or below reorder level"
            icon={metrics.lowStock ? AlertTriangle : MapPinned}
            tone={metrics.lowStock ? "accent" : "muted"}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Revenue vs Expenses" className="lg:col-span-2">
            <RevenueAreaChart data={revenueSeries} />
          </SectionCard>
          <SectionCard title="Expense Breakdown">
            <CategoryPie data={expenseByCategory} />
          </SectionCard>
        </div>

        <SectionCard title="Yield Performance — Expected vs Actual (tons)">
          <YieldBarChart data={yieldSeries} />
        </SectionCard>
      </div>
    </>
  );
}
