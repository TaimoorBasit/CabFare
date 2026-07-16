import { Request, Response } from 'express';
export const getHandler = async (req: Request, res: Response) => {
  return res.json({
    message: 'Hello from the Next.js API route!',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
