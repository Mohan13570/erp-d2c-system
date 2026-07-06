import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// OUTBOUND: PICK LISTS
// ==========================================
router.get('/pick-lists', async (req: Request, res: Response) => {
  try {
    const picks = await prisma.pickList.findMany({ include: { items: true, boxes: true } });
    res.json(picks);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/pick-lists/generate', async (req: Request, res: Response) => {
  try {
    const { orderRef, pickingType, assignedZone } = req.body;
    // Basic algorithmic generation
    const pickList = await prisma.pickList.create({
      data: {
        pickNumber: `PK-${Date.now()}`,
        orderRef,
        pickingType,
        assignedZone,
        status: 'Pending'
      }
    });
    res.status(201).json(pickList);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// OUTBOUND: PACKING
// ==========================================
router.get('/packing-boxes', async (req: Request, res: Response) => {
  try {
    const boxes = await prisma.packingBox.findMany({ include: { pickList: true } });
    res.json(boxes);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/pack', async (req: Request, res: Response) => {
  try {
    const { pickListId, packingType, weight, dimensions } = req.body;
    const box = await prisma.packingBox.create({
      data: {
        boxNumber: `BOX-${Date.now()}`,
        pickListId,
        packingType,
        weight: Number(weight),
        dimensions,
        labelUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOX-${Date.now()}`,
        status: 'Packed'
      }
    });
    res.status(201).json(box);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// OUTBOUND: DISPATCH & LOADING
// ==========================================
router.get('/dispatches', async (req: Request, res: Response) => {
  try {
    const dispatches = await prisma.shipmentDispatch.findMany({ include: { boxes: true, proof: true } });
    res.json(dispatches);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/dispatch/load', async (req: Request, res: Response) => {
  try {
    const { driverName, vehicleNo, dockBayId, boxIds } = req.body;
    const dispatch = await prisma.shipmentDispatch.create({
      data: {
        dispatchNo: `DSP-${Date.now()}`,
        driverName,
        vehicleNo,
        dockBayId,
        status: 'Planned'
      }
    });

    if (boxIds && boxIds.length > 0) {
      await prisma.packingBox.updateMany({
        where: { id: { in: boxIds } },
        data: { dispatchId: dispatch.id, status: 'Dispatched' }
      });
    }

    res.status(201).json(dispatch);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
