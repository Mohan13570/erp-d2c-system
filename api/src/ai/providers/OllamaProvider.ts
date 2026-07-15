import { AIProvider } from '../interfaces/AIProvider';
import { logger } from '../../utils/logger';

/**
 * Placeholder for Ollama local LLM.
 * Returns static responses and logs calls.
 */
export class OllamaProvider implements AIProvider {
  async generateResponse(prompt: string, options?: any): Promise<string> {
    logger.warn('OllamaProvider.generateResponse called – placeholder');
    return `Ollama placeholder response for prompt: ${prompt}`;
  }

  async *streamResponse(prompt: string, options?: any): AsyncIterable<string> {
    logger.warn('OllamaProvider.streamResponse called – placeholder');
    yield `Ollama streaming placeholder for prompt: ${prompt}`;
  }

  async healthCheck(): Promise<boolean> {
    logger.info('OllamaProvider.healthCheck – returning true (placeholder)');
    return true;
  }
}
