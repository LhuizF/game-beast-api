import { HelperDb } from '../src/data/protocols/helperDb';
import { BeastModel, GuildModel, UserModel } from '../src/domain/models';
import beatMock from './mocks/beasts.json';

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

  async getAllBeast(): Promise<BeastModel[]> {
    return await new Promise((resolve) => resolve(beatMock));
  }
}
