import { LastGamesController } from '../../presentation/controllers/game';
import { prisma } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/logsError';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';
import { PrismaHelper } from '../../infra/db/prisma/utils/helper';

export const makeLastGamesController = (): Controller => {
  const prismaHelper = new PrismaHelper();
  const lastGamesController = new LastGamesController(prismaHelper);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);

  return new LogControllerDecorator(lastGamesController, logErrorPrismaRepository);
};
