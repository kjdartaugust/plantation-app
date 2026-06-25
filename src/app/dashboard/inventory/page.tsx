"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { SectionCard, Modal, StatCard } from "@/components/ui";
import { InventoryItem } from "@/lib/types";
import { uid, formatCurrency, cn } from "@/lib/utils";
import { Plus, Boxes, AlertTriangle, Coins, Minus, Trash2, Pencil } from "lucide-react";

const CATEGORIES: InventoryItem["category"][] = [
  "seed",
  "fertilizer",
  "pesticide",
  "equipment",
  "fuel",
  "other",
];

const empty: Omit<InventoryItem, "id"> = {
  name: "",
  category: "seed",
  quantity: 0,
  unit: "units",
  reorderLevel: 0,
  unitCost: 0,
  supplier: "",
};

export default function InventoryPage() {
  const { data, add, update, remove } = useStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    const { id, ...rest } = item;
    setEditingId(id);
    setForm(rest);
    setOpen(true);
  };

  const save = () => {
    if (!form.name) return;
    if (editingId) update("inventory", editingId, form);
    else add("inventory", { ...form, id: uid("inv") });
    setForm(empty);
    setEditingId(null);
    setOpen(false);
  };

  const adjust = (item: InventoryItem, delta: number) =>
    update("inventory", item.id, {
      quantity: Math.max(0, item.quantity + delta),
    });

  const totalValue = data.inventory.reduce(
    (s, i) => s + i.quantity * i.unitCost,
    0
  );
  const lowStock = data.inventory.filter((i) => i.quantity <= i.reorderLevel);

  return (
    <>
      <Topbar title="Inventory" />
      <div className="space-y-6 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Stock Items" value={`${data.inventory.length}`} icon={Boxes} />
          <StatCard label="Inventory Value" value={formatCurrency(totalValue)} icon={Coins} tone="accent" />
          <StatCard
            label="Reorder Alerts"
            value={`${lowStock.length}`}
            icon={AlertTriangle}
            tone={lowStock.length ? "accent" : "muted"}
          />
        </div>

        {lowStock.length > 0 && (
          <div className="card flex items-start gap-3 border-accent/40 bg-accent/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-accent" />
            <div className="text-sm">
              <p className="font-medium">Reorder needed</p>
              <p className="text-muted-foreground">
                {lowStock.map((i) => i.name).join(", ")} {lowStock.length === 1 ? "is" : "are"} at or below reorder level.
              </p>
            </div>
          </div>
        )}

        <SectionCard
          title="Stock Register"
          action={
            <button className="btn-primary" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Add Item
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Item</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Quantity</th>
                  <th className="py-2 pr-4">Unit Cost</th>
                  <th className="py-2 pr-4">Value</th>
                  <th className="py-2 pr-4">Supplier</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.inventory.map((i) => {
                  const low = i.quantity <= i.reorderLevel;
                  return (
                    <tr key={i.id} className="border-b border-border/60">
                      <td className="py-3 pr-4 font-medium">{i.name}</td>
                      <td className="py-3 pr-4">
                        <span className="badge bg-muted capitalize text-muted-foreground">{i.category}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => adjust(i, -1)} className="btn-ghost h-7 w-7 px-0">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className={cn("min-w-[3rem] text-center font-medium", low && "text-accent")}>
                            {i.quantity} {i.unit}
                          </span>
                          <button onClick={() => adjust(i, 1)} className="btn-ghost h-7 w-7 px-0">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 pr-4">{formatCurrency(i.unitCost)}</td>
                      <td className="py-3 pr-4 font-medium">{formatCurrency(i.quantity * i.unitCost)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{i.supplier}</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(i)}
                            className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove("inventory", i.id)}
                            className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit Inventory Item" : "Add Inventory Item"}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Item name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as InventoryItem["category"] })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Supplier</label>
            <input className="input" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </div>
          <div>
            <label className="label">Quantity</label>
            <input type="number" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} />
          </div>
          <div>
            <label className="label">Unit</label>
            <input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <div>
            <label className="label">Reorder level</label>
            <input type="number" className="input" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: +e.target.value })} />
          </div>
          <div>
            <label className="label">Unit cost (GHS)</label>
            <input type="number" className="input" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: +e.target.value })} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>
            {editingId ? "Update Item" : "Save Item"}
          </button>
        </div>
      </Modal>
    </>
  );
}
