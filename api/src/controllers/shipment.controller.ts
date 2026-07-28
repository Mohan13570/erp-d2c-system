import { Request, Response } from 'express';
import { ShipmentService } from '../services/shipment.service';

export class ShipmentController {
  static async getDashboardKPIs(req: Request, res: Response) {
    try {
      const kpis = await ShipmentService.getDashboardKPIs();
      res.json(kpis);
    } catch (error: any) {
      console.error('Error fetching dashboard KPIs:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard KPIs', details: error.message });
    }
  }

  static async getShipments(req: Request, res: Response) {
    try {
      const result = await ShipmentService.getShipments(req.query);
      res.json(result);
    } catch (error: any) {
      console.error('Error fetching shipments:', error);
      res.status(500).json({ error: 'Failed to fetch shipments', details: error.message });
    }
  }
}
