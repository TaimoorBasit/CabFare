import { calculateMileage } from './mileageEngine';
import { calculatePrice } from './pricingEngine';
import { checkAvailability } from './availabilityEngine';
import { getDatabase } from './db';

export async function generateQuotes(journey: any) {
  const db = await getDatabase();
  const data = db.data;
  if (!data || !data.vehicles) throw new Error("Database missing vehicles");

  // 1. Calculate mileage and geometry once for the journey
  const mileageResult = await calculateMileage(journey);

  const quotes = [];

  // 2. Iterate through vehicles
  for (const vehicle of data.vehicles as any[]) {
    // 3. Check availability
    const isAvailable = await checkAvailability({
      vehicleId: vehicle.id,
      passengers: journey.passengers,
      departureDate: journey.departureDate,
      returnDate: journey.returnDate,
      largeLuggage: journey.largeLuggage,
      luggageCount: journey.luggageCount
    });

    if (!isAvailable) {
      continue; // Skip this vehicle
    }

    // 4. Calculate price
    const pricingResult = await calculatePrice({
      liveKm: mileageResult.liveKm,
      deadKm: mileageResult.deadKm,
      liveDurationMinutes: mileageResult.liveDurationMinutes,
      vehicleId: vehicle.id,
      journeyType: journey.journeyType,
      passengers: journey.passengers,
      originName: String(journey.origin).split(',')[0],
      destinationName: String(journey.destination).split(',')[0],
      originCoords: journey.wpCoords?.[0] || null,
      destinationCoords: journey.wpCoords?.[journey.wpCoords?.length - 1] || null,
      waypoints: mileageResult.geometry ? [] : [], // Geometry contains points we can use for waypoints if needed, but we'll stick to WP coords for now.
      waitingMins: journey.waitingMins,
      departureDate: journey.departureDate,
      returnDate: journey.returnDate
    });

    // 5. Structure the quote response
    quotes.push({
      vehicle,
      result: {
        totalKm: Math.round(mileageResult.totalKm),
        revenueKm: Math.round(mileageResult.liveKm),
        finalPrice: pricingResult.finalFare,
        subtotal: pricingResult.baseFare + pricingResult.extraLiveMileageCharge + pricingResult.extraDeadMileageCharge + pricingResult.waitingCharge,
        surchargeLines: pricingResult.surchargeLines,
        surchargeTotal: pricingResult.surchargeTotal,
        chain: mileageResult.legs, // Using the Google legs instead of the custom chain for now, or adapt later
        geometry: mileageResult.geometry,
        pts: [journey.wpCoords?.[0] || {lat:0, lng:0}, journey.wpCoords?.[1] || {lat:0, lng:0}], // Approximation for map pins
        isManualQuote: pricingResult.isManualQuote,
        belowMin: false, // New engine doesn't enforce old min hire unless configured
        opDays: 1, // Simplified
        totalShiftHrs: Math.round((mileageResult.liveDurationMinutes / 60) * 10) / 10
      }
    });
  }

  return quotes;
}
