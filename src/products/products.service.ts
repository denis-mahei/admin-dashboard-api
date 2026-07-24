import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../../generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    name,
    category,
    page = 1,
    limit = 10,
    sortBy = 'name',
    order = 'asc',
  }: {
    name: string;
    category: string;
    sortBy: string;
    order: string;
    limit: number;
    page: number;
  }): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        category,
        name: { contains: name },
      },
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
      include: { supplier: true },
    });
  }

  async createProduct(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }
}
