import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { NlpManager } from 'node-nlp';
import { deepTrain } from '../utils/ai-trainer';

const router = Router();
const prisma = new PrismaClient();

// Initialize NLP manager and train intents
const manager = new NlpManager({ languages: ['en'], forceNER: true, nlu: { log: false } });
// Register intents (trainer adds documents)
deepTrain(manager);
let isTrained = false;
(async () => {
  const start = Date.now();
  await manager.train();
  console.log(`[NLP] Neural Network Booted in ${Date.now() - start}ms.`);
  isTrained = true;
})();

router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!isTrained) {
      return res.json({ response: "My neural networks are still booting up. Please give me a moment!", module: "System", log: null });
    }
    const result = await manager.process('en', query);
    const intent = result.intent;
    let response = "I couldn't understand that. Please try a different query.";
    let module = "General";
    switch (intent) {
      case 'fleet.vehicles':
        const vehicles = await prisma.vehicle.findMany({
          select: {
            id: true,
            plateNumber: true,
            type: true,
            capacity: true,
            status: true,
          },
        });
        response = vehicles.length
          ? `Fleet vehicles:\n${vehicles
              .map(v => `ID: ${v.id}, Plate: ${v.plateNumber}, Type: ${v.type}, Capacity: ${v.capacity}, Status: ${v.status}`)
              .join('\n')}`
          : 'No vehicles found.';
        module = "Fleet";
        break;
      case 'shipments.active':
        const activeCount = await prisma.shipment.count({ where: { status: { not: 'Delivered' } } });
        response = `There are currently ${activeCount} active shipments in transit.`;
        module = "Shipments";
        break;
      case 'shipments.delayed':
        const delayed = await prisma.shipment.findMany({
          where: { status: 'Delayed' },
          select: { id: true, trackingNumber: true, status: true, origin: true, destination: true },
        });
        response = delayed.length
          ? `Delayed shipments: ${delayed.map(s => `${s.trackingNumber} (${s.origin}→${s.destination})`).join(', ')}`
          : 'No delayed shipments found.';
        module = "Shipments";
        break;
      case 'airFreight.list':
        const bookings = await prisma.booking.findMany({
          select: { id: true, bookingRef: true, status: true },
        });
        // Explicit type to avoid implicit any
        type BookingInfo = { id: string; bookingRef: string; status: string };
        const bookingInfos = bookings as BookingInfo[];
        response = bookingInfos.length
          ? `Air freight bookings: ${bookingInfos
              .map(b => `${b.id} (${b.bookingRef}, ${b.status})`)
              .join(', ')}`
          : 'No air‑freight records found.';
        module = "AirFreight";
        break;
      // other intents can be added here
      case 'warehouse.inventory':
        const inventory = await prisma.stockLevel.findMany({
          include: {
            item: { select: { itemCode: true, itemName: true } },
            warehouse: { select: { name: true, code: true } }
          }
        });
        if (inventory.length === 0) {
          response = 'No inventory records found.';
        } else {
          const lines = inventory.map(s => `${s.item.itemName} (${s.item.itemCode}) in ${s.warehouse.name}${s.warehouse.code ? ' (' + s.warehouse.code + ')' : ''}: ${s.qtyOnHand} units`);
          response = `Warehouse inventory:\n${lines.join('\n')}`;
        }
        module = "Warehouse";
        break;
      case 'orders.list':
          const orders = await prisma.salesOrder.findMany({
            select: {
              id: true,
              status: true,
              grandTotal: true,
              transactionDate: true,
            },
          });
          response = orders.length
            ? `Orders:\n${orders
                .map(o => `ID: ${o.id}, Status: ${o.status}, Total: $${o.grandTotal.toFixed(2)}, Date: ${new Date(o.transactionDate).toISOString().split('T')[0]}`)
                .join('\n')}`
            : 'No orders found.';
          module = "Orders";
          break;
      case 'customers.list':
        const customers = await prisma.customer.findMany({
          select: {
            id: true,
            customerName: true,
            customerGroup: true,
            territory: true,
            email: true,
            phone: true
          }
        });
        if (customers.length === 0) {
          response = 'No customers found.';
        } else {
          const lines = customers.map(c => `ID: ${c.id}, Name: ${c.customerName}, Group: ${c.customerGroup}, Territory: ${c.territory ?? 'N/A'}, Email: ${c.email ?? 'N/A'}, Phone: ${c.phone ?? 'N/A'}`);
          response = `Customer list:\n${lines.join('\n')}`;
        }
        module = "Customers";
        break;
      case 'finance.summary':
        const revenueAgg = await prisma.invoice.aggregate({
          _sum: { total: true },
          where: { type: 'AR' }
        });
        const expenseAgg = await prisma.invoice.aggregate({
          _sum: { total: true },
          where: { type: 'AP' }
        });
        const revenue = revenueAgg._sum.total ?? 0;
        const expenses = expenseAgg._sum.total ?? 0;
        const net = revenue - expenses;
        response = `Finance Summary:\nRevenue: $${revenue.toFixed(2)}\nExpenses: $${expenses.toFixed(2)}\nNet Profit: $${net.toFixed(2)}`;
        module = "Finance";
        break;
      default:
        // keep generic fallback response
        break;
    }
    const log = await prisma.aIQueryLog.create({ data: { query, response, module } });
    res.json({ response, module, log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process AI query' });
  }
});

router.get('/logs', async (req, res) => {
  try {
    res.json(await prisma.aIQueryLog.findMany({ orderBy: { timestamp: 'desc' }, take: 20 }));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
