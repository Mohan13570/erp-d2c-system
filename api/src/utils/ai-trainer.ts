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

  // ---------- Air Freight ----------
  manager.addDocument('en', 'show air freight bookings', 'airFreight.list');
  manager.addDocument('en', 'list all air freight', 'airFreight.list');
  manager.addDocument('en', 'air freight bookings', 'airFreight.list');

  // ---------- Ocean Freight ----------
  manager.addDocument('en', 'list ocean freight shipments', 'oceanFreight.list');
  manager.addDocument('en', 'show ocean freight bookings', 'oceanFreight.list');
  manager.addDocument('en', 'how many ocean freight shipments are pending', 'oceanFreight.list');

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
};
