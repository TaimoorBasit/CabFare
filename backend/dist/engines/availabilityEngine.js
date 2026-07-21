import { getDatabase } from '../database/db';
export async function checkAvailability(input, env) {
    const db = await getDatabase(env);
    const data = db.data;
    if (!data)
        return false;
    const vehicle = data.vehicles?.find((v) => v.id === input.vehicleId);
    if (!vehicle)
        return false;
    if (vehicle.capacity < input.passengers)
        return false;
    const depDate = new Date(input.departureDate);
    const retDate = input.returnDate ? new Date(input.returnDate) : depDate;
    const isBlocked = data.vehicleAvailability?.some(block => {
        if (block.vehicleId !== vehicle.id)
            return false;
        const blockStart = new Date(block.from);
        const blockEnd = new Date(block.to);
        return depDate <= blockEnd && retDate >= blockStart;
    });
    if (isBlocked)
        return false;
    return true;
}
