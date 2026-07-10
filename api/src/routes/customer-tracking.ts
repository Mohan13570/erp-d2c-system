import { Router } from 'express';
import { CustomerTrackingService } from '../services/CustomerTrackingService';

const router = Router();

// Initialize Tracking
router.post('/initialize', async (req, res) => {
  try {
    const { bookingId } = req.body;
    const tracking = await CustomerTrackingService.initializeTracking(bookingId);
    res.status(201).json({ success: true, data: tracking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GPS Webhook for IoT Devices
router.post('/gps-ping', async (req, res) => {
  try {
    const { trackingId, lat, lng, speed, heading } = req.body;
    const loc = await CustomerTrackingService.updateGPSLocation(trackingId, lat, lng, speed, heading);
    res.status(200).json({ success: true, data: loc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Timeline
router.get('/:id/timeline', async (req, res) => {
  try {
    const timeline = await CustomerTrackingService.getShipmentTimeline(req.params.id);
    res.status(200).json({ success: true, data: timeline });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch Mock Dashboard Data
router.get('/dashboard', async (req, res) => {
  res.json({
    success: true,
    data: {
      activeShipments: 45,
      inTransit: 28,
      delayed: 3,
      completed: 14,
      liveMapMarkers: [
        { id: 'TRK-1', lat: 34.0522, lng: -118.2437, status: 'In Transit', vessel: 'Evergreen 1' },
        { id: 'TRK-2', lat: 35.6762, lng: 139.6503, status: 'At Port', vessel: 'Maersk Delta' }
      ]
    }
  });
});

export default router;
