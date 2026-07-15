import dotenv from 'dotenv';

dotenv.config();

export const AI_CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  AI_PROVIDER: process.env.AI_PROVIDER || 'openai',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
