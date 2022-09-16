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
  async getLastThreeBets(id: string): Promise<BetModel[] | []> {
    return await prisma.bet.findMany({
      where: { id_user: id },
      orderBy: { created_at: 'desc' },
      take: 3
    });
  }
}

export default UserInfosPrisma;
