import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET All Stocks
router.get('/status', async (req: Request, res: Response) => {
  try {
    const stocks = await prisma.companyStock.findMany();
    const actions = await prisma.corporateAction.findMany({ orderBy: { date: 'desc' } });
    
    // Convert BigInt to string
    const mappedStocks = stocks.map(s => ({ ...s, sharesOutstanding: s.sharesOutstanding.toString() }));
    res.json({ stocks: mappedStocks, actions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock status' });
  }
});

// POST New Stock
router.post('/stocks', async (req: Request, res: Response) => {
  try {
    const { ticker, companyName, sharesOutstanding, currentPrice, marketCap } = req.body;
    const stock = await prisma.companyStock.create({
      data: {
        ticker,
        companyName,
        sharesOutstanding: BigInt(sharesOutstanding),
        currentPrice: Number(currentPrice),
        marketCap: Number(marketCap)
      }
    });
    res.json({ ...stock, sharesOutstanding: stock.sharesOutstanding.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stock' });
  }
});

// POST Corporate Action
router.post('/action', async (req: Request, res: Response) => {
  try {
    const { ticker, actionType, quantity, price } = req.body;
    const qtyNum = parseFloat(quantity);
    const priceNum = parseFloat(price);
    const totalValue = qtyNum * priceNum;

    const stock = await prisma.companyStock.findUnique({ where: { ticker } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    let newShares = stock.sharesOutstanding;
    if (actionType === 'Buyback') {
      newShares = newShares - BigInt(Math.floor(qtyNum));
    } else if (actionType === 'Issue Shares') {
      newShares = newShares + BigInt(Math.floor(qtyNum));
    }

    const newMarketCap = Number(newShares) * stock.currentPrice;

    await prisma.$transaction([
      prisma.companyStock.update({
        where: { ticker },
        data: { sharesOutstanding: newShares, marketCap: newMarketCap, lastUpdated: new Date() }
      }),
      prisma.corporateAction.create({
        data: { ticker, actionType, quantity: qtyNum, price: priceNum, totalValue }
      })
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process corporate action' });
  }
});

export default router;
