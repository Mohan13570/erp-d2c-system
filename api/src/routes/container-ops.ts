import { Router } from 'express';
import yardRoutes from './container-ops/yard';
import operationsRoutes from './container-ops/operations';
import cargoRoutes from './container-ops/cargo';
import portRoutes from './container-ops/port';

const router = Router();

router.use('/yard', yardRoutes);
router.use('/operations', operationsRoutes);
router.use('/cargo', cargoRoutes);
router.use('/port', portRoutes);

export default router;
