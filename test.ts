import { PrismaHelper } from './src/infra/db/prisma/utils/helper';
import { WinBeastPrisma } from './src/infra/db/prisma/utils/winBeast';
import PlayResultService from './src/presentation/service/playResult';
import { GameTimeAdapter } from './src/utils/game-time';

const help = new PrismaHelper();
const win = new WinBeastPrisma();
const gt = new GameTimeAdapter();
const playResult = new PlayResultService(help, win, gt);

playResult.play();
