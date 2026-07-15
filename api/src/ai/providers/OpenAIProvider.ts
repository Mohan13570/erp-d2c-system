import { AIProvider } from '../interfaces/AIProvider';
import OpenAI from 'openai';
import { logger } from '../../utils/logger';

/**
 * OpenAI implementation of the AIProvider interface.
 */
export class OpenAIProvider implements AIProvider {
  private client: any;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required for OpenAIProvider');
    }
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(prompt: string, options?: any): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: options?.model ?? process.env.OPENAI_MODEL ?? 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
      });
      const content = response.choices[0]?.message?.content;
      logger.info('OpenAI generateResponse succeeded');
      return content ?? '';
    } catch (err: any) {
      logger.error(`OpenAI generateResponse error: ${err.message}`);
      throw err;
    }
  }

  async *streamResponse(prompt: string, options?: any): AsyncIterable<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: options?.model ?? process.env.OPENAI_MODEL ?? 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        stream: true,
      });
      for await (const part of stream) {
        const delta = part.choices[0]?.delta?.content;
        if (delta) yield delta;
      }
      logger.info('OpenAI streamResponse completed');
    } catch (err: any) {
      logger.error(`OpenAI streamResponse error: ${err.message}`);
      throw err;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.models.list();
      logger.info('OpenAI healthCheck OK');
      return true;
    } catch (err: any) {
      logger.warn(`OpenAI healthCheck failed: ${err.message}`);
      return false;
    }
  }
}
