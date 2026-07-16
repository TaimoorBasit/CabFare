"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putHandler = exports.postHandler = void 0;
const db_1 = require("../database/db");
const postHandler = async (req, res) => {
    try {
        const db = await (0, db_1.getDatabase)();
        if (!db.data)
            throw new Error("Database not initialized");
        return res.json({ bookings: db.data.bookings || [] });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.postHandler = postHandler;
const putHandler = async (req, res) => {
    try {
        const db = await (0, db_1.getDatabase)();
        if (!db.data)
            throw new Error("Database not initialized");
        const payload = req.body;
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
        return res.json({ success: true, booking: newBooking });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.putHandler = putHandler;
