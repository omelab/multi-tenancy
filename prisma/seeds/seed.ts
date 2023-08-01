// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
// import { hashData } from '../../src/common/helper/hashData';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy users
  //   const password = await hashData('123456');

  //   const module = await prisma.module.upsert({
  //     where: { title: 'user' },
  //     update: {
  //       title: 'user',
  //     },
  //     create: {
  //       title: 'user',
  //     },
  //   });

  //   const permission = await prisma.permission.upsert({
  //     where: { name: 'user-create' },
  //     update: {
  //       name: 'user_create',
  //     },
  //     create: {
  //       name: 'user_create',
  //       moduleId: module.id,
  //     },
  //   });

  //   const role = await prisma.role.upsert({
  //     where: { name: 'admin' },
  //     update: {
  //       name: 'admin',
  //     },
  //     create: {
  //       name: 'admin',
  //       description: 'this role for super admin',
  //     },
  //   });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      password: '123456',
    },
    create: {
      username: 'admin',
      email: 'admin@gmail.com',
      password: '123456',
      name: 'Admin',
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: 'operator@gmail.com' },
    update: {
      password: '123456',
    },
    create: {
      username: 'operator',
      email: 'operator@gmail.com',
      password: '123456',
      name: 'Operator',
    },
  });

  console.log({ admin, operator });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
