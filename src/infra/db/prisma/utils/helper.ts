import { HelperDb } from '../../../../data/protocols/helperDb';
import { UserModel, GuildModel, BetModel } from '../../../../domain/models';
import { prisma } from './client';

export class PrismaHelper implements HelperDb {
  async getGuild(id: number): Promise<GuildModel | null> {
    return await prisma.guild.findUnique({ where: { id } });
  }

  async getUser(id: string): Promise<UserModel | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getBeast(id: number): Promise<any | null> {
    return await prisma.beast.findUnique({ where: { id } });
  }
}
