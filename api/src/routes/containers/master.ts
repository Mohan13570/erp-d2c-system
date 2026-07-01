import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Helper: ISO 6346 Validation (Mod 11 Check Digit)
function isValidContainerNo(containerNo: string): boolean {
  if (!/^[A-Z]{4}\d{7}$/.test(containerNo)) return false;
  
  const charValues: { [key: string]: number } = {
    A: 10, B: 12, C: 13, D: 14, E: 15, F: 16, G: 17, H: 18, I: 19, J: 20, K: 21,
    L: 23, M: 24, N: 25, O: 26, P: 27, Q: 28, R: 29, S: 30, T: 31, U: 32, V: 34,
    W: 35, X: 36, Y: 37, Z: 38
  };

  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const char = containerNo[i];
    let val = i < 4 ? charValues[char] : parseInt(char);
    sum += val * Math.pow(2, i);
  }

  const checkDigit = sum % 11;
  const expectedDigit = checkDigit === 10 ? 0 : checkDigit;
  return expectedDigit === parseInt(containerNo[10]);
}

// Get all containers
router.get('/', async (req, res) => {
  try {
    const containers = await prisma.container.findMany({
      where: { isDeleted: false },
      orderBy: { timestamp: 'desc' }
    });
    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch containers' });
  }
});

// Create container
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!isValidContainerNo(data.containerNo)) {
      return res.status(400).json({ error: 'Invalid ISO 6346 Container Number' });
    }
    const container = await prisma.container.create({ data });
    res.json(container);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Container number already exists' });
    res.status(500).json({ error: 'Failed to create container' });
  }
});

export default router;
