export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDatabase } from '../../../server/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const isVercel = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
  
  if (!isVercel) {
    return NextResponse.json({ error: "Not on live Vercel environment (KV credentials not found)" }, { status: 400 });
  }

  const dataDir = path.join(process.cwd(), '.data');
  const file = path.join(dataDir, 'db.json');
  
  if (!fs.existsSync(file)) {
    return NextResponse.json({ error: "Local db.json not found on Vercel deployment" }, { status: 404 });
  }

  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const jsonData = JSON.parse(raw);

    const db = await getDatabase();
    db.data = jsonData;
    await db.write(); // This will write to the KV store because isVercel is true

    return NextResponse.json({ success: true, message: "Live KV Database overwritten with latest local db.json containing dummy data." });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to parse or write db.json", details: error.message }, { status: 500 });
  }
}
