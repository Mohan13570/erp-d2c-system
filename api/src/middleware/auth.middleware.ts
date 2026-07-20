import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-me';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    customerId: string;
    role: string;
  };
}

export const authenticatePortalUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Not authenticated, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      customerId: decoded.customerId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authenticated, invalid token' });
  }
};
