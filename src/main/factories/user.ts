import { LogErrorPrismaRepository, prisma } from '../../infra/db/prisma';
import { PrismaHelper } from '../../infra/db/prisma/utils/helper';
import UserController from '../../presentation/controllers/user/user';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorator/logsError';

export const makeUserController = (): Controller => {
  const prismaHelper = new PrismaHelper();
  const userController = new UserController(prismaHelper);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);
  return new LogControllerDecorator(userController, logErrorPrismaRepository);
};
