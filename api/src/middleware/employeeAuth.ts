import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export interface EmployeeAuthRequest extends Request {
  employeeUser?: {
    userId: string;
    employeeId: string;
    email: string;
    role: 'employee' | 'manager' | 'hr_admin';
    firstName: string;
    lastName: string;
    departmentId?: string | null;
  };
}

export const authenticateEmployee = async (
  req: EmployeeAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Ensure we resolve the employee profile & role
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        userRoles: { include: { role: true } },
        employeeProfile: {
          include: {
            employmentInfo: true
          }
        }
      }
    });

    if (!user || user.status === 'Locked' || user.status === 'Suspended') {
      return res.status(401).json({ success: false, error: 'Unauthorized or account suspended' });
    }

    // Determine role (hr_admin > manager > employee)
    const roleNames = user.userRoles.map(ur => ur.role.name.toLowerCase());
    let role: 'employee' | 'manager' | 'hr_admin' = 'employee';

    if (roleNames.includes('system admin') || roleNames.includes('hr admin') || roleNames.includes('hr_admin')) {
      role = 'hr_admin';
    } else if (roleNames.includes('manager') || roleNames.includes('reporting manager')) {
      role = 'manager';
    }

    // Resolve employeeId — if employeeProfile exists, use its id; fallback to employee record or user id
    let employeeId = user.employeeProfile?.id;
    if (!employeeId) {
      const emp = await prisma.employee.findFirst({ where: { userId: user.id } });
      employeeId = emp?.employee || user.id;
    }

    req.employeeUser = {
      userId: user.id,
      employeeId,
      email: user.email,
      role,
      firstName: user.firstName,
      lastName: user.lastName,
      departmentId: user.employeeProfile?.employmentInfo?.departmentId || null
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (allowedRoles: Array<'employee' | 'manager' | 'hr_admin'>) => {
  return (req: EmployeeAuthRequest, res: Response, next: NextFunction) => {
    if (!req.employeeUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.employeeUser.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Forbidden: Access restricted to ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};
