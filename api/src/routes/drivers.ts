import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all drivers with basic info and stats
router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      where: { status: { not: 'Terminated' } },
      include: {
        assignedVehicles: true,
        documents: true
      },
      orderBy: { name: 'asc' }
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get a single driver profile (360 view)
router.get('/:id', async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.params.id },
      include: {
        assignedVehicles: true,
        documents: {
          orderBy: { createdAt: 'desc' }
        },
        auditLogs: {
          orderBy: { timestamp: 'desc' }
        },
        shifts: {
          take: 5,
          orderBy: { startTime: 'desc' }
        },
        violations: {
          orderBy: { date: 'desc' }
        },
        trips: {
          take: 5,
          orderBy: { startTime: 'desc' },
          include: { vehicle: true }
        }
      }
    });
    if (!driver) return res.status(404).json({ error: 'Not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver profile' });
  }
});

// Register new driver
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newDriver = await prisma.$transaction(async (tx) => {
      const d = await tx.driver.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          licenseNo: data.licenseNo,
          licenseExpiry: data.licenseExpiry ? new Date(data.licenseExpiry) : null,
          medicalCertExpiry: data.medicalCertExpiry ? new Date(data.medicalCertExpiry) : null,
          emergencyContact: data.emergencyContact,
          emergencyPhone: data.emergencyPhone,
          bloodGroup: data.bloodGroup,
          payrollId: data.payrollId,
          hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : null,
          status: 'Active',
          availability: 'Available'
        }
      });
      
      await tx.driverAuditLog.create({
        data: {
          driverId: d.id,
          action: 'Registered',
          description: `Driver ${d.name} onboarded into the system.`
        }
      });
      
      return d;
    });
    res.status(201).json(newDriver);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Add document
router.post('/:id/documents', async (req, res) => {
  try {
    const doc = await prisma.driverDocument.create({
      data: {
        driverId: req.params.id,
        type: req.body.type,
        documentNo: req.body.documentNo,
        issueDate: req.body.issueDate ? new Date(req.body.issueDate) : null,
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
        fileUrl: req.body.fileUrl
      }
    });
    res.status(201).json(doc);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Log Violation
router.post('/:id/violations', async (req, res) => {
  try {
    const v = await prisma.driverViolation.create({
      data: {
        driverId: req.params.id,
        violationType: req.body.violationType,
        description: req.body.description,
        penaltyAmount: req.body.penaltyAmount ? parseFloat(req.body.penaltyAmount) : 0
      }
    });
    
    // Auto deduction of rating
    await prisma.driver.update({
      where: { id: req.params.id },
      data: {
        rating: { decrement: 0.5 },
        auditLogs: {
          create: {
            action: 'PenaltyApplied',
            description: `${req.body.violationType} logged. Penalty: $${req.body.penaltyAmount}`
          }
        }
      }
    });

    res.status(201).json(v);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
