import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PricingEngine {
  
  static async calculateShipmentCost(params: {
    customerId: string;
    originCode: string;
    destinationCode: string;
    transportMode: string;
    weightKg: number;
    volumeCbm: number;
    containerCount?: number;
    equipmentType?: string; // TEU, FEU
  }) {
    const { customerId, originCode, destinationCode, transportMode, weightKg, volumeCbm, containerCount = 1, equipmentType = 'TEU' } = params;

    // 1. Hierarchical Match: Check if Customer has an active Contract for this route
    const now = new Date();
    const contract = await prisma.erpPricingContract.findFirst({
      where: {
        customerId,
        status: 'ACTIVE',
        validFrom: { lte: now },
        validTo: { gte: now }
      },
      include: {
        rates: {
          where: {
             originCode,
             destinationCode,
             transportMode
          }
        }
      }
    });

    let baseRate = 0;
    let unitType = 'KG';
    let isContractRate = false;

    if (contract && contract.rates.length > 0) {
      // Contract matched
      const rateConfig = contract.rates[0];
      baseRate = rateConfig.rateAmount;
      unitType = rateConfig.unitType;
      isContractRate = true;
    } else {
      // Fallback to Standard Public Rate Card
      const rateCard = await prisma.erpRateCard.findFirst({
        where: {
          providerType: 'STANDARD',
          originCode,
          destinationCode,
          transportMode,
          status: 'ACTIVE',
          validFrom: { lte: now },
          validTo: { gte: now }
        }
      });

      if (!rateCard) {
        throw new Error(`No active rate card found for route ${originCode} to ${destinationCode} via ${transportMode}. Please request a manual quote.`);
      }

      baseRate = rateCard.baseRate;
      unitType = rateCard.unitType;
    }

    // 2. Base Freight Calculation
    let freightTotal = 0;
    if (unitType === 'KG') freightTotal = baseRate * weightKg;
    else if (unitType === 'CBM') freightTotal = baseRate * volumeCbm;
    else if (unitType === 'TEU' || unitType === 'FEU') freightTotal = baseRate * containerCount;
    else if (unitType === 'TRIP') freightTotal = baseRate;

    // 3. Apply Surcharges (e.g. Fuel, Peak Season)
    const surcharges = await prisma.erpSurchargeRule.findMany({
      where: {
        transportMode: { in: [transportMode, 'ALL'] },
        validFrom: { lte: now },
        validTo: { gte: now }
      }
    });

    let surchargeTotal = 0;
    const appliedSurcharges = [];

    for (const rule of surcharges) {
       let amt = 0;
       if (rule.calculationType === 'PERCENTAGE') {
          amt = (freightTotal * rule.amount) / 100;
       } else if (rule.calculationType === 'PER_UNIT') {
          if (unitType === 'KG') amt = rule.amount * weightKg;
          else if (unitType === 'CBM') amt = rule.amount * volumeCbm;
          else if (unitType === 'TEU' || unitType === 'FEU') amt = rule.amount * containerCount;
       } else if (rule.calculationType === 'FLAT_RATE') {
          amt = rule.amount;
       }

       if (amt > 0) {
         surchargeTotal += amt;
         appliedSurcharges.push({ name: rule.chargeType, amount: amt });
       }
    }

    // 4. Apply Contractual Discounts if applicable
    let discountAmount = 0;
    if (contract && contract.discountPercent > 0) {
       discountAmount = ((freightTotal + surchargeTotal) * contract.discountPercent) / 100;
    }

    const netFreight = freightTotal + surchargeTotal - discountAmount;

    // Simulate Buy Rate for Margin Analysis (Usually fetched from Carrier tables)
    // For Phase 2, we simulate a buy rate as 75-85% of standard sell rate to calculate profit.
    const mockBuyRate = netFreight * (0.75 + (Math.random() * 0.1)); 
    const marginAmount = netFreight - mockBuyRate;

    return {
      status: "SUCCESS",
      route: `${originCode} -> ${destinationCode} (${transportMode})`,
      appliedRateType: isContractRate ? 'CONTRACT' : 'STANDARD',
      baseFreight: freightTotal,
      surcharges: appliedSurcharges,
      surchargeTotal,
      discountAmount,
      netFreight,
      currency: "USD",
      marginAnalysis: {
        estimatedBuyRate: mockBuyRate,
        estimatedProfitMargin: marginAmount,
        marginPercent: (marginAmount / netFreight) * 100
      }
    };
  }

}
