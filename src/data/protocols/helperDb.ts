import {
  UserModel,
  GuildModel,
  BeastModel,
  GameModel,
  GameWithBet
} from '../../domain/models';
import { UserWin } from '../../presentation/protocols/play-result';

export interface HelperDb {
  getGuild(id: string): Promise<GuildModel | null>;
  getUser(id: string): Promise<UserModel | null>;
  getUserDiscord(guildId: string, discordId: string): Promise<UserModel | null>;
  getBeast(id: number): Promise<BeastModel | null>;
  getAllBeast(): Promise<BeastModel[]>;
  getCurrentGameId(): Promise<number>;
  getCurrentGame(): Promise<GameModel | null>;
  getLastGames(max: number): Promise<GameWithBet[]>;
  getBetsByGame(id: number): Promise<{ winners: UserWin[]; losers: number }>;
  getRank(guildId?: string): Promise<Array<UserModel>>;
  getAllGuildActive(): Promise<GuildModel[]>;
  checkUser(guildId: string, discordId: string, email: string): Promise<boolean>;
}
