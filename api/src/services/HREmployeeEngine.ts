import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HREmployeeEngine {
  
  /**
   * Registers a new employee, generates unique EmployeeCode, and triggers Onboarding.
   */
  static async registerEmployee(payload: any) {
    // Basic validation
    if (!payload.officialEmail || !payload.firstName || !payload.lastName) {
       throw new Error("Missing mandatory fields: officialEmail, firstName, lastName");
    }

    // Check duplicates
    const existing = await prisma.employee.findUnique({ where: { officialEmail: payload.officialEmail } });
    if (existing) {
       throw new Error(`Employee with email ${payload.officialEmail} already exists.`);
    }

    // Generate Sequential Employee Code
    const count = await prisma.employee.count();
    const employeeCode = `EMP-${1000 + count + 1}`;

    // Create Employee record using Prisma Transactions to ensure atomic inserts
    const employee = await prisma.$transaction(async (tx) => {
      const emp = await tx.employee.create({
        data: {
          employeeCode,
          officialEmail: payload.officialEmail,
          status: 'ACTIVE',
          profile: {
             create: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                gender: payload.gender || 'UNSPECIFIED',
                completionPercent: 30
             }
          },
          employment: {
             create: {
                designation: payload.designation || 'Trainee',
                jobTitle: payload.jobTitle || 'Trainee',
                employmentType: payload.employmentType || 'PERMANENT',
                department: payload.department || 'Operations',
                businessUnit: payload.businessUnit || 'Logistics',
                joiningDate: payload.joiningDate ? new Date(payload.joiningDate) : new Date(),
                workLocation: payload.workLocation || 'Headquarters',
                workMode: payload.workMode || 'OFFICE'
             }
          },
          onboarding: {
             create: {
                status: 'PENDING'
             }
          }
        },
        include: { profile: true, employment: true, onboarding: true }
      });
      return emp;
    });

    return employee;
  }

  /**
   * Fetches the global employee directory
   */
  static async getDirectory() {
    return await prisma.employee.findMany({
      include: {
         profile: true,
         employment: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Fetches the hierarchical organization chart.
   * In a real enterprise system, this uses recursive CTEs or nested graph lookups.
   */
  static async getOrganizationChart() {
    // Mock hierarchical structure for UI rendering
    return {
      id: "ORG-1",
      name: "Global Freight Logistics",
      title: "CEO",
      children: [
        {
           id: "ORG-2",
           name: "Operations Department",
           title: "Head of Operations",
           children: [
              { id: "ORG-4", name: "Ocean Freight", title: "Manager" },
              { id: "ORG-5", name: "Air Freight", title: "Manager" }
           ]
        },
        {
           id: "ORG-3",
           name: "Finance Department",
           title: "CFO",
           children: [
              { id: "ORG-6", name: "Accounts Payable", title: "Lead" },
              { id: "ORG-7", name: "Accounts Receivable", title: "Lead" }
           ]
        }
      ]
    };
  }
}
