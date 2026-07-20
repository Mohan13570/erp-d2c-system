import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticatePortalUser } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticatePortalUser, getMe);

export default router;
