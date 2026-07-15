export interface AIProvider {
  /**
   * Generate a full response from the LLM.
   * @param prompt The user prompt or system instruction.
   * @param options Optional provider‑specific options.
   * @returns The completed response as a string.
   */
  generateResponse(prompt: string, options?: any): Promise<string>;

  /**
   * Stream a response from the LLM token‑by‑token.
   * @param prompt The prompt to send.
   * @param options Optional provider‑specific options.
   * @returns An async iterable yielding partial strings.
   */
  streamResponse(prompt: string, options?: any): AsyncIterable<string>;

  /**
   * Perform a lightweight health check (e.g., ping the provider).
   * @returns true if the provider is reachable, otherwise false.
   */
  healthCheck(): Promise<boolean>;
}
