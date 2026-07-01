import { Router } from 'express';
import masterDataRoutes from './road/master-data';
import bookingRoutes from './road/bookings';
import planningRoutes from './road/planning';
import dispatchRoutes from './road/dispatch';
import vehicleOpsRoutes from './road/vehicle-ops';
import driverOpsRoutes from './road/driver-ops';
import cargoOpsRoutes from './road/cargo-ops';
import financeRoutes from './road/finance';
import podRoutes from './road/pod';
import claimsRoutes from './road/claims';
import analyticsRoutes from './road/analytics';

const router = Router();

router.use('/master-data', masterDataRoutes);
router.use('/bookings', bookingRoutes);
router.use('/planning', planningRoutes);
router.use('/dispatch', dispatchRoutes);
router.use('/vehicle-ops', vehicleOpsRoutes);
router.use('/driver-ops', driverOpsRoutes);
router.use('/cargo-ops', cargoOpsRoutes);
router.use('/finance', financeRoutes);
router.use('/pod', podRoutes);
router.use('/claims', claimsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
