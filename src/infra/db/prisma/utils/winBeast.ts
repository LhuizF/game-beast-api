import { WinBeast } from '../../../../data/protocols';
import { BetsResult, UserWin } from '../../../../presentation/protocols/play-result';
import { prisma } from './client';

export class WinBeastPrisma implements WinBeast {
  async addWin(idGame: number, idBeast: number): Promise<BetsResult> {
    const multiplier = 3;

    // atualizando beast sorteado
    await prisma.beast.update({
      where: { id: idBeast },
      data: { times_win: { increment: 1 } }
    });

    // atualizando resultado do game
    await prisma.game.update({
      where: { id: idGame },
      data: { result: idBeast }
    });

    // pegando bets vencedoras
    const betsWin = await prisma.bet.findMany({
      where: { AND: [{ id_game: idGame }, { status: 'pending' }, { id_beast: idBeast }] },
      include: {
        User: true
      }
    });

    // atualizando pontos de cada usuário com bets vencedoras
    const winners: UserWin[] = await Promise.all(
      betsWin.map(async (bet) => {
        const additionalPoints = bet.points * multiplier;

        await prisma.user.update({
          where: { id: bet.id_user },
          data: { points: { increment: additionalPoints } }
        });

        await prisma.bet.update({
          where: { id: bet.id },
          data: { status: 'win' }
        });

        return {
          id: bet.id_user,
          name: bet.User.name,
          avatar: bet.User.avatar,
          pointsBet: bet.points,
          pointsReceived: additionalPoints
        };
      })
    );

    const betsLose = await prisma.bet.updateMany({
      where: {
        AND: [{ id_game: idGame }, { status: 'pending' }, { id_beast: { not: idBeast } }]
      },
      data: { status: 'lose' }
    });

    return {
      totalBets: betsLose.count + betsWin.length,
      winners,
      losers: betsLose.count
    };
  }

  async getChannels(): Promise<string[]> {
    const guilds = await prisma.guild.findMany({
      where: { active: true },
      select: { channel: true }
    });

    return guilds.map((ch) => ch.channel);
  }
}
