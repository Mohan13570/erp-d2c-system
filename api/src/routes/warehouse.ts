import { Router } from 'express';
import masterRouter from './warehouse/master';
import assetsRouter from './warehouse/assets';
import settingsRouter from './warehouse/settings';
import inboundRouter from './warehouse/inbound';
import outboundRouter from './warehouse/outbound';
import analyticsRouter from './warehouse/analytics';

const router = Router();

// WMS Router Mounting
router.use('/master', masterRouter);
router.use('/assets', assetsRouter);
router.use('/settings', settingsRouter);
router.use('/inbound', inboundRouter);
router.use('/outbound', outboundRouter);
router.use('/analytics', analyticsRouter);

export default router;
