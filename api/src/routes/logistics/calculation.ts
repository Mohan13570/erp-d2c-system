import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const packageSchema = z.object({
  bookingId: z.string().uuid(),
  packageType: z.string(),
  quantity: z.number().int().positive(),
  description: z.string().optional(),
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  unit: z.enum(['CM', 'IN']),
  actualWeight: z.number().positive(),
  weightUnit: z.enum(['KG', 'LBS']),
  serviceType: z.enum(['Ocean', 'Air', 'Road']),
});

router.post('/calculate', async (req, res) => {
  try {
    const data = packageSchema.parse(req.body);

    // 1. Calculate Dimensions (Convert to CM and KG if needed for standard metric)
    let lengthCm = data.unit === 'IN' ? data.length * 2.54 : data.length;
    let widthCm = data.unit === 'IN' ? data.width * 2.54 : data.width;
    let heightCm = data.unit === 'IN' ? data.height * 2.54 : data.height;
    let weightKg = data.weightUnit === 'LBS' ? data.actualWeight * 0.453592 : data.actualWeight;

    // CBM = L * W * H (in meters) * quantity
    const volumeCBM = (lengthCm / 100) * (widthCm / 100) * (heightCm / 100) * data.quantity;
    const volumeCFT = volumeCBM * 35.3147;

    // Volumetric Divisor (Air = 6000, Ocean/Road = 1000 standard metric for CBM)
    // Often 1 CBM = 167 kg for Air, 1 CBM = 333 kg for Road, 1 CBM = 1000 kg for Ocean
    let volumetricDivisor = 6000;
    if (data.serviceType === 'Ocean') volumetricDivisor = 1000;
    if (data.serviceType === 'Road') volumetricDivisor = 3000;

    // Volumetric Weight (L*W*H in CM / Divisor)
    const volumetricWeight = ((lengthCm * widthCm * heightCm) / volumetricDivisor) * data.quantity;

    // Chargeable Weight (Higher of Actual vs Volumetric)
    const totalActualWeight = weightKg * data.quantity;
    const chargeableWeight = Math.max(totalActualWeight, volumetricWeight);

    // 2. Pricing Engine
    // Fetch active rate cards for this service type
    const rateCard = await prisma.rateCard.findFirst({
      where: { serviceType: data.serviceType, status: 'Active' },
      include: { items: true }
    });

    let totalFreight = 0;
    const breakdowns: any[] = [];

    if (rateCard) {
      // Find base freight rate
      const freightRate = rateCard.items.find((item: any) => item.chargeCode === 'FREIGHT');
      if (freightRate) {
        let calculatedBase = 0;
        if (freightRate.calculationType === 'PER_KG') {
          calculatedBase = chargeableWeight * freightRate.unitRate;
        } else if (freightRate.calculationType === 'PER_CBM') {
          calculatedBase = volumeCBM * freightRate.unitRate;
        } else if (freightRate.calculationType === 'FLAT') {
          calculatedBase = freightRate.unitRate;
        }
        
        if (freightRate.minimumCharge && calculatedBase < freightRate.minimumCharge) {
          calculatedBase = freightRate.minimumCharge;
        }

        totalFreight += calculatedBase;
        breakdowns.push({ chargeCode: 'FREIGHT', chargeName: freightRate.chargeName, amount: calculatedBase, isTaxable: true });
      }

      // Add other rate items (DOC, THC, etc)
      rateCard.items.filter((item: any) => item.chargeCode !== 'FREIGHT').forEach((item: any) => {
        let amt = 0;
        if (item.calculationType === 'FLAT') amt = item.unitRate;
        else if (item.calculationType === 'PER_KG') amt = chargeableWeight * item.unitRate;
        breakdowns.push({ chargeCode: item.chargeCode, chargeName: item.chargeName, amount: amt, isTaxable: true });
        totalFreight += amt; // Add to subtotal for simplicity
      });
    } else {
        return res.status(400).json({ error: 'No active rate card found for ' + data.serviceType + '. Please configure rates in ERP Settings.' });
    }

    // 3. Fuel Surcharge
    const fsc = await prisma.fuelSurcharge.findFirst({
      where: { serviceType: data.serviceType, status: 'Active' }
    });
    let totalSurcharges = 0;
    if (fsc) {
      const fscAmount = totalFreight * (fsc.percentage / 100);
      totalSurcharges += fscAmount;
      breakdowns.push({ chargeCode: 'FSC', chargeName: 'Fuel Surcharge', amount: fscAmount, isTaxable: true });
    }

    // 4. Tax
    const taxRule = await prisma.taxRule.findFirst({
      where: { status: 'Active' }
    });
    let totalTaxes = 0;
    if (taxRule) {
      const taxableAmount = totalFreight + totalSurcharges;
      totalTaxes = taxableAmount * (taxRule.taxPercentage / 100);
      breakdowns.push({ chargeCode: 'TAX', chargeName: taxRule.taxName, amount: totalTaxes, isTaxable: false });
    }

    const grandTotal = totalFreight + totalSurcharges + totalTaxes;

    // 5. Database Saves
    // Create Package
    const pkg = await prisma.pkgPackage.create({
      data: {
        bookingId: data.bookingId,
        packageRef: `PKG-${Date.now()}`,
        packageType: data.packageType,
        quantity: data.quantity,
        description: data.description,
        dimensions: {
          create: { length: data.length, width: data.width, height: data.height, unit: data.unit }
        },
        weight: {
          create: { actualWeight: data.actualWeight, unit: data.weightUnit }
        },
        calculation: {
          create: {
            volumeCBM,
            volumeCFT,
            volumetricWeight,
            chargeableWeight,
            volumetricDivisor
          }
        }
      },
      include: { dimensions: true, weight: true, calculation: true }
    });

    // Save Shipment Charge
    const shipmentCharge = await prisma.shipmentCharge.create({
      data: {
        bookingId: data.bookingId,
        totalFreight,
        totalSurcharges,
        totalTaxes,
        grandTotal,
        currency: rateCard?.currency || 'USD',
        breakdowns: {
          create: breakdowns.map((b: any) => ({
            chargeCode: b.chargeCode,
            chargeName: b.chargeName,
            amount: b.amount,
            isTaxable: b.isTaxable
          }))
        }
      },
      include: { breakdowns: true }
    });

    // Save Audit History
    await prisma.calculationHistory.create({
      data: {
        bookingId: data.bookingId,
        calculatedBy: 'SYSTEM',
        inputSnapshot: JSON.stringify(data),
        appliedRates: JSON.stringify(rateCard),
        finalAmount: grandTotal,
        currency: rateCard?.currency || 'USD'
      }
    });

    res.json({
      package: pkg,
      calculation: {
        volumeCBM,
        volumeCFT,
        volumetricDivisor,
        volumetricWeight,
        chargeableWeight,
        totalFreight,
        totalSurcharges,
        totalTaxes,
        grandTotal,
        breakdowns,
        currency: rateCard?.currency || 'USD'
      }
    });
  } catch (error) {
    console.error('CALC ERROR:', error);
    res.status(400).json({ error: 'Calculation failed', details: error });
  }
});

