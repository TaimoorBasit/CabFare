import { calculateMileage } from './mileageEngine';
import { calculatePrice } from './pricingEngine';
import { checkAvailability } from './availabilityEngine';
import { getDatabase } from './db';

export async function generateQuotes(journey: any) {
  const db = await getDatabase();
  const data = db.data;
  if (!data || !data.vehicles) throw new Error("Database missing vehicles");

  const mileageResult = await calculateMileage(journey);

  const quotes = [];

  for (const vehicle of data.vehicles as any[]) {

    const isAvailable = await checkAvailability({
      vehicleId: vehicle.id,
      passengers: journey.passengers,
      departureDate: journey.departureDate,
      returnDate: journey.returnDate,
      suitcaseCount: journey.suitcaseCount,
      handbagCount: journey.handbagCount
    });

    const pricingResult = await calculatePrice({
      liveKm: mileageResult.liveKm,
      deadKm: mileageResult.deadKm,
      liveDurationMinutes: mileageResult.liveDurationMinutes,
      totalDurationMinutes: mileageResult.totalDurationMinutes,
      vehicleId: vehicle.id,
      journeyType: journey.journeyType,
      passengers: journey.passengers,
      suitcaseCount: journey.suitcaseCount,
      handbagCount: journey.handbagCount,
      originName: String(journey.origin),
      destinationName: String(journey.destination),
      originCoords: journey.wpCoords?.[0] || null,
      destinationCoords: journey.wpCoords?.[journey.wpCoords?.length - 1] || null,
      waypoints: mileageResult.geometry ? [] : [], 
      waitingMins: journey.waitingMins,
      departureDate: journey.departureDate,
      returnDate: journey.returnDate
    });

    const requiredVehicles = Math.ceil((journey.passengers || 1) / (vehicle.capacity || 1));

    quotes.push({
      vehicle,
      result: {
        totalKm: Math.round(mileageResult.totalKm),
        revenueKm: Math.round(mileageResult.liveKm),
        finalPrice: pricingResult.finalFare * requiredVehicles,
        subtotal: (pricingResult.baseFare + pricingResult.extraLiveMileageCharge + pricingResult.extraDeadMileageCharge + pricingResult.waitingCharge) * requiredVehicles,
        surchargeLines: pricingResult.surchargeLines.map(s => ({...s, cost: s.cost * requiredVehicles})),
        surchargeTotal: pricingResult.surchargeTotal * requiredVehicles,
        chain: mileageResult.legs, 
        geometry: mileageResult.geometry,
        pts: [journey.wpCoords?.[0] || {lat:0, lng:0}, journey.wpCoords?.[1] || {lat:0, lng:0}], 
        isManualQuote: pricingResult.isManualQuote,
        belowMin: false, 
        opDays: (journey.returnDate && journey.departureDate && new Date(journey.returnDate) > new Date(journey.departureDate)) ? Math.max(1, Math.ceil((new Date(journey.returnDate).getTime() - new Date(journey.departureDate).getTime()) / 86400000) + 1) : 1,
        totalShiftHrs: Math.round(((mileageResult.totalDurationMinutes + Number(journey.waitingMins || 0)) / 60) * 10) / 10
      }
    });
  }

  return quotes;
}
