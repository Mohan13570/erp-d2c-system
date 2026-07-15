import { Router, Request, Response, NextFunction } from 'express';
import { ProviderFactory } from '../ProviderFactory';
import logger from '../../middleware/logger';
import { authenticateToken, checkPermission } from '../../middleware/auth';
import { logger as structuredLogger } from '../../utils/logger';
import { ConversationService } from '../services/ConversationService';
import { prisma } from '../prisma';

const router = Router();
const conversationService = new ConversationService();

// Apply request logger middleware to all AI routes
router.use(logger);

// Health endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', version: '1.0.0' });
});

// Status endpoint
router.get('/status', (req: Request, res: Response) => {
  res.json({ status: 'running', uptime: process.uptime() });
});

// Version endpoint
router.get('/version', (req: Request, res: Response) => {
  const providerName = process.env.AI_PROVIDER || 'openai';
  res.json({ version: '1.0.0', provider: providerName });
});

// POST /chat endpoint – now with persistence
router.post(
  '/chat',
  authenticateToken,
  checkPermission('AI'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, conversationId } = req.body as { message?: string; conversationId?: string };
      if (!message || typeof message !== 'string') {
        return res
          .status(400)
          .json({ success: false, error: 'Invalid request: "message" must be a non‑empty string' });
      }

      const userId = (req as any).user?.id || 'anonymous';
      structuredLogger.info(`AI chat request by user ${userId}`);

      const provider = ProviderFactory.getProvider();
      const response = await provider.generateResponse(message);
      const providerName = process.env.AI_PROVIDER || 'openai';
      const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

      // Persist the conversation and messages
      const convId = await conversationService.recordMessageFlow(userId, conversationId, message, response);

      res.json({
        success: true,
        provider: providerName,
        model,
        response,
        conversationId: convId,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      structuredLogger.error(`AI chat error: ${err.message}`);
      res.status(500).json({ success: false, error: err.message || 'Internal AI error' });
    }
  },
);

  // GET conversation history with pagination
  router.get(
    '/conversation/:id',
    authenticateToken,
    checkPermission('AI'),
    async (req: Request, res: Response) => {
      try {
        const conversationId = req.params.id as string;
        if (!conversationId) {
          return res.status(400).json({ success: false, error: 'Conversation ID required' });
        }
        const userId = (req as any).user?.id as string;
        if (!userId) {
          return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        // Verify ownership
        const conversation = await (prisma as any).aIConversation.findUnique({ where: { id: conversationId } });
        if (!conversation) {
          return res.status(404).json({ success: false, error: 'Conversation not found' });
        }
        if (conversation.userId !== userId) {
          return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        const messages = await conversationService.getHistory(conversationId, page, limit);
        res.json({ success: true, conversationId, page, limit, messages });
      } catch (err: any) {
        structuredLogger.error(`AI get conversation error: ${err.message}`);
        res.status(500).json({ success: false, error: err.message || 'Internal AI error' });
      }
    },
  );

  // DELETE a conversation
  router.delete(
    '/conversation/:id',
    authenticateToken,
    checkPermission('AI'),
    async (req: Request, res: Response) => {
      try {
        const conversationId = req.params.id as string;
        if (!conversationId) {
          return res.status(400).json({ success: false, error: 'Conversation ID required' });
        }
        const userId = (req as any).user?.id as string;
        if (!userId) {
          return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        await conversationService.deleteConversation(conversationId, userId);
        res.status(204).send();
      } catch (err: any) {
        const status = err.message === 'Conversation not found' ? 404 : err.message === 'Unauthorized' ? 403 : 500;
        structuredLogger.error(`AI delete conversation error: ${err.message}`);
        res.status(status).json({ success: false, error: err.message });
      }
    },
  );

export default router;
