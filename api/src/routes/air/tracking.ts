import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// Post a location ping (usually from ADS-B or FlightRadar equivalent)
router.post('/ping', asyncHandler(async (req: any, res: any) => {
  const { flightScheduleId, latitude, longitude, altitude, speed, heading, status } = req.body;

  const ping = await prisma.airFlightTracking.create({
    data: {
      flightScheduleId, latitude, longitude, altitude, speed, heading, status,
      timestamp: new Date()
    },
    include: { flightSchedule: { include: { fromAirport: true, toAirport: true, airline: true } } }
  });

  // Broadcast WebSocket Event!
  const io = req.app.get('io');
  if (io) {
    io.emit('air_flight_update', ping);
  }

  res.status(201).json(ping);
}));

// Get recent pings for a specific flight
router.get('/:flightId', asyncHandler(async (req: any, res: any) => {
  const pings = await prisma.airFlightTracking.findMany({
    where: { flightScheduleId: req.params.flightId, isDeleted: false },
    orderBy: { timestamp: 'desc' },
    take: 50
  });
  res.json(pings);
}));

// Weather Alerts
router.post('/weather', asyncHandler(async (req: any, res: any) => {
  const alert = await prisma.airWeatherAlert.create({
    data: req.body
  });
  const io = req.app.get('io');
  if (io) io.emit('air_weather_alert', alert);

  res.status(201).json(alert);
}));

export default router;
