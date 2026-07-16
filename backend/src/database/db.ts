import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import seedData from './seed.json';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface PricingMatrixRule {
  id: string;
  pickupArea: string;
  dropArea: string;
  tripType: string;
  vehicleId: string;
  baseFare: number;
  includedLiveMileage: number;
  includedDeadMileage: number;
  waitingChargePerHour: number;
  extraMileageRate: number;
  nightRateMultiplier: number;
  weekendRateMultiplier: number;
  status: 'active' | 'inactive';
  pickupGeo?: { lat: number; lng: number };
  dropGeo?: { lat: number; lng: number };
}

export interface RouteTemplate {
  id: string;
  pickupArea: string;
  dropArea: string;
  vehicleId: string;
  tripType: 'one-way' | 'return';
  price: number;
  pickupGeo?: { lat: number; lng: number };
  dropGeo?: { lat: number; lng: number };
  radiusKm?: number;
}

export interface SeasonalPricing {
  id: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  multiplier?: number;
  overrideFare?: number;
  applicableRoutes: string[];
  applicableVehicles: string[];
  priority: number;
  enabled: boolean;
}

export interface DatabaseSchema {
  users: User[];
  pricingMatrix: PricingMatrixRule[];
  routeTemplates: RouteTemplate[];
  seasonalPricing: SeasonalPricing[];
  mileageRules: any[];
  bookings: any[];
  quotes: any[];
  waitingCharges: any[];
  vehicleAvailability: any[];
  routeCache: any[];
  vehicles?: any[];
  globalVars?: any;
  surcharges?: any;
  annualOverheads?: any[];
  blockedDates?: any[];
}

class KVAdapter {
  async read() {
    try {
      const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token) return null;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(["GET", "cabfare_db"])
      });
      const json: any = await res.json();
      if (json && json.result) {
        return JSON.parse(json.result);
      }
    } catch (e) {
      console.error("KV read error:", e);
    }
    return null;
  }

  async write(data: any) {
    try {
      const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token) return;

      await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(["SET", "cabfare_db", JSON.stringify(data)])
      });
    } catch (e) {
      console.error("KV write error:", e);
    }
  }
}

let db: Low<DatabaseSchema> | null = null;

export async function initDatabase(): Promise<Low<DatabaseSchema>> {
  if (db) return db;

  const isVercel = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
  let adapter;

  if (isVercel) {
    adapter = new KVAdapter();
  } else {
    const dataDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const file = path.join(dataDir, 'db.json');
    adapter = new JSONFile<DatabaseSchema>(file);
  }

  db = new Low(adapter, seedData as any as DatabaseSchema);

  await db.read();

  if (!db.data || Object.keys(db.data).length === 0) {
    db.data = seedData as any as DatabaseSchema;
    await db.write();
  }

  return db;
}

export async function getDatabase(): Promise<Low<DatabaseSchema>> {
  if (!db) {
    await initDatabase();
  }
  if (db && (process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_TOKEN)) {
    await db.read();
  }
  return db!;
}

