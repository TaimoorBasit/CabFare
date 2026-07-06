import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';

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

let db: Low<DatabaseSchema> | null = null;

export async function initDatabase(): Promise<Low<DatabaseSchema>> {
  if (db) return db;

  const dataDir = path.join(process.cwd(), '.data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const file = path.join(dataDir, 'db.json');
  const adapter = new JSONFile<DatabaseSchema>(file);
  db = new Low(adapter, { 
    users: [],
    pricingMatrix: [],
    routeTemplates: [],
    seasonalPricing: [],
    mileageRules: [],
    bookings: [],
    quotes: [],
    waitingCharges: [],
    vehicleAvailability: [],
    routeCache: []
  });
  
  await db.read();
  await db.write();
  
  return db;
}

export async function getDatabase(): Promise<Low<DatabaseSchema>> {
  if (!db) {
    return initDatabase();
  }
  return db;
}

