import { CrateGameDb } from '../../data/usecases/createGameDb';
import { prisma } from '../../infra/db/prisma';
import { SaveGamePrismaRepository } from '../../infra/db/prisma/saveGame';
import { PrismaHelper } from '../../infra/db/prisma/utils/helper';
import { WinBeastPrisma } from '../../infra/db/prisma/utils/winBeast';
import { PlayResult } from '../../presentation/protocols/play-result';
import PlayResultService from '../../presentation/service/playResult';
import { GameTimeAdapter } from '../../utils/game-time';

export const makePlayResult = (): PlayResult => {
  const prismaHelper = new PrismaHelper();
  const winBeast = new WinBeastPrisma();
  const saveGame = new SaveGamePrismaRepository(prisma);
  const gameTime = new GameTimeAdapter();
  const createGame = new CrateGameDb(gameTime, saveGame);
  return new PlayResultService(prismaHelper, winBeast, createGame);
};
