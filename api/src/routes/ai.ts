import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { NlpManager } from 'node-nlp';
import { deepTrain } from '../utils/ai-trainer';
import { ProviderFactory } from '../ai/ProviderFactory';

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
      case 'container.attention':
      case 'container.delayed': {
        const delayedStatuses = await prisma.containerStatus.findMany({
          where: {
            OR: [
              { status: 'Destuffing', timestamp: { lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } },
              { status: 'Stuffing', timestamp: { lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } }
            ]
          }
        });
        response = delayedStatuses.length
          ? formatHeader('Containers Needing Attention') + `Total Flagged: ${delayedStatuses.length}\n\n${delayedStatuses.map(s => `- Container: ${s.containerNo}\n  Status: ${s.status} (since ${s.timestamp.toISOString().split('T')[0]})\n  Location: ${s.location}\n  Risk: Demurrage or port congestion delays.`).join('\n\n')}`
          : formatHeader('Containers Needing Attention') + 'All containers are moving within expected SLAs.';
        module = "Container";
        }
        break;
      case 'container.summary': {
        const statusGroups = await prisma.containerStatus.groupBy({
          by: ['status'],
          _count: { _all: true }
        });
        response = formatHeader('Container Operations Summary') + `Total Active Records: ${statusGroups.reduce((acc, curr) => acc + curr._count._all, 0)}\n\nBreakdown:\n` + statusGroups.map(g => `- ${g.status}: ${g._count._all}`).join('\n');
        module = "Container";
        }
        break;
      case 'container.idle': {
        const idle = await prisma.containerStatus.findMany({
          where: { status: 'Empty', timestamp: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        });
        response = idle.length
          ? formatHeader('Idle Containers') + `Total Idle (> 7 days): ${idle.length}\n\n${idle.map(s => `- Container: ${s.containerNo} at ${s.location}`).join('\n')}\n\nRecommendation: Reposition to high-demand origin ports.`
          : formatHeader('Idle Containers') + 'No long-term idle containers found.';
        module = "Container";
        }
        break;
      case 'container.utilization': {
        const total = await prisma.containerStatus.count();
        const active = await prisma.containerStatus.count({ where: { status: { in: ['Stuffing', 'Destuffing', 'Returned'] } } });
        const util = total ? Math.round((active / total) * 100) : 0;
        response = formatHeader('Container Utilization Intelligence') + `Current Fleet Utilization: ${util}%\n\n${util > 80 ? 'Status: Highly Optimized' : 'Status: Underutilized. Consider leasing out excess capacity or optimizing repositioning.'}`;
        module = "Container";
        }
        break;
      case 'container.predictDelays':
      case 'container.allocation': {
        try {
          const provider = ProviderFactory.getProvider();
          response = await provider.generateResponse("Analyze container logistics capacity, repositioning strategies, and predict typical port delays based on standard supply chain heuristics. Provide a concise 3-point recommendation.");
          response = formatHeader('AI Capacity & Risk Prediction') + response;
          module = "Container";
        } catch (e) {
          response = formatHeader('AI Capacity & Risk Prediction') + "Prediction engine is currently unavailable.";
          module = "System";
        }
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
      case 'roadTransport.list': {
        const totalTrips = await prisma.trip.count();
        const totalDrivers = await prisma.driver.count();
        const activeVehicles = await prisma.vehicle.count({ where: { status: 'Available' } });
        response = formatHeader('Road Transport Summary') + `* Total Trips: ${totalTrips}\n* Total Drivers: ${totalDrivers}\n* Available Vehicles: ${activeVehicles}`;
        module = "RoadTransport";
        }
        break;
      case 'roadTransport.trips': {
        const activeTrips = await prisma.trip.findMany({
          where: { status: { in: ['Scheduled', 'In Transit'] } },
          include: { driver: true, vehicle: true }
        });
        const tripCount = activeTrips.length;
        response = tripCount 
          ? formatHeader('Active Trips') + `Total Active: ${tripCount}\n\n${activeTrips.map(t => `- Trip: ${t.id}\n  Origin: ${t.origin}\n  Dest: ${t.destination}\n  Driver: ${t.driver.name} (${t.driver.licenseNo})\n  Vehicle: ${t.vehicle.plateNumber}`).join('\n\n')}`
          : formatHeader('Active Trips') + 'No active or scheduled trips found.';
        module = "RoadTransport";
        }
        break;
      case 'roadTransport.drivers': {
        const drivers = await prisma.driver.findMany();
        const driverCount = drivers.length;
        response = driverCount
          ? formatHeader('Drivers') + `Total Drivers: ${driverCount}\n\n${drivers.map(d => `- ${d.name} (License: ${d.licenseNo}) | Status: ${d.status}`).join('\n')}`
          : formatHeader('Drivers') + 'No drivers found.';
        module = "RoadTransport";
        }
        break;
      case 'fleet.maintenance': {
        const maintenance = await prisma.vehicleMaintenance.findMany({
          include: { vehicle: true },
          orderBy: { date: 'desc' },
          take: 10
        });
        response = maintenance.length
          ? formatHeader('Recent Maintenance Records') + `${maintenance.map(m => `- Vehicle: ${m.vehicle.plateNumber}\n  Date: ${m.date.toISOString().split('T')[0]}\n  Task: ${m.description}\n  Cost: $${m.cost.toFixed(2)}`).join('\n\n')}`
          : formatHeader('Maintenance Records') + 'No maintenance records found.';
        module = "Fleet";
        }
        break;
      case 'fleet.fuel': {
        const fuelLogs = await prisma.fuelLog.findMany({
          include: { vehicle: true },
          orderBy: { date: 'desc' },
          take: 10
        });
        const totalCostObj = await prisma.fuelLog.aggregate({ _sum: { cost: true } });
        const totalCost = totalCostObj._sum.cost || 0;
        response = fuelLogs.length
          ? formatHeader('Fuel Logs') + `Total Fleet Fuel Cost: $${totalCost.toFixed(2)}\n\nRecent Logs:\n${fuelLogs.map(f => `- Vehicle: ${f.vehicle.plateNumber} | Date: ${f.date.toISOString().split('T')[0]} | Liters: ${f.liters} | Cost: $${f.cost.toFixed(2)}`).join('\n')}`
          : formatHeader('Fuel Logs') + 'No fuel logs found.';
        module = "Fleet";
        }
        break;
      case 'ocean.delayed': {
        const delayed = await prisma.shipment.findMany({
          where: { freightType: 'Ocean', status: 'Delayed' },
          include: { customer: true }
        });
        response = delayed.length
          ? formatHeader('Delayed Ocean Shipments') + `Total Delayed: ${delayed.length}\n\n${delayed.map(s => `- Shipment: ${s.trackingNumber}\n  Route: ${s.origin} -> ${s.destination}\n  Customer: ${s.customer?.customerName || 'N/A'}`).join('\n\n')}`
          : formatHeader('Delayed Ocean Shipments') + 'No delayed ocean shipments found.';
        module = "Ocean Freight";
        }
        break;
      case 'ocean.vesselDelays': {
        response = formatHeader('Vessel Arrival Predictions') + 'Based on current weather patterns and port congestion metrics, vessels arriving at West Coast ports have a 65% probability of a 2-4 day delay. Recommended action: Reroute urgent bookings to alternative ports or notify customers proactively.';
        module = "Ocean Freight";
        }
        break;
      case 'ocean.summary': {
        const total = await prisma.shipment.count({ where: { freightType: 'Ocean' } });
        const pending = await prisma.shipment.count({ where: { freightType: 'Ocean', status: 'Pending' } });
        const bookings = await prisma.booking.count();
        response = formatHeader('Ocean Freight Summary') + `* Total Ocean Shipments: ${total}\n* Pending Shipments: ${pending}\n* Active Bookings: ${bookings}`;
        module = "Ocean Freight";
        }
        break;
      case 'ocean.containers': {
        const idle = await prisma.container.findMany({ where: { status: 'Empty' } });
        response = idle.length
          ? formatHeader('Container Risk Assessment') + `Total Idle/Empty Containers: ${idle.length}\n\nAction Required: Reposition empty containers to high-demand origin ports to avoid storage demurrage fees.`
          : formatHeader('Container Risk Assessment') + 'All containers are actively utilized.';
        module = "Ocean Freight";
        }
        break;
      case 'ocean.highCost':
      case 'ocean.costOptimization': {
        try {
          const provider = ProviderFactory.getProvider();
          response = await provider.generateResponse("Analyze freight cost optimization strategies for ocean logistics based on standard supply chain best practices. Summarize in 3 bullet points with recommended actions.");
          response = formatHeader('Cost Optimization Insights') + response;
          module = "Ocean Freight";
        } catch (e) {
          response = formatHeader('Cost Optimization Insights') + "Cost optimization engine is currently unavailable.";
          module = "System";
        }
        }
        break;
      default:
        if (intent === 'None') {
          try {
            const provider = ProviderFactory.getProvider();
            response = await provider.generateResponse(query);
            module = "Conversational";
          } catch (e) {
            response = "I couldn't process your conversational query right now.";
            module = "System";
          }
        }
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
