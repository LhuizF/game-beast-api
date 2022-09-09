import { UserModel, GuildModel } from '../../domain/models';

export interface HelperDb {
  getGuild(id: number): Promise<GuildModel | null>;
  getUser(id: string): Promise<UserModel | null>;
  getBeast(id: number): Promise<any | null>;
}
