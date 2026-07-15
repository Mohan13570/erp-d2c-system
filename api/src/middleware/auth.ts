import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_aura_key';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'System Admin' || req.user.role === 'Admin' || req.user.role === 'Administrator')) {
    next();
  } else {
    res.status(403).json({ error: 'Requires Administrator privileges' });
  }
};

export const checkPermission = (moduleName: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.user.role === 'System Admin' || req.user.role === 'Admin' || req.user.role === 'Administrator') {
      return next();
    }
    const permissions = req.user.permissions || [];
    if (permissions.includes('All Modules') || permissions.includes(moduleName)) {
      return next();
    }
    res.status(403).json({ error: `Forbidden: Requires permission for ${moduleName}` });
  };
};

