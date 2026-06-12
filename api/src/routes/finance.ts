import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/coa', async (req, res) => {
  try { res.json(await prisma.account.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/coa', async (req, res) => {
  try { 
    // Default values for required fields on Account model
    const data = {...req.body, accountType: req.body.type || 'Asset', rootType: 'Asset'};
    res.json(await prisma.account.create({ data })); 
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/journals', async (req, res) => {
  try { res.json(await prisma.journalEntry.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/journals', async (req, res) => {
  try { res.json(await prisma.journalEntry.create({ data: req.body })); } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
