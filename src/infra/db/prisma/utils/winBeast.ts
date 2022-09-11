import { WinBeast } from '../../../../data/protocols/winBeast';
import { prisma } from './client';

export class WinBeastPrisma implements WinBeast {
  async addWin(id: number, time: number): Promise<void> {
    await prisma.beast.update({
      where: { id },
      data: { times_win: { increment: 1 } }
    });

    const betsWin = await prisma.bet.updateMany({
      where: { AND: [{ game_time: time }, { status: 'pending' }] },
      data: { status: 'win' }
    });

    console.log(betsWin);
  }
}
