"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { SectionCard, Modal, StatCard, StatusBadge } from "@/components/ui";
import { Worker } from "@/lib/types";
import { uid, formatCurrency } from "@/lib/utils";
import { Plus, Users, Wallet, CalendarCheck, Trash2, Pencil } from "lucide-react";

const empty: Omit<Worker, "id"> = {
  name: "",
  role: "",
  phone: "",
  dailyRate: 0,
  joinedDate: new Date().toISOString().slice(0, 10),
  status: "active",
};

export default function WorkersPage() {
  const { data, add, update, remove } = useStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const today = new Date().toISOString().slice(0, 10);

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (w: Worker) => {
    const { id, ...rest } = w;
    setEditingId(id);
    setForm(rest);
    setOpen(true);
  };

  const save = () => {
    if (!form.name) return;
    if (editingId) update("workers", editingId, form);
    else add("workers", { ...form, id: uid("wk") });
    setForm(empty);
    setEditingId(null);
    setOpen(false);
  };

  const attendanceToday = (workerId: string) =>
    data.attendance.find((a) => a.workerId === workerId && a.date === today);

  const mark = (workerId: string, status: "present" | "absent" | "leave") => {
    const existing = attendanceToday(workerId);
    if (existing) {
      update("attendance", existing.id, { status, hours: status === "present" ? 8 : 0 });
    } else {
      add("attendance", {
        id: uid("att"),
        workerId,
        date: today,
        status,
        hours: status === "present" ? 8 : 0,
      });
    }
  };

  const payroll = useMemo(() => {
    // Monthly payroll: present days this month * daily rate.
    const month = today.slice(0, 7);
    return data.workers.map((w) => {
      const days = data.attendance.filter(
        (a) => a.workerId === w.id && a.status === "present" && a.date.startsWith(month)
      ).length;
      // Assume a baseline of 22 working days when no attendance logged yet.
      const billedDays = days || 22;
      return { worker: w, days: billedDays, pay: billedDays * w.dailyRate };
    });
  }, [data, today]);

  const totalPayroll = payroll.reduce((s, p) => s + p.pay, 0);
  const presentToday = data.attendance.filter(
    (a) => a.date === today && a.status === "present"
  ).length;

  return (
    <>
      <Topbar title="Labor & Payroll" />
      <div className="space-y-6 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Active Workers" value={`${data.workers.filter((w) => w.status === "active").length}`} icon={Users} />
          <StatCard label="Present Today" value={`${presentToday}/${data.workers.length}`} icon={CalendarCheck} tone="accent" />
          <StatCard label="Est. Monthly Payroll" value={formatCurrency(totalPayroll)} icon={Wallet} />
        </div>

        <SectionCard
          title="Workforce & Attendance"
          action={
            <button className="btn-primary" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Add Worker
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Worker</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Daily Rate</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Today</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.workers.map((w) => {
                  const att = attendanceToday(w.id);
                  return (
                    <tr key={w.id} className="border-b border-border/60">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.phone}</p>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{w.role}</td>
                      <td className="py-3 pr-4">{formatCurrency(w.dailyRate)}</td>
                      <td className="py-3 pr-4"><StatusBadge status={w.status} /></td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-1">
                          {(["present", "absent", "leave"] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => mark(w.id, s)}
                              className={`rounded px-2 py-1 text-xs capitalize transition ${
                                att?.status === s
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-border"
                              }`}
                            >
                              {s[0].toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(w)}
                            className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove("workers", w.id)}
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

        <SectionCard title="Payroll Sheet — current month">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Worker</th>
                  <th className="py-2 pr-4">Days Billed</th>
                  <th className="py-2 pr-4">Daily Rate</th>
                  <th className="py-2 pr-4 text-right">Payable</th>
                </tr>
              </thead>
              <tbody>
                {payroll.map(({ worker, days, pay }) => (
                  <tr key={worker.id} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 font-medium">{worker.name}</td>
                    <td className="py-2.5 pr-4">{days}</td>
                    <td className="py-2.5 pr-4">{formatCurrency(worker.dailyRate)}</td>
                    <td className="py-2.5 pr-4 text-right font-semibold">{formatCurrency(pay)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="py-3 pr-4 text-right font-semibold">Total</td>
                  <td className="py-3 pr-4 text-right font-bold text-primary">{formatCurrency(totalPayroll)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit Worker" : "Add Worker"}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Full name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Role</label>
            <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Daily rate (GHS)</label>
            <input type="number" className="input" value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: +e.target.value })} />
          </div>
          <div>
            <label className="label">Joined date</label>
            <input type="date" className="input" value={form.joinedDate} onChange={(e) => setForm({ ...form, joinedDate: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Worker["status"] })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>
            {editingId ? "Update Worker" : "Save Worker"}
          </button>
        </div>
      </Modal>
    </>
  );
}
