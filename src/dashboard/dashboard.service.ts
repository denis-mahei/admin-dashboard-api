import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const recentCustomers = await this.prisma.customer.findMany({
      take: 5,
      orderBy: {
        register_date: 'desc',
      },
    });
    const incomesExpenses = await this.prisma.customer.findMany();
    const totalProducts = await this.prisma.product.count();
    const totalCustomers = await this.prisma.customer.count();
    const totalSuppliers = await this.prisma.supplier.count();
    return {
      totalProducts,
      incomesExpenses,
      totalCustomers,
      totalSuppliers,
      recentCustomers,
    };
  }
}
