import { UserInfos } from '../../../../data/protocols/userInfos';
import { UserModel, BetModel } from '../../../../domain/models';
import { prisma } from './client';

class UserInfosPrisma implements UserInfos {
  async getAllInfos(id: string): Promise<UserModel | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { Bets: true, Guild: true }
    });
  }
  // eslint-disable-next-line
  async getLastBets(id_guild: string, id_discord: string, max: number): Promise<BetModel[] | []> {
    return await prisma.bet.findMany({
      where: {
        User: { id_guild, id_discord }
      },
      orderBy: { created_at: 'desc' },
      take: max
    });
  }
}

export default UserInfosPrisma;
