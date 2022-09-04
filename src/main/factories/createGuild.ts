import CreateGuildController from '../../presentation/controllers/guild/createGuild';
import { AddGuildDb } from '../../data/usecases/addGuildDb';
import { CreateGuildPrismaRepository, prisma } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorator/logsError';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';

export const makeCreateGuildController = (): Controller => {
  const createGuildPrismaRepository = new CreateGuildPrismaRepository(prisma);
  const addGuildDb = new AddGuildDb(createGuildPrismaRepository);
  const createGuildController = new CreateGuildController(addGuildDb);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);

  return new LogControllerDecorator(createGuildController, logErrorPrismaRepository);
};
