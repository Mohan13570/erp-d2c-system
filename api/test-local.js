const http = require('http');

async function runTests() {
  console.log("Starting Exhaustive Local DB Tests...");

  const BASE_URL = 'http://localhost:5000/api';
  let token = '';

  // 1. Test Auth (CREATE Session / READ User)
  console.log("\\n[1] Testing Authentication...");
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: "admin@aura.com", password: "admin123"})
    });
    if (!loginRes.ok) throw new Error("Login failed");
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log("✅ Login successful. Token obtained.");
  } catch(e) {
    console.error("❌ Auth Test Failed:", e);
    return;
  }

  // 2. Test Inventory (CREATE)
  console.log("\\n[2] Testing Inventory - Create Item...");
  const newItemCode = 'TEST-ITEM-' + Math.floor(Math.random()*1000);
  try {
    const createRes = await fetch(`${BASE_URL}/inventory/items`, {
      method: "POST", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
      body: JSON.stringify({
        itemCode: newItemCode,
        itemName: "Test Item",
        itemGroup: "Products",
        standardRate: 99.99,
        valuationRate: 50.00,
        initialStock: 10,
        warehouseName: "Aura Main Warehouse"
      })
    });
    if (!createRes.ok) throw new Error(await createRes.text());
    console.log(`✅ Item ${newItemCode} created successfully.`);
  } catch(e) {
    console.error("❌ Inventory Create Test Failed:", e);
  }

  // 3. Test Inventory (READ)
  console.log("\\n[3] Testing Inventory - Read Items...");
  try {
    const readRes = await fetch(`${BASE_URL}/inventory/items`);
    if (!readRes.ok) throw new Error("Failed to fetch items");
    const items = await readRes.json();
    console.log(`✅ Items fetched successfully. Total items: ${items.length}`);
    const found = items.find(i => i.itemCode === newItemCode);
    if(found) console.log(`✅ Found newly created item ${newItemCode} in the list.`);
  } catch(e) {
    console.error("❌ Inventory Read Test Failed:", e);
  }

  // 4. Test Inventory (DELETE)
  console.log("\\n[4] Testing Inventory - Delete Item...");
  try {
    const deleteRes = await fetch(`${BASE_URL}/inventory/items/${newItemCode}`, {
      method: "DELETE", headers: {"Authorization": `Bearer ${token}`}
    });
    if (!deleteRes.ok) throw new Error(await deleteRes.text());
    console.log(`✅ Item ${newItemCode} deleted successfully.`);
  } catch(e) {
    console.error("❌ Inventory Delete Test Failed:", e);
  }

  // 5. Test Customer Store (READ D2C Products)
  console.log("\\n[5] Testing Customer Store API (D2C Products)...");
  try {
    const d2cRes = await fetch(`${BASE_URL}/inventory/items?d2c=true`);
    if (!d2cRes.ok) throw new Error(await d2cRes.text());
    const products = await d2cRes.json();
    console.log(`✅ D2C products fetched successfully. Total products: ${products.length}`);
    
    // 6. Test D2C Checkout (CREATE Order)
    console.log("\\n[6] Testing Customer Store API (Checkout)...");
    const checkoutRes = await fetch(`${BASE_URL}/d2c/checkout`, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        customer: { email: "testd2c@example.com", firstName: "Test", lastName: "Customer", phone: "1234567890" },
        items: [{ itemCode: products[0].itemCode, qty: 1, price: products[0].standardRate }],
        grandTotal: products[0].standardRate,
        paymentMethod: "Credit Card"
      })
    });
    if (!checkoutRes.ok) throw new Error(await checkoutRes.text());
    console.log(`✅ D2C Checkout successful.`);
  } catch(e) {
    console.error("❌ D2C Test Failed:", e);
  }

  console.log("\\n🎉 All automated backend tests completed!");
}

runTests();
