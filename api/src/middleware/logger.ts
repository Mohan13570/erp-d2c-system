import { Request, Response, NextFunction } from 'express';

export default function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`[AI] ${req.method} ${req.path}`);
  next();
}
