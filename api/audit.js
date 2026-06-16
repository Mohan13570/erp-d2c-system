const http = require('http');

const endpoints = [
  '/api/inventory',
  '/api/orders',
  '/api/hr',
  '/api/finance',
  '/api/auth/users',
  '/api/supply-chain',
  '/api/manufacturing',
  '/api/projects',
  '/api/assets',
  '/api/returns',
  '/api/crm',
  '/api/marketing',
  '/api/analytics',
  '/api/rbac',
  '/api/equity',
  '/api/d2c',
  '/api/ocean',
  '/api/air',
  '/api/road',
  '/api/warehouse',
  '/api/customs',
  '/api/documents',
  '/api/containers',
  '/api/procurement',
  '/api/billing',
  '/api/insurance',
  '/api/tracking',
  '/api/portals',
  '/api/notifications',
  '/api/bi',
  '/api/ai/logs',
  '/api/shipments',
  '/api/fleet',
  '/api/company-management',
  '/api/quotations'
];

async function check(path) {
  return new Promise(resolve => {
    http.get(`http://localhost:5000${path}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, data: data.substring(0, 100) });
      });
    }).on('error', err => {
      resolve({ path, status: 0, error: err.message });
    });
  });
}

(async () => {
  console.log("Starting audit...");
  const results = [];
  for (const path of endpoints) {
    const res = await check(path);
    results.push(res);
  }
  const failed = results.filter(r => r.status !== 200);
  console.log("FAILED ENDPOINTS:", failed);
  console.log(`Audited ${results.length} endpoints. ${failed.length} failed.`);
})();
