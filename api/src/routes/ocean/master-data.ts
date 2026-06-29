import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Global unified endpoint for Ocean Freight Master Data to hydrate frontend dropdowns
router.get('/', async (req, res) => {
  try {
    const [
       incoterms,
       tradeLanes,
       cargoTypes,
       dgClasses,
       tempClasses,
       packageTypes,
       sealTypes,
       chargeMasters,
       serviceTypes,
       statuses
    ] = await Promise.all([
       prisma.incoterm.findMany({ where: { isDeleted: false } }),
       prisma.tradeLane.findMany({ where: { isDeleted: false }, include: { routes: true } }),
       prisma.cargoType.findMany({ where: { isDeleted: false } }),
       prisma.dangerousGoodsClass.findMany({ where: { isDeleted: false } }),
       prisma.temperatureClass.findMany({ where: { isDeleted: false } }),
       prisma.packageType.findMany({ where: { isDeleted: false } }),
       prisma.sealType.findMany({ where: { isDeleted: false } }),
       prisma.chargeMaster.findMany({ where: { isDeleted: false } }),
       prisma.serviceType.findMany({ where: { isDeleted: false } }),
       prisma.oceanFreightStatus.findMany({ where: { isDeleted: false } })
    ]);

    res.json({
       incoterms,
       tradeLanes,
       cargoTypes,
       dgClasses,
       tempClasses,
       packageTypes,
       sealTypes,
       chargeMasters,
       serviceTypes,
       statuses
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch master data dictionary' });
  }
});

export default router;
