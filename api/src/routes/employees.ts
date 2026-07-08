import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all employee profiles
router.get('/', requireAuth, async (req, res) => {
  try {
    const employees = await prisma.employeeProfile.findMany({
      include: {
        user: { select: { email: true, status: true } },
        employmentInfo: {
          include: {
            designation: true,
            jobTitle: true
          }
        },
        teamMemberships: {
          include: { team: true }
        }
      }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee profiles' });
  }
});

// GET specific employee profile
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const profile = await prisma.employeeProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { email: true, status: true, lastLogin: true } },
        employmentInfo: true,
        addresses: true,
        contacts: true,
        documents: true,
        skills: true,
        education: true,
        experience: true,
        certifications: true,
        teamMemberships: { include: { team: true } }
      }
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile details' });
  }
});

// POST generate new employee profile
router.post('/', requireAuth, async (req, res) => {
  try {
    const { userId, firstName, lastName, officialEmail, designationId } = req.body;
    
    // Auto-generate employee code
    const empCount = await prisma.employeeProfile.count();
    const employeeCode = `EMP-${(empCount + 1).toString().padStart(5, '0')}`;

    const profile = await prisma.employeeProfile.create({
      data: {
        userId,
        employeeCode,
        firstName,
        lastName,
        officialEmail,
        employmentInfo: {
          create: {
            designationId
          }
        }
      },
      include: { employmentInfo: true }
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create employee profile' });
  }
});

export const employeesRouter = router;
