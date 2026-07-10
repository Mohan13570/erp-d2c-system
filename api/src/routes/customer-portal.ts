import { Router } from 'express';
import { CustomerOnboardingEngine } from '../services/CustomerOnboardingEngine';

const router = Router();

// --- Registration & Onboarding ---
router.post('/register', async (req, res) => {
  try {
    const customer = await CustomerOnboardingEngine.registerCustomer(req.body);
    res.json(customer);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/invite', async (req, res) => {
  try {
    const invite = await CustomerOnboardingEngine.inviteCustomer(req.body.email);
    res.json(invite);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

// --- Read APIs ---
router.get('/', async (req, res) => {
  try {
    const customers = await CustomerOnboardingEngine.getCustomers();
    res.json(customers);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await CustomerOnboardingEngine.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- Workflow ---
router.put('/:id/approve', async (req, res) => {
  try {
    const customer = await CustomerOnboardingEngine.approveCustomer(req.params.id);
    res.json(customer);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
