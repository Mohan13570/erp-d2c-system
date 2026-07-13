import { Router } from 'express';
import { CustomerFinanceEngine } from '../services/CustomerFinanceEngine';

const router = Router();

// Test Customer ID for Development
const MOCK_CUSTOMER_ID = 'CUST-1001';

router.get('/dashboard', async (req, res) => {
  try {
    const metrics = await CustomerFinanceEngine.getDashboardMetrics(MOCK_CUSTOMER_ID);
    res.json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/invoice/generate', async (req, res) => {
  try {
    const invoice = await CustomerFinanceEngine.generateInvoice({
      customerId: MOCK_CUSTOMER_ID,
      items: req.body.items
    });
    res.status(201).json({ success: true, data: invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/payment/process', async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod } = req.body;
    const payment = await CustomerFinanceEngine.processPayment({
      customerId: MOCK_CUSTOMER_ID,
      invoiceId,
      amount,
      paymentMethod,
      gatewayRef: `TXN-${Date.now()}`
    });
    res.status(200).json({ success: true, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/ledger', async (req, res) => {
  // Return mocked ledger lines if DB empty for UI prototyping
  res.json({
    success: true,
    data: [
      { date: '2026-10-20', type: 'DEBIT', description: 'Invoice INV-10045 Generated', amount: 12500.00, balance: 12500.00 },
      { date: '2026-10-22', type: 'CREDIT', description: 'Payment via Stripe (TXN-99881)', amount: 12500.00, balance: 0.00 },
      { date: '2026-10-24', type: 'DEBIT', description: 'Invoice INV-10046 Generated', amount: 4300.50, balance: 4300.50 }
    ]
  });
});

export default router;
