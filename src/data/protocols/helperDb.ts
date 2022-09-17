import { UserModel, GuildModel, BeastModel, GameModel } from '../../domain/models';

export interface HelperDb {
  getGuild(id: number): Promise<GuildModel | null>;
  getUser(id: string): Promise<UserModel | null>;
  getBeast(id: number): Promise<BeastModel | null>;
  getAllBeast(): Promise<BeastModel[]>;
  getCurrentGameId(): Promise<number>;
  getCurrentGame(): Promise<GameModel | null>;
  getLastThreeGames(): Promise<GameModel[]>;
}
