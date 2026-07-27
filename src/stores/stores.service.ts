import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pharmacy.findMany();
  }

  async findNearest() {
    return this.prisma.pharmacy.findMany({
      orderBy: { rating: 'desc' },
      take: 6,
    });
  }
}
