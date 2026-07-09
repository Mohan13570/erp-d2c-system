import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AIEngine {
  /**
   * Route an AI prompt to the active provider and log the request/usage.
   */
  static async query(prompt: string, modelName: string, userId?: string) {
    const startTime = Date.now();
    let status = 'Success';
    let tokensUsed = 0;
    let responseText = '';

    // Mock Provider Logic (In reality, we'd use OpenAI SDK or Gemini SDK here)
    if (modelName.includes('gemini')) {
      responseText = `[Gemini Output] Analyzed prompt: "${prompt.substring(0, 50)}..."`;
      tokensUsed = Math.floor(Math.random() * 50) + 10;
    } else if (modelName.includes('gpt')) {
      responseText = `[GPT Output] Generated response for: "${prompt.substring(0, 50)}..."`;
      tokensUsed = Math.floor(Math.random() * 100) + 20;
    } else {
      responseText = `[Fallback AI] Handled prompt: "${prompt.substring(0, 50)}..."`;
      tokensUsed = 15;
    }

    const durationMs = Date.now() - startTime;

    // Log Request asynchronously
    this.logRequest(modelName, prompt, responseText, status, durationMs, tokensUsed, userId).catch(console.error);

    return {
      text: responseText,
      usage: {
        total_tokens: tokensUsed
      }
    };
  }

  static async logRequest(modelName: string, prompt: string, response: string, status: string, durationMs: number, tokensUsed: number, userId?: string) {
    try {
      // Find model
      let model = await prisma.aIModel.findFirst({ where: { name: modelName } });
      if (!model) {
        // Fallback or create dummy
        const provider = await prisma.aIProvider.upsert({
          where: { name: 'SystemFallback' },
          update: {},
          create: { name: 'SystemFallback', isActive: true }
        });
        model = await prisma.aIModel.create({
          data: {
            name: modelName,
            providerId: provider.id,
            costPer1kTokens: 0.002
          }
        });
      }

      await prisma.aIRequest.create({
        data: {
          modelId: model.id,
          providerId: model.providerId,
          prompt,
          response,
          status,
          durationMs,
          tokensUsed,
          userId
        }
      });
      
      // Update usage stats (Mocked simple daily update)
      const today = new Date();
      today.setHours(0,0,0,0);

      const usage = await prisma.aIUsage.findFirst({
        where: { providerId: model.providerId, date: today }
      });

      const cost = (tokensUsed / 1000) * model.costPer1kTokens;

      if (usage) {
        await prisma.aIUsage.update({
          where: { id: usage.id },
          data: {
            totalRequests: usage.totalRequests + 1,
            totalTokens: usage.totalTokens + tokensUsed,
            estimatedCost: usage.estimatedCost + cost
          }
        });
      } else {
        await prisma.aIUsage.create({
          data: {
            providerId: model.providerId,
            date: today,
            totalRequests: 1,
            totalTokens: tokensUsed,
            estimatedCost: cost
          }
        });
      }
    } catch (e) {
      console.error('Failed to log AI request:', e);
    }
  }

  /**
   * Fetch an active prompt version by Template Name.
   */
  static async getPromptTemplate(templateName: string) {
    const template = await prisma.promptTemplate.findUnique({
      where: { name: templateName },
      include: {
        versions: {
          where: { isActive: true },
          take: 1
        }
      }
    });

    if (template && template.versions.length > 0) {
      return template.versions[0].content;
    }
    return null;
  }
}
