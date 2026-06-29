import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all vehicles with basic info and stats
router.get('/', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { isRetired: false },
      include: {
        assignedDriver: true,
        documents: true,
        GPSDevice: true
      },
      orderBy: { plateNumber: 'asc' }
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get a single vehicle details
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        assignedDriver: true,
        documents: {
          orderBy: { createdAt: 'desc' }
        },
        auditLogs: {
          orderBy: { timestamp: 'desc' }
        },
        maintenance: true,
        GPSDevice: true,
        trips: {
          take: 5,
          orderBy: { startTime: 'desc' }
        }
      }
    });
    if (!vehicle) return res.status(404).json({ error: 'Not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Create new vehicle
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newVehicle = await prisma.$transaction(async (tx) => {
      const v = await tx.vehicle.create({
        data: {
          plateNumber: data.plateNumber,
          category: data.category,
          make: data.make,
          model: data.model,
          year: data.year,
          type: data.type,
          capacity: data.capacity,
          fuelType: data.fuelType,
          ownershipType: data.ownershipType,
          status: 'Available',
          qrCode: `QR-${data.plateNumber}`,
          barcode: `BC-${data.plateNumber}`
        }
      });
      
      // Auto-create initial audit log
      await tx.vehicleAuditLog.create({
        data: {
          vehicleId: v.id,
          action: 'Registered',
          description: `Vehicle ${v.plateNumber} was registered in the system.`
        }
      });
      
      return v;
    });
    res.status(201).json(newVehicle);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update assignment
router.put('/:id/assign', async (req, res) => {
  try {
    const { driverId, shipmentId } = req.body;
    
    const v = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: {
        assignedDriverId: driverId || null,
        assignedShipment: shipmentId || null,
        status: driverId ? 'On Trip' : 'Available',
        auditLogs: {
          create: {
            action: 'DriverAssigned',
            description: `Driver ${driverId || 'None'} assigned. Shipment: ${shipmentId || 'None'}`
          }
        }
      }
    });
    res.json(v);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Add document
router.post('/:id/documents', async (req, res) => {
  try {
    const doc = await prisma.vehicleDocument.create({
      data: {
        vehicleId: req.params.id,
        ...req.body
      }
    });
    res.status(201).json(doc);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Retire vehicle (Soft Delete)
router.post('/:id/retire', async (req, res) => {
  try {
    const v = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: {
        isRetired: true,
        retiredAt: new Date(),
        retirementReason: req.body.reason || 'End of life',
        status: 'Retired',
        auditLogs: {
          create: {
            action: 'Retired',
            description: `Vehicle retired: ${req.body.reason || 'End of life'}`
          }
        }
      }
    });
    res.json(v);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
