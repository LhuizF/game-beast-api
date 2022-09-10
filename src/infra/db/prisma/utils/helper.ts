import { HelperDb } from '../../../../data/protocols/helperDb';
import { UserModel, GuildModel, BeastModel } from '../../../../domain/models';
import { prisma } from './client';

export class PrismaHelper implements HelperDb {
  async getGuild(id: number): Promise<GuildModel | null> {
    return await prisma.guild.findUnique({ where: { id } });
  }

  async getUser(id: string): Promise<UserModel | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getBeast(id: number): Promise<BeastModel | null> {
    return await prisma.beast.findUnique({ where: { id } });
  }

  async getAllBeast(): Promise<BeastModel[]> {
    return await prisma.beast.findMany();
  }
}
