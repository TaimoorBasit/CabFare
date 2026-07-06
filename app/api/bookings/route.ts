import { NextResponse } from 'next/server';
import { getDatabase } from '../../../server/db';

export async function GET(request: Request) {
  try {
    const db = await getDatabase();
    if (!db.data) throw new Error("Database not initialized");

    return NextResponse.json({ bookings: db.data.bookings || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase();
    if (!db.data) throw new Error("Database not initialized");

    const payload = await request.json();
    
    // Add missing bookings array if undefined
    if (!db.data.bookings) {
      db.data.bookings = [];
    }

    const newBooking = {
      id: 'BK-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      ...payload
    };

    db.data.bookings.unshift(newBooking); // Add to beginning of array
    await db.write();

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
