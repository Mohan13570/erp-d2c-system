import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET Customers for CRM
router.get('/customers', async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        salesOrders: true,
        invoices: true,
        contacts: true,
        contracts: true
      }
    });
    // also fetch D2C customers
    const d2cCustomers = await prisma.d2CCustomer.findMany({
      include: {
        orders: true,
        returns: true
      }
    });
    res.json({ b2b: customers, d2c: d2cCustomers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// CREATE B2B Customer
router.post('/customers', async (req: Request, res: Response) => {
  try {
    const { customerName, customerGroup, territory, email, phone } = req.body;
    const newCustomer = await prisma.customer.create({
      data: {
        customerName,
        customerGroup: customerGroup || 'Commercial',
        territory: territory || 'Global',
        email,
        phone
      }
    });
    res.json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// CREATE D2C Customer
router.post('/d2c-customers', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, tier } = req.body;
    const newCustomer = await prisma.d2CCustomer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        tier: tier || 'Bronze',
        isGuest: false
      }
    });
    res.json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create D2C customer' });
  }
});

// DELETE B2B Customer
router.delete('/customers/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const hasOrders = await prisma.salesOrder.findFirst({ where: { customerId: id } });
    if (hasOrders) return res.status(400).json({ error: 'Cannot delete customer with existing orders' });
    
    await prisma.customer.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// DELETE D2C Customer
router.delete('/d2c-customers/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const hasOrders = await prisma.salesOrder.findFirst({ where: { d2cCustomerId: id } });
    if (hasOrders) return res.status(400).json({ error: 'Cannot delete customer with existing orders' });
    
    await prisma.d2CCustomer.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete D2C customer' });
  }
});

// ==========================================
// LEADS & OPPORTUNITIES
// ==========================================

router.get('/leads', async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({ include: { activities: true, opportunities: true } });
    res.json(leads);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/leads', async (req: Request, res: Response) => {
  try {
    const lead = await prisma.lead.create({ data: req.body });
    res.json(lead);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.delete('/leads/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.leadActivity.deleteMany({ where: { leadId: id }});
    await prisma.opportunity.deleteMany({ where: { leadId: id }});
    await prisma.lead.delete({ where: { id: id }});
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/opportunities', async (req: Request, res: Response) => {
  try {
    const opps = await prisma.opportunity.findMany({ include: { lead: true, customer: true } });
    res.json(opps);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/opportunities', async (req: Request, res: Response) => {
  try {
    const opp = await prisma.opportunity.create({ data: req.body });
    res.json(opp);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.delete('/opportunities/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.opportunity.delete({ where: { id: id }});
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// CUSTOMER CONTACTS & CONTRACTS
// ==========================================

router.post('/customer-contacts', async (req: Request, res: Response) => {
  try {
    const contact = await prisma.customerContact.create({ data: req.body });
    res.json(contact);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/customer-contracts', async (req: Request, res: Response) => {
  try {
    // Parse dates
    const data = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    
    const contract = await prisma.customerContract.create({ data });
    res.json(contract);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
