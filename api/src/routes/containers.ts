import { Router } from 'express';
import masterRoutes from './containers/master';
import lifecycleRoutes from './containers/lifecycle';
import allocationRoutes from './containers/allocation';

const router = Router();

router.use('/master', masterRoutes);
router.use('/lifecycle', lifecycleRoutes);
router.use('/allocation', allocationRoutes);

export default router;
