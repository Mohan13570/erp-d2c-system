export class PromptService {
  /**
   * Simple formatter – in real implementation this would inject context, templates, etc.
   */
  formatPrompt(raw: string): string {
    // Trim and ensure consistent newline handling.
    return raw.trim();
  }
}
