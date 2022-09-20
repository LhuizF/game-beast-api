import { HelperDb } from '../../../../data/protocols/helperDb';
import { UserModel, GuildModel, BeastModel, GameModel } from '../../../../domain/models';
import { prisma } from './client';

export class PrismaHelper implements HelperDb {
  async getGuild(id: string): Promise<GuildModel | null> {
    return await prisma.guild.findUnique({ where: { id } });
  }

  async getUser(id: string): Promise<UserModel | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getUserDiscord(guildId: string, discordId: string): Promise<UserModel | null> {
    return await prisma.user.findFirst({
      where: {
        id_guild: guildId,
        id_discord: discordId
      }
    });
  }

  async getBeast(id: number): Promise<BeastModel | null> {
    return await prisma.beast.findUnique({ where: { id } });
  }

  async getAllBeast(): Promise<BeastModel[]> {
    return await prisma.beast.findMany({ orderBy: { id: 'asc' } });
  }

  async getCurrentGameId(): Promise<number> {
    const game = await prisma.game.findFirst({ orderBy: { created_at: 'desc' } });
    if (!game) return 0;
    return game.id;
  }

  async getCurrentGame(): Promise<GameModel | null> {
    return await prisma.game.findFirst({ orderBy: { created_at: 'desc' } });
  }

  async getLastThreeGames(): Promise<GameModel[]> {
    return await prisma.game.findMany({
      where: { result: { not: 0 } },
      orderBy: { created_at: 'desc' },
      take: 3
    });
  }
}
