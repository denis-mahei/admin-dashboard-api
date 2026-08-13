import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { CustomersParams } from './interface/customers-params';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ name, limit = 10, page = 1 }: CustomersParams) {
    const data = this.prisma.customer.findMany({
      where: { name: name ? { contains: name } : Prisma.skip },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = this.prisma.customer.count();
    const [customers, totalCustomers] = await Promise.all([data, total]);
    return { customers, totalCustomers };
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.customer.findUnique({ where: { id } });
  }
}
