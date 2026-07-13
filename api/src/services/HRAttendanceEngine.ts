import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HRAttendanceEngine {
  
  /**
   * Validates GPS distance between two coordinates using the Haversine formula.
   */
  private static calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(dp/2) * Math.sin(dp/2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * Perform a GPS Check-In
   */
  static async gpsCheckIn(payload: { employeeId: string; latitude: number; longitude: number; method: string }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch primary GeoFence for the company
    const fence = await prisma.hRGeoFence.findFirst({ where: { isActive: true } });
    
    let inGeoFence = false;
    if (fence) {
      const distance = this.calculateDistanceMeters(payload.latitude, payload.longitude, fence.latitude, fence.longitude);
      inGeoFence = distance <= fence.radiusMeters;
    }

    // Upsert Attendance Record
    const attendance = await prisma.hRAttendance.upsert({
      where: {
        employeeId_date: {
          employeeId: payload.employeeId,
          date: today
        }
      },
      update: {
         status: 'PRESENT' // Might update to 'LATE' if checking against shift times
      },
      create: {
         employeeId: payload.employeeId,
         date: today,
         status: 'PRESENT',
         firstCheckIn: new Date(),
      }
    });

    // Create Log
    const log = await prisma.hRAttendanceLog.create({
      data: {
         attendanceId: attendance.id,
         type: 'IN',
         method: payload.method,
         latitude: payload.latitude,
         longitude: payload.longitude,
         geoFenceId: fence?.id,
         inGeoFence
      }
    });

    return { attendance, log, distanceValidated: inGeoFence };
  }

  /**
   * Submit an Overtime Request
   */
  static async requestOvertime(payload: { employeeId: string; date: string; requestedMins: number }) {
     return await prisma.hROvertimeApproval.create({
        data: {
           employeeId: payload.employeeId,
           date: new Date(payload.date),
           requestedMins: payload.requestedMins,
           status: 'PENDING'
        }
     });
  }

  /**
   * Build Timesheet summary
   */
  static async getTimesheet(employeeId: string, month: number, year: number) {
     // Mock calculation for UI
     return {
        employeeId,
        month, year,
        totalPresent: 21,
        totalAbsent: 1,
        totalLate: 2,
        totalWorkHours: 168,
        totalOvertimeHours: 12
     };
  }

  /**
   * Get Active Shifts
   */
  static async getActiveShifts() {
     return await prisma.hRShift.findMany({
        include: { assignments: true }
     });
  }
}
