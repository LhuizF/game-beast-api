import { PrismaClient } from '@prisma/client';

export const PrismaHelper = {
  client: new PrismaClient()
};
