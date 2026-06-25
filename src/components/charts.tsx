"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GRID = "hsl(var(--border))";
const PRIMARY = "hsl(var(--primary))";
const ACCENT = "hsl(var(--accent))";
const PIE_COLORS = [
  "hsl(142 64% 35%)",
  "hsl(38 92% 50%)",
  "hsl(199 70% 45%)",
  "hsl(280 50% 55%)",
  "hsl(12 75% 55%)",
  "hsl(160 40% 55%)",
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--card-foreground))",
};

export function RevenueAreaChart({
  data,
}: {
  data: { month: string; income: number; expense: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.4} />
            <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={ACCENT} stopOpacity={0.4} />
            <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke={GRID} />
        <YAxis tick={{ fontSize: 12 }} stroke={GRID} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="income" stroke={PRIMARY} fill="url(#inc)" strokeWidth={2} />
        <Area type="monotone" dataKey="expense" stroke={ACCENT} fill="url(#exp)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function YieldBarChart({
  data,
}: {
  data: { name: string; expected: number; actual: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke={GRID} />
        <YAxis tick={{ fontSize: 12 }} stroke={GRID} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="expected" fill={ACCENT} radius={[4, 4, 0, 0]} />
        <Bar dataKey="actual" fill={PRIMARY} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPie({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke={GRID} />
        <YAxis tick={{ fontSize: 12 }} stroke={GRID} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="value" stroke={PRIMARY} strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
