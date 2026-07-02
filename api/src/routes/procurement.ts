import { Router } from 'express';
import mastersRouter from './procurement/masters';
import vendorsRouter from './procurement/vendors';
import rfqRouter from './procurement/rfq';
import contractsRouter from './procurement/contracts';
import approvalsRouter from './procurement/approvals';
import prRouter from './procurement/pr';
import poRouter from './procurement/po';
import grnRouter from './procurement/grn';
import returnsRouter from './procurement/returns';
import invoicesRouter from './procurement/invoices';
import posRouter from './procurement/pos';
import financeRouter from './procurement/finance';
import analyticsRouter from './procurement/analytics';

const router = Router();

router.use('/masters', mastersRouter);
router.use('/vendors', vendorsRouter);
router.use('/rfq', rfqRouter);
router.use('/contracts', contractsRouter);
router.use('/approvals', approvalsRouter);
router.use('/pr', prRouter);
router.use('/po', poRouter);
router.use('/grn', grnRouter);
router.use('/returns', returnsRouter);
router.use('/invoices', invoicesRouter);
router.use('/finance', financeRouter);
router.use('/analytics', analyticsRouter);
router.use('/', posRouter);

export default router;
