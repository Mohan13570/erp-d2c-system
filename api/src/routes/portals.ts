import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Customer Portal Data
router.get('/customer/:id/shipments', async (req, res) => {
  try {
    const data = await prisma.shipment.findMany({ where: { customerId: req.params.id } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/customer/:id/tickets', async (req, res) => {
  try {
    const data = await prisma.supportTicket.findMany({ where: { customerId: req.params.id } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/customer/tickets', async (req, res) => {
  try {
    const data = await prisma.supportTicket.create({ data: req.body });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// Vendor Portal Data
router.get('/vendor/:id/jobs', async (req, res) => {
  // Simulating jobs as Shipments that need carriers or Procurement orders
  try {
    const pos = await prisma.purchaseOrder.findMany({ where: { vendorId: req.params.id } });
    res.json(pos);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/vendor/bills', async (req, res) => {
  try {
    const data = await prisma.vendorBill.create({ data: { ...req.body, dueDate: new Date(req.body.dueDate) } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// Employee Portal Data
router.get('/employee/:id/attendance', async (req, res) => {
  try {
    const data = await prisma.attendance.findMany({ where: { employeeId: req.params.id } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/employee/attendance', async (req, res) => {
  try {
    const data = await prisma.attendance.create({ data: req.body });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/employee/:id/payroll', async (req, res) => {
  try {
    const data = await prisma.payroll.findMany({ where: { employeeId: req.params.id } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

export default router;
