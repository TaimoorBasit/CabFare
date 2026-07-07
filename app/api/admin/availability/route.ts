export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../server/db';

export async function GET() {
  const db = await getDatabase();
  return NextResponse.json(db.data?.vehicleAvailability || []);
}

export async function POST(request: Request) {
  const db = await getDatabase();
  const item = await request.json();
  if (!item.id) item.id = 'block_' + Date.now();
  db.data?.vehicleAvailability.push(item);
  await db.write();
  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = await getDatabase();
  if (db.data) {
    db.data.vehicleAvailability = db.data.vehicleAvailability.filter(m => m.id !== id);
    await db.write();
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
