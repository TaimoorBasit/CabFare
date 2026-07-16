"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const db_1 = require("../database/db");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getHandler = async (req, res) => {
    const isVercel = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
    if (!isVercel) {
        return res.status(400).json({ error: "Not on live Vercel environment (KV credentials not found)" });
    }
    const dataDir = path_1.default.join(process.cwd(), '.data');
    const file = path_1.default.join(dataDir, 'db.json');
    if (!fs_1.default.existsSync(file)) {
        return res.status(404).json({ error: "Local db.json not found on Vercel deployment" });
    }
    try {
        const raw = fs_1.default.readFileSync(file, 'utf-8');
        const jsonData = JSON.parse(raw);
        const db = await (0, db_1.getDatabase)();
        db.data = jsonData;
        await db.write(); // This will write to the KV store because isVercel is true
        return res.json({ success: true, message: "Live KV Database overwritten with latest local db.json containing dummy data." });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to parse or write db.json", details: error.message });
    }
};
exports.getHandler = getHandler;
