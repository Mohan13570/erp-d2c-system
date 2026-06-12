import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// =======================
// MASTER DATA GET ROUTES
// =======================

router.get('/countries', authenticateToken, async (req, res) => {
  try {
    const countries = await prisma.country.findMany({ include: { states: true } });
    res.json(countries);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/countries', authenticateToken, async (req, res) => {
  try {
    const country = await prisma.country.create({ data: req.body });
    res.json(country);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/states', authenticateToken, async (req, res) => {
  try {
    const states = await prisma.state.findMany({ include: { country: true } });
    res.json(states);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/states', authenticateToken, async (req, res) => {
  try {
    const state = await prisma.state.create({ data: req.body });
    res.json(state);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/cities', authenticateToken, async (req, res) => {
  try {
    const cities = await prisma.city.findMany({ include: { state: { include: { country: true } } } });
    res.json(cities);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/cities', authenticateToken, async (req, res) => {
  try {
    const city = await prisma.city.create({ data: req.body });
    res.json(city);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/branches', authenticateToken, async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({ include: { city: true } });
    res.json(branches);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/branches', authenticateToken, async (req, res) => {
  try {
    const branch = await prisma.branch.create({ data: req.body });
    res.json(branch);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/ports', authenticateToken, async (req, res) => {
  try {
    const ports = await prisma.port.findMany({ include: { city: true } });
    res.json(ports);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/ports', authenticateToken, async (req, res) => {
  try {
    const port = await prisma.port.create({ data: req.body });
    res.json(port);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/airports', authenticateToken, async (req, res) => {
  try {
    const airports = await prisma.airport.findMany({ include: { city: true } });
    res.json(airports);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/airports', authenticateToken, async (req, res) => {
  try {
    const airport = await prisma.airport.create({ data: req.body });
    res.json(airport);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/taxes', authenticateToken, async (req, res) => {
  try {
    const taxes = await prisma.taxConfiguration.findMany();
    res.json(taxes);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/taxes', authenticateToken, async (req, res) => {
  try {
    const tax = await prisma.taxConfiguration.create({ data: req.body });
    res.json(tax);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/currencies', authenticateToken, async (req, res) => {
  try {
    const currencies = await prisma.currency.findMany();
    res.json(currencies);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/currencies', authenticateToken, async (req, res) => {
  try {
    const currency = await prisma.currency.create({ data: req.body });
    res.json(currency);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
