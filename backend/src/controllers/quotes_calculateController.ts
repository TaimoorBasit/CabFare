import { Request, Response } from 'express';
import { generateQuotes } from '../engines/quoteEngine';

export const postHandler = async (req: Request, res: Response) => {
  try {
    const journey = req.body;
    const quotes = await generateQuotes(journey);
    return res.json({ quotes });
  } catch (error: any) {
    console.error("Quote calculation error:", error);
    return res.status(500).json({ error: error.message });
  }
}
