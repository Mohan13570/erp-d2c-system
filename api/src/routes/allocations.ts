import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

// GET all allocations for a shipment
router.get('/shipments/:shipmentId/allocations', async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: req.params.shipmentId },
      include: {
        resourceValidation: true,
        vehicleAssignment: true,
        driverAssignment: true,
        warehouseAssignment: true,
        containerAssignment: true,
        routeAssignment: true,
        dispatchPlan: true,
      }
    });
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    res.json(shipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch allocations' });
  }
});

// POST save allocations
router.post('/shipments/:shipmentId/allocations', async (req, res) => {
  const { shipmentId } = req.params;
  const { 
    vehicleAssignment, 
    driverAssignment, 
    warehouseAssignment, 
    containerAssignment, 
    routeAssignment, 
    dispatchPlan 
  } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Vehicle
      if (vehicleAssignment) {
        await tx.vehicleAssignment.upsert({
          where: { shipmentId },
          update: vehicleAssignment,
          create: { ...vehicleAssignment, shipmentId }
        });
      }
      
      // Driver
      if (driverAssignment) {
        await tx.driverAssignment.upsert({
          where: { shipmentId },
          update: driverAssignment,
          create: { ...driverAssignment, shipmentId }
        });
      }

      // Warehouse
      if (warehouseAssignment) {
        await tx.shipmentWarehouseAssignment.upsert({
          where: { shipmentId },
          update: warehouseAssignment,
          create: { ...warehouseAssignment, shipmentId }
        });
      }

      // Container
      if (containerAssignment) {
        await tx.containerAssignment.upsert({
          where: { shipmentId },
          update: containerAssignment,
          create: { ...containerAssignment, shipmentId }
        });
      }

      // Route
      if (routeAssignment) {
        await tx.routeAssignment.upsert({
          where: { shipmentId },
          update: routeAssignment,
          create: { ...routeAssignment, shipmentId }
        });
      }

      // Dispatch Plan
      if (dispatchPlan) {
        await tx.dispatchPlan.upsert({
          where: { shipmentId },
          update: dispatchPlan,
          create: { ...dispatchPlan, shipmentId }
        });
      }

      // Auto-validate based on basic rules
      const isVehicleValid = !!vehicleAssignment?.vehicleId;
      const isDriverValid = !!driverAssignment?.driverId;
      const isWarehouseValid = !!warehouseAssignment?.originWarehouse && !!warehouseAssignment?.destWarehouse;
      const isContainerValid = !!containerAssignment?.containerNumber;

      const overallStatus = (isVehicleValid && isDriverValid && isWarehouseValid && isContainerValid) 
        ? 'VALIDATED' 
        : 'PENDING';

      await tx.shipmentResourceValidation.upsert({
        where: { shipmentId },
        update: {
          isVehicleValid,
          isDriverValid,
          isWarehouseValid,
          isContainerValid,
          overallStatus,
          lastValidatedAt: new Date()
        },
        create: {
          shipmentId,
          isVehicleValid,
          isDriverValid,
          isWarehouseValid,
          isContainerValid,
          overallStatus,
          lastValidatedAt: new Date()
        }
      });

      return { success: true, overallStatus };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save allocations' });
  }
});

// POST trigger dispatch
router.post('/shipments/:shipmentId/dispatch', async (req, res) => {
  const { shipmentId } = req.params;
  try {
    const validation = await prisma.shipmentResourceValidation.findUnique({
      where: { shipmentId }
    });

    if (!validation || validation.overallStatus !== 'VALIDATED') {
      return res.status(400).json({ error: 'Cannot dispatch. Resources are not fully validated.' });
    }

    // Update shipment status
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: 'DISPATCHED' }
    });

    // Update dispatch plan status
    await prisma.dispatchPlan.update({
        where: { shipmentId },
        data: { status: 'LOCKED' }
    });

    res.json({ success: true, message: 'Shipment dispatched successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Dispatch failed' });
  }
});

export default router;
