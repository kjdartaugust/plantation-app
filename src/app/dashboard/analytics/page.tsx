"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { SectionCard, StatCard } from "@/components/ui";
import { YieldBarChart, CategoryPie, TrendLineChart } from "@/components/charts";
import { formatNumber, cn } from "@/lib/utils";
import { Target, Gauge, Sprout, Download } from "lucide-react";

export default function AnalyticsPage() {
  const { data } = useStore();

  const yieldSeries = data.yields.map((y) => ({
    name: y.cropName,
    expected: y.expectedTons,
    actual: y.actualTons,
  }));

  const totals = useMemo(() => {
    const expected = data.yields.reduce((s, y) => s + y.expectedTons, 0);
    const actual = data.yields.reduce((s, y) => s + y.actualTons, 0);
    const accuracy = expected ? Math.round((actual / expected) * 100) : 0;
    return { expected, actual, accuracy };
  }, [data]);

  const areaByCrop = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of data.crops)
      map.set(c.name, (map.get(c.name) ?? 0) + c.areaHectares);
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [data]);

  const harvestTrend = useMemo(
    () =>
      [...data.yields]
        .sort((a, b) => a.harvestDate.localeCompare(b.harvestDate))
        .map((y) => ({ label: y.cropName, value: y.actualTons })),
    [data]
  );

  const exportCsv = () => {
    const rows = [
      ["Crop", "Farm", "Harvest Date", "Expected (t)", "Actual (t)", "Variance %"],
      ...data.yields.map((y) => {
        const farm = data.farms.find((f) => f.id === y.farmId)?.name ?? "";
        const variance = y.expectedTons
          ? (((y.actualTons - y.expectedTons) / y.expectedTons) * 100).toFixed(1)
          : "0";
        return [y.cropName, farm, y.harvestDate, y.expectedTons, y.actualTons, variance];
      }),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yield-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Topbar title="Yield Analytics" />
      <div className="space-y-6 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Expected Output" value={`${formatNumber(totals.expected)} t`} icon={Target} tone="accent" />
          <StatCard label="Actual Harvest" value={`${formatNumber(totals.actual)} t`} icon={Sprout} />
          <StatCard label="Forecast Accuracy" value={`${totals.accuracy}%`} hint="Actual ÷ expected" icon={Gauge} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            title="Expected vs Actual Yield (tons)"
            className="lg:col-span-2"
            action={
              <button className="btn-ghost" onClick={exportCsv}>
                <Download className="h-4 w-4" /> Export CSV
              </button>
            }
          >
            <YieldBarChart data={yieldSeries} />
          </SectionCard>
          <SectionCard title="Planted Area by Crop (ha)">
            <CategoryPie data={areaByCrop} />
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Harvest Volume Trend">
            <TrendLineChart data={harvestTrend} />
          </SectionCard>
          <SectionCard title="Yield Variance by Harvest">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-4">Crop</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4 text-right">Expected</th>
                    <th className="py-2 pr-4 text-right">Actual</th>
                    <th className="py-2 text-right">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.yields.map((y) => {
                    const variance = y.expectedTons
                      ? ((y.actualTons - y.expectedTons) / y.expectedTons) * 100
                      : 0;
                    return (
                      <tr key={y.id} className="border-b border-border/60">
                        <td className="py-2.5 pr-4 font-medium">{y.cropName}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{y.harvestDate}</td>
                        <td className="py-2.5 pr-4 text-right">{y.expectedTons}</td>
                        <td className="py-2.5 pr-4 text-right">{y.actualTons}</td>
                        <td className={cn("py-2.5 text-right font-semibold", variance >= 0 ? "text-primary" : "text-red-500")}>
                          {variance >= 0 ? "+" : ""}
                          {variance.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
