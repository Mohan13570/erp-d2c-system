declare module 'node-nlp' {
  export default class NlpManager {
    constructor(options?: any);
    addDocument(lang: string, utterance: string, intent: string): void;
    train(): Promise<void>;
    process(lang: string, text: string): Promise<{ intent: string; answer?: string }>;
  }
}
