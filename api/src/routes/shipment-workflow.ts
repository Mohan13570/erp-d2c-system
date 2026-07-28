import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 9: Workflow Automation & BullMQ Queue
// ==========================================

// Attempt to initialize BullMQ. Fallback gracefully if Redis isn't running locally.
let notificationQueue: Queue | null = null;
try {
  notificationQueue = new Queue('NotificationQueue', {
    connection: { host: 'localhost', port: 6379 }
  });
  console.log('[BullMQ] NotificationQueue initialized (Phase 9)');
} catch (error) {
  console.warn('[BullMQ] Redis not available locally. Notifications will be logged to DB only.');
}

// GET /api/v1/shipments/:id/workflow
// Fetches the entire automated workflow state, exceptions, and chronological audit timeline.
router.get('/shipments/:id/workflow', async (req, res) => {
  try {
    const { id } = req.params;

    let workflow = await prisma.shipmentWorkflow.findUnique({
      where: { shipmentId: id },
      include: {
        steps: { orderBy: { sequence: 'asc' } },
        history: { orderBy: { createdAt: 'desc' } },
        exceptions: { include: { history: true }, orderBy: { createdAt: 'desc' } },
      }
    });

    const timeline = await prisma.activityTimeline.findMany({
      where: { shipmentId: id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    if (!workflow) {
      // Initialize workflow state if it doesn't exist yet for demo
      workflow = await prisma.shipmentWorkflow.create({
        data: {
          shipmentId: id,
          currentStage: 'DISPATCHED',
          previousStage: 'WAREHOUSE_RECEIVED',
          nextStage: 'IN_TRANSIT',
          progressPercentage: 45,
          currentOwner: 'Logistics Control Tower',
          department: 'OPERATIONS',
          steps: {
            create: [
              { stageName: 'Booking Approved', status: 'COMPLETED', sequence: 1 },
              { stageName: 'Pickup Scheduled', status: 'COMPLETED', sequence: 2 },
              { stageName: 'Warehouse Received', status: 'COMPLETED', sequence: 3 },
              { stageName: 'Dispatched', status: 'IN_PROGRESS', sequence: 4 },
              { stageName: 'In Transit', status: 'PENDING', sequence: 5 },
              { stageName: 'Delivered', status: 'PENDING', sequence: 6 },
            ]
          },
          exceptions: {
            create: [
              { type: 'DELAY', severity: 'MEDIUM', status: 'RESOLVED', raisedBy: 'System', resolution: 'Traffic cleared', remarks: 'Delayed by 2 hours at origin.' }
            ]
          }
        },
        include: {
          steps: { orderBy: { sequence: 'asc' } },
          history: { orderBy: { createdAt: 'desc' } },
          exceptions: { include: { history: true }, orderBy: { createdAt: 'desc' } },
        }
      });
      
      await prisma.activityTimeline.create({
        data: { shipmentId: id, category: 'SYSTEM', description: 'Workflow Engine Initialized', actor: 'System' }
      });
    }

    res.json({ workflow, timeline });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    res.status(500).json({ error: 'Failed to fetch shipment workflow' });
  }
});

// POST /api/v1/shipments/:id/workflow/advance
// Core automation trigger: Moves workflow stage, generates audit logs, and pushes notifications to BullMQ.
router.post('/shipments/:id/workflow/advance', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real system, you would calculate the exact next stages dynamically from a state machine configuration.
    // For this demonstration, we simulate advancing from 'DISPATCHED' to 'IN_TRANSIT'.
    const nextStage = 'IN_TRANSIT';
    
    const workflow = await prisma.shipmentWorkflow.update({
      where: { shipmentId: id },
      data: {
        previousStage: 'DISPATCHED',
        currentStage: nextStage,
        nextStage: 'OUT_FOR_DELIVERY',
        progressPercentage: 65,
        history: {
          create: { fromStage: 'DISPATCHED', toStage: nextStage, actionBy: 'System Engine', remarks: 'Automated stage advancement' }
        }
      }
    });

    // Generate Activity Timeline
    await prisma.activityTimeline.create({
      data: {
        shipmentId: id,
        category: 'WORKFLOW',
        description: 'Shipment advanced to IN_TRANSIT stage automatically.',
        actor: 'Workflow Engine'
      }
    });

    // Enqueue Notification using BullMQ
    const notifPayload = { shipmentId: id, event: 'STAGE_ADVANCE', stage: nextStage };
    if (notificationQueue) {
      await notificationQueue.add('sendNotification', notifPayload);
    } else {
      // Fallback if Redis is missing
      await prisma.notificationQueue.create({
        data: { shipmentId: id, type: 'EMAIL', event: 'STAGE_ADVANCE', payload: JSON.stringify(notifPayload), status: 'QUEUED' }
      });
    }

    res.json({ message: 'Workflow advanced successfully', workflow });
  } catch (error) {
    console.error('Error advancing workflow:', error);
    res.status(500).json({ error: 'Failed to advance workflow' });
  }
});

// POST /api/v1/shipments/:id/exceptions
// Raises a new exception, alerting the command center.
router.post('/shipments/:id/exceptions', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, severity, remarks } = req.body;

    const workflow = await prisma.shipmentWorkflow.findUnique({ where: { shipmentId: id } });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    const exception = await prisma.shipmentException.create({
      data: {
        workflowId: workflow.id,
        type,
        severity,
        remarks,
        raisedBy: 'Operator',
        status: 'OPEN',
        history: {
          create: { action: 'RAISED', actor: 'Operator', details: 'Exception created manually.' }
        }
      }
    });

    await prisma.activityTimeline.create({
      data: {
        shipmentId: id,
        category: 'EXCEPTION',
        description: "CRITICAL: Exception raised - " + type,
        actor: 'Operator'
      }
    });

    res.status(201).json({ message: 'Exception raised', exception });
  } catch (error) {
    console.error('Error raising exception:', error);
    res.status(500).json({ error: 'Failed to raise exception' });
  }
});

export default router;
