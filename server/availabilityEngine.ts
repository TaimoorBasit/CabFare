import { getDatabase } from './db';

interface AvailabilityInput {
  vehicleId: string;
  passengers: number;
  departureDate: string;
  returnDate?: string;
  suitcaseCount?: number;
  handbagCount?: number;
}

export async function checkAvailability(input: AvailabilityInput) {
  const db = await getDatabase();
  const data = db.data;
  if (!data) return false;

  const vehicle = data.vehicles?.find((v: any) => v.id === input.vehicleId);
  if (!vehicle) return false;

  // Check capacity
  if (vehicle.capacity < input.passengers) return false;

  // We rely on pricingEngine to calculate extra luggage charges rather than blocking availability

  // Check blocked dates
  const depDate = new Date(input.departureDate);
  const retDate = input.returnDate ? new Date(input.returnDate) : depDate;

  const isBlocked = data.vehicleAvailability?.some(block => {
    if (block.vehicleId !== vehicle.id) return false;
    const blockStart = new Date(block.from);
    const blockEnd = new Date(block.to);
    // Intersection check
    return depDate <= blockEnd && retDate >= blockStart;
  });

  if (isBlocked) return false;

  // Also check existing bookings (if we had them implemented to track fleet count limits)
  // For now, if it's not blocked and has capacity, it's available.
  
  return true;
}
