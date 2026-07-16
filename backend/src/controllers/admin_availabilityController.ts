import { Request, Response } from 'express';
import { getDatabase } from '../database/db';

export const getHandler = async (req: Request, res: Response) => {
  const db = await getDatabase();
  return res.json(db.data?.vehicleAvailability || []);
}

export const postHandler = async (req: Request, res: Response) => {
  const db = await getDatabase();
  const item = req.body;
  if (!item.id) item.id = 'block_' + Date.now();
  db.data?.vehicleAvailability.push(item);
  await db.write();
  return res.json(item);
}

export const deleteHandler = async (req: Request, res: Response) => {
  const id = req.query.id as string;
  const db = await getDatabase();
  if (db.data) {
    db.data.vehicleAvailability = db.data.vehicleAvailability.filter(m => m.id !== id);
    await db.write();
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'Not found' });
}
