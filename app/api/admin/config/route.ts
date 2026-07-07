export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../server/db';

export async function GET() {
  const db = await getDatabase();
  return NextResponse.json({
    vehicles: db.data?.vehicles,
    globalVars: db.data?.globalVars,
    surcharges: db.data?.surcharges,
    annualOverheads: db.data?.annualOverheads,
    blockedDates: db.data?.blockedDates
  });
}

export async function POST(request: Request) {
  const db = await getDatabase();
  const config = await request.json();
  if (db.data) {
    if (config.vehicles) db.data.vehicles = config.vehicles;
    if (config.globalVars) db.data.globalVars = config.globalVars;
    if (config.surcharges) db.data.surcharges = config.surcharges;
    if (config.annualOverheads) db.data.annualOverheads = config.annualOverheads;
    if (config.blockedDates) db.data.blockedDates = config.blockedDates;
    await db.write();
  }
  return NextResponse.json({ success: true });
}
