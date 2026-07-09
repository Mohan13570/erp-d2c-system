import os from 'os';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MonitoringEngine {
  static getSystemMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpus = os.cpus();
    const uptime = os.uptime();
    
    // Calculate a rough CPU load average
    const loadAvg = os.loadavg()[0]; // 1 minute load avg
    const cpuUsagePct = Math.min((loadAvg / cpus.length) * 100, 100);

    return {
      cpuUsage: parseFloat(cpuUsagePct.toFixed(2)),
      memoryTotal: parseFloat((totalMem / (1024 * 1024 * 1024)).toFixed(2)), // GB
      memoryUsed: parseFloat((usedMem / (1024 * 1024 * 1024)).toFixed(2)), // GB
      diskTotal: 500, // Mocked for cross-platform simplicity
      diskUsed: 120, // Mocked
      networkRx: Math.random() * 100, // Mocked MB/s
      networkTx: Math.random() * 50,  // Mocked MB/s
      uptime,
      cores: cpus.length,
      platform: os.platform(),
      release: os.release()
    };
  }

  static async recordServerMetrics() {
    const metrics = this.getSystemMetrics();
    try {
      await prisma.serverMetrics.create({
        data: {
          cpuUsage: metrics.cpuUsage,
          memoryTotal: metrics.memoryTotal,
          memoryUsed: metrics.memoryUsed,
          diskTotal: metrics.diskTotal,
          diskUsed: metrics.diskUsed,
          networkRx: metrics.networkRx,
          networkTx: metrics.networkTx,
          uptime: metrics.uptime
        }
      });
    } catch (error) {
      console.error('Failed to record server metrics', error);
    }
  }

  static async getDatabaseMetrics() {
    try {
      // For SQLite, we mock active connections. For Postgres we would run specific queries.
      return {
        activeConnections: Math.floor(Math.random() * 100) + 10,
        idleConnections: Math.floor(Math.random() * 20),
        queryRate: Math.floor(Math.random() * 500) + 100,
        slowQueries: Math.floor(Math.random() * 5),
        deadlocks: 0,
        dbSizeGb: 2.5
      };
    } catch (error) {
      return null;
    }
  }

  static async getHealthStatus() {
    return [
      { component: 'Server', status: 'Operational', responseTimeMs: Math.floor(Math.random() * 10) + 1 },
      { component: 'Database', status: 'Operational', responseTimeMs: Math.floor(Math.random() * 50) + 5 },
      { component: 'Redis Cache', status: 'Operational', responseTimeMs: Math.floor(Math.random() * 5) + 1 },
      { component: 'Background Queue', status: 'Operational', responseTimeMs: 0 },
      { component: 'External APIs', status: 'Degraded', responseTimeMs: 850 }
    ];
  }

  static startPeriodicMonitoring(intervalMs = 60000) {
    setInterval(() => {
      this.recordServerMetrics();
    }, intervalMs);
  }
}
