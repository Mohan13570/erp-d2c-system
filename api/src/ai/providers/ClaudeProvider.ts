import { AIProvider } from '../interfaces/AIProvider';
import { logger } from '../../utils/logger';

/**
 * Placeholder implementation for Anthropic Claude.
 * Returns static strings and logs calls – real integration can be added later.
 */
export class ClaudeProvider implements AIProvider {
  async generateResponse(prompt: string, options?: any): Promise<string> {
    logger.warn('ClaudeProvider.generateResponse called – placeholder');
    return `Claude placeholder response for prompt: ${prompt}`;
  }

  async *streamResponse(prompt: string, options?: any): AsyncIterable<string> {
    logger.warn('ClaudeProvider.streamResponse called – placeholder');
    yield `Claude streaming placeholder for prompt: ${prompt}`;
  }

  async healthCheck(): Promise<boolean> {
    logger.info('ClaudeProvider.healthCheck – returning true (placeholder)');
    return true;
  }
}
