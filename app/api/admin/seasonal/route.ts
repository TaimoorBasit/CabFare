import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../server/db';

export async function GET() {
  const db = await getDatabase();
  return NextResponse.json(db.data?.seasonalPricing || []);
}

export async function POST(request: Request) {
  const db = await getDatabase();
  const item = await request.json();
  if (!item.id) item.id = 'season_' + Date.now();
  db.data?.seasonalPricing.push(item);
  await db.write();
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const db = await getDatabase();
  const item = await request.json();
  const index = db.data?.seasonalPricing.findIndex(m => m.id === item.id);
  if (index !== undefined && index > -1 && db.data) {
    db.data.seasonalPricing[index] = item;
    await db.write();
    return NextResponse.json(item);
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = await getDatabase();
  if (db.data) {
    db.data.seasonalPricing = db.data.seasonalPricing.filter(m => m.id !== id);
    await db.write();
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
