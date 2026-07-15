import { prisma } from '../prisma';

export class ConversationService {
  /**
   * Create a new conversation linked to a user. Returns the conversation record.
   */
  async createConversation(userId: string): Promise<any> {
    return (prisma as any).aIConversation.create({
      data: { userId },
    });
  }

  /**
   * Add a message (user or assistant) to a conversation.
   */
  async addMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<any> {
    return (prisma as any).aIMessage.create({
      data: { conversationId, role, content },
    });
  }

  /**
   * Retrieve paginated messages for a conversation, newest last.
   */
  async getHistory(conversationId: string, page: number = 1, limit: number = 20): Promise<any[]> {
    const skip = (page - 1) * limit;
    return (prisma as any).aIMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    });
  }

  /**
   * Delete a conversation and its messages. Only the owner can delete.
   */
  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    // Verify ownership
    const conv = await (prisma as any).aIConversation.findUnique({ where: { id: conversationId } });
    if (!conv) {
      throw new Error('Conversation not found');
    }
    if (conv.userId !== userId) {
      throw new Error('Unauthorized');
    }
    await (prisma as any).aIMessage.deleteMany({ where: { conversationId } });
    await (prisma as any).aIConversation.delete({ where: { id: conversationId } });
  }

  /**
   * Helper used by the chat endpoint to record request/response pair.
   */
  async recordMessageFlow(userId: string, conversationId: string | undefined, prompt: string, response: string): Promise<string> {
    // Ensure we have a valid conversation ID as a string
    let convId: string = conversationId ?? '';
    if (!convId) {
      const conv = await this.createConversation(userId);
      convId = conv.id as string;
    }
    await this.addMessage(convId, 'user', prompt);
    await this.addMessage(convId, 'assistant', response);
    return convId;
  }
}
