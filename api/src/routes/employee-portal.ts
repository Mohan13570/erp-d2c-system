import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { authenticateEmployee, requireRole, EmployeeAuthRequest } from '../middleware/employeeAuth';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Helper for sending structured responses
const successRes = (res: Response, data: any, status = 200) => {
  res.status(status).json({ success: true, data });
};
const errorRes = (res: Response, error: string, status = 400) => {
  res.status(status).json({ success: false, error });
};

// ==========================================
// 1. AUTHENTICATION & SESSION
// ==========================================
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return errorRes(res, 'Email and password required');

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: { include: { role: true } },
        employeeProfile: true
      }
    });

    if (!user || user.passwordHash !== passwordHash) {
      return errorRes(res, 'Invalid email or password', 401);
    }

    if (user.status === 'Locked' || user.status === 'Suspended') {
      return errorRes(res, `Account is ${user.status}`, 403);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Resolve role
    const roleNames = user.userRoles.map(ur => ur.role.name.toLowerCase());
    let role: 'employee' | 'manager' | 'hr_admin' = 'employee';

    if (roleNames.includes('system admin') || roleNames.includes('hr admin') || roleNames.includes('hr_admin')) {
      role = 'hr_admin';
    } else if (roleNames.includes('manager') || roleNames.includes('reporting manager')) {
      role = 'manager';
    }

    let employeeId = user.employeeProfile?.id;
    if (!employeeId) {
      const emp = await prisma.employee.findFirst({ where: { userId: user.id } });
      employeeId = emp?.employee || user.id;
    }

    return successRes(res, {
      token,
      user: {
        id: user.id,
        employeeId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role,
        employeeCode: user.employeeProfile?.employeeCode || 'EMP-001'
      }
    });
  } catch (err: any) {
    return errorRes(res, err.message || 'Login failed', 500);
  }
});

router.get('/auth/me', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  const empUser = req.employeeUser!;
  const profile = await prisma.employeeProfile.findFirst({
    where: { userId: empUser.userId },
    include: { employmentInfo: { include: { designation: true } } }
  });

  return successRes(res, {
    ...empUser,
    employeeCode: profile?.employeeCode || 'EMP-001',
    designation: profile?.employmentInfo?.designation?.name || 'Logistics Specialist',
    photo: profile?.profilePhoto || null
  });
});

router.post('/auth/change-password', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return errorRes(res, 'Current and new password required');

    // Password Complexity Rules Verification
    const hasMinLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return errorRes(res, 'New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
    }

    const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
    const user = await prisma.user.findUnique({ where: { id: req.employeeUser!.userId } });

    if (user && user.passwordHash !== currentHash) {
      // Also allow if user exists in fallback demo session
      return errorRes(res, 'Current password is incorrect', 401);
    }

    const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash }
      });
    }

    return successRes(res, { message: 'Password updated successfully!' });
  } catch (err: any) {
    return errorRes(res, err.message || 'Failed to update password', 500);
  }
});

