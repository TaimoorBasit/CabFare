"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = exports.putHandler = exports.postHandler = exports.getHandler = void 0;
const db_1 = require("../database/db");
const getHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    return res.json(db.data?.routeTemplates || []);
};
exports.getHandler = getHandler;
const postHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    const item = req.body;
    if (!item.id)
        item.id = 'template_' + Date.now();
    if (db.data) {
        db.data.routeTemplates.push(item);
        await db.write();
    }
    return res.json(item);
};
exports.postHandler = postHandler;
const putHandler = async (req, res) => {
    const db = await (0, db_1.getDatabase)();
    const item = req.body;
    const index = db.data?.routeTemplates.findIndex(m => m.id === item.id);
    if (index !== undefined && index > -1 && db.data) {
        db.data.routeTemplates[index] = item;
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
        db.data.routeTemplates = db.data.routeTemplates.filter(m => m.id !== id);
        await db.write();
        return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Not found' });
};
exports.deleteHandler = deleteHandler;
