import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PricingEngine } from '../services/PricingEngine';

const router = express.Router();
const prisma = new PrismaClient();

// Get Dashboard Metrics
router.get('/dashboard', async (req, res) => {
  try {
    const contractsCount = await prisma.erpPricingContract.count({ where: { status: 'ACTIVE' } });
    const ratesCount = await prisma.erpRateCard.count({ where: { status: 'ACTIVE' } });
    
    // Simulate Margin metrics for Phase 2 UI
    const marginStats = {
       avgOceanMargin: 18.5,
       avgAirMargin: 24.2,
       avgRoadMargin: 12.8,
       totalActiveContracts: contractsCount,
       totalRateCards: ratesCount
    };

    res.json(marginStats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List Standard Rate Cards
router.get('/rates', async (req, res) => {
  try {
    const rates = await prisma.erpRateCard.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(rates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Standard Rate Cards (Utility for testing Phase 2)
router.post('/rates/seed', async (req, res) => {
  try {
    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);

    await prisma.erpRateCard.createMany({
       data: [
         { providerType: 'STANDARD', originCode: 'JFK', destinationCode: 'LHR', transportMode: 'AIR', unitType: 'KG', baseRate: 4.50, validFrom: now, validTo: nextYear },
         { providerType: 'STANDARD', originCode: 'SHA', destinationCode: 'LAX', transportMode: 'OCEAN', unitType: 'FEU', baseRate: 3500.00, validFrom: now, validTo: nextYear },
         { providerType: 'STANDARD', originCode: 'HAM', destinationCode: 'DXB', transportMode: 'OCEAN', unitType: 'TEU', baseRate: 1800.00, validFrom: now, validTo: nextYear },
         { providerType: 'STANDARD', originCode: 'MIA', destinationCode: 'ATL', transportMode: 'ROAD', unitType: 'KG', baseRate: 0.85, validFrom: now, validTo: nextYear },
       ]
    });

    await prisma.erpSurchargeRule.create({
       data: {
          chargeType: 'FUEL',
          transportMode: 'ALL',
          calculationType: 'PERCENTAGE',
          amount: 15.0,
          validFrom: now,
          validTo: nextYear
       }
    });

    res.json({ message: "Seeded Rates & Surcharges successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List Customer Contracts
router.get('/contracts', async (req, res) => {
  try {
    const contracts = await prisma.erpPricingContract.findMany({
      include: { rates: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(contracts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Customer Contract
router.post('/contracts', async (req, res) => {
  try {
    const { customerId, validFrom, validTo, discountPercent, rates } = req.body;
    const contract = await prisma.erpPricingContract.create({
      data: {
        contractNumber: `CTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        customerId,
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        discountPercent,
        rates: {
          create: rates
        }
      },
      include: { rates: true }
    });
    res.status(201).json(contract);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Live Charge Calculator
router.post('/calculate', async (req, res) => {
  try {
    const result = await PricingEngine.calculateShipmentCost(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
