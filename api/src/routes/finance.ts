import { Router } from 'express';
import masterRouter from './finance/master';
import coaRouter from './finance/coa';
import apRouter from './finance/ap';
import arRouter from './finance/ar';
import dashboardRouter from './finance/dashboard';

const router = Router();

router.use('/master', masterRouter);
router.use('/coa', coaRouter);
router.use('/ap', apRouter);
router.use('/ar', arRouter);
router.use('/dashboard', dashboardRouter);

export default router;
