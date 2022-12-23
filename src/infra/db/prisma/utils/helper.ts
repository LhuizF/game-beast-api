import { HelperDb } from '../../../../data/protocols';
import {
  UserModel,
  GuildModel,
  BeastModel,
  GameModel,
  GameWithBet
} from '../../../../domain/models';
import { UserWin } from '../../../../presentation/protocols/play-result';
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

  async getLastGames(max: number): Promise<GameWithBet[]> {
    const games = await prisma.game.findMany({
      where: { result: { not: 0 } },
      orderBy: { created_at: 'desc' },
      take: max,
      include: {
        Bet: true
      }
    });

    return games.map((game) => ({
      id: game.id,
      time: game.time,
      result: game.result,
      created_at: game.created_at,
      update_at: game.update_at,
      bets: game.Bet
    }));
  }

  async getBetsByGame(id: number): Promise<{ winners: UserWin[]; losers: number }> {
    const bets = await prisma.bet.findMany({
      where: { id_game: id },
      include: { User: true }
    });

    const betsWin = bets.filter((bet) => bet.status === 'win');
    const lose = bets.filter((bet) => bet.status === 'lose');
    const winners: UserWin[] = betsWin.map((win) => ({
      id: win.User.id,
      avatar: win.User.avatar,
      name: win.User.name,
      pointsBet: win.points,
      pointsReceived: win.points * 3
    }));

    return {
      winners: winners,
      losers: lose.length
    };
  }

  async getRank(guildId?: string): Promise<UserModel[]> {
    const user = await prisma.user.findMany({
      where: { id_guild: guildId, Guild: { active: true } },
      orderBy: { points: 'desc' },
      take: 5
    });

    return user;
  }

  async getAllGuildActive(): Promise<GuildModel[]> {
    return await prisma.guild.findMany({ where: { active: true } });
  }

  async checkUser(guildId: string, discordId: string, email: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        OR: {
          id_guild: guildId,
          id_discord: discordId
        }
      }
    });

    return !!user;
  }
}
