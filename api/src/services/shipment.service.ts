import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ShipmentService {
  static async getDashboardKPIs() {
    const total = await prisma.shipment.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysCount = await prisma.shipment.count({
      where: {
        timeline: {
          some: {
            timestamp: {
              gte: today,
            },
          },
        },
      },
    });

    const byStatus = await prisma.shipment.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const financialAggregates = await prisma.shipment.aggregate({
      _sum: {
        revenue: true,
        profit: true,
      },
    });

    const statusCounts = byStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalShipments: total,
      todayShipments: todaysCount,
      pendingPickup: statusCounts['Pending Pickup'] || 0,
      pickedUp: statusCounts['Picked Up'] || 0,
      warehouse: statusCounts['Warehouse'] || 0,
      inTransit: statusCounts['In Transit'] || 0,
      customsClearance: statusCounts['Customs Clearance'] || 0,
      outForDelivery: statusCounts['Out For Delivery'] || 0,
      delivered: statusCounts['Delivered'] || 0,
      completed: statusCounts['Completed'] || 0,
      cancelled: statusCounts['Cancelled'] || 0,
      delayed: statusCounts['Delayed'] || 0,
      revenue: financialAggregates._sum.revenue || 0,
      profit: financialAggregates._sum.profit || 0,
    };
  }

  static async getShipments(query: any) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      priority, 
      origin, 
      destination, 
      driver, 
      vehicle,
      sortBy = 'trackingNumber',
      sortOrder = 'desc'
    } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: Prisma.ShipmentWhereInput = {};

    if (search) {
      where.OR = [
        { trackingNumber: { contains: search } },
        { bookingNumber: { contains: search } },
        { shipper: { contains: search } },
        { consignee: { contains: search } }
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (origin) where.origin = { contains: origin };
    if (destination) where.destination = { contains: destination };
    if (driver) where.assignedDriver = { contains: driver };
    if (vehicle) where.assignedVehicle = { contains: vehicle };

    const shipments = await prisma.shipment.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc' },
      include: {
        customer: true
      }
    });

    const totalCount = await prisma.shipment.count({ where });

    return {
      data: shipments,
      meta: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    };
  }
}
