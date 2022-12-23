import { CurrentGameController } from '../../presentation/controllers/game';
import { prisma } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/logsError';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';
import { PrismaHelper } from '../../infra/db/prisma/utils/helper';

export const makeCurrentGameController = (): Controller => {
  const prismaHelper = new PrismaHelper();
  const currentGameController = new CurrentGameController(prismaHelper);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);

  return new LogControllerDecorator(currentGameController, logErrorPrismaRepository);
};
