import { Router } from 'express';
import billingRoutes from './container-finance/billing';
import analyticsRoutes from './container-finance/analytics';
import reportsRoutes from './container-finance/reports';

const router = Router();

router.use('/billing', billingRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportsRoutes);
// We map dashboard calls to analytics for data aggregation
router.use('/dashboard', analyticsRoutes); 

export default router;
