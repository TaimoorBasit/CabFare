import { Request, Response } from 'express';
import { getDatabase } from '../database/db';

export const getHandler = async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const users = db.data?.users || [];
    return res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
