import { Prisma } from '@prisma/client';

export const customers: Prisma.CustomerUpsertArgs['create'][] = [
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd3',
    email: 'user@gmail.com',
    password: 'randow-password',
    role: 'USER',
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd4',
    email: 'user2@gmail.com',
    password: 'randow-password',
    role: 'USER',
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd5',
    email: 'user3@gmail.com',
    password: 'randow-password',
    role: 'USER',
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd6',
    email: 'user4@gmail.com',
    password: 'randow-password',
    role: 'USER',
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd7',
    email: 'user5@gmail.com',
    password: 'randow-password',
    role: 'USER',
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd8',
    email: 'admin@gmail.com',
    password: 'admin-password',
    role: 'ADMIN',
  },
];
