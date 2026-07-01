import { Router } from 'express';
import inventoryRoutes from './maintenance-ops/inventory';
import fuelRoutes from './maintenance-ops/fuel';
import tyresRoutes from './maintenance-ops/tyres';
import vendorsRoutes from './maintenance-ops/vendors';
import analyticsRoutes from './maintenance-ops/analytics';

const router = Router();

router.use('/inventory', inventoryRoutes);
router.use('/fuel', fuelRoutes);
router.use('/tyres', tyresRoutes);
router.use('/vendors', vendorsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
