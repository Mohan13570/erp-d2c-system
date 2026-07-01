import { Router } from 'express';
import telemetryRoutes from './container-tracking/telemetry';
import healthRoutes from './container-tracking/health';
import complianceRoutes from './container-tracking/compliance';
import repairRoutes from './container-tracking/repair';

const router = Router();

router.use('/telemetry', telemetryRoutes);
router.use('/health', healthRoutes);
router.use('/compliance', complianceRoutes);
router.use('/repair', repairRoutes);

export default router;
