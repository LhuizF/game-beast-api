import DisableGuildController from '../../presentation/controllers/guild/disableGuild';
import { prisma } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/logsError';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';
import { DisableGuildPrisma } from '../../infra/db/prisma/utils/disableGuild';

export const makeDisableGuild = (): Controller => {
  const disableGuild = new DisableGuildPrisma();
  const disableGuildController = new DisableGuildController(disableGuild);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);

  return new LogControllerDecorator(disableGuildController, logErrorPrismaRepository);
};
