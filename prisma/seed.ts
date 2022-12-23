import beast from '../test/mocks/beasts.json';
import { prisma } from '../src/infra/db/prisma/utils/client';
import { GameTimeAdapter } from '../src/utils/game-time';
import { SaveGamePrismaRepository } from '../src/infra/db/prisma/saveGame';

const run = async () => {
  try {
    await prisma.beast.createMany({ data: beast });

    const gameTime = new GameTimeAdapter();
    const time = gameTime.getNext();

    const saveGame = new SaveGamePrismaRepository(prisma);
    await saveGame.save(time);

    console.log('Done ✔️');
  } catch (err) {
    console.log(err);
  }
};

run();
