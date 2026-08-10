import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductParams } from './interface/product-params';
import { Prisma } from '../../generated/prisma/client';

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
  }: ProductParams) {
    const where = {
      category: category || Prisma.skip,
      name: name ? { contains: name } : Prisma.skip,
    };
    const totalProducts = this.prisma.product.count({
      where,
    });
    const data = this.prisma.product.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
      include: { supplier: true },
    });
    const [products, total] = await Promise.all([data, totalProducts]);
    return { data: products, totalProducts: total };
  }

  async createProduct(createProductDto: CreateProductDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: createProductDto.supplierId,
      },
    });

    if (!supplier) {
      throw new BadRequestException();
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        photo: createProductDto.photo ?? Prisma.skip,
      },
    });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        photo: updateProductDto.photo ?? Prisma.skip,
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async deleteProduct(id: number) {
    const product = await this.prisma.product.delete({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }
}
