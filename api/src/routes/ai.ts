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

// Helper to format section headings for ERP style responses
function formatHeader(title: string): string {
  return `\n=== ${title} ===\n\n`;
}
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
      case 'fleet.vehicles': {
        const vehicles = await prisma.vehicle.findMany({
          select: {
            id: true,
            plateNumber: true,
            type: true,
            capacity: true,
            status: true,
          },
        });
        const statusSummary = await prisma.vehicle.groupBy({
          by: ['status'],
          _count: { _all: true }
        });
        const summaryText = statusSummary.map(s => `${s.status}: ${s._count._all}`).join(', ');
        response = vehicles.length
  ? `${formatHeader('Fleet Vehicles')}Total Vehicles: ${vehicles.length}\nStatus: ${summaryText}\n\n${vehicles.map(v => `- ID: ${v.id}\n  Plate: ${v.plateNumber}\n  Type: ${v.type}\n  Capacity: ${v.capacity}\n  Status: ${v.status}`).join('\n\n')}`
  : `${formatHeader('Fleet Vehicles')}No vehicles found.`;
        module = "Fleet";
        }
        break;
      case 'shipments.active': {
        const activeCount = await prisma.shipment.count({ where: { status: { not: 'Delivered' } } });
        response = `${formatHeader('Active Shipments')}Total Active Shipments: ${activeCount}`;
        module = "Shipments";
        }
        break;
      case 'shipments.delayed': {
          const delayed = await prisma.shipment.findMany({
            where: { status: 'Delayed' },
            select: { id: true, trackingNumber: true, status: true, origin: true, destination: true },
          });
          const delayedCount = delayed.length;
          response = delayedCount
            ? `${formatHeader('Delayed Shipments')}Total Delayed: ${delayedCount}\n${delayed.map(s => `- ${s.trackingNumber} (${s.origin} → ${s.destination})`).join('\n')}`
            : `${formatHeader('Delayed Shipments')}No delayed shipments found.`;
          module = "Shipments";

        break;
    }
      case 'airFreight.list': {
          const bookings = await prisma.booking.findMany({
            select: { id: true, bookingRef: true, status: true },
          });
          const totalBookings = bookings.length;
          const statusAgg = await prisma.booking.groupBy({
            by: ['status'],
            _count: { _all: true },
          });
          response = totalBookings
            ? `${formatHeader('Air Freight Bookings')}Total Bookings: ${totalBookings}\n${statusAgg.map(sa => `- ${sa.status}: ${sa._count._all}`).join('\n')}`
            : `${formatHeader('Air Freight Bookings')}No bookings found.`;
          module = "AirFreight";
          }
        break;
      case 'airFreight.total': {
        const totalAir = await prisma.booking.count();
        response = `${formatHeader('Air Freight Stats')}There are currently ${totalAir} air freight bookings in the system.`;
        module = "AirFreight";
        }
        break;
      case 'airFreight.pending': {
        const pendingAir = await prisma.booking.findMany({
          where: { status: 'Pending' },
          select: { bookingRef: true }
        });
        const totalPending = pendingAir.length;
        response = totalPending
          ? `${formatHeader('Pending Air Freight Bookings')}Total Pending: ${totalPending}\n${pendingAir.map(b => `- ${b.bookingRef}`).join('\n')}`
          : `${formatHeader('Pending Air Freight Bookings')}No pending air freight bookings.`;
        module = "AirFreight";
                }
        break;
      // other intents can be added here
      // Air Freight extended intents
      case 'airFreight.showShipments': {
        const airShips = await prisma.airShipment.findMany({
          include: { awb: true, flight: true }
        });
        const totalAirShips = airShips.length;
        response = totalAirShips
          ? `${formatHeader('Air Shipments')}Total Shipments: ${totalAirShips}\n${airShips.map(s => `- ID: ${s.id}\n  AWB: ${s.awb?.awbNumber || 'N/A'}\n  Flight: ${s.flight?.flightNo || 'N/A'}\n  Status: ${s.status}`).join('\n\n')}`
          : `${formatHeader('Air Shipments')}No air shipments found.`;
        module = "AirFreight";
                }
        break;
      case 'airFreight.showWaybills': {
        const awbs = await prisma.airWaybill.findMany({});
        const totalAwbs = awbs.length;
        response = totalAwbs
          ? `${formatHeader('Airway Bills')}Total Waybills: ${totalAwbs}\n${awbs.map(a => `- AWB: ${a.awbNumber}\n  Origin: ${a.origin}\n  Destination: ${a.destination}\n  Status: ${a.status}`).join('\n\n')}`
          : `${formatHeader('Airway Bills')}No airway bills found.`;
        module = "AirFreight";
                }
        break;
      // Container Management intents
      case 'container.showAll': {
          const containers = await prisma.container.findMany({
            select: { id: true, containerNo: true, type: true, status: true }
          });
          const totalContainers = containers.length;
          const statusAgg = await prisma.container.groupBy({
            by: ['status'],
            _count: { _all: true },
          });
          response = totalContainers
            ? `${formatHeader('Containers')}Total Containers: ${totalContainers}\n${statusAgg.map(sc => `- ${sc.status}: ${sc._count._all}`).join('\n')}\n\n${containers.map(c => `- ID: ${c.id}\n  No: ${c.containerNo}\n  Type: ${c.type}\n  Status: ${c.status}`).join('\n\n')}`
            : `${formatHeader('Containers')}No containers found.`;
          module = "Container";
          }
        break;
      case 'container.status': {
        const statusCounts = await prisma.container.groupBy({
          by: ['status'],
          _count: { _all: true }
        });
        const totalContainers = await prisma.container.count();
        response = statusCounts.length
            ? `${formatHeader('Container Status Summary')}Total Containers: ${totalContainers}\n${statusCounts
                .map(sc => `- ${sc.status}: ${sc._count._all}`)
                .join('\n')}`
            : `${formatHeader('Container Status Summary')}No container status data.`;
        module = "Container";
        }
        break;
      case 'container.empty': {
        const emptyContainers = await prisma.container.findMany({
          where: { status: 'Empty' },
          select: { id: true, containerNo: true, type: true }
        });
        const totalEmpty = await prisma.container.count({ where: { status: 'Empty' } });
        response = totalEmpty
            ? `${formatHeader('Empty Containers Summary')}Total Empty Containers: ${totalEmpty}\n${emptyContainers
                .map(c => `- ID: ${c.id}\n  No: ${c.containerNo}\n  Type: ${c.type}`)
                .join('\n')}`
            : `${formatHeader('Empty Containers Summary')}No empty containers found.`;
        module = "Container";
        }
        break;
      case 'container.loaded': {
        const loadedContainers = await prisma.container.findMany({
          where: { status: 'Loaded' },
          select: { id: true, containerNo: true, type: true }
        });
        const totalLoaded = await prisma.container.count({ where: { status: 'Loaded' } });
        response = totalLoaded
            ? `${formatHeader('Loaded Containers Summary')}Total Loaded Containers: ${totalLoaded}\n${loadedContainers
                .map(c => `- ID: ${c.id}\n  No: ${c.containerNo}\n  Type: ${c.type}`)
                .join('\n')}`
            : `${formatHeader('Loaded Containers Summary')}No loaded containers found.`;
        module = "Container";
        }
        break;
      case 'container.inTransit': {
        const inTransitMovements = await prisma.containerMovement.findMany({
          where: { status: 'In Transit' },
          include: { container: { select: { id: true, containerNo: true, type: true } } }
        });
        const totalInTransit = await prisma.containerMovement.count({ where: { status: 'In Transit' } });
        response = inTransitMovements.length
            ? `${formatHeader('Containers In Transit')}Total In Transit: ${totalInTransit}\n${inTransitMovements
                .map(m => `- Container ID: ${m.container.id}\n  No: ${m.container.containerNo}\n  Type: ${m.container.type}\n  Location: ${m.location}\n  Timestamp: ${m.timestamp.toISOString()}`)
                .join('\n\n')}`
            : `${formatHeader('Containers In Transit')}No containers in transit found.`;
        module = "Container";
        }
        break;
      case 'airFreight.delayedFlights': {
        const delayedFlights = await prisma.flight.findMany();
        const totalDelayed = delayedFlights.length;
        response = totalDelayed
          ? `${formatHeader('Delayed Flights')}Total Delayed Flights: ${totalDelayed}\n${delayedFlights.map(f => `- Flight: ${f.flightNo} (${f.airline})\n  Route: ${f.origin} → ${f.destination}\n  Schedule: ${f.departure.toISOString()} - ${f.arrival.toISOString()}`).join('\n\n')}`
          : `${formatHeader('Delayed Flights')}No delayed flights found.`;
        module = "AirFreight";
        }
        break;
      case 'airFreight.summary': {
        const totalBookings = await prisma.booking.count();
        const totalFlights = await prisma.flight.count();
        const totalShipments = await prisma.airShipment.count();
        response = `${formatHeader('Air Freight Summary')}* Total Bookings: ${totalBookings}\n* Active Flights: ${totalFlights}\n* Total Shipments: ${totalShipments}`;
        module = "AirFreight";
                }
        break;
      case 'warehouse.inventory': {
        const inventory = await prisma.stockLevel.findMany({
          include: {
            item: { select: { itemCode: true, itemName: true } },
            warehouse: { select: { name: true, code: true } }
          }
        });
        if (inventory.length === 0) {
          response = `${formatHeader('Warehouse Inventory')}No inventory records found.`;
        } else {
          const lines = inventory.map(s => `- ${s.item.itemName} (${s.item.itemCode})\n  Location: ${s.warehouse.name}${s.warehouse.code ? ' (' + s.warehouse.code + ')' : ''}\n  Qty On Hand: ${s.qtyOnHand} units`);
          response = `${formatHeader('Warehouse Inventory')}${lines.join('\n')}`;
        }
        module = "Warehouse";
                }
        break;
      case 'orders.list': {
          const orders = await prisma.salesOrder.findMany({
            select: {
              id: true,
              status: true,
              grandTotal: true,
              transactionDate: true,
            },
          });
          const totalOrders = orders.length;
          const statusAgg = await prisma.salesOrder.groupBy({
            by: ['status'],
            _count: { _all: true },
          });
          response = totalOrders
            ? `${formatHeader('Orders Summary')}Total Orders: ${totalOrders}\n${statusAgg.map(sa => `- ${sa.status}: ${sa._count._all}`).join('\n')}\n\nRecent Orders\n${orders.map(o => `- ${o.id} | ${o.status} | $${o.grandTotal.toFixed(2)} | ${new Date(o.transactionDate).toISOString().split('T')[0]}`).join('\n')}`
            : `${formatHeader('Orders')}No orders found.`;
          module = "Orders";
                  }
        break;
      case 'customers.list': {
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
        const totalCustomers = customers.length;
        if (totalCustomers === 0) {
          response = `${formatHeader('Customers')}No customers found.`;
        } else {
          const lines = customers.map(c => `- ID: ${c.id}\n  Name: ${c.customerName}\n  Group: ${c.customerGroup}\n  Territory: ${c.territory ?? 'N/A'}\n  Email: ${c.email ?? 'N/A'}\n  Phone: ${c.phone ?? 'N/A'}`);
          response = `${formatHeader('Customers')}Total Customers: ${totalCustomers}\n${lines.join('\n\n')}`;
        }
        module = "Customers";
                }
        break;
      case 'finance.summary': {
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
        response = `${formatHeader('Finance Summary')}* Revenue: $${revenue.toFixed(2)}\n* Expenses: $${expenses.toFixed(2)}\n* Net Profit: $${net.toFixed(2)}`;
        module = "Finance";
                }
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
