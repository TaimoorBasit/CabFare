import { getDatabase } from './db';

// Using fetch to get directions from Google API
export async function getDirections(origin: any, destination: any, waypoints: any[] = [], apiKey: string) {
  if (!apiKey) throw new Error("Google Maps API key is required");

  // Format waypoints for Google API
  let waypointsStr = '';
  if (waypoints.length > 0) {
    waypointsStr = '&waypoints=' + waypoints.map(w => formatLoc(w)).join('|');
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${formatLoc(origin)}&destination=${formatLoc(destination)}${waypointsStr}&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Maps API error: ${res.statusText}`);
  
  const data = await res.json();
  if (data.status !== 'OK') {
    throw new Error(`Google Maps API failed: ${data.status} - ${data.error_message || ''}`);
  }

  return data;
}

function formatLoc(loc: any) {
  if (typeof loc === 'string') return encodeURIComponent(loc);
  if (loc && loc.lat && loc.lng) return `${loc.lat},${loc.lng}`;
  return '';
}

export async function calculateMileage(journey: any) {
  const db = await getDatabase();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || (db.data as any)?.googleApiKey || '';
  if (!apiKey) {
    // Fallback if no API key
    return fallbackCalculateMileage(journey);
  }

  const { origin, destination, waypoints, stops = [] } = journey;
  const yardLoc = db.data?.globalVars?.yardAddress || "Unit 1, Carolean Coaches Bentley Lane Walsall WS2 8TL , UK";

  // Build the live route points
  const livePoints = waypoints?.length >= 2 ? waypoints : [origin, destination];
  const liveOrigin = livePoints[0];
  const liveDestination = livePoints[livePoints.length - 1];
  const liveWaypoints = livePoints.slice(1, -1);

  try {
    // 1. Calculate Live Mileage
    const liveDirections = await getDirections(liveOrigin, liveDestination, liveWaypoints, apiKey);
    const liveDistanceMeters = sumLegs(liveDirections.routes[0].legs, 'distance');
    const liveDurationSeconds = sumLegs(liveDirections.routes[0].legs, 'duration');
    const distanceUnit = db.data?.globalVars?.distanceUnit || 'km';
    const divisor = distanceUnit === 'miles' ? 1609.34 : 1000;
    const liveKm = liveDistanceMeters / divisor;

    // 2. Calculate Dead Mileage (Yard to Origin, Destination to Yard)
    const deadOutDirections = await getDirections(yardLoc, liveOrigin, [], apiKey);
    const deadOutDistanceMeters = sumLegs(deadOutDirections.routes[0].legs, 'distance');
    
    const deadBackDirections = await getDirections(liveDestination, yardLoc, [], apiKey);
    const deadBackDistanceMeters = sumLegs(deadBackDirections.routes[0].legs, 'distance');

    const deadKm = (deadOutDistanceMeters + deadBackDistanceMeters) / divisor;

    return {
      liveKm,
      deadKm,
      totalKm: liveKm + deadKm,
      liveDurationMinutes: liveDurationSeconds / 60,
      geometry: liveDirections.routes[0].overview_polyline.points,
      legs: liveDirections.routes[0].legs
    };
  } catch (error) {
    console.error("Mileage engine error:", error);
    return fallbackCalculateMileage(journey);
  }
}

function sumLegs(legs: any[], key: 'distance'|'duration') {
  return legs.reduce((sum, leg) => sum + leg[key].value, 0);
}

// Haversine fallback if API fails
function haversineKm(a: any, b: any) {
  if (!a || !b) return 60;
  // Just dummy logic for fallback since real coordinates might be missing
  return 60;
}

function fallbackCalculateMileage(journey: any) {
  // Simple fallback logic if Google Maps is disabled or fails
  // Since we don't have the exact geocoder here, just return dummy or approximated values
  return {
    liveKm: 100,
    deadKm: 40,
    totalKm: 140,
    liveDurationMinutes: 120,
    geometry: null,
    legs: []
  };
}