// 2FA Endpoints
router.post('/auth/2fa/setup', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    const secret = 'AURA-2FA-SEC-' + Math.floor(100000 + Math.random() * 900000);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/AuraERP:employee?secret=${secret}&issuer=AuraERP`;
    return successRes(res, { secret, qrCodeUrl });
  } catch (err: any) {
    return errorRes(res, err.message || 'Failed to initialize 2FA setup', 500);
  }
});

router.post('/auth/2fa/verify', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { code, secret } = req.body;
    if (!code || code.length !== 6) return errorRes(res, 'Valid 6-digit TOTP verification code required');

    const recoveryCodes = Array.from({ length: 6 }, (_, i) => `AURA-RECOVER-${Math.floor(1000 + Math.random() * 9000)}-${i + 1}`);

    return successRes(res, {
      message: 'Two-Factor Authentication (2FA) successfully enabled!',
      twoFactorEnabled: true,
      recoveryCodes
    });
  } catch (err: any) {
    return errorRes(res, err.message || 'Failed to verify 2FA code', 500);
  }
});

router.post('/auth/2fa/disable', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) return errorRes(res, 'Current password required to disable 2FA');

    return successRes(res, {
      message: 'Two-Factor Authentication (2FA) disabled.',
      twoFactorEnabled: false
    });
  } catch (err: any) {
    return errorRes(res, err.message || 'Failed to disable 2FA', 500);
  }
});

// ==========================================
// 2. DASHBOARD
// ==========================================
router.get('/dashboard/summary', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId, role } = req.employeeUser!;
    const today = new Date();
    today.setHours(0,0,0,0);

    // Attendance stats
    const todayLog = await prisma.attendanceLog.findFirst({
      where: { employeeId, date: { gte: today } }
    });

    // Leave balances
    const leaveBalances = await prisma.hRLeaveBalance.findMany({
      where: { employeeId },
      include: { leaveType: true }
    });

    // Announcements
    const announcements = await prisma.announcement.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // Pending team approvals if Manager/HR
    let pendingApprovals = 0;
    if (role === 'manager' || role === 'hr_admin') {
      pendingApprovals = await prisma.hRLeaveRequest.count({
        where: { status: 'PENDING' }
      });
    }

    return successRes(res, {
      clockedIn: !!(todayLog && !todayLog.clockOut),
      clockInTime: todayLog?.clockIn || null,
      leaveBalances: leaveBalances.map(b => ({
        type: b.leaveType.name,
        code: b.leaveType.code,
        balance: b.balanceDays,
        accrued: b.accruedDays,
        used: b.usedDays
      })),
      announcements,
      pendingApprovals,
      nextPayday: 'July 31, 2026'
    });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// Logistics ERP Operations Overview Endpoint (Calculated Dynamically from Live Stores)
router.get('/dashboard/ops', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { role } = req.employeeUser!;

    const inTransitCount = masterShipmentsStore.filter(s => s.status === 'IN_TRANSIT').length;
    const pendingPickupCount = masterShipmentsStore.filter(s => s.status === 'BOOKED' || s.status === 'PICKED_UP').length;
    const delayedCount = masterShipmentsStore.filter(s => s.exceptions && s.exceptions.length > 0).length;
    const deliveredCount = masterShipmentsStore.filter(s => s.status === 'DELIVERED').length;

    const opsOverview = {
      inTransit: { count: inTransitCount },
      pendingPickup: { count: pendingPickupCount },
      delayedToday: { count: delayedCount },
      deliveredToday: { count: deliveredCount }
    };

    // Dynamic Alerts from live stores
    const alerts: any[] = [];
    masterShipmentsStore.forEach(s => {
      (s.exceptions || []).forEach((ex: any) => {
        alerts.push({
          id: ex.id,
          type: 'shipment_exception',
          title: `Shipment Delay: ${ex.reasonCode}`,
          description: ex.description,
          severity: ex.escalated ? 'critical' : 'high',
          recordId: s.shipmentNumber,
          recordType: 'shipment',
          timestamp: 'Active'
        });
      });
    });

    masterClaimsStore.forEach(c => {
      if (c.status !== 'SETTLED' && c.status !== 'DENIED') {
        alerts.push({
          id: c.id,
          type: 'claim_open',
          title: `Claim Logged: ${c.damageType}`,
          description: c.description,
          severity: c.claimedAmount > 50000 ? 'critical' : 'high',
          recordId: c.claimNumber,
          recordType: 'claim',
          timestamp: 'Active'
        });
      }
    });

    masterTicketsStore.forEach(t => {
      if (t.isSlaBreached) {
        alerts.push({
          id: t.id,
          type: 'sla_breach',
          title: `SLA Overdue: ${t.subject}`,
          description: `Ticket ${t.ticketNumber} exceeded SLA window`,
          severity: 'high',
          recordId: t.ticketNumber,
          recordType: 'ticket',
          timestamp: 'Overdue'
        });
      }
    });

    // Dynamic Task Queue
    const pendingQuotes = masterQuotesStore.filter(q => q.status === 'PENDING_APPROVAL');
    const pendingClaims = masterClaimsStore.filter(c => c.status === 'PENDING_APPROVAL' || c.status === 'INTAKE');
    const overdueTickets = masterTicketsStore.filter(t => t.assignedTo === 'Unassigned' || t.isSlaBreached);

    const taskQueue = [
      {
        type: 'quotes_pending',
        title: 'Quotes Pending Approval',
        count: pendingQuotes.length,
        viewAllUrl: '/admin/hr-portal/quotes',
        items: pendingQuotes.slice(0, 3).map(q => ({ id: q.quoteNumber, name: q.lane, amount: `₹${q.proposedPrice?.toLocaleString()}` }))
      },
      {
        type: 'claims_pending',
        title: 'Claims Pending Review',
        count: pendingClaims.length,
        viewAllUrl: '/admin/hr-portal/claims',
        items: pendingClaims.slice(0, 3).map(c => ({ id: c.claimNumber, name: c.damageType, amount: `₹${c.claimedAmount?.toLocaleString()}` }))
      },
      {
        type: 'tickets_overdue',
        title: 'Unassigned / Overdue Tickets',
        count: overdueTickets.length,
        viewAllUrl: '/admin/hr-portal/support',
        items: overdueTickets.slice(0, 3).map(t => ({ id: t.ticketNumber, name: t.subject, priority: t.priority }))
      }
    ];

    // Dynamic Financial Snapshot
    let totalReceivables = 0;
    let overdueCount = 0;
    let totalCollections = 0;

    masterInvoicesStore.forEach(inv => {
      if (inv.status !== 'PAID') {
        totalReceivables += inv.balanceAmount || 0;
        overdueCount++;
      }
      totalCollections += inv.paidAmount || 0;
    });

    const isFinancialRole = role === 'manager' || role === 'hr_admin';
    const financials = isFinancialRole ? {
      isAccessible: true,
      outstandingReceivables: totalReceivables,
      overdueInvoicesCount: overdueCount,
      todayCollections: totalCollections,
      formattedReceivables: `₹${totalReceivables.toLocaleString()}`,
      formattedCollections: `₹${totalCollections.toLocaleString()}`
    } : {
      isAccessible: false,
      message: 'Financial summary is restricted to Finance & Management roles.'
    };

    const teamPerformance = {
      shipmentsHandledPerAgent: [],
      avgResolutionTimeHours: 0,
      quoteToBookingRate: '0%'
    };

    return successRes(res, {
      opsOverview,
      alerts,
      taskQueue,
      financials,
      teamPerformance
    });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 3. PROFILE
// ==========================================
router.get('/profile', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { userId, employeeId } = req.employeeUser!;
    let profile = await prisma.employeeProfile.findFirst({
      where: { OR: [{ userId }, { id: employeeId }] },
      include: {
        employmentInfo: { include: { designation: true, jobTitle: true } },
        addresses: true,
        contacts: true
      }
    });

    if (!profile) {
      // Fallback create/return basic profile
      profile = await prisma.employeeProfile.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          employeeCode: `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
          firstName: req.employeeUser!.firstName,
          lastName: req.employeeUser!.lastName,
          officialEmail: req.employeeUser!.email
        },
        include: {
          employmentInfo: { include: { designation: true } },
          addresses: true,
          contacts: true
        }
      });
    }

    return successRes(res, profile);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.put('/profile', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { userId } = req.employeeUser!;
    const { personalEmail, primaryMobile, secondaryMobile, emergencyContact, emergencyPhone, bio, profilePhoto } = req.body;

    const updated = await prisma.employeeProfile.update({
      where: { userId },
      data: {
        personalEmail,
        primaryMobile,
        secondaryMobile,
        emergencyContact,
        emergencyPhone,
        bio,
        profilePhoto
      }
    });

    return successRes(res, updated);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 4. ATTENDANCE MODULE
// ==========================================
router.post('/attendance/clock-in', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    const { latitude, longitude, address } = req.body;

    const today = new Date();
    today.setHours(0,0,0,0);

    let log = await prisma.attendanceLog.findFirst({
      where: { employeeId, date: { gte: today } }
    });

    if (log && log.clockIn && !log.clockOut) {
      return errorRes(res, 'Already clocked in for today');
    }

    if (!log) {
      log = await prisma.attendanceLog.create({
        data: {
          employeeId,
          date: new Date(),
          clockIn: new Date(),
          source: address ? `GPS (${address})` : 'Web Portal'
        }
      });
    } else {
      log = await prisma.attendanceLog.update({
        where: { id: log.id },
        data: { clockIn: new Date() }
      });
    }

    return successRes(res, log);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.post('/attendance/clock-out', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    const today = new Date();
    today.setHours(0,0,0,0);

    const log = await prisma.attendanceLog.findFirst({
      where: { employeeId, date: { gte: today } }
    });

    if (!log || !log.clockIn) {
      return errorRes(res, 'You have not clocked in today');
    }

    const clockOut = new Date();
    const diffMs = clockOut.getTime() - new Date(log.clockIn).getTime();
    const hoursWorked = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;

    const updated = await prisma.attendanceLog.update({
      where: { id: log.id },
      data: {
        clockOut,
        hoursWorked
      }
    });

    return successRes(res, updated);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.get('/attendance/my-logs', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    const logs = await prisma.attendanceLog.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
      take: 31
    });

    return successRes(res, logs);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// Attendance team logs for Managers & HR
router.get('/attendance/team-logs', authenticateEmployee, requireRole(['manager', 'hr_admin']), async (req: EmployeeAuthRequest, res) => {
  try {
    const logs = await prisma.attendanceLog.findMany({
      take: 50,
      orderBy: { date: 'desc' },
      include: { employee: true }
    });
    return successRes(res, logs);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 5. LEAVE & ABSENCE MODULE
// ==========================================
router.get('/leave/balances', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    let balances = await prisma.hRLeaveBalance.findMany({
      where: { employeeId },
      include: { leaveType: true }
    });

    if (balances.length === 0) {
      // Seed default balances for this employee
      const leaveTypes = await prisma.hRLeaveType.findMany();
      for (const lt of leaveTypes) {
        await prisma.hRLeaveBalance.create({
          data: {
            employeeId,
            leaveTypeId: lt.id,
            accrued: lt.code === 'CASUAL' ? 12 : lt.code === 'SICK' ? 10 : 15,
            used: 0,
            balance: lt.code === 'CASUAL' ? 12 : lt.code === 'SICK' ? 10 : 15,
            year: new Date().getFullYear()
          }
        });
      }
      balances = await prisma.hRLeaveBalance.findMany({
        where: { employeeId },
        include: { leaveType: true }
      });
    }

    return successRes(res, balances);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.post('/leave/apply', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    const { leaveTypeId, startDate, endDate, reason, documentUrl } = req.body;

    if (!leaveTypeId || !startDate || !endDate || !reason) {
      return errorRes(res, 'All fields (leave type, dates, reason) are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return errorRes(res, 'End date cannot be before start date');

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check overlapping dates
    const overlap = await prisma.hRLeaveRequest.findFirst({
      where: {
        employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } }
        ]
      }
    });

    if (overlap) {
      return errorRes(res, 'You already have a pending or approved leave request for these dates');
    }

    const request = await prisma.hRLeaveRequest.create({
      data: {
        employeeId,
        leaveTypeId,
        startDate: start,
        endDate: end,
        totalDays,
        reason,
        status: 'PENDING',
        documentUrl
      },
      include: { leaveType: true }
    });

    return successRes(res, request, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.get('/leave/my-requests', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    const requests = await prisma.hRLeaveRequest.findMany({
      where: { employeeId },
      include: { leaveType: true },
      orderBy: { createdAt: 'desc' }
    });
    return successRes(res, requests);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// Manager / HR Team Leave Requests
router.get('/leave/team-requests', authenticateEmployee, requireRole(['manager', 'hr_admin']), async (req: EmployeeAuthRequest, res) => {
  try {
    const requests = await prisma.hRLeaveRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { leaveType: true }
    });
    return successRes(res, requests);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.post('/leave/approve/:id', authenticateEmployee, requireRole(['manager', 'hr_admin']), async (req: EmployeeAuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body; // APPROVED or REJECTED

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return errorRes(res, 'Status must be APPROVED or REJECTED');
    }

    const leaveReq = await prisma.hRLeaveRequest.findUnique({ where: { id } });
    if (!leaveReq) return errorRes(res, 'Leave request not found');

    const updated = await prisma.hRLeaveRequest.update({
      where: { id },
      data: {
        status,
        approvedBy: req.employeeUser!.employeeId,
        approvalDate: new Date(),
        rejectionReason: status === 'REJECTED' ? rejectionReason : null
      }
    });

    // If approved, update Leave Balance
    if (status === 'APPROVED') {
      const bal = await prisma.hRLeaveBalance.findFirst({
        where: { employeeId: leaveReq.employeeId, leaveTypeId: leaveReq.leaveTypeId }
      });
      if (bal) {
        await prisma.hRLeaveBalance.update({
          where: { id: bal.id },
          data: {
            used: bal.used + leaveReq.totalDays,
            balance: Math.max(0, bal.balance - leaveReq.totalDays)
          }
        });
      }
    }

    return successRes(res, updated);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 6. PAYROLL & PAYSLIPS (STRICT READ-ONLY & SCOPED)
// ==========================================
router.get('/payroll/my-payslips', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    const payslips = await prisma.payslip.findMany({
      where: { employeeId },
      include: { payrollRun: true },
      orderBy: { createdAt: 'desc' }
    });

    return successRes(res, payslips);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.get('/payroll/my-payslips/:id', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    const payslip = await prisma.payslip.findFirst({
      where: { id: req.params.id, employeeId }, // STRICT OWNERSHIP CHECK
      include: { payrollRun: true }
    });

    if (!payslip) return errorRes(res, 'Payslip not found or access denied', 404);

    return successRes(res, payslip);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 7. DOCUMENTS & COMPANY POLICIES
// ==========================================
router.get('/documents/my-documents', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { employeeId } = req.employeeUser!;
    const docs = await prisma.employeeDocument.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' }
    });

    return successRes(res, docs);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.get('/documents/company-policies', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    const policies = [
      { id: '1', title: 'HR Employee Code of Conduct 2026', category: 'Compliance', format: 'PDF', updatedAt: '2026-01-01' },
      { id: '2', title: 'Travel & Expense Reimbursement Policy', category: 'Finance', format: 'PDF', updatedAt: '2026-02-15' },
      { id: '3', title: 'Annual Leave & Holiday List 2026', category: 'Leave', format: 'PDF', updatedAt: '2026-01-10' },
      { id: '4', title: 'IT & Data Security Guidelines', category: 'Security', format: 'PDF', updatedAt: '2026-03-01' }
    ];
    return successRes(res, policies);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 8. ANNOUNCEMENTS & DIRECTORY
// ==========================================
router.get('/announcements', authenticateEmployee, async (_req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return successRes(res, announcements);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.post('/announcements', authenticateEmployee, requireRole(['hr_admin']), async (req: EmployeeAuthRequest, res) => {
  try {
    const { title, content, type, isPinned } = req.body;
    if (!title || !content) return errorRes(res, 'Title and content required');

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type: type || 'Info',
        targetAudience: 'Global',
        isPinned: !!isPinned,
        authorId: req.employeeUser!.employeeId
      }
    });

    return successRes(res, announcement, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// Directory (Public fields only - NO salary / bank details)
router.get('/directory', authenticateEmployee, async (_req, res) => {
  try {
    const employees = await prisma.employeeProfile.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        officialEmail: true,
        primaryMobile: true,
        profilePhoto: true,
        employeeCode: true,
        employmentInfo: {
          select: {
            designation: { select: { name: true } }
          }
        }
      }
    });
    return successRes(res, employees);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 9. SUPPORT & HELPDESK
// ==========================================
router.get('/support/my-tickets', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { userId } = req.employeeUser!;
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return successRes(res, tickets);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.post('/support/tickets', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { category, subject, description, priority } = req.body;
    if (!subject || !description) return errorRes(res, 'Subject and description required');

    const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: req.employeeUser!.userId,
        customerName: `${req.employeeUser!.firstName} ${req.employeeUser!.lastName}`,
        subject: `[${category || 'HR'}] ${subject}`,
        category: category || 'HR Query',
        priority: priority || 'Medium',
        status: 'Open'
      }
    });

    return successRes(res, ticket, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

router.get('/support/all-tickets', authenticateEmployee, requireRole(['hr_admin']), async (_req, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return successRes(res, tickets);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 10. NOTIFICATIONS
// ==========================================
// ==========================================
// 11. SHIPMENT MANAGEMENT (STATE MACHINE, MULTI-LEG, VENDORS, COSTS, DOCUMENTS)
// ==========================================

// Mock In-Memory Master Shipments Store
const masterShipmentsStore: any[] = [];

// Vendor Master List (Stub)
const vendorMasterList = [
  { id: 'VND-01', name: 'Apex Freight Transporters Ltd', vehicleNumber: 'MH-04-AB-1234', driverName: 'Rajesh Kumar', driverPhone: '+91 98765 11111', city: 'Mumbai' },
  { id: 'VND-02', name: 'BlueDart Express Fleet Ltd', vehicleNumber: 'DL-01-XY-9876', driverName: 'Amit Verma', driverPhone: '+91 98765 22222', city: 'Delhi' },
  { id: 'VND-03', name: 'ColdChain Express Logistics', vehicleNumber: 'KA-02-ZZ-5555', driverName: 'Suresh Patil', driverPhone: '+91 98765 33333', city: 'Bengaluru' }
];

// GET Master Shipment List (with pagination, sorting, and filtering)
router.get('/shipments', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { branch, agent, status, customer, search, page = '1', limit = '10' } = req.query;

    let filtered = [...masterShipmentsStore];

    if (branch && branch !== 'ALL') {
      filtered = filtered.filter(s => s.branch.toLowerCase().includes((branch as string).toLowerCase()));
    }
    if (agent && agent !== 'ALL') {
      filtered = filtered.filter(s => s.assignedAgent.toLowerCase().includes((agent as string).toLowerCase()));
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter(s => s.status === status);
    }
    if (customer) {
      filtered = filtered.filter(s => s.customerName.toLowerCase().includes((customer as string).toLowerCase()));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(s =>
        s.shipmentNumber.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q)
      );
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    // Hide financial margins if non-financial role
    const isFinancialRole = req.employeeUser?.role === 'manager' || req.employeeUser?.role === 'hr_admin';
    const sanitized = paginated.map(s => {
      const copy = { ...s };
      if (!isFinancialRole) {
        delete copy.internalCost;
        delete copy.marginAmount;
        delete copy.marginPercentage;
      }
      return copy;
    });

    return successRes(res, {
      shipments: sanitized,
      totalCount: filtered.length,
      page: pageNum,
      totalPages: Math.ceil(filtered.length / limitNum),
      vendorMasterList
    });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Single Shipment Detail
router.get('/shipments/:id', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const shipment = masterShipmentsStore.find(s => s.id === req.params.id || s.shipmentNumber === req.params.id);
    if (!shipment) return errorRes(res, 'Shipment record not found', 404);

    const isFinancialRole = req.employeeUser?.role === 'manager' || req.employeeUser?.role === 'hr_admin';
    const copy = { ...shipment };
    if (!isFinancialRole) {
      delete copy.internalCost;
      delete copy.marginAmount;
      delete copy.marginPercentage;
    }

    return successRes(res, { shipment: copy, isFinancialRole, vendorMasterList });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Staff Booking Form (Booking on behalf of customer)
router.post('/shipments', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const {
      customerName, customerEmail, customerPhone, branch,
      origin, destination, serviceType, cargoDetails,
      specialInstructions, billedAmount, internalCost
    } = req.body;

    if (!customerName || !origin || !destination) {
      return errorRes(res, 'Customer name, origin, and destination are required');
    }

    const idNum = Math.floor(10000 + Math.random() * 90000);
    const shipmentId = `SHP-${idNum}`;

    const billed = parseFloat(billedAmount || 100000);
    const cost = parseFloat(internalCost || 70000);
    const margin = billed - cost;
    const marginPct = `${((margin / billed) * 100).toFixed(1)}%`;

    const newShipment = {
      id: shipmentId,
      shipmentNumber: shipmentId,
      customerName,
      customerEmail: customerEmail || 'customer@company.com',
      customerPhone: customerPhone || '+91 98765 00000',
      branch: branch || 'Mumbai Central Hub',
      assignedAgent: `${req.employeeUser?.email}`,
      origin,
      destination,
      status: 'BOOKED',
      serviceType: serviceType || 'FTL Express Freight',
      cargoDetails: cargoDetails || 'Standard Palletized Goods',
      specialInstructions: specialInstructions || 'Standard dispatch policy',
      createdAt: new Date().toISOString(),
      billedAmount: billed,
      internalCost: cost,
      marginAmount: margin,
      marginPercentage: marginPct,
      vendor: vendorMasterList[0],
      legs: [
        { id: `LEG-1`, legName: 'First Mile Pickup', origin, destination: 'Hub Terminal', carrier: 'Local Express Fleet', status: 'PENDING' },
        { id: `LEG-2`, legName: 'Line-Haul Intercity', origin: 'Hub Terminal', destination, carrier: 'Trunk Transport Line', status: 'PENDING' }
      ],
      statusHistory: [
        { fromStatus: 'INIT', toStatus: 'BOOKED', timestamp: new Date().toISOString(), updatedBy: req.employeeUser?.email, remarks: 'Staff booking registered.' }
      ],
      exceptions: [],
      documents: []
    };

    masterShipmentsStore.unshift(newShipment);
    return successRes(res, newShipment, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Status State Machine Transition
router.post('/shipments/:id/status-transition', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { nextStatus, remarks } = req.body;
    const shipment = masterShipmentsStore.find(s => s.id === req.params.id);
    if (!shipment) return errorRes(res, 'Shipment not found', 404);

    const allowedTransitions: Record<string, string[]> = {
      BOOKED: ['PICKED_UP'],
      PICKED_UP: ['IN_TRANSIT'],
      IN_TRANSIT: ['CUSTOMS', 'OUT_FOR_DELIVERY'],
      CUSTOMS: ['IN_TRANSIT', 'OUT_FOR_DELIVERY'],
      OUT_FOR_DELIVERY: ['DELIVERED'],
      DELIVERED: []
    };

    const validNext = allowedTransitions[shipment.status] || [];
    if (!validNext.includes(nextStatus)) {
      return errorRes(res, `Invalid status transition from ${shipment.status} to ${nextStatus}. Allowed: [${validNext.join(', ')}]`);
    }

    const currentStatus = shipment.status;
    shipment.status = nextStatus;
    shipment.statusHistory.unshift({
      fromStatus: currentStatus,
      toStatus: nextStatus,
      timestamp: new Date().toISOString(),
      updatedBy: req.employeeUser?.email,
      remarks: remarks || `Transitioned stage to ${nextStatus}`
    });

    // Hook: Auto-generate Commercial Invoice on DELIVERED completion
    if (nextStatus === 'DELIVERED') {
      const invId = `INV-AUTO-${Math.floor(1000 + Math.random() * 9000)}`;
      const billed = shipment.billedAmount || 125000;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      const autoInvoice = {
        id: invId,
        invoiceNumber: invId,
        shipmentId: shipment.id,
        customerName: shipment.customerName,
        customerEmail: shipment.customerEmail,
        amount: billed,
        paidAmount: 0,
        balanceAmount: billed,
        status: 'UNPAID', // 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'DISPUTED'
        dueDate: dueDate.toISOString().split('T')[0],
        agingBucket: '0-30 days',
        isAutoGenerated: true,
        createdAt: new Date().toISOString()
      };

      masterInvoicesStore.unshift(autoInvoice);
    }

    return successRes(res, shipment);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Assign Carrier / Vendor
router.post('/shipments/:id/vendor-assign', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { vendorId, vehicleNumber, driverName, driverPhone } = req.body;
    const shipment = masterShipmentsStore.find(s => s.id === req.params.id);
    if (!shipment) return errorRes(res, 'Shipment not found', 404);

    const vendorObj = vendorMasterList.find(v => v.id === vendorId) || vendorMasterList[0];
    shipment.vendor = {
      id: vendorObj.id,
      name: vendorObj.name,
      vehicleNumber: vehicleNumber || vendorObj.vehicleNumber,
      driverName: driverName || vendorObj.driverName,
      driverPhone: driverPhone || vendorObj.driverPhone
    };

    return successRes(res, shipment);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Flag Exception / Escalate to Manager
router.post('/shipments/:id/exception', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { reasonCode, description, escalate } = req.body;
    const shipment = masterShipmentsStore.find(s => s.id === req.params.id);
    if (!shipment) return errorRes(res, 'Shipment not found', 404);

    const exceptionId = `EX-${Date.now().toString().slice(-4)}`;
    let escalatedTicketId = null;

    if (escalate) {
      const ticketNum = Math.floor(1000 + Math.random() * 9000);
      escalatedTicketId = `TKT-ESC-${ticketNum}`;
    }

    const newEx = {
      id: exceptionId,
      reasonCode: reasonCode || 'WEATHER_DELAY',
      description: description || 'Operational delay flagged by dispatcher.',
      escalated: !!escalate,
      escalatedTicketId,
      timestamp: new Date().toISOString()
    };

    shipment.exceptions.unshift(newEx);
    return successRes(res, shipment);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 12. QUOTATIONS MODULE (SLA QUEUE, RATE CARDS, BUILDER, APPROVALS, CONVERSION)
// ==========================================

// Rate Card Lookup Master List
const masterRateCards = [
  { id: 'RC-01', origin: 'Mumbai JNPT', destination: 'Delhi NCR Hub', mode: 'Road FTL', weightSlab: '0 - 2,500 kg', baseCost: 65000, stdRate: 90000, margin: '27.7%' },
  { id: 'RC-02', origin: 'Mumbai JNPT', destination: 'Chennai Ocean Terminal', mode: 'Ocean FCL (20ft)', weightSlab: 'Standard Container', baseCost: 110000, stdRate: 155000, margin: '29.0%' },
  { id: 'RC-03', origin: 'Bengaluru Airport', destination: 'Hyderabad Terminal', mode: 'Air Freight Express', weightSlab: '0 - 500 kg', baseCost: 45000, stdRate: 68000, margin: '33.8%' },
  { id: 'RC-04', origin: 'Pune MIDC', destination: 'Kolkata Cargo Yard', mode: 'Heavy Transport LTL', weightSlab: '2,500 kg+', baseCost: 140000, stdRate: 195000, margin: '28.2%' }
];

// Master Quotes Store
const masterQuotesStore: any[] = [];

// GET Master Quotes List (Sorted by SLA Urgency)
router.get('/quotes', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { status, search } = req.query;

    let filtered = [...masterQuotesStore];

    if (status && status !== 'ALL') {
      filtered = filtered.filter(q => q.status === status);
    }
    if (search) {
      const query = (search as string).toLowerCase();
      filtered = filtered.filter(q =>
        q.quoteNumber.toLowerCase().includes(query) ||
        q.customerName.toLowerCase().includes(query) ||
        q.lane.toLowerCase().includes(query)
      );
    }

    // Sort by SLA Urgency (CRITICAL -> HIGH -> NORMAL)
    const urgencyWeight: Record<string, number> = { CRITICAL: 1, HIGH: 2, NORMAL: 3 };
    filtered.sort((a, b) => (urgencyWeight[a.slaUrgency] || 4) - (urgencyWeight[b.slaUrgency] || 4));

    const isFinancialRole = req.employeeUser?.role === 'manager' || req.employeeUser?.role === 'hr_admin';
    const sanitized = filtered.map(q => {
      const copy = { ...q };
      if (!isFinancialRole) {
        delete copy.internalCost;
        delete copy.marginAmount;
        delete copy.marginPercentage;
      }
      return copy;
    });

    return successRes(res, {
      quotes: sanitized,
      totalCount: filtered.length,
      rateCards: masterRateCards,
      isFinancialRole
    });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Rate Cards Lookup Table
router.get('/quotes/rate-cards', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { mode, search } = req.query;
    let cards = [...masterRateCards];

    if (mode && mode !== 'ALL') {
      cards = cards.filter(c => c.mode.toLowerCase().includes((mode as string).toLowerCase()));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      cards = cards.filter(c => c.origin.toLowerCase().includes(q) || c.destination.toLowerCase().includes(q));
    }

    return successRes(res, cards);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Create Manual Quote Builder
router.post('/quotes', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const {
      customerName, customerEmail, customerPhone,
      origin, destination, mode, weight, specialHandling,
      internalCost, proposedPrice, discountPercentage
    } = req.body;

    if (!customerName || !origin || !destination || !proposedPrice) {
      return errorRes(res, 'Customer name, origin, destination, and proposed price are required');
    }

    const priceNum = parseFloat(proposedPrice);
    const costNum = parseFloat(internalCost || (priceNum * 0.7).toString());
    const discountNum = parseFloat(discountPercentage || '0');
    const margin = priceNum - costNum;
    const marginPct = `${((margin / priceNum) * 100).toFixed(1)}%`;

    // Configurable threshold: Discount > 15% requires manager approval
    const requiresApproval = discountNum > 15;
    const initialStatus = requiresApproval ? 'PENDING_APPROVAL' : 'APPROVED';

    const idNum = Math.floor(900 + Math.random() * 90);
    const quoteId = `Q-${idNum}`;

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 5); // Default 5-day expiry

    const newQuote = {
      id: quoteId,
      quoteNumber: quoteId,
      customerName,
      customerEmail: customerEmail || 'customer@company.com',
      customerPhone: customerPhone || '+91 98765 00000',
      lane: `${origin} ➔ ${destination}`,
      origin,
      destination,
      mode: mode || 'Road FTL',
      weight: weight || '1,000 kg',
      specialHandling: specialHandling || 'Standard handling',
      internalCost: costNum,
      proposedPrice: priceNum,
      discountPercentage: discountNum,
      marginAmount: margin,
      marginPercentage: marginPct,
      status: initialStatus,
      slaUrgency: requiresApproval ? 'HIGH' : 'NORMAL',
      slaTimeRemaining: '24 Hours',
      expiresAt: expiresDate.toISOString(),
      isNearExpiry: false,
      approver: requiresApproval ? 'Pending Manager Approval' : 'System Auto-Approved (Discount ≤ 15%)',
      commentsLog: [
        {
          timestamp: new Date().toISOString(),
          user: req.employeeUser?.email,
          text: `Quote created. Discount: ${discountNum}%. ${requiresApproval ? 'Sent to manager for approval.' : 'Auto-approved.'}`
        }
      ],
      conversion: null
    };

    masterQuotesStore.unshift(newQuote);
    return successRes(res, newQuote, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Manager Approval Action Workflow
router.post('/quotes/:id/approve', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { action, comments } = req.body; // action: 'APPROVE' | 'REJECT'
    const quote = masterQuotesStore.find(q => q.id === req.params.id);
    if (!quote) return errorRes(res, 'Quote not found', 404);

    if (quote.status !== 'PENDING_APPROVAL') {
      return errorRes(res, `Quote status is ${quote.status}, not PENDING_APPROVAL`);
    }

    if (action === 'APPROVE') {
      quote.status = 'APPROVED';
      quote.approver = req.employeeUser?.email;
      quote.commentsLog.unshift({
        timestamp: new Date().toISOString(),
        user: req.employeeUser?.email,
        text: `Manager Approved: ${comments || 'Discount sign-off granted.'}`
      });
    } else {
      quote.status = 'DRAFT';
      quote.commentsLog.unshift({
        timestamp: new Date().toISOString(),
        user: req.employeeUser?.email,
        text: `Manager Rejected: ${comments || 'Discount too high. Revise pricing.'}`
      });
    }

    return successRes(res, quote);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Send Quote to Customer
router.post('/quotes/:id/send', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const quote = masterQuotesStore.find(q => q.id === req.params.id);
    if (!quote) return errorRes(res, 'Quote not found', 404);

    quote.status = 'SENT';
    quote.commentsLog.unshift({
      timestamp: new Date().toISOString(),
      user: req.employeeUser?.email,
      text: `Proposal email sent to customer at ${quote.customerEmail}.`
    });

    return successRes(res, quote);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Quote-to-Booking Conversion (Mark WON)
router.post('/quotes/:id/convert-booking', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { winReason } = req.body;
    const quote = masterQuotesStore.find(q => q.id === req.params.id);
    if (!quote) return errorRes(res, 'Quote not found', 404);

    const waybillId = `SHP-CONV-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create linked shipment in masterShipmentsStore
    const newShipment = {
      id: waybillId,
      shipmentNumber: waybillId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      branch: 'Mumbai Central Hub',
      assignedAgent: req.employeeUser?.email,
      origin: quote.origin,
      destination: quote.destination,
      status: 'BOOKED',
      serviceType: quote.mode,
      cargoDetails: quote.weight,
      specialInstructions: quote.specialHandling,
      createdAt: new Date().toISOString(),
      billedAmount: quote.proposedPrice,
      internalCost: quote.internalCost,
      marginAmount: quote.marginAmount,
      marginPercentage: quote.marginPercentage,
      vendor: { id: 'VND-01', name: 'Apex Freight Transporters Ltd', vehicleNumber: 'MH-04-AB-1234', driverName: 'Rajesh Kumar', driverPhone: '+91 98765 11111' },
      legs: [
        { id: 'LEG-1', legName: 'First Mile Pickup', origin: quote.origin, destination: 'Hub Terminal', carrier: 'Express Fleet', status: 'PENDING' },
        { id: 'LEG-2', legName: 'Line-Haul Dispatch', origin: 'Hub Terminal', destination: quote.destination, carrier: 'Trunk Transport Line', status: 'PENDING' }
      ],
      statusHistory: [
        { fromStatus: 'INIT', toStatus: 'BOOKED', timestamp: new Date().toISOString(), updatedBy: req.employeeUser?.email, remarks: `Converted from Quote ${quote.quoteNumber}` }
      ],
      exceptions: [],
      documents: []
    };

    masterShipmentsStore.unshift(newShipment);

    // Update Quote status
    quote.status = 'WON';
    quote.conversion = {
      convertedToWaybill: waybillId,
      convertedAt: new Date().toISOString(),
      winReason: winReason || 'Competitive pricing & SLA assurance'
    };

    quote.commentsLog.unshift({
      timestamp: new Date().toISOString(),
      user: req.employeeUser?.email,
      text: `Quote WON! Converted to Active Shipment Booking ${waybillId}. Reason: ${quote.conversion.winReason}`
    });

    return successRes(res, { quote, shipment: newShipment });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Mark Quote LOST with Reason Code
router.post('/quotes/:id/mark-lost', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { lossReasonCode, remarks } = req.body;
    const quote = masterQuotesStore.find(q => q.id === req.params.id);
    if (!quote) return errorRes(res, 'Quote not found', 404);

    quote.status = 'LOST';
    quote.commentsLog.unshift({
      timestamp: new Date().toISOString(),
      user: req.employeeUser?.email,
      text: `Quote LOST. Reason: ${lossReasonCode || 'PRICE_TOO_HIGH'}. ${remarks || ''}`
    });

    return successRes(res, quote);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});
// ==========================================
// 13. ADVANCED DOCUMENTS MODULE (PDF AUTO-GEN, VERSION CONTROL, BULK ACTIONS, COMPLIANCE REPOSITORY)
// ==========================================

// Master Compliance Repository Store
const masterComplianceRepository = [
  { id: 'COMP-01', title: 'Customs Brokerage Operating License 2026', category: 'LICENSE', docType: 'Customs License', issuer: 'Central Board of Indirect Taxes & Customs', expiryDate: '2026-12-31', status: 'ACTIVE', fileUrl: 'https://docs.lizome.com/compliance/cb-license-2026.pdf' },
  { id: 'COMP-02', title: 'Import Export Code (IEC) Registration Certificate', category: 'REGISTRATION', docType: 'IEC Certificate', issuer: 'Directorate General of Foreign Trade (DGFT)', expiryDate: '2027-03-31', status: 'ACTIVE', fileUrl: 'https://docs.lizome.com/compliance/iec-registration.pdf' },
  { id: 'COMP-03', title: 'Global Tariff HS Code Master Mapping (Chap 84 & 85)', category: 'HS_MAPPING', docType: 'HS Code Matrix', issuer: 'World Customs Organization (WCO)', expiryDate: '2026-12-31', status: 'ACTIVE', fileUrl: 'https://docs.lizome.com/compliance/hscode-matrix.pdf' },
  { id: 'COMP-04', title: 'Hazardous Cargo Handling Certification (IMDG Code)', category: 'LICENSE', docType: 'Hazardous License', issuer: 'International Maritime Organization', expiryDate: '2026-08-15', status: 'EXPIRING_SOON', fileUrl: 'https://docs.lizome.com/compliance/hazmat-cert.pdf' }
];

// Document Status Tracker per Shipment Store
const shipmentDocumentTrackerStore: Record<string, any> = {
  'SHP-84920': [
    {
      docType: 'INVOICE',
      title: 'Freight Commercial Invoice',
      status: 'GENERATED', // 'PENDING' | 'GENERATED' | 'SIGNED'
      currentVersion: 'v2',
      lastGeneratedAt: '2026-07-20T08:35:00Z',
      lastGeneratedBy: 'employee@aura.com',
      versions: [
        { version: 'v1', generatedAt: '2026-07-20T08:35:00Z', generatedBy: 'employee@aura.com', reason: 'Initial PDF generation from shipment record.' },
        { version: 'v2', generatedAt: '2026-07-21T10:00:00Z', generatedBy: 'employee@aura.com', reason: 'Reprinted with updated GST tax breakdown.' }
      ]
    },
    {
      docType: 'BILL_OF_LADING',
      title: 'Ocean Bill of Lading (BoL)',
      status: 'SIGNED',
      currentVersion: 'v1',
      lastGeneratedAt: '2026-07-20T09:00:00Z',
      lastGeneratedBy: 'Port Officer V. Sharma',
      versions: [
        { version: 'v1', generatedAt: '2026-07-20T09:00:00Z', generatedBy: 'Port Officer V. Sharma', reason: 'Port master signed electronic Bill of Lading.' }
      ]
    },
    {
      docType: 'PROOF_OF_DELIVERY',
      title: 'Proof of Delivery (POD)',
      status: 'PENDING',
      currentVersion: 'v0',
      lastGeneratedAt: null,
      lastGeneratedBy: null,
      versions: []
    },
    {
      docType: 'EWAY_BILL',
      title: 'National E-Way Bill Manifest',
      status: 'GENERATED',
      currentVersion: 'v1',
      lastGeneratedAt: '2026-07-20T09:15:00Z',
      lastGeneratedBy: 'employee@aura.com',
      versions: [
        { version: 'v1', generatedAt: '2026-07-20T09:15:00Z', generatedBy: 'employee@aura.com', reason: 'Generated via GST portal API integration.' }
      ]
    },
    {
      docType: 'CUSTOMS_DOC',
      title: 'Customs Entry Clearance Declaration',
      status: 'GENERATED',
      currentVersion: 'v1',
      lastGeneratedAt: '2026-07-21T09:15:00Z',
      lastGeneratedBy: 'employee@aura.com',
      versions: [
        { version: 'v1', generatedAt: '2026-07-21T09:15:00Z', generatedBy: 'employee@aura.com', reason: 'Inspection clearance declaration generated.' }
      ]
    }
  ]
};

// GET Document Status Tracker for a Shipment
router.get('/documents/shipment/:id', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const shipmentId = req.params.id;
    let tracker = shipmentDocumentTrackerStore[shipmentId];

    if (!tracker) {
      // Initialize default tracker for new shipment
      tracker = [
        { docType: 'INVOICE', title: 'Freight Commercial Invoice', status: 'GENERATED', currentVersion: 'v1', lastGeneratedAt: new Date().toISOString(), lastGeneratedBy: req.employeeUser?.email, versions: [{ version: 'v1', generatedAt: new Date().toISOString(), generatedBy: req.employeeUser?.email, reason: 'Auto-generated on booking' }] },
        { docType: 'BILL_OF_LADING', title: 'Bill of Lading / Consignment Note', status: 'PENDING', currentVersion: 'v0', lastGeneratedAt: null, lastGeneratedBy: null, versions: [] },
        { docType: 'PROOF_OF_DELIVERY', title: 'Proof of Delivery (POD)', status: 'PENDING', currentVersion: 'v0', lastGeneratedAt: null, lastGeneratedBy: null, versions: [] },
        { docType: 'EWAY_BILL', title: 'National E-Way Bill Manifest', status: 'GENERATED', currentVersion: 'v1', lastGeneratedAt: new Date().toISOString(), lastGeneratedBy: req.employeeUser?.email, versions: [{ version: 'v1', generatedAt: new Date().toISOString(), generatedBy: req.employeeUser?.email, reason: 'Generated on dispatch' }] },
        { docType: 'CUSTOMS_DOC', title: 'Customs Entry Clearance Declaration', status: 'PENDING', currentVersion: 'v0', lastGeneratedAt: null, lastGeneratedBy: null, versions: [] }
      ];
      shipmentDocumentTrackerStore[shipmentId] = tracker;
    }

    return successRes(res, tracker);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Auto-Generate Standard Document with Version Control Log
router.post('/documents/generate', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { shipmentId, docType, reasonForReprint } = req.body;
    const shipment = masterShipmentsStore.find(s => s.id === shipmentId);
    if (!shipment) return errorRes(res, 'Shipment not found', 404);

    let tracker = shipmentDocumentTrackerStore[shipmentId];
    if (!tracker) {
      tracker = [];
      shipmentDocumentTrackerStore[shipmentId] = tracker;
    }

    let docItem = tracker.find((d: any) => d.docType === docType);
    if (!docItem) {
      docItem = {
        docType,
        title: `${docType.replace('_', ' ')} Document`,
        status: 'GENERATED',
        currentVersion: 'v0',
        lastGeneratedAt: null,
        lastGeneratedBy: null,
        versions: []
      };
      tracker.push(docItem);
    }

    // Version control increment
    const currentVerNum = parseInt(docItem.currentVersion.replace('v', '') || '0', 10);
    const newVersion = `v${currentVerNum + 1}`;

    const auditLog = {
      version: newVersion,
      generatedAt: new Date().toISOString(),
      generatedBy: req.employeeUser?.email,
      reason: reasonForReprint || (currentVerNum === 0 ? 'Initial PDF generation from shipment record.' : 'Reprinted / Amended PDF generation.')
    };

    docItem.currentVersion = newVersion;
    docItem.status = docType === 'BILL_OF_LADING' ? 'SIGNED' : 'GENERATED';
    docItem.lastGeneratedAt = new Date().toISOString();
    docItem.lastGeneratedBy = req.employeeUser?.email;
    docItem.versions.unshift(auditLog);

    return successRes(res, { docItem, shipment });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Bulk Document Action Job (Batch Generation & Zip Bundle)
router.post('/documents/bulk-job', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { shipmentIds, docTypes } = req.body;
    if (!shipmentIds || !Array.isArray(shipmentIds) || shipmentIds.length === 0) {
      return errorRes(res, 'At least one shipment must be selected for bulk generation');
    }

    const jobId = `JOB-BULK-${Math.floor(1000 + Math.random() * 9000)}`;
    const zipUrl = `https://docs.lizome.com/downloads/bulk_manifest_${jobId}.zip`;

    return successRes(res, {
      jobId,
      status: 'COMPLETED',
      totalShipmentsProcessed: shipmentIds.length,
      generatedDocumentsCount: shipmentIds.length * (docTypes?.length || 2),
      downloadZipUrl: zipUrl,
      completedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Compliance Repository Documents
router.get('/documents/compliance', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { category, search } = req.query;
    let docs = [...masterComplianceRepository];

    if (category && category !== 'ALL') {
      docs = docs.filter(d => d.category === category);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      docs = docs.filter(d => d.title.toLowerCase().includes(q) || d.issuer.toLowerCase().includes(q));
    }

    return successRes(res, docs);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Upload Compliance Document / HS Mapping
router.post('/documents/compliance', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { title, category, docType, issuer, expiryDate, fileUrl } = req.body;
    if (!title || !category) return errorRes(res, 'Title and category are required');

    const newComp = {
      id: `COMP-${Math.floor(10 + Math.random() * 90)}`,
      title,
      category,
      docType: docType || 'Compliance Record',
      issuer: issuer || 'Regulatory Authority',
      expiryDate: expiryDate || '2026-12-31',
      status: 'ACTIVE',
      fileUrl: fileUrl || 'https://docs.lizome.com/compliance/sample-compliance.pdf'
    };

    masterComplianceRepository.unshift(newComp);
    return successRes(res, newComp, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});
// ==========================================
// 14. BILLING MODULE (AUTO-GEN, CREDIT CONTROL, RECONCILIATION, DISPUTES, LEDGER, RECURRING)
// ==========================================

// Master Invoices Store
const masterInvoicesStore: any[] = [];

// Customer Credit Control Master Data
const masterCreditControlData: any[] = [];

// Master Customer Running Ledgers
const masterCustomerLedgersStore: Record<string, any[]> = {};

// Recurring Billing Contracts Store
const masterRecurringContracts: any[] = [];

// GET Master Invoices List
router.get('/billing/invoices', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { status, search } = req.query;
    let filtered = [...masterInvoicesStore];

    if (status && status !== 'ALL') {
      filtered = filtered.filter(i => i.status === status);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(i =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q) ||
        i.shipmentId.toLowerCase().includes(q)
      );
    }

    return successRes(res, filtered);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Manual Invoice Creation / Edge Case Adjustment
router.post('/billing/invoices', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { customerName, shipmentId, amount, dueDate, itemsDescription } = req.body;
    if (!customerName || !amount) return errorRes(res, 'Customer name and amount are required');

    const invNum = `INV-MAN-${Math.floor(1000 + Math.random() * 9000)}`;
    const amtNum = parseFloat(amount);

    const newInv = {
      id: invNum,
      invoiceNumber: invNum,
      shipmentId: shipmentId || 'N/A',
      customerName,
      customerEmail: 'finance@customer.com',
      amount: amtNum,
      paidAmount: 0,
      balanceAmount: amtNum,
      status: 'UNPAID',
      dueDate: dueDate || '2026-08-15',
      agingBucket: '0-30 days',
      isAutoGenerated: false,
      createdAt: new Date().toISOString(),
      items: [
        { description: itemsDescription || 'Manual Freight Invoice Adjustment', quantity: 1, unitPrice: amtNum, total: amtNum }
      ]
    };

    masterInvoicesStore.unshift(newInv);
    return successRes(res, newInv, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Credit Control Dashboard & Overdue Aging Buckets
router.get('/billing/credit-control', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    // Calculate aggregate aging buckets
    const aggregateAging = {
      days0_30: masterCreditControlData.reduce((acc, c) => acc + c.agingBuckets.days0_30, 0),
      days30_60: masterCreditControlData.reduce((acc, c) => acc + c.agingBuckets.days30_60, 0),
      days60_90Plus: masterCreditControlData.reduce((acc, c) => acc + c.agingBuckets.days60_90Plus, 0)
    };

    const totalOutstanding = aggregateAging.days0_30 + aggregateAging.days30_60 + aggregateAging.days60_90Plus;

    return successRes(res, {
      aggregateAging,
      totalOutstanding,
      formattedTotalOutstanding: `₹${totalOutstanding.toLocaleString()}`,
      customers: masterCreditControlData
    });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Payment Reconciliation (Matching Incoming Payments against Open Invoices)
router.post('/billing/reconcile', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { invoiceNumber, paymentAmount, paymentReference, paymentMethod } = req.body;
    const inv = masterInvoicesStore.find(i => i.invoiceNumber === invoiceNumber || i.id === invoiceNumber);
    if (!inv) return errorRes(res, 'Invoice not found', 404);

    const payNum = parseFloat(paymentAmount || '0');
    if (payNum <= 0) return errorRes(res, 'Payment amount must be greater than 0');

    inv.paidAmount += payNum;
    inv.balanceAmount = Math.max(0, inv.amount - inv.paidAmount);

    if (inv.balanceAmount === 0) {
      inv.status = 'PAID';
    } else {
      inv.status = 'PARTIALLY_PAID';
    }

    // Record in Customer Ledger
    if (!masterCustomerLedgersStore[inv.customerName]) {
      masterCustomerLedgersStore[inv.customerName] = [];
    }

    const ledger = masterCustomerLedgersStore[inv.customerName];
    const lastBal = ledger.length > 0 ? ledger[ledger.length - 1].runningBalance : inv.amount;

    ledger.push({
      date: new Date().toISOString().split('T')[0],
      type: 'PAYMENT',
      reference: paymentReference || `PAY-${Date.now().toString().slice(-4)}`,
      description: `Reconciled Payment via ${paymentMethod || 'NEFT'} for ${inv.invoiceNumber}`,
      debit: 0,
      credit: payNum,
      runningBalance: Math.max(0, lastBal - payNum)
    });

    return successRes(res, inv);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Disputes Queue
router.get('/billing/disputes', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    const disputes = masterInvoicesStore.filter(i => i.status === 'DISPUTED');
    return successRes(res, disputes);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Resolve Dispute
router.post('/billing/disputes/:id/resolve', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { resolutionAction, resolutionNote, revisedAmount } = req.body;
    const inv = masterInvoicesStore.find(i => i.id === req.params.id || i.invoiceNumber === req.params.id);
    if (!inv) return errorRes(res, 'Disputed invoice not found', 404);

    if (resolutionAction === 'ADJUST_AMOUNT' && revisedAmount) {
      const newAmt = parseFloat(revisedAmount);
      inv.amount = newAmt;
      inv.balanceAmount = Math.max(0, newAmt - inv.paidAmount);
    }

    inv.status = inv.paidAmount > 0 ? 'PARTIALLY_PAID' : 'UNPAID';
    inv.disputeStatus = 'RESOLVED';
    inv.resolutionNote = resolutionNote || 'Dispute resolved by billing officer.';

    return successRes(res, inv);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Customer Ledger Account Statement
router.get('/billing/customer-ledger/:customerName', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const customerName = decodeURIComponent(req.params.customerName);
    const ledger = masterCustomerLedgersStore[customerName] || [
      { date: new Date().toISOString().split('T')[0], type: 'INVOICE', reference: 'INV-INIT', description: 'Opening Account Balance', debit: 0, credit: 0, runningBalance: 0 }
    ];

    return successRes(res, { customerName, ledger });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Recurring Billing Contracts List
router.get('/billing/recurring-contracts', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    return successRes(res, masterRecurringContracts);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Create Recurring Billing Contract / Auto-Generate Monthly Consolidated Invoice
router.post('/billing/recurring-contracts', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { customerName, billingCycle, monthlyRetainer, includedWaybills } = req.body;
    if (!customerName || !monthlyRetainer) return errorRes(res, 'Customer name and retainer amount required');

    const contractId = `REC-${Math.floor(100 + Math.random() * 900)}`;
    const retainerNum = parseFloat(monthlyRetainer);

    const newContract = {
      id: contractId,
      contractNumber: contractId,
      customerName,
      billingCycle: billingCycle || 'Monthly (1st of month)',
      monthlyRetainer: retainerNum,
      includedWaybills: includedWaybills || 'Standard FTL freight allocation',
      status: 'ACTIVE',
      nextInvoiceDate: '2026-08-01',
      autoGenerateConsolidated: true,
      lastConsolidatedInvoice: 'INV-NEW-MONTHLY'
    };

    masterRecurringContracts.unshift(newContract);
    return successRes(res, newContract, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 15. CLAIMS & INSURANCE MODULE (INTAKE, INVESTIGATION, INSURANCE, APPROVALS, AGING REPORT)
// ==========================================

// Master Claims Store
const masterClaimsStore: any[] = [];

// GET Master Claims List
router.get('/claims', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { status, search } = req.query;
    let filtered = [...masterClaimsStore];

    if (status && status !== 'ALL') {
      filtered = filtered.filter(c => c.status === status);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(c =>
        c.claimNumber.toLowerCase().includes(q) ||
        c.shipmentId.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q)
      );
    }

    return successRes(res, filtered);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Claims Aging Report (Grouped by Status & Investigator, Stale Flags)
router.get('/claims/aging-report', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    const openClaims = masterClaimsStore.filter(c => c.status !== 'SETTLED' && c.status !== 'DENIED');

    const groupedByStatus: Record<string, any[]> = {};
    const groupedByInvestigator: Record<string, any[]> = {};

    openClaims.forEach(c => {
      // Group by Status
      if (!groupedByStatus[c.status]) groupedByStatus[c.status] = [];
      groupedByStatus[c.status].push(c);

      // Group by Investigator
      const inv = c.investigator || 'Unassigned';
      if (!groupedByInvestigator[inv]) groupedByInvestigator[inv] = [];
      groupedByInvestigator[inv].push(c);
    });

    const staleClaims = openClaims.filter(c => c.daysOpen > 14);

    return successRes(res, {
      totalOpenClaims: openClaims.length,
      staleClaimsCount: staleClaims.length,
      staleClaims,
      groupedByStatus,
      groupedByInvestigator
    });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Single Claim Detail
router.get('/claims/:id', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const claim = masterClaimsStore.find(c => c.id === req.params.id || c.claimNumber === req.params.id);
    if (!claim) return errorRes(res, 'Claim record not found', 404);

    return successRes(res, claim);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Claim Intake Form
router.post('/claims', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { shipmentId, damageType, description, claimedAmount, photoUrl } = req.body;
    if (!shipmentId || !claimedAmount) return errorRes(res, 'Shipment ID and claimed amount are required');

    const shipment = masterShipmentsStore.find(s => s.id === shipmentId || s.shipmentNumber === shipmentId);

    const clmId = `CLM-2026-${Math.floor(10 + Math.random() * 90)}`;
    const amtNum = parseFloat(claimedAmount);

    const newClaim = {
      id: clmId,
      claimNumber: clmId,
      shipmentId,
      customerName: shipment?.customerName || 'Customer Enterprise',
      damageType: damageType || 'CARGO_DAMAGE',
      description: description || 'Damage reported upon unsealing.',
      claimedAmount: amtNum,
      status: 'INTAKE',
      investigator: 'Unassigned',
      liabilityDetermination: 'UNCLEAR',
      internalNotes: [
        { timestamp: new Date().toISOString(), author: req.employeeUser?.email, text: 'Claim intake registered.' }
      ],
      insurance: {
        policyReference: 'INS-POL-PENDING',
        providerName: 'Cargo Insurance Provider',
        submittedDate: new Date().toISOString().split('T')[0],
        settlementStatus: 'SUBMITTED',
        settlementAmount: 0
      },
      photoUrls: photoUrl ? [photoUrl] : [],
      requiresSeniorApproval: amtNum > 50000,
      approverSignoff: null,
      daysOpen: 1,
      isStale: false,
      createdAt: new Date().toISOString()
    };

    masterClaimsStore.unshift(newClaim);
    return successRes(res, newClaim, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Update Investigation & Liability Determination
router.post('/claims/:id/investigate', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { investigator, liabilityDetermination, internalNote } = req.body;
    const claim = masterClaimsStore.find(c => c.id === req.params.id || c.claimNumber === req.params.id);
    if (!claim) return errorRes(res, 'Claim not found', 404);

    if (investigator) claim.investigator = investigator;
    if (liabilityDetermination) claim.liabilityDetermination = liabilityDetermination;

    if (internalNote) {
      claim.internalNotes.unshift({
        timestamp: new Date().toISOString(),
        author: req.employeeUser?.email,
        text: internalNote
      });
    }

    claim.status = 'UNDER_INVESTIGATION';
    return successRes(res, claim);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Update Insurance Provider Tracking
router.post('/claims/:id/insurance', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { policyReference, providerName, settlementStatus, settlementAmount } = req.body;
    const claim = masterClaimsStore.find(c => c.id === req.params.id || c.claimNumber === req.params.id);
    if (!claim) return errorRes(res, 'Claim not found', 404);

    claim.insurance = {
      policyReference: policyReference || claim.insurance?.policyReference,
      providerName: providerName || claim.insurance?.providerName,
      submittedDate: claim.insurance?.submittedDate || new Date().toISOString().split('T')[0],
      settlementStatus: settlementStatus || claim.insurance?.settlementStatus,
      settlementAmount: settlementAmount ? parseFloat(settlementAmount) : claim.insurance?.settlementAmount
    };

    if (claim.requiresSeniorApproval && claim.status !== 'APPROVED') {
      claim.status = 'PENDING_APPROVAL';
    }

    return successRes(res, claim);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Senior Role Approval Sign-off for Payout / Closure
router.post('/claims/:id/approve', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { action, comments } = req.body; // action: 'APPROVE' | 'DENY'
    const claim = masterClaimsStore.find(c => c.id === req.params.id || c.claimNumber === req.params.id);
    if (!claim) return errorRes(res, 'Claim not found', 404);

    if (action === 'APPROVE') {
      claim.status = 'SETTLED';
      claim.approverSignoff = req.employeeUser?.email;
      claim.internalNotes.unshift({
        timestamp: new Date().toISOString(),
        author: req.employeeUser?.email,
        text: `Senior Approval Granted: Payout sign-off approved. ${comments || ''}`
      });
    } else {
      claim.status = 'DENIED';
      claim.approverSignoff = req.employeeUser?.email;
      claim.internalNotes.unshift({
        timestamp: new Date().toISOString(),
        author: req.employeeUser?.email,
        text: `Senior Decision: Claim Denied. ${comments || ''}`
      });
    }

    return successRes(res, claim);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 16. REVERSE LOGISTICS & RETURNS MODULE (INTAKE, REVERSE PICKUP, TRACKING, CREDIT NOTE HOOK)
// ==========================================

// Master Returns Store
const masterReturnsStore: any[] = [];

// GET Master Returns List
router.get('/returns', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { status, search } = req.query;
    let filtered = [...masterReturnsStore];

    if (status && status !== 'ALL') {
      filtered = filtered.filter(r => r.status === status);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(r =>
        r.returnNumber.toLowerCase().includes(q) ||
        r.shipmentId.toLowerCase().includes(q) ||
        r.invoiceId.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q)
      );
    }

    return successRes(res, filtered);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Single Return Detail
router.get('/returns/:id', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const ret = masterReturnsStore.find(r => r.id === req.params.id || r.returnNumber === req.params.id);
    if (!ret) return errorRes(res, 'Return record not found', 404);

    return successRes(res, { returnRecord: ret, vendorMasterList });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Return Request Intake Form (Linked to Shipment & Invoice)
router.post('/returns', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { shipmentId, invoiceId, reasonCode, description, returnValue } = req.body;
    if (!shipmentId || !returnValue) return errorRes(res, 'Original shipment ID and return value required');

    const shipment = masterShipmentsStore.find(s => s.id === shipmentId || s.shipmentNumber === shipmentId);
    const invoice = masterInvoicesStore.find(i => i.shipmentId === shipmentId || i.invoiceNumber === invoiceId);

    const retId = `RET-2026-${Math.floor(10 + Math.random() * 90)}`;
    const retVal = parseFloat(returnValue);

    const newReturn = {
      id: retId,
      returnNumber: retId,
      shipmentId,
      invoiceId: invoice?.invoiceNumber || invoiceId || 'INV-MANUAL',
      customerName: shipment?.customerName || 'Customer Enterprise',
      reasonCode: reasonCode || 'WRONG_ITEM',
      description: description || 'Return intake initiated by staff.',
      returnValue: retVal,
      status: 'RETURN_REQUESTED',
      reverseWaybill: `WB-REV-${Math.floor(1000 + Math.random() * 9000)}`,
      reverseCarrier: {
        id: vendorMasterList[0].id,
        name: vendorMasterList[0].name,
        vehicleNumber: vendorMasterList[0].vehicleNumber,
        driverName: vendorMasterList[0].driverName,
        pickupScheduledAt: new Date().toISOString()
      },
      statusHistory: [
        { fromStatus: 'INIT', toStatus: 'RETURN_REQUESTED', timestamp: new Date().toISOString(), updatedBy: req.employeeUser?.email, remarks: 'Return request intake logged.' }
      ],
      linkedCreditNote: null,
      createdAt: new Date().toISOString()
    };

    masterReturnsStore.unshift(newReturn);
    return successRes(res, newReturn, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Reverse Logistics Pickup Booking
router.post('/returns/:id/reverse-booking', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { vendorId, pickupDate, vehicleNumber, driverName } = req.body;
    const ret = masterReturnsStore.find(r => r.id === req.params.id || r.returnNumber === req.params.id);
    if (!ret) return errorRes(res, 'Return record not found', 404);

    const vendorObj = vendorMasterList.find(v => v.id === vendorId) || vendorMasterList[0];

    ret.reverseCarrier = {
      id: vendorObj.id,
      name: vendorObj.name,
      vehicleNumber: vehicleNumber || vendorObj.vehicleNumber,
      driverName: driverName || vendorObj.driverName,
      pickupScheduledAt: pickupDate || new Date().toISOString()
    };

    return successRes(res, ret);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Return Status State Machine Transition & Credit Note Hook on REFUNDED
router.post('/returns/:id/status-transition', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { nextStatus, remarks } = req.body;
    const ret = masterReturnsStore.find(r => r.id === req.params.id || r.returnNumber === req.params.id);
    if (!ret) return errorRes(res, 'Return record not found', 404);

    const allowedTransitions: Record<string, string[]> = {
      RETURN_REQUESTED: ['PICKED_UP'],
      PICKED_UP: ['IN_TRANSIT'],
      IN_TRANSIT: ['RECEIVED'],
      RECEIVED: ['INSPECTED'],
      INSPECTED: ['REFUNDED', 'REPLACED'],
      REFUNDED: [],
      REPLACED: []
    };

    const validNext = allowedTransitions[ret.status] || [];
    if (!validNext.includes(nextStatus)) {
      return errorRes(res, `Invalid return status transition from ${ret.status} to ${nextStatus}. Allowed: [${validNext.join(', ')}]`);
    }

    const currentStatus = ret.status;
    ret.status = nextStatus;
    ret.statusHistory.unshift({
      fromStatus: currentStatus,
      toStatus: nextStatus,
      timestamp: new Date().toISOString(),
      updatedBy: req.employeeUser?.email,
      remarks: remarks || `Transitioned return stage to ${nextStatus}`
    });

    // Hook: On REFUNDED status, auto-generate Credit Note and post to Customer Account Ledger
    if (nextStatus === 'REFUNDED') {
      const cnNumber = `CN-AUTO-${Math.floor(1000 + Math.random() * 9000)}`;

      ret.linkedCreditNote = {
        creditNoteNumber: cnNumber,
        amount: ret.returnValue,
        issuedAt: new Date().toISOString()
      };

      // Post Credit Note entry directly to Customer Account Ledger
      if (!masterCustomerLedgersStore[ret.customerName]) {
        masterCustomerLedgersStore[ret.customerName] = [];
      }

      const ledger = masterCustomerLedgersStore[ret.customerName];
      const lastBal = ledger.length > 0 ? ledger[ledger.length - 1].runningBalance : 0;

      ledger.push({
        date: new Date().toISOString().split('T')[0],
        type: 'CREDIT_NOTE',
        reference: cnNumber,
        description: `Credit Note issued for Return ${ret.returnNumber} (Waybill ${ret.shipmentId})`,
        debit: 0,
        credit: ret.returnValue,
        runningBalance: Math.max(0, lastBal - ret.returnValue)
      });
    }

    return successRes(res, ret);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 17. SUPPORT TICKETS & SLA ESCALATION MODULE (QUEUE, DUAL REPLIES, CANNED RESPONSES, CLAIMS AUTO-ROUTING)
// ==========================================

// Canned Responses Library
const masterCannedResponsesStore: any[] = [
  {
    id: 'CR-01',
    category: 'TRACKING_QUERY',
    title: 'Standard Transit Update',
    templateText: 'Dear Customer, your shipment is currently in transit corridor and scheduled for delivery per SLA. You can view real-time GPS tracking on your customer portal.'
  },
  {
    id: 'CR-02',
    category: 'BILLING_QUERY',
    title: 'Invoice Discrepancy Audit Initiated',
    templateText: 'Dear Customer, we have received your invoice discrepancy note and initiated an audit with our Finance desk. A credit note or revised statement will be posted within 24 hours.'
  },
  {
    id: 'CR-03',
    category: 'DAMAGE_REPORT',
    title: 'Cargo Damage Claim Escalation',
    templateText: 'Dear Customer, we regret the damage reported upon unsealing. This ticket has been auto-routed to our Claims & Insurance Department. A Claims Officer will contact you shortly.'
  }
];

// Master Support Tickets Store
const masterTicketsStore: any[] = [];

// GET Master Support Tickets Queue
router.get('/tickets', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { category, assignedView, search } = req.query;
    let filtered = [...masterTicketsStore];

    if (category && category !== 'ALL') {
      filtered = filtered.filter(t => t.category === category);
    }
    if (assignedView === 'UNASSIGNED') {
      filtered = filtered.filter(t => t.assignedTo === 'Unassigned' || !t.assignedTo);
    } else if (assignedView === 'ASSIGNED_TO_ME') {
      filtered = filtered.filter(t => t.assignedTo !== 'Unassigned');
    } else if (assignedView === 'OVERDUE_SLA') {
      filtered = filtered.filter(t => t.isSlaBreached || t.slaHoursRemaining <= 0);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(t =>
        t.ticketNumber.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.shipmentId.toLowerCase().includes(q)
      );
    }

    return successRes(res, filtered);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Canned Response Templates
router.get('/tickets/canned-responses', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    return successRes(res, masterCannedResponsesStore);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Create New Canned Response Template
router.post('/tickets/canned-responses', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { category, title, templateText } = req.body;
    if (!title || !templateText) return errorRes(res, 'Title and template text required');

    const newTemplate = {
      id: `CR-${Math.floor(10 + Math.random() * 90)}`,
      category: category || 'GENERAL',
      title,
      templateText
    };

    masterCannedResponsesStore.push(newTemplate);
    return successRes(res, newTemplate, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Single Ticket Detail Workspace
router.get('/tickets/:id', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const ticket = masterTicketsStore.find(t => t.id === req.params.id || t.ticketNumber === req.params.id);
    if (!ticket) return errorRes(res, 'Ticket not found', 404);

    return successRes(res, { ticket, cannedResponses: masterCannedResponsesStore });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Add Reply to Ticket (Dual Modes: CUSTOMER_REPLY vs INTERNAL_NOTE)
router.post('/tickets/:id/reply', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { messageType, text } = req.body; // messageType: 'CUSTOMER_REPLY' | 'INTERNAL_NOTE'
    if (!text) return errorRes(res, 'Reply content required');

    const ticket = masterTicketsStore.find(t => t.id === req.params.id || t.ticketNumber === req.params.id);
    if (!ticket) return errorRes(res, 'Ticket not found', 404);

    const newMsg = {
      id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
      type: messageType === 'INTERNAL_NOTE' ? 'INTERNAL_NOTE' : 'STAFF_REPLY',
      author: req.employeeUser?.email || 'Support Agent',
      timestamp: new Date().toISOString(),
      text
    };

    ticket.messages.push(newMsg);
    if (messageType === 'CUSTOMER_REPLY' && ticket.status === 'OPEN') {
      ticket.status = 'IN_PROGRESS';
    }

    return successRes(res, ticket);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Assign Ticket
router.post('/tickets/:id/assign', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { assignedTo } = req.body;
    const ticket = masterTicketsStore.find(t => t.id === req.params.id || t.ticketNumber === req.params.id);
    if (!ticket) return errorRes(res, 'Ticket not found', 404);

    ticket.assignedTo = assignedTo || req.employeeUser?.email;
    return successRes(res, ticket);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Auto-Route Damage Report Ticket to Claims Module (Creates linked claim)
router.post('/tickets/:id/route-to-claim', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const ticket = masterTicketsStore.find(t => t.id === req.params.id || t.ticketNumber === req.params.id);
    if (!ticket) return errorRes(res, 'Ticket not found', 404);

    const claimId = `CLM-2026-${Math.floor(10 + Math.random() * 90)}`;

    const newClaim = {
      id: claimId,
      claimNumber: claimId,
      shipmentId: ticket.shipmentId || 'SHP-84920',
      customerName: ticket.customerName,
      damageType: 'CARGO_DAMAGE',
      description: `Auto-routed from Ticket ${ticket.ticketNumber}: ${ticket.subject}`,
      claimedAmount: 75000,
      status: 'INTAKE',
      investigator: 'Unassigned',
      liabilityDetermination: 'UNCLEAR',
      internalNotes: [
        { timestamp: new Date().toISOString(), author: req.employeeUser?.email, text: `Claim auto-created from Support Ticket ${ticket.ticketNumber}.` }
      ],
      insurance: {
        policyReference: 'INS-POL-PENDING',
        providerName: 'Cargo Insurance Provider',
        submittedDate: new Date().toISOString().split('T')[0],
        settlementStatus: 'SUBMITTED',
        settlementAmount: 0
      },
      photoUrls: [],
      requiresSeniorApproval: true,
      approverSignoff: null,
      daysOpen: 1,
      isStale: false,
      createdAt: new Date().toISOString()
    };

    masterClaimsStore.unshift(newClaim);

    ticket.linkedClaimId = claimId;
    ticket.status = 'ROUTED_TO_CLAIMS';
    ticket.messages.push({
      id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
      type: 'INTERNAL_NOTE',
      author: req.employeeUser?.email,
      timestamp: new Date().toISOString(),
      text: `SYSTEM AUTO-ROUTING: Ticket routed to Claims & Insurance Module. Created Claim Record: ${claimId}.`
    });

    return successRes(res, { ticket, createdClaim: newClaim });
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Auto-Escalate Ticket on SLA Breach
router.post('/tickets/:id/escalate', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const ticket = masterTicketsStore.find(t => t.id === req.params.id || t.ticketNumber === req.params.id);
    if (!ticket) return errorRes(res, 'Ticket not found', 404);

    ticket.isEscalated = true;
    ticket.escalatedTo = 'Mohan Manager';
    ticket.status = 'ESCALATED';
    ticket.messages.push({
      id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
      type: 'INTERNAL_NOTE',
      author: 'SYSTEM_SLA_MONITOR',
      timestamp: new Date().toISOString(),
      text: `SLA BREACH ALERT: Ticket exceeded SLA resolution window. Auto-escalated to Senior Operations Manager (Mohan Manager).`
    });

    return successRes(res, ticket);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// 18. ADMIN & SETTINGS MODULE (ROLES & PERMISSIONS, BRANCHES, RATE CARDS, MASTERS, AUDIT LOGS)
// ==========================================

// Master System Roles & Permission Matrix Store
const masterRolePermissionsStore: Record<string, any> = {
  Sales: {
    roleName: 'Sales',
    description: 'Sales & Business Development Team',
    modulePermissions: {
      dashboard: { view: true, edit: false },
      shipments: { view: true, edit: true, approve: false },
      quotes: { view: true, edit: true, approve: true },
      billing: { view: false, edit: false, approve: false },
      claims: { view: true, edit: false, approve: false },
      returns: { view: true, edit: false, approve: false },
      support: { view: true, edit: false, approve: false },
      settings: { view: false, edit: false, approve: false }
    },
    approvalAuthority: {
      quoteDiscountMaxPercent: 15,
      claimPayoutMaxAmount: 0,
      creditLimitOverride: false
    }
  },
  Ops: {
    roleName: 'Ops',
    description: 'Logistics Operations & Fleet Dispatch',
    modulePermissions: {
      dashboard: { view: true, edit: true },
      shipments: { view: true, edit: true, approve: true },
      quotes: { view: true, edit: false, approve: false },
      billing: { view: true, edit: false, approve: false },
      claims: { view: true, edit: true, approve: false },
      returns: { view: true, edit: true, approve: true },
      support: { view: true, edit: true, approve: false },
      settings: { view: false, edit: false, approve: false }
    },
    approvalAuthority: {
      quoteDiscountMaxPercent: 0,
      claimPayoutMaxAmount: 50000,
      creditLimitOverride: false
    }
  },
  Finance: {
    roleName: 'Finance',
    description: 'Accounts, Credit Control & Invoicing',
    modulePermissions: {
      dashboard: { view: true, edit: true },
      shipments: { view: true, edit: false, approve: false },
      quotes: { view: true, edit: false, approve: true },
      billing: { view: true, edit: true, approve: true },
      claims: { view: true, edit: true, approve: true },
      returns: { view: true, edit: true, approve: true },
      support: { view: true, edit: false, approve: false },
      settings: { view: false, edit: false, approve: false }
    },
    approvalAuthority: {
      quoteDiscountMaxPercent: 25,
      claimPayoutMaxAmount: 200000,
      creditLimitOverride: true
    }
  },
  Support: {
    roleName: 'Support',
    description: 'Customer Care & Ticket Desk Agent',
    modulePermissions: {
      dashboard: { view: true, edit: false },
      shipments: { view: true, edit: false, approve: false },
      quotes: { view: true, edit: false, approve: false },
      billing: { view: false, edit: false, approve: false },
      claims: { view: true, edit: false, approve: false },
      returns: { view: true, edit: false, approve: false },
      support: { view: true, edit: true, approve: true },
      settings: { view: false, edit: false, approve: false }
    },
    approvalAuthority: {
      quoteDiscountMaxPercent: 0,
      claimPayoutMaxAmount: 0,
      creditLimitOverride: false
    }
  },
  Admin: {
    roleName: 'Admin',
    description: 'System Administrator & Superuser',
    modulePermissions: {
      dashboard: { view: true, edit: true },
      shipments: { view: true, edit: true, approve: true },
      quotes: { view: true, edit: true, approve: true },
      billing: { view: true, edit: true, approve: true },
      claims: { view: true, edit: true, approve: true },
      returns: { view: true, edit: true, approve: true },
      support: { view: true, edit: true, approve: true },
      settings: { view: true, edit: true, approve: true }
    },
    approvalAuthority: {
      quoteDiscountMaxPercent: 100,
      claimPayoutMaxAmount: 10000000,
      creditLimitOverride: true
    }
  }
};

// Master Branch & Hub Mapping Store
const masterBranchesStore: any[] = [
  {
    id: 'BR-01',
    branchCode: 'BHW-01',
    branchName: 'Bhiwandi Central Logistics Hub',
    city: 'Mumbai / Bhiwandi',
    address: 'Bhiwandi Warehousing Park, Sector 4, Thane, MH',
    hubMapping: ['JNPT Port Terminal', 'Bandra Express Yard', 'Pune Chakan Yard'],
    isActive: true
  },
  {
    id: 'BR-02',
    branchCode: 'JNPT-02',
    branchName: 'JNPT Port Terminal Hub',
    city: 'Navi Mumbai',
    address: 'JNPT Container Terminal Gate 3, Uran, MH',
    hubMapping: ['Bhiwandi Central Logistics Hub', 'Pune Chakan Yard'],
    isActive: true
  },
  {
    id: 'BR-03',
    branchCode: 'BND-03',
    branchName: 'Bandra Express Hub',
    city: 'Mumbai City',
    address: 'BKC Express Cargo Complex, Bandra East, MH',
    hubMapping: ['Bhiwandi Central Logistics Hub'],
    isActive: true
  },
  {
    id: 'BR-04',
    branchCode: 'PNE-04',
    branchName: 'Pune Chakan Industrial Hub',
    city: 'Pune',
    address: 'Chakan MIDC Phase 2, Pune, MH',
    hubMapping: ['Bhiwandi Central Logistics Hub', 'JNPT Port Terminal Hub'],
    isActive: true
  }
];

// System-Wide Central Audit Log Store
const masterAuditLogsStore: any[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-07-22T14:30:00Z',
    user: 'employee@aura.com',
    userRole: 'Ops',
    module: 'SHIPMENTS',
    action: 'STATUS_TRANSITION',
    entityId: 'SHP-84920',
    details: 'Status transitioned from BOOKED to PICKED_UP by Rajesh Kumar (MH-04-AB-1234).'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-07-22T14:00:00Z',
    user: 'mohan.manager@aura.com',
    userRole: 'Finance',
    module: 'QUOTATIONS',
    action: 'APPROVAL_GRANTED',
    entityId: 'QT-2026-8801',
    details: 'Manager sign-off approved for 18% discount quote.'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-07-22T11:00:00Z',
    user: 'employee@aura.com',
    userRole: 'Finance',
    module: 'BILLING',
    action: 'CREDIT_NOTE_ISSUED',
    entityId: 'CN-AUTO-5012',
    details: 'Credit note of ₹50,000 issued for Return RET-2026-01.'
  },
  {
    id: 'AUD-904',
    timestamp: '2026-07-22T09:00:00Z',
    user: 'admin@aura.com',
    userRole: 'Admin',
    module: 'SETTINGS',
    action: 'PERMISSION_MUTATION',
    entityId: 'Role:Sales',
    details: 'Updated quoteDiscountMaxPercent to 15% for Sales role.'
  }
];

// Helper: Log audit entry
function logAuditEntry(user: string, role: string, module: string, action: string, entityId: string, details: string) {
  masterAuditLogsStore.unshift({
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    user: user || 'system@aura.com',
    userRole: role || 'Staff',
    module,
    action,
    entityId,
    details
  });
}

// GET Role & Permissions Matrix
router.get('/settings/roles', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    return successRes(res, masterRolePermissionsStore);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Update Role Permissions or Approval Authority
router.post('/settings/roles', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { roleName, modulePermissions, approvalAuthority } = req.body;
    if (!roleName) return errorRes(res, 'Role name is required');

    masterRolePermissionsStore[roleName] = {
      roleName,
      description: masterRolePermissionsStore[roleName]?.description || `${roleName} Role`,
      modulePermissions: modulePermissions || masterRolePermissionsStore[roleName]?.modulePermissions,
      approvalAuthority: approvalAuthority || masterRolePermissionsStore[roleName]?.approvalAuthority
    };

    logAuditEntry(
      req.employeeUser?.email || 'admin@aura.com',
      req.employeeUser?.role || 'Admin',
      'SETTINGS',
      'PERMISSION_MUTATION',
      `Role:${roleName}`,
      `Updated role permissions and approval flags for ${roleName}`
    );

    return successRes(res, masterRolePermissionsStore[roleName]);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Master Branches List
router.get('/settings/branches', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    return successRes(res, masterBranchesStore);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Create Branch/Hub
router.post('/settings/branches', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { branchName, city, address, hubMapping } = req.body;
    if (!branchName || !city) return errorRes(res, 'Branch name and city required');

    const brId = `BR-${Math.floor(10 + Math.random() * 90)}`;
    const newBranch = {
      id: brId,
      branchCode: `${city.substring(0, 3).toUpperCase()}-${brId}`,
      branchName,
      city,
      address: address || `${city} Logistics Hub`,
      hubMapping: hubMapping || ['Bhiwandi Central Logistics Hub'],
      isActive: true
    };

    masterBranchesStore.push(newBranch);
    logAuditEntry(
      req.employeeUser?.email || 'admin@aura.com',
      req.employeeUser?.role || 'Admin',
      'SETTINGS',
      'BRANCH_MUTATION',
      brId,
      `Created new logistics branch: ${branchName}`
    );

    return successRes(res, newBranch, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Master Rate Cards
router.get('/settings/rate-cards', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    return successRes(res, rateCardsMaster);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// POST Create / Edit Rate Card
router.post('/settings/rate-cards', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { lane, mode, weightSlab, baseCost, standardRate } = req.body;
    if (!lane || !standardRate) return errorRes(res, 'Lane and standard rate required');

    const cardId = `RC-${Math.floor(100 + Math.random() * 900)}`;
    const newCard = {
      id: cardId,
      lane,
      mode: mode || 'Road FTL',
      weightSlab: weightSlab || '15 - 25 Tons',
      baseCost: parseFloat(baseCost || '60000'),
      standardRate: parseFloat(standardRate)
    };

    rateCardsMaster.push(newCard);
    logAuditEntry(
      req.employeeUser?.email || 'admin@aura.com',
      req.employeeUser?.role || 'Admin',
      'SETTINGS',
      'RATE_CARD_MUTATION',
      cardId,
      `Updated tariff rate card for ${lane}`
    );

    return successRes(res, newCard, 201);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Customer Master Data
router.get('/settings/customers', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    const customers = [
      {
        id: 'CUST-01',
        customerName: 'Aura Consumer Tech Ltd',
        gstin: '27AAAAA0000A1Z5',
        creditLimit: 15000000,
        creditTermsDays: 30,
        contactEmail: 'contact@auratech.com',
        primaryAddress: 'Plot 12, SEEPZ, Andheri East, Mumbai, MH 400096'
      },
      {
        id: 'CUST-02',
        customerName: 'GlobeTech Manufacturing India',
        gstin: '27BBBBB1111B1Z6',
        creditLimit: 8000000,
        creditTermsDays: 45,
        contactEmail: 'logistics@globetech.in',
        primaryAddress: 'Chakan Industrial Estate, Pune, MH 410501'
      }
    ];
    return successRes(res, customers);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Vendor Transporter Master Data
router.get('/settings/vendors', authenticateEmployee, async (_req: EmployeeAuthRequest, res) => {
  try {
    return successRes(res, vendorMasterList);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// GET Centralized Queryable System Audit Log
router.get('/settings/audit-logs', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { module, search } = req.query;
    let filtered = [...masterAuditLogsStore];

    if (module && module !== 'ALL') {
      filtered = filtered.filter(a => a.module === module);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(a =>
        a.user.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.entityId.toLowerCase().includes(q) ||
        a.details.toLowerCase().includes(q)
      );
    }

    return successRes(res, filtered);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

// ==========================================
// PERSONAL ACCOUNT SETTINGS ENDPOINTS
// ==========================================
router.put('/settings/account/profile', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const userId = req.employeeUser?.userId;
    if (userId) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }
      });
      return successRes(res, {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone
      });
    }
    return successRes(res, { firstName, lastName, phone });
  } catch (err: any) {
    return errorRes(res, err.message || 'Failed to update profile', 500);
  }
});

router.post('/settings/account/photo', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { photoUrl, action } = req.body;
    const userId = req.employeeUser?.userId;
    const finalPhoto = action === 'remove' ? null : photoUrl;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: finalPhoto }
      });
    }
    return successRes(res, { profilePhoto: finalPhoto });
  } catch (err: any) {
    return errorRes(res, err.message || 'Failed to update photo', 500);
  }
});

router.post('/settings/account/request-email-change', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { currentPassword, newEmail } = req.body;
    if (!currentPassword || !newEmail) return errorRes(res, 'Current password and new email required');

    const userId = req.employeeUser?.userId;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
      if (user && user.passwordHash !== currentHash) {
        return errorRes(res, 'Incorrect current password', 401);
      }
    }

    const verificationToken = `EMP_EML_VERIFY_${Math.floor(100000 + Math.random() * 900000)}`;
    return successRes(res, {
      message: `Verification token generated. Please click the link sent to ${newEmail} to complete the change.`,
      pendingEmail: newEmail,
      verificationToken,
      verificationLink: `http://localhost:5173/admin/hr-portal/verify-email?token=${verificationToken}`
    });
  } catch (err: any) {
    return errorRes(res, err.message || 'Email change request failed', 500);
  }
});

router.post('/settings/account/verify-email', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { token, newEmail } = req.body;
    if (!token) return errorRes(res, 'Verification token required');

    const userId = req.employeeUser?.userId;
    if (userId && newEmail) {
      await prisma.user.update({
        where: { id: userId },
        data: { email: newEmail }
      });
    }
    return successRes(res, { message: 'Email address updated successfully!' });
  } catch (err: any) {
    return errorRes(res, err.message || 'Email verification failed', 500);
  }
});

router.put('/settings/account/notifications', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { notifications } = req.body;
    return successRes(res, { notifications, message: 'Notification preferences saved.' });
  } catch (err: any) {
    return errorRes(res, err.message || 'Failed to save notifications', 500);
  }
});

router.post('/settings/account/deactivate', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const { currentPassword, reason } = req.body;
    if (!currentPassword) return errorRes(res, 'Current password is required to submit deactivation request');

    const userId = req.employeeUser?.userId;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
      if (user && user.passwordHash !== currentHash) {
        return errorRes(res, 'Incorrect current password', 401);
      }
    }

    logAuditEntry(
      req.employeeUser?.email || 'user@aura.com',
      req.employeeUser?.role || 'Staff',
      'SETTINGS',
      'ACCOUNT_DEACTIVATION_REQUESTED',
      userId || 'usr_01',
      `Deactivation requested: ${reason || 'User initiated'}`
    );

    return successRes(res, {
      message: 'Account deactivation request logged for HR/Admin review. Your account will remain active until approved.'
    });
  } catch (err: any) {
    return errorRes(res, err.message || 'Deactivation request failed', 500);
  }
});

router.get('/notifications', authenticateEmployee, async (req: EmployeeAuthRequest, res) => {
  try {
    const notifications = [
      { id: '1', title: 'Leave Application Received', message: 'Your leave request has been submitted to your manager.', time: '10 mins ago', unread: true },
      { id: '2', title: 'New Announcement Posted', message: 'HR broadcasted Annual Holiday Schedule 2026.', time: '2 hours ago', unread: true },
      { id: '3', title: 'Payslip Available', message: 'Your June 2026 salary slip is now available for download.', time: '1 day ago', unread: false }
    ];
    return successRes(res, notifications);
  } catch (err: any) {
    return errorRes(res, err.message, 500);
  }
});

export default router;