// Seed API specifically for the Package Engine demo setup
router.post('/seed-engine', async (req, res) => {
    try {
        await prisma.rateCard.upsert({
            where: { code: 'OCEAN-STD' },
            update: {},
            create: {
                code: 'OCEAN-STD',
                name: 'Standard Ocean Rates',
                serviceType: 'Ocean',
                validFrom: new Date(),
                validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                items: {
                    create: [
                        { chargeCode: 'FREIGHT', chargeName: 'Ocean Base Freight', calculationType: 'PER_CBM', unitRate: 85.00, minimumCharge: 150.00 },
                        { chargeCode: 'THC', chargeName: 'Terminal Handling', calculationType: 'FLAT', unitRate: 45.00 },
                        { chargeCode: 'DOC', chargeName: 'Bill of Lading Doc', calculationType: 'FLAT', unitRate: 25.00 }
                    ]
                }
            }
        });

        await prisma.rateCard.upsert({
            where: { code: 'AIR-STD' },
            update: {},
            create: {
                code: 'AIR-STD',
                name: 'Standard Air Rates',
                serviceType: 'Air',
                validFrom: new Date(),
                validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                items: {
                    create: [
                        { chargeCode: 'FREIGHT', chargeName: 'Air Base Freight', calculationType: 'PER_KG', unitRate: 4.50, minimumCharge: 50.00 },
                        { chargeCode: 'SEC', chargeName: 'Security Charge', calculationType: 'PER_KG', unitRate: 0.15 },
                        { chargeCode: 'AWB', chargeName: 'Air Waybill Fee', calculationType: 'FLAT', unitRate: 35.00 }
                    ]
                }
            }
        });

        await prisma.rateCard.upsert({
            where: { code: 'ROAD-STD' },
            update: {},
            create: {
                code: 'ROAD-STD',
                name: 'Standard Road Rates',
                serviceType: 'Road',
                validFrom: new Date(),
                validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                items: {
                    create: [
                        { chargeCode: 'FREIGHT', chargeName: 'Road LTL Freight', calculationType: 'PER_KG', unitRate: 0.85, minimumCharge: 120.00 },
                        { chargeCode: 'TOLL', chargeName: 'Highway Tolls', calculationType: 'FLAT', unitRate: 25.00 }
                    ]
                }
            }
        });
        
        await prisma.fuelSurcharge.create({
            data: { carrierCode: 'GENERIC', serviceType: 'Ocean', percentage: 12.5, effectiveFrom: new Date() }
        });
        await prisma.fuelSurcharge.create({
            data: { carrierCode: 'GENERIC', serviceType: 'Air', percentage: 18.0, effectiveFrom: new Date() }
        });
        await prisma.fuelSurcharge.create({
            data: { carrierCode: 'GENERIC', serviceType: 'Road', percentage: 14.2, effectiveFrom: new Date() }
        });
        
        await prisma.taxRule.create({
            data: { countryCode: 'US', taxName: 'Federal Tax', taxPercentage: 7.0, appliesTo: 'ALL' }
        });
        
        res.json({ message: 'Engine seed successful' });
    } catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Seed failed' });
    }
});

export const packageCalcRouter = router;
