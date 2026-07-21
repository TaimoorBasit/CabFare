// No fs, path, or Node.js built-ins.
import seedData from './seed.json';
class KVAdapter {
    async read(env) {
        try {
            if (!env)
                throw new Error("Environment configuration is missing");
            const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
            const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
            if (!url || !token)
                throw new Error("Upstash Redis credentials missing in environment");
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(["GET", "cabfare_db"])
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Upstash API Error: ${res.status} ${res.statusText} - ${errText}`);
            }
            const json = await res.json();
            if (json && json.error) {
                throw new Error(`Upstash DB Error: ${json.error}`);
            }
            if (json && json.result) {
                return JSON.parse(json.result);
            }
        }
        catch (e) {
            console.error("KV read error:", e);
            throw new Error(`KV read failed: ${e.message}`);
        }
        return null;
    }
    async write(data, env) {
        try {
            if (!env)
                throw new Error("Environment configuration is missing");
            const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
            const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
            if (!url || !token)
                throw new Error("Upstash Redis credentials missing in environment");
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(["SET", "cabfare_db", JSON.stringify(data)])
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Upstash Write API Error: ${res.status} ${res.statusText} - ${errText}`);
            }
            const json = await res.json();
            if (json && json.error) {
                throw new Error(`Upstash Write DB Error: ${json.error}`);
            }
        }
        catch (e) {
            console.error("KV write error:", e);
            throw new Error(`KV write failed: ${e.message}`);
        }
    }
}
class DB {
    data = null;
    adapter = new KVAdapter();
    env;
    constructor(env) {
        this.env = env;
    }
    async read() {
        this.data = await this.adapter.read(this.env);
    }
    async write() {
        if (this.data) {
            await this.adapter.write(this.data, this.env);
        }
    }
}
let db = null;
export async function initDatabase(env) {
    if (db)
        return db;
    db = new DB(env);
    await db.read();
    if (!db.data || Object.keys(db.data).length === 0) {
        db.data = seedData;
        await db.write();
    }
    return db;
}
export async function getDatabase(env) {
    if (!db) {
        await initDatabase(env);
    }
    else {
        // Keep it refreshed just in case but update env reference
        db.env = env;
        await db.read();
    }
    return db;
}
