import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Live Vessel Map Data (GeoJSON format suitable for Leaflet)
router.get('/map-data', async (req, res) => {
  try {
    const vessels = await prisma.vessel.findMany({
      include: {
        vesselLocations: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    const activeVessels = vessels.filter(v => v.vesselLocations.length > 0);

    const geoJson = {
       type: "FeatureCollection",
       features: activeVessels.map(v => {
          const loc = v.vesselLocations[0];
          return {
             type: "Feature",
             geometry: {
                type: "Point",
                coordinates: [loc.longitude, loc.latitude]
             },
             properties: {
                id: v.id,
                name: v.name,
                imo: v.imoNo,
                heading: loc.heading,
                speed: loc.speedKnots,
                type: 'vessel'
             }
          }
       })
    };

    res.json(geoJson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
});

// Get Shipment Timeline
router.get('/timeline/:bookingId', async (req, res) => {
  try {
    const events = await prisma.oceanBookingEvent.findMany({
       where: { bookingId: req.params.bookingId },
       orderBy: { createdAt: 'asc' }
    });
    // In a real system, we'd interleave ContainerEvents here too.
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

export default router;
