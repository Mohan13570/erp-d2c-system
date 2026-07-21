import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router({ mergeParams: true }); // Allows access to :id from parent router if mounted there, but we will mount it independently
const prisma = new PrismaClient();

// In production, calculations like Volumetric Weight would be standardized.
const VOLUMETRIC_DIVISOR = 6000; // cm3/kg for standard freight

// GET cargo and packages for a shipment
router.get('/shipments/:shipmentId/cargo', async (req, res) => {
  try {
    const cargoList = await prisma.shipmentCargo.findMany({
      where: { shipmentId: req.params.shipmentId },
      include: {
        packages: {
          include: {
            photos: true,
            inspections: true
          }
        }
      }
    });
    res.json(cargoList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cargo data' });
  }
});

// POST save cargo and packages (Bulk Upsert & Calculate)
router.post('/shipments/:shipmentId/cargo', async (req, res) => {
  const { shipmentId } = req.params;
  const { cargoId, ...cargoData } = req.body.cargo;
  const packages = req.body.packages || [];

  try {
    // 1. Transaction to safely update everything
    const result = await prisma.$transaction(async (tx) => {
      
      // Upsert Cargo Global Details
      let cargoRecord;
      if (cargoId) {
        cargoRecord = await tx.shipmentCargo.update({
          where: { id: cargoId },
          data: cargoData
        });
      } else {
        cargoRecord = await tx.shipmentCargo.create({
          data: { ...cargoData, shipmentId }
        });
      }

      // Process Packages & Calculate Summaries
      let totalGross = 0, totalNet = 0, totalCbm = 0, totalChargeable = 0;

      // Delete existing packages to cleanly insert new grid state (simplest for bulk editable grid)
      await tx.shipmentPackage.deleteMany({
        where: { cargoId: cargoRecord.id }
      });

      const processedPackages = packages.map((pkg: any) => {
        // Calculations
        let cbm = pkg.cbm || 0;
        let volumetricWeight = pkg.volumetricWeight || 0;
        
        // Auto-calculate if dimensions are provided in CM
        if (pkg.length && pkg.width && pkg.height && pkg.dimensionUnit === 'cm') {
           const cm3 = pkg.length * pkg.width * pkg.height;
           cbm = cm3 / 1000000; // 1 million cm3 in 1 cbm
           volumetricWeight = cm3 / VOLUMETRIC_DIVISOR; 
        }

        const chargeable = Math.max(pkg.grossWeight || 0, volumetricWeight);

        // Tally totals
        totalGross += (pkg.grossWeight || 0) * (pkg.quantity || 1);
        totalNet += (pkg.netWeight || 0) * (pkg.quantity || 1);
        totalCbm += cbm * (pkg.quantity || 1);
        totalChargeable += chargeable * (pkg.quantity || 1);

        return {
          packageNumber: pkg.packageNumber,
          packageType: pkg.packageType,
          description: pkg.description,
          marksAndNumbers: pkg.marksAndNumbers,
          quantity: pkg.quantity || 1,
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
          dimensionUnit: pkg.dimensionUnit || 'cm',
          grossWeight: pkg.grossWeight,
          netWeight: pkg.netWeight,
          weightUnit: pkg.weightUnit || 'kg',
          cbm,
          volumetricWeight,
          chargeableWeight: chargeable
        };
      });

      if (processedPackages.length > 0) {
        await tx.shipmentPackage.createMany({
          data: processedPackages.map(p => ({ ...p, cargoId: cargoRecord.id }))
        });
      }

      // Update Cargo Totals
      await tx.shipmentCargo.update({
        where: { id: cargoRecord.id },
        data: {
          grossWeight: totalGross,
          netWeight: totalNet,
          chargeableWeight: totalChargeable,
          volume: totalCbm,
          packagesCount: processedPackages.reduce((acc: number, p: any) => acc + p.quantity, 0)
        }
      });

      return { cargoRecord, totalGross, totalChargeable, totalCbm };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process cargo data' });
  }
});

export default router;
