export interface IAIProvider {
  /**
   * Returns the provider name (e.g., "openai").
   */
  getName(): string;

  /**
   * Generates a response for a given prompt.
   */
  generate(prompt: string): Promise<string>;
}
