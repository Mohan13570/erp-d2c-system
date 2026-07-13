import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HRLeaveEngine {
  
  /**
   * Applies for leave, calculating days and checking negative balances.
   */
  static async applyLeave(payload: { employeeId: string; leaveTypeId: string; startDate: string; endDate: string; reason: string; backupEmployeeId?: string }) {
    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    // Check Balance
    const balanceRecord = await prisma.hRLeaveBalance.findFirst({
       where: { employeeId: payload.employeeId, leaveTypeId: payload.leaveTypeId, year: new Date().getFullYear() }
    });

    if (!balanceRecord || balanceRecord.balance < totalDays) {
       throw new Error(`Insufficient leave balance. You requested ${totalDays} days, but only have ${balanceRecord?.balance || 0} days remaining.`);
    }

    // Create Request inside transaction
    return await prisma.$transaction(async (tx) => {
       const request = await tx.hRLeaveRequest.create({
          data: {
             employeeId: payload.employeeId,
             leaveTypeId: payload.leaveTypeId,
             startDate: start,
             endDate: end,
             totalDays,
             reason: payload.reason,
             backupEmployeeId: payload.backupEmployeeId,
             status: 'PENDING'
          }
       });

       return request;
    });
  }

  /**
   * Fetch current leave balances for UI
   */
  static async getLeaveBalances(employeeId: string) {
     return await prisma.hRLeaveBalance.findMany({
        where: { employeeId, year: new Date().getFullYear() },
        include: { leaveType: true }
     });
  }

  /**
   * Fetch holidays for calendar
   */
  static async getHolidays() {
     return await prisma.hRHoliday.findMany({
        orderBy: { date: 'asc' }
     });
  }

  /**
   * Predict Workforce Capacity using AI (Mock logic)
   */
  static async predictWorkforceCapacity(departmentId: string, targetDate: string) {
     // Check total leaves vs required headcount
     return {
        departmentId,
        date: targetDate,
        requiredHeadcount: 50,
        actualHeadcount: 50,
        onLeave: 4,
        deficit: 0,
        aiSuggestion: "Staffing levels are optimal. No backup assignments required."
     };
  }
}
