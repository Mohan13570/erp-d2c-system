export interface AIProvider {
  /**
   * Generate a full response from the LLM.
   * @param prompt The input prompt.
   * @param options Optional provider‑specific options.
   */
  generateResponse(prompt: string, options?: any): Promise<string>;

  /**
   * Stream a response token‑by‑token.
   */
  streamResponse(prompt: string, options?: any): AsyncIterable<string>;

  /**
   * Perform a lightweight health check.
   */
  healthCheck(): Promise<boolean>;
}
