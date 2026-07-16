"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = exports.postHandler = exports.getHandler = void 0;
const db_1 = require("../database/db");
const getHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    return res.json(db.data?.vehicleAvailability || []);
};
exports.getHandler = getHandler;
const postHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    const item = req.body;
    if (!item.id)
        item.id = 'block_' + Date.now();
    db.data?.vehicleAvailability.push(item);
    await db.write();
    return res.json(item);
};
exports.postHandler = postHandler;
const deleteHandler = async (req, res) => {
    const id = req.query.id;
    const db = await (0, db_1.getDatabase)();
    if (db.data) {
        db.data.vehicleAvailability = db.data.vehicleAvailability.filter(m => m.id !== id);
        await db.write();
        return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Not found' });
};
exports.deleteHandler = deleteHandler;
