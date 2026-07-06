import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import inventoryRoutes from './routes/inventory';
import omsRoutes from './routes/oms';
import hrRoutes from './routes/hr';
import financeRoutes from './routes/finance';
import glRouter from './routes/gl';
import authRoutes from './routes/auth';
import supplychainRoutes from './routes/supplychain';
import manufacturingRoutes from './routes/manufacturing';
import projectRoutes from './routes/projects';
import assetRoutes from './routes/assets';
import returnsRoutes from './routes/returns';
import crmRoutes from './routes/crm';
import marketingRoutes from './routes/marketing';
import analyticsRoutes from './routes/analytics';
import rbacRoutes from './routes/rbac';
import equityRoutes from './routes/equity';
import d2cRoutes from './routes/d2c';
import fleetRouter from './routes/fleet';
import fleetExtendedRouter from './routes/fleet-extended';
import oceanRouter from './routes/ocean';
import airRouter from './routes/air';
import roadRouter from './routes/road';
import warehouseRouter from './routes/warehouse';
import customsRouter from './routes/customs';
import documentsRouter from './routes/documents';
import containersRouter from './routes/containers';
import procurementRouter from './routes/procurement';
import billingRouter from './routes/billing';
import insuranceRouter from './routes/insurance';
import trackingRouter from './routes/tracking';
import portalsRouter from './routes/portals';
import notificationsRouter from './routes/notifications';
import biReportsRouter from './routes/bi-reports';
import aiRouter from './routes/ai';
import shipmentRoutes from './routes/shipments';
import fleetRoutes from './routes/fleet';
import companyManagementRoutes from './routes/company-management';
import quotationRoutes from './routes/quotations';
import gpsRoutes from './routes/gps';
import vehiclesRoutes from './routes/vehicles';
import driversRoutes from './routes/drivers';
import tripsRoutes from './routes/trips';
import geofencesRoutes from './routes/geofences';
import alertsRoutes from './routes/alerts';
import routesRoutes from './routes/routes';
import reportsRoutes from './routes/reports';
import oceanPortsRoutes from './routes/ocean/ports';
import oceanVesselsRoutes from './routes/ocean/vessels';
import oceanContainersRoutes from './routes/ocean/containers';
import oceanMasterDataRoutes from './routes/ocean/master-data';
import oceanBookingsRoutes from './routes/ocean/bookings';
import oceanAssetsRoutes from './routes/ocean/assets';
import oceanEventsRoutes from './routes/ocean/events';
import oceanPortOpsRoutes from './routes/ocean/port-ops';
import oceanFinanceRoutes from './routes/ocean/finance';
import oceanCustomsRoutes from './routes/ocean/customs';
import oceanTrackingRoutes from './routes/ocean/tracking';
import oceanAnalyticsRoutes from './routes/ocean/analytics';
import maintenanceRouter from './routes/maintenance';
import maintenanceOpsRouter from './routes/maintenance-ops';
import containerOpsRouter from './routes/container-ops';
import containerTrackingRouter from './routes/container-tracking';
import containerFinanceRouter from './routes/container-finance';

dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', omsRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/gl', glRouter);
app.use('/api/auth', authRoutes);
app.use('/api/supply-chain', supplychainRoutes);
app.use('/api/manufacturing', manufacturingRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rbac', rbacRoutes);
app.use('/api/equity', equityRoutes);
app.use('/api/d2c', d2cRoutes);
app.use('/api/ocean', oceanRouter);
app.use('/api/air', airRouter);
app.use('/api/road', roadRouter);

// Modules 9,10,11,12
app.use('/api/fleet-extended', fleetExtendedRouter);
app.use('/api/warehouse', warehouseRouter);
app.use('/api/customs', customsRouter);
app.use('/api/documents', documentsRouter);

// Modules 13-18
app.use('/api/containers', containersRouter);
app.use('/api/procurement', procurementRouter);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/supplychain', supplychainRoutes);
app.use('/api/procurement', procurementRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/portals', portalsRouter);
app.use('/api/billing', billingRouter);
app.use('/api/warehouse', warehouseRouter); // Mount WMS
app.use('/api/notifications', notificationsRouter); // Restored Notifications

// AI API
app.use('/api/bi', biReportsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/company-management', companyManagementRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/geofences', geofencesRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/reports', reportsRoutes);

// Ocean Freight Routes
app.use('/api/ocean/ports', oceanPortsRoutes);
app.use('/api/ocean/vessels', oceanVesselsRoutes);
app.use('/api/ocean/containers', oceanContainersRoutes);
app.use('/api/ocean/master-data', oceanMasterDataRoutes);
app.use('/api/ocean/bookings', oceanBookingsRoutes);
app.use('/api/ocean/assets', oceanAssetsRoutes);
app.use('/api/ocean/events', oceanEventsRoutes);
app.use('/api/ocean/port-ops', oceanPortOpsRoutes);
app.use('/api/ocean/finance', oceanFinanceRoutes);
app.use('/api/ocean/customs', oceanCustomsRoutes);
app.use('/api/ocean/tracking', oceanTrackingRoutes);
app.use('/api/ocean/analytics', oceanAnalyticsRoutes);

app.use('/api/maintenance', maintenanceRouter);
app.use('/api/maintenance-ops', maintenanceOpsRouter);
app.use('/api/container-ops', containerOpsRouter);
app.use('/api/container-tracking', containerTrackingRouter);
app.use('/api/container-finance', containerFinanceRouter);

// Pass io to GPS routes for broadcasting
app.use('/api/gps', gpsRoutes);
app.set('io', io);

app.get('/api/health', (_req, res) => res.json({ status: 'OK', modules: 19, version: '2.0.0' }));

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error]', err.message || err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  
  // Real-time Location Engine
  socket.on('telemetry_update', async (data) => {
     try {
       // Data payload structure: { deviceId, lat, lng, speed, heading, engineOn, fuelLevel }
       
       // 1. Calculate ETA to some destination (Simulation logic for now)
       const distanceToDestKm = Math.random() * 50; // simulated remaining distance
       const estimatedETA = new Date();
       estimatedETA.setMinutes(estimatedETA.getMinutes() + (distanceToDestKm / (data.speed || 1)) * 60);

       // 2. Data Batching & Buffer Logic
       // In production, trackers send packets of 5-10 coordinates at once to save bandwidth
       // We log the latest packet directly to Prisma
       const telemetry = await prisma.vehicleTelemetry.create({
          data: {
             deviceId: data.deviceId,
             latitude: data.lat,
             longitude: data.lng,
             speed: data.speed,
             heading: data.heading,
             engineOn: data.engineOn,
             fuelLevel: data.fuelLevel,
             estimatedETA,
             distanceToDestKm,
             isBatched: false,
             bufferSequence: 1
          }
       });

       // 3. Update Device Status (Heartbeat)
       await prisma.gPSDevice.update({
          where: { id: data.deviceId },
          data: { lastPing: new Date(), isOnline: true }
       });

       // 4. Broadcast the processed telemetry packet to the frontend map clients
       io.emit('live_tracking_broadcast', telemetry);
     } catch (error) {
       console.error('[Socket.IO] Telemetry Engine Error:', error);
     }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => console.log(`Server and WebSockets are running on port ${PORT}`));
