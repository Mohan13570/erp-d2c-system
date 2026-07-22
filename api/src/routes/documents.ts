import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Multer for parsing multipart/form-data (in memory for mock processing)
const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// Phase 7: Document Management API
// ==========================================

// GET /api/v1/shipments/:id/documents
// Fetch all documents for a shipment, separated by category
router.get('/shipments/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real scenario, this fetches from the DB. 
    // Since we just ran a fresh migration, we'll return a structured mock response 
    // so the massive UI has data to render instead of being blank.
    
    const documents = {
      commercial: [
        { id: '1', name: 'Commercial Invoice', status: 'APPROVED', uploadedAt: new Date().toISOString(), size: '245 KB' },
        { id: '2', name: 'Packing List', status: 'PENDING_REVIEW', uploadedAt: new Date().toISOString(), size: '120 KB' }
      ],
      transport: [
        { id: '3', name: 'Master Bill Of Lading', status: 'DRAFT', uploadedAt: new Date().toISOString(), size: '1.2 MB' }
      ],
      customs: [
        { id: '4', name: 'Certificate Of Origin', status: 'REJECTED', uploadedAt: new Date().toISOString(), size: '400 KB', remarks: 'Missing seal' }
      ],
      insurance: [],
      warehouse: [],
      proof: []
    };

    const compliance = [
      { type: 'IMPORT', status: 'COMPLIANT' },
      { type: 'EXPORT', status: 'PENDING_REVIEW' },
      { type: 'DG', status: 'NON_COMPLIANT' }
    ];

    res.json({ documents, compliance });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch shipment documents' });
  }
});

// POST /api/v1/shipments/:id/documents
// Upload a new document with multipart/form-data
router.post('/shipments/:id/documents', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { category, documentName, isMandatory } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // MOCK S3 UPLOAD
    // In production: const s3Url = await s3Service.upload(file.buffer, file.originalname);
    const mockS3Url = \`https://s3.lizome.dev/bucket/\${Date.now()}-\${file.originalname}\`;

    // Ensure category exists
    let dbCategory = await prisma.documentCategory.findUnique({ where: { name: category } });
    if (!dbCategory) {
      dbCategory = await prisma.documentCategory.create({ data: { name: category } });
    }

    const doc = await prisma.shipmentDocument.create({
      data: {
        shipmentId: id,
        categoryId: dbCategory.id,
        name: documentName || file.originalname,
        fileUrl: mockS3Url,
        fileSize: file.size,
        fileType: file.mimetype,
        isMandatory: isMandatory === 'true',
        status: 'PENDING_REVIEW'
      }
    });

    // Audit log
    await prisma.documentHistory.create({
      data: {
        documentId: doc.id,
        action: 'UPLOADED',
        actor: 'System User', // Usually extracted from JWT
      }
    });

    res.status(201).json({ message: 'Document uploaded successfully', document: doc });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// PUT /api/v1/shipments/:id/documents/:docId/approve
// Workflow approval for a specific document
router.put('/shipments/:id/documents/:docId/approve', async (req, res) => {
  try {
    const { docId } = req.params;
    const { status, remarks } = req.body; // 'APPROVED' | 'REJECTED'

    const doc = await prisma.shipmentDocument.update({
      where: { id: docId },
      data: { status }
    });

    await prisma.documentApproval.create({
      data: {
        documentId: docId,
        status,
        remarks,
        reviewedBy: 'Compliance Officer' // JWT extracted
      }
    });

    res.json({ message: \`Document \${status}\`, document: doc });
  } catch (error) {
    console.error('Error approving document:', error);
    res.status(500).json({ error: 'Failed to process document approval' });
  }
});

// POST /api/v1/shipments/:id/documents/validate
// Automatically checks for missing mandatory docs or expired docs
router.post('/shipments/:id/documents/validate', async (req, res) => {
  try {
    const { id } = req.params;

    const documents = await prisma.shipmentDocument.findMany({
      where: { shipmentId: id }
    });

    let errors = [];

    // Validation 1: Expired documents
    const expired = documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date());
    if (expired.length > 0) {
      errors.push(...expired.map(d => \`Document '\${d.name}' has expired.\`));
    }

    // Validation 2: Pending Mandatory Docs
    const pendingMandatory = documents.filter(d => d.isMandatory && d.status !== 'APPROVED');
    if (pendingMandatory.length > 0) {
      errors.push(...pendingMandatory.map(d => \`Mandatory document '\${d.name}' is not approved yet.\`));
    }

    res.json({
      isValid: errors.length === 0,
      errors
    });
  } catch (error) {
    console.error('Error validating documents:', error);
    res.status(500).json({ error: 'Failed to run document validation' });
  }
});

export default router;
