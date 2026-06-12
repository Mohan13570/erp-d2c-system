import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Place an order from the D2C Storefront
router.post('/checkout', async (req: Request, res: Response) => {
  const { customer, items, grandTotal, paymentMethod } = req.body;

  try {
    // 1. Ensure Customer Exists or Create Guest Customer
    let d2cCustomer = await prisma.d2CCustomer.findUnique({
      where: { email: customer.email }
    });

    if (!d2cCustomer) {
      d2cCustomer = await prisma.d2CCustomer.create({
        data: {
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          isGuest: true,
        }
      });
    }

    // 2. Validate Stock Availability before placing order
    for (const item of items) {
      const stock = await prisma.stockLevel.findFirst({
        where: { itemCode: item.itemCode, warehouseName: 'Aura Main Warehouse' }
      });

      if (!stock || stock.qtyAvailable < item.qty) {
        return res.status(400).json({ error: `Insufficient stock for ${item.itemCode}` });
      }
    }

    // 3. Create the SalesOrder transactionally and deduct stock
    const salesOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.create({
        data: {
          d2cCustomerId: d2cCustomer!.id,
          companyName: 'Aura',
          status: 'Confirmed',
          grandTotal: grandTotal,
          channel: 'D2C',
          items: {
            create: items.map((i: any) => ({
              itemCode: i.itemCode,
              qty: i.qty,
              rate: i.price,
              amount: i.qty * i.price
            }))
          }
        }
      });

      // Deduct stock for each item
      for (const item of items) {
        await tx.stockLevel.updateMany({
          where: { itemCode: item.itemCode, warehouseName: 'Aura Main Warehouse' },
          data: {
            qtyOnHand: { decrement: item.qty },
            qtyAvailable: { decrement: item.qty }
          }
        });

        // Add Stock Ledger Entry
        await tx.stockLedgerEntry.create({
          data: {
            itemCode: item.itemCode,
            warehouse: 'Aura Main Warehouse',
            qty: -item.qty, // Negative for deduction
            voucherType: 'Sales Order',
            voucherNo: order.id
          }
        });
      }

      return order;
    });

    res.json({ success: true, orderId: salesOrder.id, message: 'Order placed successfully!' });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Get customer orders
router.get('/orders', async (req: Request, res: Response) => {
  const { email } = req.query;
  try {
    const d2cCustomer = await prisma.d2CCustomer.findUnique({
      where: { email: email as string }
    });
    if (!d2cCustomer) return res.json([]);
    
    const orders = await prisma.salesOrder.findMany({
      where: { d2cCustomerId: d2cCustomer.id },
      include: { items: { include: { item: true } } },
      orderBy: { transactionDate: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
