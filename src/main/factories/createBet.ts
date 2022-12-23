import CreateBetController from '../../presentation/controllers/bet/createBet';
import { prisma, SaveBetPrismaRepository } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';
import { PlaceBetDb } from '../../data/usecases';
import { PrismaHelper } from '../../infra/db/prisma/utils/helper';
import { UpdatePointsPrisma } from '../../infra/db/prisma/utils/updatePoints';

export const makeCreateBet = (): Controller => {
  const saveBetRepository = new SaveBetPrismaRepository(prisma);
  const updatePoints = new UpdatePointsPrisma();
  const placeBet = new PlaceBetDb(saveBetRepository, updatePoints);
  const helperDb = new PrismaHelper();
  const createGuildController = new CreateBetController(placeBet, helperDb);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);

  return new LogControllerDecorator(createGuildController, logErrorPrismaRepository);
};
