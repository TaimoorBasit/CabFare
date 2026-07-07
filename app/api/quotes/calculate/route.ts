export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { generateQuotes } from '../../../../server/quoteEngine';

export async function POST(request: Request) {
  try {
    const journey = await request.json();
    const quotes = await generateQuotes(journey);
    return NextResponse.json({ quotes });
  } catch (error: any) {
    console.error("Quote calculation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
