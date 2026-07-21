import express from 'express';
import { PrismaClient } from '@prisma/client';

import { ShipmentController } from '../controllers/shipment.controller';

const router = express.Router();
const prisma = new PrismaClient();

// GET Dashboard KPIs
router.get('/dashboard', ShipmentController.getDashboardKPIs);

// GET all shipments (Advanced Paginated List)
router.get('/', ShipmentController.getShipments);

// GET single shipment (Detail View)
router.get('/:id', async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        cargo: true,
        locations: true,
        carrier: true,
        charges: true,
        documents: true,
        parties: true,
        notes: true,
        assignments: true,
        timeline: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });
    if (!shipment) return res.status(404).json({ error: 'Not found' });
    res.json(shipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

// POST Create new shipment (Wizard Submission)
router.post('/wizard', async (req, res) => {
  try {
    const data = req.body;
    
    // Generate unique Tracking Number
    const trackingNumber = `TRK-${new Date().getTime().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const newShipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        customerId: data.customerId,
        shipper: data.shipper,
        consignee: data.consignee,
        notifyParty: data.notifyParty,
        incoterms: data.incoterms,
        priority: data.priority || 'Standard',
        freightType: data.freightType,
        transportMode: data.transportMode,
        status: data.status || 'Draft',
        expectedPickup: data.expectedPickup ? new Date(data.expectedPickup) : null,
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : null,
        insuranceRequired: data.insuranceRequired || false,
        dangerousGoods: data.dangerousGoods || false,
        tempControlled: data.tempControlled || false,
        remarks: data.remarks,

        cargo: {
          create: data.cargo ? data.cargo.map((c: any) => ({
            commodity: c.commodity,
            hsCode: c.hsCode,
            description: c.description,
            grossWeight: c.grossWeight ? parseFloat(c.grossWeight) : null,
            netWeight: c.netWeight ? parseFloat(c.netWeight) : null,
            chargeableWeight: c.chargeableWeight ? parseFloat(c.chargeableWeight) : null,
            volume: c.volume ? parseFloat(c.volume) : null,
            packagesCount: c.packagesCount ? parseInt(c.packagesCount) : null,
            packageType: c.packageType,
            hazmatClass: c.hazmatClass
          })) : []
        },

        locations: {
          create: data.locations ? data.locations.map((l: any) => ({
            type: l.type,
            warehouseName: l.warehouseName,
            address: l.address,
            contactName: l.contactName,
            contactPhone: l.contactPhone,
            gpsCoordinates: l.gpsCoordinates
          })) : []
        },

        carrier: data.carrier ? {
          create: {
            carrierId: data.carrier.carrierId,
            bookingNumber: data.carrier.bookingNumber,
            vessel: data.carrier.vessel,
            voyage: data.carrier.voyage,
            flight: data.carrier.flight,
            truck: data.carrier.truck,
            eta: data.carrier.eta ? new Date(data.carrier.eta) : null,
            etd: data.carrier.etd ? new Date(data.carrier.etd) : null
          }
        } : undefined,

        charges: data.charges ? {
          create: {
            freight: parseFloat(data.charges.freight || 0),
            fuel: parseFloat(data.charges.fuel || 0),
            customs: parseFloat(data.charges.customs || 0),
            insurance: parseFloat(data.charges.insurance || 0),
            handling: parseFloat(data.charges.handling || 0),
            tax: parseFloat(data.charges.tax || 0),
            discount: parseFloat(data.charges.discount || 0),
            margin: parseFloat(data.charges.margin || 0),
            totalCost: parseFloat(data.charges.totalCost || 0),
            expectedRevenue: parseFloat(data.charges.expectedRevenue || 0)
          }
        } : undefined,

        timeline: {
          create: {
            status: 'Draft',
            remarks: 'Shipment created via wizard'
          }
        }
      }
    });

    res.status(201).json(newShipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// PUT Update Status (Workflow Engine)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, remarks, gps } = req.body;
    
    // Prevent invalid transitions could be enforced here.
    
    const updated = await prisma.shipment.update({
      where: { id: req.params.id },
      data: {
        status,
        timeline: {
          create: {
            status,
            remarks,
            gps
          }
        }
      }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
