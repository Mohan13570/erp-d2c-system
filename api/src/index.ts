import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventory';
import omsRoutes from './routes/oms';
import hrRoutes from './routes/hr';
import financeRoutes from './routes/finance';
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
import financeRouter from './routes/finance';
import billingRouter from './routes/billing';
import insuranceRouter from './routes/insurance';
import trackingRouter from './routes/tracking';
import portalsRouter from './routes/portals';
import notificationsRouter from './routes/notifications';
import biReportsRouter from './routes/bi-reports';
import aiRouter from './routes/ai';
import aiModuleRouter from './ai/routes/ai.routes';
import shipmentRoutes from './routes/shipments';
import fleetRoutes from './routes/fleet';
import companyManagementRoutes from './routes/company-management';
import quotationRoutes from './routes/quotations';
import reportsRouter from './routes/reports';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', omsRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/finance', financeRoutes);
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
app.use('/api/finance', financeRouter);
app.use('/api/billing', billingRouter);
app.use('/api/insurance', insuranceRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/portals', portalsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/bi', biReportsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/ai', aiModuleRouter);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/company-management', companyManagementRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/reports', reportsRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'OK', modules: 20, version: '2.0.0' }));

// Global Error Handler (Returns JSON instead of HTML stack traces)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error]', err.message || err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
