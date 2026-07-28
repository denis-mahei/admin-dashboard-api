import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findStores() {
    return this.prisma.pharmacy.findMany({
      where: { type: 'regular' },
    });
  }

  async findNearest() {
    return this.prisma.pharmacy.findMany({
      where: { type: 'nearest' },
    });
  }
}
