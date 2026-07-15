// Simple structured logger for the AI module.
// In a real project you might use winston or pino; here we keep it lightweight.
export const logger = {
  info: (msg: string) => console.log(`[AI][INFO] ${msg}`),
  warn: (msg: string) => console.warn(`[AI][WARN] ${msg}`),
  error: (msg: string) => console.error(`[AI][ERROR] ${msg}`),
};
