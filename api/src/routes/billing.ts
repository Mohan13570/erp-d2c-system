import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/invoices', async (req, res) => {
  try { res.json(await prisma.invoice.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/invoices', async (req, res) => {
  try { 
    const data = {...req.body};
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    data.total = data.amount || 0; // map amount to total
    delete data.entityName; // frontend uses entityName, backend doesn't have it directly. Let's just create it anyway.
    res.json(await prisma.invoice.create({ data })); 
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/notes', async (req, res) => {
  try { res.json(await prisma.creditDebitNote.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/notes', async (req, res) => {
  try { res.json(await prisma.creditDebitNote.create({ data: req.body })); } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
