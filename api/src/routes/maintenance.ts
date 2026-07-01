import { Router } from 'express';
import assetsRoutes from './maintenance/assets';
import preventiveRoutes from './maintenance/preventive';
import workshopRoutes from './maintenance/workshop';
import inspectionsRoutes from './maintenance/inspections';

const router = Router();

router.use('/assets', assetsRoutes);
router.use('/preventive', preventiveRoutes);
router.use('/workshop', workshopRoutes);
router.use('/inspections', inspectionsRoutes);

export default router;
