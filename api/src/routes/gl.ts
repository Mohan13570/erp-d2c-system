import { Router } from 'express';
import journalsRouter from './gl/journals';
import bankingRouter from './gl/banking';
import billingRouter from './gl/billing';
import taxationRouter from './gl/taxation';

const router = Router();

router.use('/journals', journalsRouter);
router.use('/banking', bankingRouter);
router.use('/billing', billingRouter);
router.use('/taxation', taxationRouter);

export default router;
