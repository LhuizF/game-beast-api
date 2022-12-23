import { LogErrorPrismaRepository, prisma } from '../../infra/db/prisma';
import UserInfosPrisma from '../../infra/db/prisma/utils/userInfos';
import { UserBetsController } from '../../presentation/controllers/user';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/logsError';

export const makeUserBetsController = (): Controller => {
  const userInfosPrisma = new UserInfosPrisma();
  const userBetsController = new UserBetsController(userInfosPrisma);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);
  return new LogControllerDecorator(userBetsController, logErrorPrismaRepository);
};
