import { PlantationData } from "./types";

export type Collections = keyof PlantationData;

// Supabase table name per store collection.
export const TABLES: Record<Collections, string> = {
  farms: "farms",
  crops: "crops",
  workers: "workers",
  attendance: "attendance",
  inventory: "inventory",
  transactions: "transactions",
  sales: "sales",
  yields: "yields",
};

// camelCase (TS) -> snake_case (Postgres) per collection.
// Used to map both full inserts and partial updates without clobbering columns.
const FIELD_MAP: Record<Collections, Record<string, string>> = {
  farms: {
    id: "id",
    name: "name",
    location: "location",
    region: "region",
    areaHectares: "area_hectares",
    soilType: "soil_type",
    latitude: "latitude",
    longitude: "longitude",
    establishedYear: "established_year",
    notes: "notes",
  },
  crops: {
    id: "id",
    farmId: "farm_id",
    name: "name",
    variety: "variety",
    stage: "stage",
    areaHectares: "area_hectares",
    plantedDate: "planted_date",
    expectedHarvestDate: "expected_harvest_date",
    expectedYieldTons: "expected_yield_tons",
    healthScore: "health_score",
  },
  workers: {
    id: "id",
    name: "name",
    role: "role",
    phone: "phone",
    dailyRate: "daily_rate",
    joinedDate: "joined_date",
    status: "status",
  },
  attendance: {
    id: "id",
    workerId: "worker_id",
    date: "date",
    status: "status",
    hours: "hours",
  },
  inventory: {
    id: "id",
    name: "name",
    category: "category",
    quantity: "quantity",
    unit: "unit",
    reorderLevel: "reorder_level",
    unitCost: "unit_cost",
    supplier: "supplier",
  },
  transactions: {
    id: "id",
    type: "type",
    category: "category",
    description: "description",
    amount: "amount",
    date: "date",
    farmId: "farm_id",
  },
  sales: {
    id: "id",
    cropName: "crop_name",
    buyer: "buyer",
    destination: "destination",
    quantityTons: "quantity_tons",
    pricePerTon: "price_per_ton",
    date: "date",
    status: "status",
  },
  yields: {
    id: "id",
    cropName: "crop_name",
    farmId: "farm_id",
    harvestDate: "harvest_date",
    expectedTons: "expected_tons",
    actualTons: "actual_tons",
  },
};

// Maps a (possibly partial) store object to a DB row, skipping unknown keys.
export function toRow(key: Collections, obj: Record<string, unknown>) {
  const map = FIELD_MAP[key];
  const row: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) {
    if (map[k] !== undefined && obj[k] !== undefined) row[map[k]] = obj[k];
  }
  return row;
}

// Maps a DB row back to a store object.
export function fromRow<K extends Collections>(
  key: K,
  row: Record<string, unknown>
): PlantationData[K][number] {
  const map = FIELD_MAP[key];
  const inverse: Record<string, string> = {};
  for (const [camel, snake] of Object.entries(map)) inverse[snake] = camel;
  const obj: Record<string, unknown> = {};
  for (const col of Object.keys(row)) {
    if (inverse[col] !== undefined) obj[inverse[col]] = row[col];
  }
  return obj as PlantationData[K][number];
}

export const EMPTY_DATA: PlantationData = {
  farms: [],
  crops: [],
  workers: [],
  attendance: [],
  inventory: [],
  transactions: [],
  sales: [],
  yields: [],
};
