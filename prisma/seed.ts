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
  //user
  const user = await prisma.user.create({
    data: {
      email: 'example@mail.com',
      name: 'User',
      password: (await secret).toString(),
    },
  });
  //suppliers
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
  // products
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
  // customers
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
  // orders
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

  // incomeExpenses
  const dataIncomeExpenses = incomeExpenses.map((i: any) => ({
    ...i,
    amount: parseFloat(i.amount),
  }));
  await prisma.incomeExpenses.createMany({
    data: dataIncomeExpenses,
    skipDuplicates: true,
  });
  //pharmacies
  const allPharmacies = [...pharmacies, ...nearestPharmacies];
  const dataPharmacies = allPharmacies.map((i: any) => i);
  await prisma.pharmacy.createMany({
    data: dataPharmacies,
    skipDuplicates: true,
  });
  // reviews
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
