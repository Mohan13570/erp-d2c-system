import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// RFQ Endpoints
router.get('/rfqs', async (req, res) => {
  try {
    const rfqs = await prisma.rFQ.findMany({ include: { customer: true, quotations: true } });
    res.json(rfqs);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/rfqs', async (req, res) => {
  try {
    const rfq = await prisma.rFQ.create({ data: req.body });
    res.json(rfq);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.delete('/rfqs/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.quotationItem.deleteMany({ where: { quotation: { rfqId: id } } });
    await prisma.quotationApproval.deleteMany({ where: { quotation: { rfqId: id } } });
    await prisma.quotation.deleteMany({ where: { rfqId: id } });
    await prisma.rFQ.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

// Quotations Endpoints
router.get('/', async (req, res) => {
  try {
    const quotes = await prisma.quotation.findMany({ include: { rfq: true, items: true, approvals: true } });
    res.json(quotes);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.validUntil) data.validUntil = new Date(data.validUntil);
    const quote = await prisma.quotation.create({ data });
    res.json(quote);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.quotationItem.deleteMany({ where: { quotationId: id } });
    await prisma.quotationApproval.deleteMany({ where: { quotationId: id } });
    await prisma.quotation.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
