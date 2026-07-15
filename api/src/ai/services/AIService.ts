// Removed self-import to avoid declaration merging conflict
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { PromptService } from '../services/PromptService';
import { ConversationService } from '../services/ConversationService';

export class AIService {
  private provider: OpenAIProvider;
  private promptService: PromptService;
  private conversationService: ConversationService;

  constructor() {
    this.provider = new OpenAIProvider();
    this.promptService = new PromptService();
    this.conversationService = new ConversationService();
  }

  /**
   * Returns the name of the AI provider (e.g., "openai").
   */
  getProviderName(): string {
    return process.env.AI_PROVIDER || 'openai';
  }

  /**
   * Placeholder – processes a prompt using the provider.
   * Future implementation will delegate to provider and handle conversation state.
   */
  async processPrompt(prompt: string): Promise<any> {
    const formatted = this.promptService.formatPrompt(prompt);
    const response = await this.provider.generateResponse(formatted);
    // Conversation metadata handling can be added later.
    return { prompt, response };
  }
}
