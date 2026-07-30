import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import bcrypt from 'bcrypt';
import { PrismaNeon } from '@prisma/adapter-neon';
import suppliers from './data/suppliers.json';
import products from './data/products.json';
import customers from './data/customers.json';
import orders from './data/orders.json';
import incomeExpenses from './data/Income-Expenses.json';
import pharmacies from './data/pharmacies.json';
import nearestPharmacies from './data/nearest_pharmacies.json';
import reviews from './data/reviews.json';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const secret = bcrypt.hash('password123', 10);

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.incomeExpenses.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.review.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: 'vendor@gmail.com',
      name: 'Clayton Santos',
      password: (await secret).toString(),
      role: 'ADMIN',
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

  const dataCustomers = customers.map((customer: any) => ({
    photo: customer.photo || customer.image || '',
    name: customer.name,
    email: customer.email,
    spent: parseFloat(customer.spent.replace(/,/g, '')),
    phone: customer.phone,
    address: customer.address,
    register_date: new Date(customer.register_date),
  }));

  await prisma.customer.createMany({
    data: dataCustomers,
    skipDuplicates: true,
  });

  const dataOrders = orders.map((order: any) => ({
    ...order,
    products: parseFloat(order.products),
    price: parseFloat(order.price),
    order_date: new Date(order.order_date),
  }));
  await prisma.order.createMany({
    data: dataOrders,
    skipDuplicates: true,
  });

  const dataIncomeExpenses = incomeExpenses.map((i: any) => ({
    ...i,
    amount: parseFloat(i.amount),
  }));
  await prisma.incomeExpenses.createMany({
    data: dataIncomeExpenses,
    skipDuplicates: true,
  });

  const dataPharmacies = pharmacies.map((p) => ({ ...p, type: 'regular' }));
  const dataNearest = nearestPharmacies.map((p) => ({ ...p, type: 'nearest' }));

  const all = [...dataPharmacies, ...dataNearest];
  await prisma.pharmacy.createMany({
    data: all,
    skipDuplicates: true,
  });

  const dataReviews = reviews.map((i: any) => i);
  await prisma.review.createMany({
    data: dataReviews,
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
