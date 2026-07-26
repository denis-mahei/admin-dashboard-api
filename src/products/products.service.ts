import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductParams } from './interface/product-params';

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
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: createProductDto.supplierId,
      },
    });

    if (!supplier) {
      throw new BadRequestException();
    }

    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
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
