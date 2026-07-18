const fs = require('fs');

let index = fs.readFileSync('api/src/index.ts', 'utf8');

index = index.replace(/<<<<<<< HEAD\r?\n=======\r?\nimport aiRouter from '\.\/routes\/ai';\r?\nimport aiModuleRouter from '\.\/ai\/routes\/ai\.routes';\r?\n>>>>>>> a432faf[^\r\n]*/g, 
`import aiRouter from './routes/ai';
import aiModuleRouter from './ai/routes/ai.routes';`);

index = index.replace(/<<<<<<< HEAD\r?\nimport gpsRoutes[\s\S]*?=======\r?\nimport reportsRouter from '\.\/routes\/reports';\r?\n>>>>>>> a432faf[^\r\n]*/g, 
`import gpsRoutes from './routes/gps';
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
import adminRoutes from './routes/admin';
import integrationRoutes from './routes/integration';
import vendorPortalRoutes from './routes/vendor-portal';
import vendorProcurementRoutes from './routes/vendor-procurement';
import vendorLogisticsRoutes from './routes/vendor-logistics';
import vendorFinanceRoutes from './routes/vendor-finance';
import vendorSupportRoutes from './routes/vendor-support';
import customerPortalRoutes from './routes/customer-portal';
import customerLogisticsRoutes from './routes/customer-logistics';
import customerTrackingRoutes from './routes/customer-tracking';
import customerFinanceRoutes from './routes/customer-finance';
import customerSupportRoutes from './routes/customer-support';
import hrEmployeeRoutes from './routes/hr-employee';
import hrAttendanceRoutes from './routes/hr-attendance';
import hrLeaveRoutes from './routes/hr-leave';
import reportsRouter from './routes/reports';`);

index = index.replace(/<<<<<<< HEAD\r?\napp\.use\('\/api\/vehicles'[\s\S]*?=======\r?\napp\.use\('\/api\/reports', reportsRouter\);\r?\n>>>>>>> a432faf[^\r\n]*/g, 
`app.use('/api/vehicles', vehiclesRoutes);
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
app.use('/api/reports', reportsRouter);`);

fs.writeFileSync('api/src/index.ts', index);
console.log('Fixed index.ts successfully');
