import { RankController } from '../../presentation/controllers/rank';
import { prisma } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorator/logsError';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';
import { PrismaHelper } from '../../infra/db/prisma/utils/helper';

export const makeRank = (): Controller => {
  const helperDb = new PrismaHelper();
  const rankController = new RankController(helperDb);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);

  return new LogControllerDecorator(rankController, logErrorPrismaRepository);
};
