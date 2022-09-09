import CreateBetController from '../../presentation/controllers/bet/createBet';
import { prisma, SaveBetPrismaRepository } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorator/logsError';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';
import { PlaceBetDb } from '../../data/usecases/placeBetDb';
import { PrismaHelper } from '../../infra/db/prisma/utils/helper';
import { GameTimeAdapter } from '../../utils/game-time';
import { UpdatePointsPrisma } from '../../infra/db/prisma/utils/updatePoints';

export const makeCreateBet = (): Controller => {
  const saveBetRepository = new SaveBetPrismaRepository(prisma);
  const gameTime = new GameTimeAdapter();
  const updatePoints = new UpdatePointsPrisma();
  const placeBet = new PlaceBetDb(saveBetRepository, gameTime, updatePoints);
  const helperDb = new PrismaHelper();
  const createGuildController = new CreateBetController(placeBet, helperDb);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);

  return new LogControllerDecorator(createGuildController, logErrorPrismaRepository);
};
