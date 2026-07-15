import { AIProvider } from './interfaces/AIProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { ClaudeProvider } from './providers/ClaudeProvider';
import { GeminiProvider } from './providers/GeminiProvider';
import { OllamaProvider } from './providers/OllamaProvider';
import { AzureOpenAIProvider } from './providers/AzureOpenAIProvider';
import { logger } from '../utils/logger';

/**
 * Factory that returns a singleton instance of the requested AI provider.
 * The provider is selected via the AI_PROVIDER environment variable.
 * Supported values: 'openai', 'claude', 'gemini', 'ollama', 'azure'.
 */
export class ProviderFactory {
  private static instance: AIProvider | null = null;

  /**
   * Returns the configured provider. Initializes it on first call.
   * Throws if the environment variable is missing or unsupported.
   */
  static getProvider(): AIProvider {
    if (this.instance) return this.instance;

    const providerName = process.env.AI_PROVIDER?.toLowerCase() ?? 'openai';
    logger.info(`[ProviderFactory] Selecting AI provider: ${providerName}`);

    switch (providerName) {
      case 'openai':
        this.instance = new OpenAIProvider();
        break;
      case 'claude':
        this.instance = new ClaudeProvider();
        break;
      case 'gemini':
        this.instance = new GeminiProvider();
        break;
      case 'ollama':
        this.instance = new OllamaProvider();
        break;
      case 'azure':
        this.instance = new AzureOpenAIProvider();
        break;
      default:
        const msg = `Unsupported AI_PROVIDER value: ${providerName}`;
        logger.error(`[ProviderFactory] ${msg}`);
        throw new Error(msg);
    }
    return this.instance;
  }
}
