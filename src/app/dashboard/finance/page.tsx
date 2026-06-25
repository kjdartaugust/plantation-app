"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { SectionCard, Modal, StatCard, SearchInput } from "@/components/ui";
import { RevenueAreaChart, CategoryPie } from "@/components/charts";
import { useConfirm } from "@/components/confirm";
import { Transaction } from "@/lib/types";
import { uid, formatCurrency, cn } from "@/lib/utils";
import { Plus, TrendingUp, TrendingDown, Scale, Trash2, Pencil } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const empty: Omit<Transaction, "id"> = {
  type: "expense",
  category: "",
  description: "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
};

export default function FinancePage() {
  const { data, add, update, remove } = useStore();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [query, setQuery] = useState("");

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (t: Transaction) => {
    const { id, ...rest } = t;
    setEditingId(id);
    setForm(rest);
    setOpen(true);
  };

  const save = () => {
    if (!form.category || !form.amount) return;
    if (editingId) update("transactions", editingId, form);
    else add("transactions", { ...form, id: uid("tx") });
    setForm(empty);
    setEditingId(null);
    setOpen(false);
  };

  const income = data.transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = data.transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const series = useMemo(() => {
    const map = new Map<number, { income: number; expense: number }>();
    for (const t of data.transactions) {
      const m = new Date(t.date).getMonth();
      const cur = map.get(m) ?? { income: 0, expense: 0 };
      cur[t.type] += t.amount;
      map.set(m, cur);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([m, v]) => ({ month: MONTHS[m], ...v }));
  }, [data]);

  const incomeByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of data.transactions.filter((t) => t.type === "income"))
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [data]);

  const sorted = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date));
  const q = query.trim().toLowerCase();
  const visible = sorted.filter(
    (t) =>
      !q ||
      [t.description, t.category, t.type].some((v) => v.toLowerCase().includes(q))
  );

  return (
    <>
      <Topbar title="Finance" />
      <div className="space-y-6 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Revenue" value={formatCurrency(income)} icon={TrendingUp} />
          <StatCard label="Total Expenses" value={formatCurrency(expense)} icon={TrendingDown} tone="accent" />
          <StatCard label="Net Profit" value={formatCurrency(income - expense)} icon={Scale} tone={income - expense >= 0 ? "primary" : "muted"} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Cash Flow" className="lg:col-span-2">
            <RevenueAreaChart data={series} />
          </SectionCard>
          <SectionCard title="Revenue Sources">
            <CategoryPie data={incomeByCategory} />
          </SectionCard>
        </div>

        <SectionCard
          title="Transactions"
          action={
            <div className="flex items-center gap-2">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search transactions…"
                className="hidden w-48 sm:block"
              />
              <button className="btn-primary" onClick={openAdd}>
                <Plus className="h-4 w-4" /> Record
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4 text-right">Amount</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No transactions match “{query}”.
                    </td>
                  </tr>
                )}
                {visible.map((t) => (
                  <tr key={t.id} className="border-b border-border/60">
                    <td className="py-3 pr-4 text-muted-foreground">{t.date}</td>
                    <td className="py-3 pr-4 font-medium">{t.description || t.category}</td>
                    <td className="py-3 pr-4">
                      <span className="badge bg-muted text-muted-foreground">{t.category}</span>
                    </td>
                    <td className={cn("py-3 pr-4 text-right font-semibold", t.type === "income" ? "text-primary" : "text-red-500")}>
                      {t.type === "income" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(t)} className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              await confirm({
                                title: "Delete this transaction?",
                                message: `${t.description || t.category} will be permanently removed from your records.`,
                              })
                            )
                              remove("transactions", t.id);
                          }}
                          className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit Transaction" : "Record Transaction"}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Transaction["type"] })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Crop Sales, Labor" />
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Amount (GHS)</label>
            <input type="number" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      </Modal>
    </>
  );
}
