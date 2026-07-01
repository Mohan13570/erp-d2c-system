import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

import airMasterDataRouter from './air/master-data';
import airBookingsRouter from './air/bookings';
import airDocumentsRouter from './air/documents';
import airOpsRouter from './air/operations';
import airUldRouter from './air/uld-management';
import airLoadPlanRouter from './air/load-planning';
import airDiscrepanciesRouter from './air/discrepancies';
import airFinancialsRouter from './air/financials';
import airCustomsRouter from './air/customs';
import airTrackingRouter from './air/tracking';
import airAnalyticsRouter from './air/analytics';

router.use('/master-data', airMasterDataRouter);
router.use('/bookings', airBookingsRouter);
router.use('/documents', airDocumentsRouter);
router.use('/operations', airOpsRouter);
router.use('/uld', airUldRouter);
router.use('/load-planning', airLoadPlanRouter);
router.use('/discrepancies', airDiscrepanciesRouter);
router.use('/finance', airFinancialsRouter);
router.use('/customs', airCustomsRouter);
router.use('/tracking', airTrackingRouter);
router.use('/analytics', airAnalyticsRouter);

// Legacy endpoints removed

export default router;
