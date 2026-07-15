import { AIProvider } from '../interfaces/AIProvider';
import { logger } from '../../utils/logger';

/**
 * Placeholder for Azure OpenAI service.
 * Returns static responses and logs calls.
 */
export class AzureOpenAIProvider implements AIProvider {
  async generateResponse(prompt: string, options?: any): Promise<string> {
    logger.warn('AzureOpenAIProvider.generateResponse called – placeholder');
    return `Azure OpenAI placeholder response for prompt: ${prompt}`;
  }

  async *streamResponse(prompt: string, options?: any): AsyncIterable<string> {
    logger.warn('AzureOpenAIProvider.streamResponse called – placeholder');
    yield `Azure OpenAI streaming placeholder for prompt: ${prompt}`;
  }

  async healthCheck(): Promise<boolean> {
    logger.info('AzureOpenAIProvider.healthCheck – returning true (placeholder)');
    return true;
  }
}
