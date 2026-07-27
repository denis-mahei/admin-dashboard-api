import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CheckOutDto } from './dto/checkout.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async orderCreate(userId: number, dto: CreateCartDto) {
    return this.prisma.cartItem.create({
      data: {
        userId,
        quantity: dto.quantity,
        productId: dto.productId,
      },
      include: {
        product: true,
      },
    });
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id } });

    if (!cartItem) {
      throw new NotFoundException('Cart not found');
    }

    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity: updateCartDto.quantity },
      include: { product: true },
    });
  }

  async checkout(id: number, checkoutDto: CheckOutDto) {
    const items = await this.findAll(id);
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );

    return this.prisma.order.create({
      data: {
        name: checkoutDto.name,
        status: 'Pending',
        address: checkoutDto.address,
        products: totalQuantity,
        price: totalPrice,
        order_date: new Date(),
      },
    });
  }
}
