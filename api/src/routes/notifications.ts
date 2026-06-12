import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/logs', async (req, res) => {
  try { res.json(await prisma.notificationLog.findMany({ orderBy: { sentAt: 'desc' } })); }
  catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/send', async (req, res) => {
  try {
    // Mock sending notification
    const data = await prisma.notificationLog.create({
      data: {
        channel: req.body.channel,
        recipient: req.body.recipient,
        subject: req.body.subject,
        message: req.body.message,
        status: 'Delivered'
      }
    });
    res.json(data);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
