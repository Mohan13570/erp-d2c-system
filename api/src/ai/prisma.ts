import { PrismaClient } from '@prisma/client';

// Singleton PrismaClient instance used by the AI module
const prisma = new PrismaClient();
export { prisma };
