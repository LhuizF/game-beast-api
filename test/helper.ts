import { HelperDb } from '../src/data/protocols/helperDb';
import { GuildModel, UserModel } from '../src/domain/models';

export class HelperDbStub implements HelperDb {
  async getUser(id: string): Promise<UserModel> {
    return await new Promise((resolve) =>
      resolve({
        id: 'any_id',
        name: 'any_name',
        points: 100,
        id_guild: 123,
        id_discord: 312,
        email: 'any_email',
        password: 'hashed_password',
        avatar: 'any_avatar',
        created_at: new Date()
      })
    );
  }
  async getBeast(id: number): Promise<any> {
    return await new Promise((resolve) => resolve({}));
  }
  async getGuild(id: number): Promise<GuildModel> {
    return await new Promise((resolve) =>
      resolve({
        id: 1,
        name: 'any_name',
        icon: 'any_icon',
        channel: 3,
        created_at: new Date()
      })
    );
  }
}
