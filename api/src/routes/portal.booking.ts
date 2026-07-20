import { Router } from 'express';
import { createPortalBooking } from '../controllers/portal.booking.controller';
import { authenticatePortalUser } from '../middleware/auth.middleware';

const router = Router();

// All routes here are protected by the portal user authentication middleware
router.post('/', authenticatePortalUser, createPortalBooking);

export default router;
