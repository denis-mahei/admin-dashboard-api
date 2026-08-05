import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const recentData = this.prisma.customer.findMany({
      take: 5,
      orderBy: {
        register_date: 'desc',
      },
    });
    const incomesData = this.prisma.incomeExpenses.findMany();
    const productsData = this.prisma.product.count();
    const customersData = this.prisma.customer.count();
    const suppliersData = this.prisma.supplier.count();

    const [
      incomesExpenses,
      totalProducts,
      totalCustomers,
      totalSuppliers,
      recentCustomers,
    ] = await Promise.all([
      incomesData,
      productsData,
      customersData,
      suppliersData,
      recentData,
    ]);
    return {
      incomesExpenses,
      totalProducts,
      totalCustomers,
      totalSuppliers,
      recentCustomers,
    };
  }
}
