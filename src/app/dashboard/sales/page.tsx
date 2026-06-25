"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { SectionCard, Modal, StatCard, StatusBadge } from "@/components/ui";
import { SaleRecord } from "@/lib/types";
import { uid, formatCurrency, formatNumber } from "@/lib/utils";
import { Plus, Ship, PackageCheck, Banknote, Trash2 } from "lucide-react";

const STATUSES: SaleRecord["status"][] = ["pending", "shipped", "delivered", "paid"];

const empty: Omit<SaleRecord, "id"> = {
  cropName: "",
  buyer: "",
  destination: "",
  quantityTons: 0,
  pricePerTon: 0,
  date: new Date().toISOString().slice(0, 10),
  status: "pending",
};

export default function SalesPage() {
  const { data, add, update, remove } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const save = () => {
    if (!form.cropName || !form.buyer) return;
    add("sales", { ...form, id: uid("sale") });
    setForm(empty);
    setOpen(false);
  };

  const value = (s: SaleRecord) => s.quantityTons * s.pricePerTon;
  const totalValue = data.sales.reduce((s, r) => s + value(r), 0);
  const paidValue = data.sales.filter((s) => s.status === "paid").reduce((s, r) => s + value(r), 0);
  const totalTons = data.sales.reduce((s, r) => s + r.quantityTons, 0);

  const cycle = (s: SaleRecord) => {
    const idx = STATUSES.indexOf(s.status);
    update("sales", s.id, { status: STATUSES[(idx + 1) % STATUSES.length] });
  };

  return (
    <>
      <Topbar title="Sales & Export" />
      <div className="space-y-6 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Contract Value" value={formatCurrency(totalValue)} icon={Ship} />
          <StatCard label="Volume Sold" value={`${formatNumber(totalTons)} t`} icon={PackageCheck} tone="accent" />
          <StatCard label="Settled (Paid)" value={formatCurrency(paidValue)} icon={Banknote} />
        </div>

        <SectionCard
          title="Sales & Export Records"
          action={
            <button className="btn-primary" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> New Order
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Crop</th>
                  <th className="py-2 pr-4">Buyer</th>
                  <th className="py-2 pr-4">Destination</th>
                  <th className="py-2 pr-4">Qty</th>
                  <th className="py-2 pr-4 text-right">Value</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.sales.map((s) => (
                  <tr key={s.id} className="border-b border-border/60">
                    <td className="py-3 pr-4 text-muted-foreground">{s.date}</td>
                    <td className="py-3 pr-4 font-medium">{s.cropName}</td>
                    <td className="py-3 pr-4">{s.buyer}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{s.destination}</td>
                    <td className="py-3 pr-4">{s.quantityTons} t</td>
                    <td className="py-3 pr-4 text-right font-semibold">{formatCurrency(value(s))}</td>
                    <td className="py-3 pr-4">
                      <button onClick={() => cycle(s)} title="Click to advance status">
                        <StatusBadge status={s.status} />
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => remove("sales", s.id)} className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Sales Order">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Crop / Product</label>
            <input className="input" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} />
          </div>
          <div>
            <label className="label">Buyer</label>
            <input className="input" value={form.buyer} onChange={(e) => setForm({ ...form, buyer: e.target.value })} />
          </div>
          <div>
            <label className="label">Destination</label>
            <input className="input" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SaleRecord["status"] })}>
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Quantity (tons)</label>
            <input type="number" className="input" value={form.quantityTons} onChange={(e) => setForm({ ...form, quantityTons: +e.target.value })} />
          </div>
          <div>
            <label className="label">Price per ton (GHS)</label>
            <input type="number" className="input" value={form.pricePerTon} onChange={(e) => setForm({ ...form, pricePerTon: +e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="label">Date</label>
            <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save Order</button>
        </div>
      </Modal>
    </>
  );
}
