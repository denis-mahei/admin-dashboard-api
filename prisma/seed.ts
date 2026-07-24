import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import bcrypt from 'bcrypt';
import { PrismaNeon } from '@prisma/adapter-neon';
import suppliers from './data/suppliers.json';
import products from './data/products.json';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const secret = bcrypt.hash('password123', 10);

async function main() {
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  const user = await prisma.user.create({
    data: {
      email: 'example@mail.com',
      name: 'User',
      password: (await secret).toString(),
    },
  });
  const dataSuppliers = suppliers.map((supplier: any) => ({
    name: supplier.name,
    address: supplier.address,
    company: supplier.suppliers,
    date: new Date(supplier.date),
    amount: parseFloat(supplier.amount.replace(/[^0-9.]/g, '')),
    status: supplier.status,
  }));
  await prisma.supplier.createMany({
    data: dataSuppliers,
    skipDuplicates: true,
  });
  const savedSuppliers = await prisma.supplier.findMany();

  const dataProducts = products.map((product: any) => {
    const supplier = savedSuppliers.find(
      (s) => s.company === product.suppliers,
    );
    return {
      photo: product.photo,
      name: product.name,
      supplierId: supplier.id,
      stock: parseInt(product.stock),
      price: parseFloat(product.price),
      category: product.category,
    };
  });
  await prisma.product.createMany({
    data: dataProducts,
    skipDuplicates: true,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
