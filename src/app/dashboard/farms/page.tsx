"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { SectionCard, Modal, EmptyState } from "@/components/ui";
import { useConfirm } from "@/components/confirm";
import { ImageUpload } from "@/components/image-upload";
import { Farm } from "@/lib/types";
import { uid, formatNumber } from "@/lib/utils";
import { Plus, MapPin, Trash2, Ruler, Pencil } from "lucide-react";

const empty: Omit<Farm, "id"> = {
  name: "",
  location: "",
  region: "",
  areaHectares: 0,
  soilType: "",
  latitude: 5.6,
  longitude: -0.2,
  establishedYear: new Date().getFullYear(),
  notes: "",
};

export default function FarmsPage() {
  const { data, add, update, remove } = useStore();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (f: Farm) => {
    const { id, ...rest } = f;
    setEditingId(id);
    setForm({ ...rest, notes: rest.notes ?? "" });
    setOpen(true);
  };

  const save = () => {
    if (!form.name || !form.location) return;
    if (editingId) update("farms", editingId, form);
    else add("farms", { ...form, id: uid("farm") });
    setForm(empty);
    setEditingId(null);
    setOpen(false);
  };

  return (
    <>
      <Topbar title="Farms & Mapping" />
      <div className="space-y-6 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.farms.length} estates ·{" "}
            {formatNumber(data.farms.reduce((s, f) => s + f.areaHectares, 0))} ha
            under management
          </p>
          <button className="btn-primary" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Register Farm
          </button>
        </div>

        {data.farms.length === 0 ? (
          <EmptyState message="No farms registered yet." />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {data.farms.map((f) => (
              <div key={f.id} className="card card-interactive overflow-hidden">
                {f.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.photoUrl}
                    alt={f.name}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <iframe
                    title={f.name}
                    className="h-48 w-full border-0"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      f.longitude - 0.05
                    }%2C${f.latitude - 0.05}%2C${f.longitude + 0.05}%2C${
                      f.latitude + 0.05
                    }&layer=mapnik&marker=${f.latitude}%2C${f.longitude}`}
                  />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{f.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {f.location} ·{" "}
                        {f.region}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(f)}
                        className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            await confirm({
                              title: `Delete ${f.name}?`,
                              message:
                                "This removes the farm and cannot be undone. Crops linked to it may be affected.",
                            })
                          )
                            remove("farms", f.id);
                        }}
                        className="btn-ghost h-8 w-8 px-0 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Ruler className="h-3 w-3" /> Area
                      </p>
                      <p className="font-medium">{f.areaHectares} ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Soil</p>
                      <p className="font-medium">{f.soilType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Since</p>
                      <p className="font-medium">{f.establishedYear}</p>
                    </div>
                  </div>
                  {f.notes && (
                    <p className="mt-3 text-sm text-muted-foreground">{f.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit Farm" : "Register Farm"}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Farm photo" className="col-span-2">
            <ImageUpload
              value={form.photoUrl}
              onChange={(url) => setForm({ ...form, photoUrl: url })}
            />
          </Field>
          <Field label="Farm name" className="col-span-2">
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Location">
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Field>
          <Field label="Region">
            <input className="input" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
          </Field>
          <Field label="Area (hectares)">
            <input type="number" className="input" value={form.areaHectares} onChange={(e) => setForm({ ...form, areaHectares: +e.target.value })} />
          </Field>
          <Field label="Soil type">
            <input className="input" value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value })} />
          </Field>
          <Field label="Latitude">
            <input type="number" step="0.001" className="input" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: +e.target.value })} />
          </Field>
          <Field label="Longitude">
            <input type="number" step="0.001" className="input" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: +e.target.value })} />
          </Field>
          <Field label="Notes" className="col-span-2">
            <input className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>
            {editingId ? "Update Farm" : "Save Farm"}
          </button>
        </div>
      </Modal>
    </>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
