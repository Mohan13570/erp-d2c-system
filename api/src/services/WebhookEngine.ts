import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WebhookEngine {
  /**
   * Dispatches a webhook payload to all active registered endpoints for a specific event.
   */
  static async dispatch(event: string, payload: any) {
    try {
      // Find active webhooks listening for this event
      const webhooks = await prisma.webhook.findMany({
        where: { isActive: true }
      });

      const targetWebhooks = webhooks.filter(wh => {
        try {
          const events = JSON.parse(wh.events);
          return events.includes(event) || events.includes('*');
        } catch {
          return false;
        }
      });

      for (const wh of targetWebhooks) {
        // Enqueue async dispatch
        this.send(wh.id, event, payload).catch(console.error);
      }
    } catch (e) {
      console.error('Failed to dispatch webhook event:', e);
    }
  }

  private static async send(webhookId: string, event: string, payload: any) {
    const startTime = Date.now();
    let status = 'Success';
    let statusCode = 200;
    let responseText = 'OK';

    try {
      const webhook = await prisma.webhook.findUnique({ where: { id: webhookId }});
      if (!webhook) return;

      // Real implementation would use Axios here:
      // const res = await axios.post(webhook.url, payload, { headers: { 'x-webhook-secret': webhook.secret } });
      // statusCode = res.status;
      // responseText = JSON.stringify(res.data);
      
      // Mock network delay and response
      await new Promise(r => setTimeout(r, Math.random() * 500));
      
      // 10% chance of failure for realistic logs
      if (Math.random() < 0.1) {
        status = 'Failed';
        statusCode = 500;
        responseText = 'Internal Server Error';
      }

    } catch (e: any) {
      status = 'Failed';
      statusCode = e.response?.status || 0;
      responseText = e.message;
    }

    // Log History
    await prisma.webhookHistory.create({
      data: {
        webhookId,
        event,
        payload: JSON.stringify(payload),
        status,
        statusCode,
        response: responseText
      }
    });

    if (status === 'Failed') {
      // Create retry job (Mock logic)
      await prisma.webhookRetry.create({
        data: {
          webhookId,
          attempts: 0,
          nextRetryAt: new Date(Date.now() + 5 * 60000), // Retry in 5 mins
          status: 'Pending'
        }
      });
    }
  }
}
