import { WinBeast } from '../../../../data/protocols/winBeast';
import { prisma } from './client';

export class WinBeastPrisma implements WinBeast {
  async addWin(id: number): Promise<void> {
    await prisma.beast.update({
      where: { id },
      data: { times_win: { increment: 1 } }
    });
  }
}
