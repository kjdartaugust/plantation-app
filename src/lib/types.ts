export type CropStage =
  | "planned"
  | "planting"
  | "germination"
  | "vegetative"
  | "flowering"
  | "fruiting"
  | "harvest"
  | "completed";

export type Farm = {
  id: string;
  name: string;
  location: string;
  region: string;
  areaHectares: number;
  soilType: string;
  latitude: number;
  longitude: number;
  establishedYear: number;
  notes?: string;
  photoUrl?: string;
};

export type Crop = {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  stage: CropStage;
  areaHectares: number;
  plantedDate: string;
  expectedHarvestDate: string;
  expectedYieldTons: number;
  healthScore: number; // 0-100
};

export type Worker = {
  id: string;
  name: string;
  role: string;
  phone: string;
  dailyRate: number;
  joinedDate: string;
  status: "active" | "inactive";
};

export type AttendanceRecord = {
  id: string;
  workerId: string;
  date: string;
  status: "present" | "absent" | "leave";
  hours: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: "seed" | "fertilizer" | "pesticide" | "equipment" | "fuel" | "other";
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  supplier: string;
};

export type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  farmId?: string;
};

export type SaleRecord = {
  id: string;
  cropName: string;
  buyer: string;
  destination: string;
  quantityTons: number;
  pricePerTon: number;
  date: string;
  status: "pending" | "shipped" | "delivered" | "paid";
};

export type YieldRecord = {
  id: string;
  cropName: string;
  farmId: string;
  harvestDate: string;
  expectedTons: number;
  actualTons: number;
};

export type PlantationData = {
  farms: Farm[];
  crops: Crop[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  sales: SaleRecord[];
  yields: YieldRecord[];
};
