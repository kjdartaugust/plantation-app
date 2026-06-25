"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { Modal, EmptyState } from "@/components/ui";
import { Crop, CropStage } from "@/lib/types";
import { uid, daysBetween, cn } from "@/lib/utils";
import { Plus, Trash2, Sprout, CalendarClock } from "lucide-react";

const STAGES: CropStage[] = [
  "planned",
  "planting",
  "germination",
  "vegetative",
  "flowering",
  "fruiting",
  "harvest",
  "completed",
];

const empty: Omit<Crop, "id"> = {
  farmId: "",
  name: "",
  variety: "",
  stage: "planned",
  areaHectares: 0,
  plantedDate: new Date().toISOString().slice(0, 10),
  expectedHarvestDate: new Date().toISOString().slice(0, 10),
  expectedYieldTons: 0,
  healthScore: 80,
};

function healthTone(score: number) {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-accent";
  return "text-red-500";
}

export default function CropsPage() {
  const { data, add, update, remove } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...empty, farmId: "" });

  const save = () => {
    if (!form.name || !form.farmId) return;
    add("crops", { ...form, id: uid("crop") });
    setForm({ ...empty, farmId: data.farms[0]?.id ?? "" });
    setOpen(false);
  };

  const advance = (c: Crop) => {
    const idx = STAGES.indexOf(c.stage);
    if (idx < STAGES.length - 1)
      update("crops", c.id, { stage: STAGES[idx + 1] });
  };

  const farmName = (id: string) =>
    data.farms.find((f) => f.id === id)?.name ?? "—";

  return (
    <>
      <Topbar title="Crop Lifecycle" />
      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.crops.length} crop blocks tracked across all stages
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              setForm({ ...empty, farmId: data.farms[0]?.id ?? "" });
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Crop
          </button>
        </div>

        {data.crops.length === 0 ? (
          <EmptyState message="No crops yet — add your first planting." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.crops.map((c) => {
              const idx = STAGES.indexOf(c.stage);
              const pct = (idx / (STAGES.length - 1)) * 100;
              const daysLeft = daysBetween(
                new Date().toISOString(),
                c.expectedHarvestDate
              );
              return (
                <div key={c.id} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/12 p-2 text-primary">
                        <Sprout className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {c.name}{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            · {c.variety}
                          </span>
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {farmName(c.farmId)} · {c.areaHectares} ha
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => remove("crops", c.id)}
                      className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium capitalize">{c.stage}</span>
                      <span className={cn("font-semibold", healthTone(c.healthScore))}>
                        {c.healthScore}% health
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {daysLeft > 0
                        ? `${daysLeft} days to harvest · ${c.expectedYieldTons}t expected`
                        : `Harvest window reached · ${c.expectedYieldTons}t expected`}
                    </p>
                    {c.stage !== "completed" && (
                      <button onClick={() => advance(c)} className="btn-ghost py-1 text-xs">
                        Advance stage →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Crop">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Farm</label>
            <select className="input" value={form.farmId} onChange={(e) => setForm({ ...form, farmId: e.target.value })}>
              {data.farms.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Crop name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Variety</label>
            <input className="input" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} />
          </div>
          <div>
            <label className="label">Stage</label>
            <select className="input" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as CropStage })}>
              {STAGES.map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Area (ha)</label>
            <input type="number" className="input" value={form.areaHectares} onChange={(e) => setForm({ ...form, areaHectares: +e.target.value })} />
          </div>
          <div>
            <label className="label">Planted date</label>
            <input type="date" className="input" value={form.plantedDate} onChange={(e) => setForm({ ...form, plantedDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Expected harvest</label>
            <input type="date" className="input" value={form.expectedHarvestDate} onChange={(e) => setForm({ ...form, expectedHarvestDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Expected yield (t)</label>
            <input type="number" className="input" value={form.expectedYieldTons} onChange={(e) => setForm({ ...form, expectedYieldTons: +e.target.value })} />
          </div>
          <div>
            <label className="label">Health score</label>
            <input type="number" min={0} max={100} className="input" value={form.healthScore} onChange={(e) => setForm({ ...form, healthScore: +e.target.value })} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save Crop</button>
        </div>
      </Modal>
    </>
  );
}
