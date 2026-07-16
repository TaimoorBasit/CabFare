import { Request, Response } from 'express';
import { getDatabase } from '../database/db';
import fs from 'fs';
import path from 'path';

export const getHandler = async (req: Request, res: Response) => {
  const isVercel = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
  
  if (!isVercel) {
    return res.status(400).json({ error: "Not on live Vercel environment (KV credentials not found)" });
  }

  const dataDir = path.join(process.cwd(), '.data');
  const file = path.join(dataDir, 'db.json');
  
  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: "Local db.json not found on Vercel deployment" });
  }

  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const jsonData = JSON.parse(raw);

    const db = await getDatabase();
    db.data = jsonData;
    await db.write(); // This will write to the KV store because isVercel is true

    return res.json({ success: true, message: "Live KV Database overwritten with latest local db.json containing dummy data." });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to parse or write db.json", details: error.message });
  }
}
