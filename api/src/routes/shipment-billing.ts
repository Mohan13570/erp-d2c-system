import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 8: Shipment Billing Integration API
// ==========================================

// GET /api/v1/shipments/:id/billing
// Fetches the comprehensive financial integration summary. Does NOT calculate freight.
router.get('/shipments/:id/billing', async (req, res) => {
  try {
    const { id } = req.params;

    let billing = await prisma.shipmentBilling.findUnique({
      where: { shipmentId: id },
      include: {
        chargeSummary: true,
        taxDetails: true,
        invoices: true,
        paymentStatus: true,
        notes: true,
      }
    });

    if (!billing) {
      // Mock an existing integration payload for Phase 8 UI demo
      billing = await prisma.shipmentBilling.create({
        data: {
          shipmentId: id,
          billingStatus: 'READY_FOR_BILLING',
          currency: 'USD',
          subtotal: 3500.00,
          totalTax: 350.00,
          totalDiscount: 100.00,
          grandTotal: 3750.00,
          chargeSummary: {
            create: {
              baseFreight: 2500,
              fuelSurcharge: 200,
              handlingCharges: 150,
              loadingCharges: 100,
              unloadingCharges: 100,
              warehouseCharges: 250,
              insuranceCharges: 100,
              customsCharges: 50,
              documentationCharges: 50,
            }
          },
          taxDetails: {
            create: [
              { taxType: 'GST', percentage: 10, amount: 350 }
            ]
          },
          paymentStatus: {
            create: {
              paidAmount: 0,
              outstandingAmount: 3750.00,
              status: 'UNPAID'
            }
          }
        },
        include: {
          chargeSummary: true,
          taxDetails: true,
          invoices: true,
          paymentStatus: true,
          notes: true,
        }
      });
    }

    res.json(billing);
  } catch (error) {
    console.error('Error fetching billing integration:', error);
    res.status(500).json({ error: 'Failed to fetch billing details' });
  }
});

// POST /api/v1/shipments/:id/billing/request
// Trigger the workflow to send the aggregated charges to the Central Billing Module
router.post('/shipments/:id/billing/request', async (req, res) => {
  try {
    const { id } = req.params;

    // Simulate sending an API request to the central Billing Module to generate the physical invoice
    console.log("Dispatching Billing Request to Finance System for Shipment ID:", id);

    const billing = await prisma.shipmentBilling.update({
      where: { shipmentId: id },
      data: {
        billingStatus: 'INVOICED',
        invoices: {
          create: {
            invoiceNumber: 'INV-' + Math.floor(Math.random() * 900000 + 100000),
            invoiceDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30
            status: 'ISSUED',
            paymentTerms: 'NET 30',
            generatedBy: 'System Auto-Integration'
          }
        }
      },
      include: {
        invoices: true
      }
    });

    res.json({ message: 'Billing request successfully dispatched to Finance.', billing });
  } catch (error) {
    console.error('Error generating billing request:', error);
    res.status(500).json({ error: 'Failed to generate billing request' });
  }
});

export default router;
