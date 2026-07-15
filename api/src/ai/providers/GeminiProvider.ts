import { AIProvider } from '../interfaces/AIProvider';
import { logger } from '../../utils/logger';

/**
 * Placeholder for Google Gemini LLM.
 * Returns static responses and logs calls.
 */
export class GeminiProvider implements AIProvider {
  async generateResponse(prompt: string, options?: any): Promise<string> {
    logger.warn('GeminiProvider.generateResponse called – placeholder');
    return `Gemini placeholder response for prompt: ${prompt}`;
  }

  async *streamResponse(prompt: string, options?: any): AsyncIterable<string> {
    logger.warn('GeminiProvider.streamResponse called – placeholder');
    yield `Gemini streaming placeholder for prompt: ${prompt}`;
  }

  async healthCheck(): Promise<boolean> {
    logger.info('GeminiProvider.healthCheck – returning true (placeholder)');
    return true;
  }
}
