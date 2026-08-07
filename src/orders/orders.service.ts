import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderParams } from './interface/order-params';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    name,
    order = 'asc',
    sortBy = 'name',
    page = 1,
    limit = 10,
  }: OrderParams) {
    const where = {
      name: name ? { contains: name } : Prisma.skip,
    };
    const orders = this.prisma.order.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const ordersCount = this.prisma.order.count({
      where,
    });

    const [data, total] = await Promise.all([orders, ordersCount]);
    return { data, total };
  }
}
