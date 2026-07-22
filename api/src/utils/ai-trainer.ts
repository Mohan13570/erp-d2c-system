// api/src/utils/ai-trainer.ts
// Registers NLP intents for the ERP D2C system.
// This file is imported by api/src/routes/ai.ts.



/**
 * Register all ERP related intents with representative utterances.
 * The function is called during server start to train the NlpManager.
 */
export const deepTrain = (manager: any) => {
  // ---------- Shipments ----------
  manager.addDocument('en', 'how many active shipments are there', 'shipments.active');
  manager.addDocument('en', 'list active shipments', 'shipments.active');
  manager.addDocument('en', 'active shipments count', 'shipments.active');
manager.addDocument('en', 'show delayed shipments', 'shipments.delayed');
manager.addDocument('en', 'show warehouse inventory', 'warehouse.inventory');
manager.addDocument('en', 'show fleet vehicles', 'fleet.vehicles');
manager.addDocument('en', 'list all fleet vehicles', 'fleet.vehicles');
manager.addDocument('en', 'display available vehicles', 'fleet.vehicles');
manager.addDocument('en', 'fleet vehicle list', 'fleet.vehicles');
 manager.addDocument('en', 'list vehicles', 'fleet.vehicles');
 manager.addDocument('en', 'show all orders', 'orders.list');
 manager.addDocument('en', 'list customer orders', 'orders.list');
 manager.addDocument('en', 'display pending orders', 'orders.list');
 manager.addDocument('en', 'show recent orders', 'orders.list');
 manager.addDocument('en', 'view order details', 'orders.list');
manager.addDocument('en', 'list inventory', 'warehouse.inventory');
manager.addDocument('en', 'show stock levels', 'warehouse.inventory');
manager.addDocument('en', 'current warehouse stock', 'warehouse.inventory');
manager.addDocument('en', 'list delayed shipments', 'shipments.delayed');
manager.addDocument('en', 'which shipments are delayed', 'shipments.delayed');
// ---------- Reports ----------
manager.addDocument('en', 'sales report', 'reports.sales');
manager.addDocument('en', 'inventory report', 'reports.inventory');
manager.addDocument('en', 'order report', 'reports.orders');
manager.addDocument('en', 'customer report', 'reports.customers');
manager.addDocument('en', 'revenue summary', 'reports.revenue');

  // ---------- Air Freight ----------
  // List all air freight bookings
  manager.addDocument('en', 'show air freight bookings', 'airFreight.list');
  manager.addDocument('en', 'list all air freight', 'airFreight.list');
  manager.addDocument('en', 'air freight bookings', 'airFreight.list');
  // Show air shipments
  manager.addDocument('en', 'show air shipments', 'airFreight.showShipments');
  manager.addDocument('en', 'list air shipments', 'airFreight.showShipments');
  // Show airway bills
  manager.addDocument('en', 'show airway bills', 'airFreight.showWaybills');
  manager.addDocument('en', 'list airway bills', 'airFreight.showWaybills');
  // Show delayed flights
  manager.addDocument('en', 'show delayed flights', 'airFreight.delayedFlights');
  manager.addDocument('en', 'list delayed flights', 'airFreight.delayedFlights');
  // Air freight summary
  manager.addDocument('en', 'air freight summary', 'airFreight.summary');
  manager.addDocument('en', 'give me an air freight summary', 'airFreight.summary');

  // ---------- Ocean Freight ----------
  manager.addDocument('en', 'list ocean freight shipments', 'oceanFreight.list');
  manager.addDocument('en', 'show ocean freight bookings', 'oceanFreight.list');
  manager.addDocument('en', 'how many ocean freight shipments are pending', 'oceanFreight.list');
  // Ocean AI
  manager.addDocument('en', 'show delayed ocean shipments', 'ocean.delayed');
  manager.addDocument('en', 'which shipments are arriving late', 'ocean.delayed');
  manager.addDocument('en', 'predict vessel arrival delays', 'ocean.vesselDelays');
  manager.addDocument('en', 'summarize today ocean freight operations', 'ocean.summary');
  manager.addDocument('en', 'which containers need attention', 'ocean.containers');
  manager.addDocument('en', 'find high cost shipments', 'ocean.highCost');
  manager.addDocument('en', 'suggest freight cost optimization', 'ocean.costOptimization');
  // ---------- Container Management ----------
  manager.addDocument('en', 'show all containers', 'container.showAll');
  manager.addDocument('en', 'list all containers', 'container.showAll');
  manager.addDocument('en', 'container status', 'container.status');
  manager.addDocument('en', 'show empty containers', 'container.empty');
  manager.addDocument('en', 'list empty containers', 'container.empty');
  manager.addDocument('en', 'show loaded containers', 'container.loaded');
  manager.addDocument('en', 'list loaded containers', 'container.loaded');
  manager.addDocument('en', 'show containers in transit', 'container.inTransit');
  manager.addDocument('en', 'list containers in transit', 'container.inTransit');
  // Container AI Insights
  manager.addDocument('en', 'show containers needing attention', 'container.attention');
  manager.addDocument('en', 'which containers are at risk', 'container.attention');
  manager.addDocument('en', 'summarize container operations', 'container.summary');
  manager.addDocument('en', 'find idle containers', 'container.idle');
  manager.addDocument('en', 'identify delayed containers', 'container.delayed');
  manager.addDocument('en', 'predict container delays', 'container.predictDelays');
  manager.addDocument('en', 'analyze container utilization', 'container.utilization');
  manager.addDocument('en', 'recommend container allocation', 'container.allocation');

  // ---------- Warehouse ----------
  manager.addDocument('en', 'what is the current warehouse stock', 'warehouse.stock');
  manager.addDocument('en', 'list items in warehouse', 'warehouse.stock');
  manager.addDocument('en', 'warehouse inventory', 'warehouse.stock');

  // ---------- Fleet ----------
  manager.addDocument('en', 'show fleet status', 'fleet.status');
  manager.addDocument('en', 'list all vehicles', 'fleet.status');
  manager.addDocument('en', 'fleet availability', 'fleet.status');

  // ---------- Inventory ----------
  manager.addDocument('en', 'low inventory items', 'inventory.low');
  manager.addDocument('en', 'items below reorder level', 'inventory.low');
  manager.addDocument('en', 'inventory shortage', 'inventory.low');

  // ---------- Finance ----------
  manager.addDocument('en', 'current revenue', 'finance.revenue');
  manager.addDocument('en', 'show financial summary', 'finance.revenue');
  manager.addDocument('en', 'total sales this month', 'finance.revenue');
manager.addDocument('en', 'Give me a finance summary', 'finance.summary');
manager.addDocument('en', 'Show finance summary', 'finance.summary');
manager.addDocument('en', 'Financial overview', 'finance.summary');
manager.addDocument('en', 'Show financial summary', 'finance.summary');
manager.addDocument('en', 'Finance report', 'finance.summary');

  // ---------- CRM ----------
  manager.addDocument('en', 'list recent customers', 'crm.customers');
  manager.addDocument('en', 'show CRM contacts', 'crm.customers');
  manager.addDocument('en', 'who are the top customers', 'crm.customers');
  manager.addDocument('en', 'show all customers', 'customers.list');
  manager.addDocument('en', 'list customers', 'customers.list');
  manager.addDocument('en', 'display customer details', 'customers.list');
  manager.addDocument('en', 'show customer information', 'customers.list');
  manager.addDocument('en', 'view customer records', 'customers.list');

  // You can extend with more utterances as needed.

  // ---------- Road Transport & Fleet Additions ----------
  manager.addDocument('en', 'road transport', 'roadTransport.list');
  manager.addDocument('en', 'show road transport', 'roadTransport.list');
  manager.addDocument('en', 'road transport summary', 'roadTransport.list');
  manager.addDocument('en', 'overview of road transport', 'roadTransport.list');
  manager.addDocument('en', 'road transport dashboard', 'roadTransport.list');
  manager.addDocument('en', 'how is road transport doing', 'roadTransport.list');
  manager.addDocument('en', 'road transport stats', 'roadTransport.list');

  // roadTransport.trips
  manager.addDocument('en', 'show active trips', 'roadTransport.trips');
  manager.addDocument('en', 'list road trips', 'roadTransport.trips');
  manager.addDocument('en', 'what trips are scheduled', 'roadTransport.trips');
  manager.addDocument('en', 'display transport trips', 'roadTransport.trips');
  manager.addDocument('en', 'show me all trips', 'roadTransport.trips');

  // roadTransport.drivers
  manager.addDocument('en', 'show our drivers', 'roadTransport.drivers');
  manager.addDocument('en', 'list all drivers', 'roadTransport.drivers');
  manager.addDocument('en', 'driver availability', 'roadTransport.drivers');
  manager.addDocument('en', 'who are the drivers', 'roadTransport.drivers');
  manager.addDocument('en', 'truck drivers list', 'roadTransport.drivers');

  // fleet.maintenance
  manager.addDocument('en', 'show vehicle maintenance', 'fleet.maintenance');
  manager.addDocument('en', 'fleet repair logs', 'fleet.maintenance');
  manager.addDocument('en', 'maintenance records', 'fleet.maintenance');
  manager.addDocument('en', 'vehicle repairs', 'fleet.maintenance');

  // fleet.fuel
  manager.addDocument('en', 'show fleet fuel consumption', 'fleet.fuel');
  manager.addDocument('en', 'fuel logs', 'fleet.fuel');
  manager.addDocument('en', 'how much are we spending on fuel', 'fleet.fuel');
  manager.addDocument('en', 'fleet fuel costs', 'fleet.fuel');

  // conversational and documents fallback
  manager.addDocument('en', 'document assistant', 'ai.documents');
  manager.addDocument('en', 'extract information from file', 'ai.documents');
  manager.addDocument('en', 'hello', 'None');
  manager.addDocument('en', 'hi', 'None');
  manager.addDocument('en', 'who are you', 'None');

};
