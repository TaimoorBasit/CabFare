import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = (
    process.env.GOOGLE_MAPS_BROWSER_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    ""
  ).trim();

  return NextResponse.json(
    { key },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
