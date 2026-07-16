"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
exports.getDatabase = getDatabase;
const lowdb_1 = require("lowdb");
const node_1 = require("lowdb/node");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const seed_json_1 = __importDefault(require("./seed.json"));
class KVAdapter {
    async read() {
        try {
            const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
            const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
            if (!url || !token)
                return null;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(["GET", "cabfare_db"])
            });
            const json = await res.json();
            if (json && json.result) {
                return JSON.parse(json.result);
            }
        }
        catch (e) {
            console.error("KV read error:", e);
        }
        return null;
    }
    async write(data) {
        try {
            const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
            const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
            if (!url || !token)
                return;
            await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(["SET", "cabfare_db", JSON.stringify(data)])
            });
        }
        catch (e) {
            console.error("KV write error:", e);
        }
    }
}
let db = null;
async function initDatabase() {
    if (db)
        return db;
    const isVercel = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
    let adapter;
    if (isVercel) {
        adapter = new KVAdapter();
    }
    else {
        const dataDir = path_1.default.join(process.cwd(), '.data');
        if (!fs_1.default.existsSync(dataDir)) {
            fs_1.default.mkdirSync(dataDir, { recursive: true });
        }
        const file = path_1.default.join(dataDir, 'db.json');
        adapter = new node_1.JSONFile(file);
    }
    db = new lowdb_1.Low(adapter, seed_json_1.default);
    await db.read();
    if (!db.data || Object.keys(db.data).length === 0) {
        db.data = seed_json_1.default;
        await db.write();
    }
    return db;
}
async function getDatabase() {
    if (!db) {
        await initDatabase();
    }
    if (db && (process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_TOKEN)) {
        await db.read();
    }
    return db;
}
