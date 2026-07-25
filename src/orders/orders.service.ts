import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderParams } from './interface/order-params';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    name,
    status,
    order = 'asc',
    sortBy = 'status',
    page = 1,
    limit = 10,
  }: OrderParams) {
    return this.prisma.order.findMany({
      where: {
        name: { contains: name },
        status,
      },
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
