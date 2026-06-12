import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/returns', async (_req: Request, res: Response) => {
  const returns = await prisma.return.findMany({ include: { salesOrder: true, items: true } });
  res.json(returns);
});
router.post('/returns', async (req: Request, res: Response) => {
  const { salesOrderId, reason, items } = req.body;
  const ret = await prisma.return.create({
    data: { salesOrderId, reason, items: { create: items } },
    include: { items: true }
  });
  res.status(201).json(ret);
});

export default router;
