"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHandler = exports.getHandler = void 0;
const db_1 = require("../database/db");
const getHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    return res.json({
        vehicles: db.data?.vehicles,
        globalVars: db.data?.globalVars,
        surcharges: db.data?.surcharges,
        annualOverheads: db.data?.annualOverheads,
        blockedDates: db.data?.blockedDates
    });
};
exports.getHandler = getHandler;
const postHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    const config = req.body;
    if (db.data) {
        if (config.vehicles)
            db.data.vehicles = config.vehicles;
        if (config.globalVars)
            db.data.globalVars = config.globalVars;
        if (config.surcharges)
            db.data.surcharges = config.surcharges;
        if (config.annualOverheads)
            db.data.annualOverheads = config.annualOverheads;
        if (config.blockedDates)
            db.data.blockedDates = config.blockedDates;
        await db.write();
    }
    return res.json({ success: true });
};
exports.postHandler = postHandler;
