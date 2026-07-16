"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailability = checkAvailability;
const db_1 = require("../database/db");
async function checkAvailability(input) {
    const db = await (0, db_1.getDatabase)();
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
