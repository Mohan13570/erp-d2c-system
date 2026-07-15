import { ProviderFactory } from '../ProviderFactory';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { ClaudeProvider } from '../providers/ClaudeProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { OllamaProvider } from '../providers/OllamaProvider';
import { AzureOpenAIProvider } from '../providers/AzureOpenAIProvider';

describe('ProviderFactory', () => {
  const originalEnv = process.env.AI_PROVIDER;

  afterEach(() => {
    // reset singleton and env variable
    // @ts-ignore: accessing private property for test cleanup
    (ProviderFactory as any).instance = null;
    if (originalEnv !== undefined) {
      process.env.AI_PROVIDER = originalEnv;
    } else {
      delete process.env.AI_PROVIDER;
    }
  });

  it('returns OpenAIProvider by default', () => {
    delete process.env.AI_PROVIDER;
    const provider = ProviderFactory.getProvider();
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it('returns OpenAIProvider when AI_PROVIDER=openai', () => {
    process.env.AI_PROVIDER = 'openai';
    const provider = ProviderFactory.getProvider();
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it('returns ClaudeProvider when AI_PROVIDER=claude', () => {
    process.env.AI_PROVIDER = 'claude';
    const provider = ProviderFactory.getProvider();
    expect(provider).toBeInstanceOf(ClaudeProvider);
  });

  it('returns GeminiProvider when AI_PROVIDER=gemini', () => {
    process.env.AI_PROVIDER = 'gemini';
    const provider = ProviderFactory.getProvider();
    expect(provider).toBeInstanceOf(GeminiProvider);
  });

  it('returns OllamaProvider when AI_PROVIDER=ollama', () => {
    process.env.AI_PROVIDER = 'ollama';
    const provider = ProviderFactory.getProvider();
    expect(provider).toBeInstanceOf(OllamaProvider);
  });

  it('returns AzureOpenAIProvider when AI_PROVIDER=azure', () => {
    process.env.AI_PROVIDER = 'azure';
    const provider = ProviderFactory.getProvider();
    expect(provider).toBeInstanceOf(AzureOpenAIProvider);
  });

  it('throws on unsupported provider', () => {
    process.env.AI_PROVIDER = 'unknown';
    expect(() => ProviderFactory.getProvider()).toThrowError(/Unsupported AI_PROVIDER/);
  });
});
