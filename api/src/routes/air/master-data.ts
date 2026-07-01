import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Utility for wrapping async routes
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ==========================================
// Geographic & Hub Data
// ==========================================

router.get('/airports', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airport.findMany({ where: { isDeleted: false }, include: { city: true } });
  res.json(data);
}));

router.post('/airports', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airport.create({ data: req.body });
  res.status(201).json(data);
}));

router.get('/airport-terminals', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airportTerminal.findMany({ where: { isDeleted: false } });
  res.json(data);
}));

router.get('/cargo-terminals', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.cargoTerminal.findMany({ where: { isDeleted: false } });
  res.json(data);
}));

// ==========================================
// Airlines & Aircrafts
// ==========================================

router.get('/airline-alliances', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airlineAlliance.findMany({ where: { isDeleted: false } });
  res.json(data);
}));

router.get('/airlines', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airline.findMany({ where: { isDeleted: false } });
  res.json(data);
}));

router.post('/airlines', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airline.create({ data: req.body });
  res.status(201).json(data);
}));

router.get('/aircraft-types', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.aircraftType.findMany({ where: { isDeleted: false }, include: { capacities: true } });
  res.json(data);
}));

// ==========================================
// Cargo & ULDs
// ==========================================

router.get('/cargo-categories', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airCargoCategory.findMany({ where: { isDeleted: false } });
  res.json(data);
}));

router.get('/uld-types', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.uLDType.findMany({ where: { isDeleted: false }, include: { sizes: true } });
  res.json(data);
}));

router.get('/pallet-types', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airPalletType.findMany({ where: { isDeleted: false } });
  res.json(data);
}));

// ==========================================
// Handling & Customs
// ==========================================

router.get('/handling-agents', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.handlingAgent.findMany({ where: { isDeleted: false } });
  res.json(data);
}));

router.get('/customs-offices', asyncHandler(async (req: any, res: any) => {
  const data = await prisma.airCustomsOffice.findMany({ where: { isDeleted: false } });
  res.json(data);
}));

export default router;
