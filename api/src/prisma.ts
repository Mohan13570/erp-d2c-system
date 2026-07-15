import { PrismaClient } from '@prisma/client';

// Singleton Prisma client for the application
const prisma = new PrismaClient();
export { prisma };
