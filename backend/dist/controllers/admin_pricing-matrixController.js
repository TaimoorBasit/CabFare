"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = exports.putHandler = exports.postHandler = exports.getHandler = void 0;
const db_1 = require("../database/db");
const getHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    return res.json(db.data?.pricingMatrix || []);
};
exports.getHandler = getHandler;
const postHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    const item = req.body;
    if (!item.id)
        item.id = 'matrix_' + Date.now();
    db.data?.pricingMatrix.push(item);
    await db.write();
    return res.json(item);
};
exports.postHandler = postHandler;
const putHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    const item = req.body;
    const index = db.data?.pricingMatrix.findIndex(m => m.id === item.id);
    if (index !== undefined && index > -1 && db.data) {
        db.data.pricingMatrix[index] = item;
        await db.write();
        return res.json(item);
    }
    return res.status(404).json({ error: 'Not found' });
};
exports.putHandler = putHandler;
const deleteHandler = async (req, res) => {
    const id = req.query.id;
    const db = await (0, db_1.getDatabase)();
    if (db.data) {
        db.data.pricingMatrix = db.data.pricingMatrix.filter(m => m.id !== id);
        await db.write();
        return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Not found' });
};
exports.deleteHandler = deleteHandler;
