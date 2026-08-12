import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierParams } from './interface/supplier-params';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    name,
    page = 1,
    limit = 10,
    sortBy = 'name',
    order = 'asc',
  }: SupplierParams) {
    const totalSuppliers = this.prisma.supplier.count();
    const data = this.prisma.supplier.findMany({
      where: {
        name: name ? { contains: name } : Prisma.skip,
      },
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });
    const [suppliers, total] = await Promise.all([data, totalSuppliers]);
    return { suppliers, total };
  }

  async findAllLookup() {
    return this.prisma.supplier.findMany({
      select: {
        id: true,
        company: true,
      },
    });
  }

  async create(createSupplierDto: CreateSupplierDto) {
    return this.prisma.supplier.create({ data: createSupplierDto });
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplierId = await this.prisma.supplier.findUnique({ where: { id } });

    if (!supplierId) {
      throw new NotFoundException('Supplier not found');
    }

    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }
}
