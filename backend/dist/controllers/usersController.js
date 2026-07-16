"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const db_1 = require("../database/db");
const getHandler = async (req, res) => {
    try {
        const db = await (0, db_1.getDatabase)();
        const users = db.data?.users || [];
        return res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Server error' });
    }
};
exports.getHandler = getHandler;
