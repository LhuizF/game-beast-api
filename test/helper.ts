import { HelperDb } from '../src/data/protocols/helperDb';
import {
  BeastModel,
  GuildModel,
  UserModel,
  GameModel,
  GameWithBet
} from '../src/domain/models';
import { UserWin } from '../src/presentation/protocols/play-result';
import beatMock from './mocks/beasts.json';

export class HelperDbStub implements HelperDb {
  async getUserDiscord(guildId: string, discordId: string): Promise<UserModel | null> {
    return await new Promise((resolve) =>
      resolve({
        id: 'any_id',
        name: 'any_name',
        points: 100,
        id_guild: '123',
        id_discord: '312',
        email: null,
        password: null,
        avatar: 'any_avatar',
        created_at: new Date()
      })
    );
  }
  async getUser(id: string): Promise<UserModel> {
    return await new Promise((resolve) =>
      resolve({
        id: 'any_id',
        name: 'any_name',
        points: 100,
        id_guild: '123',
        id_discord: '312',
        email: 'any_email',
        password: 'hashed_password',
        avatar: 'any_avatar',
        created_at: new Date()
      })
    );
  }

  async getBeast(id: number): Promise<BeastModel> {
    return await new Promise((resolve) =>
      resolve({
        id: 1,
        name: 'any',
        times_win: 1
      })
    );
  }

  async getGuild(id: string): Promise<GuildModel> {
    return await new Promise((resolve) =>
      resolve({
        id: '1',
        name: 'any_name',
        icon: 'any_icon',
        channel: '3',
        role: '3',
        created_at: new Date(),
        active: true
      })
    );
  }

  async getAllBeast(): Promise<BeastModel[]> {
    return await new Promise((resolve) => resolve(beatMock));
  }

  async getCurrentGameId(): Promise<number> {
    return await new Promise((resolve) => resolve(1));
  }

  async getCurrentGame(): Promise<GameModel> {
    return await new Promise((resolve) =>
      resolve({
        id: 1,
        time: 1,
        result: 0,
        created_at: new Date(),
        update_at: new Date()
      })
    );
  }

  async getLastGames(max: number): Promise<GameWithBet[]> {
    return await new Promise((resolve) =>
      resolve([
        {
          id: 1,
          time: 1,
          result: 0,
          created_at: new Date(),
          update_at: new Date(),
          bets: [
            {
              id: 1,
              points: 1,
              id_game: 1,
              status: 'any_status',
              platform: 'any_platform',
              id_beast: 1,
              id_user: 'any_user',
              created_at: new Date()
            }
          ]
        }
      ])
    );
  }

  async getBetsByGame(id: number): Promise<{ winners: UserWin[]; losers: number }> {
    return await new Promise((resolve) =>
      resolve({
        winners: [
          {
            id: '1',
            avatar: 'any',
            name: 'any_name',
            pointsBet: 10,
            pointsReceived: 60
          }
        ],
        losers: 1
      })
    );
  }

  async getRank(guildId?: string): Promise<any[]> {
    return await new Promise((resolve) =>
      resolve([
        {
          id: 'any_id',
          name: 'any_name',
          points: 100,
          id_guild: '123',
          id_discord: '312',
          email: 'any_email',
          password: 'hashed_password',
          avatar: 'any_avatar',
          created_at: new Date()
        }
      ])
    );
  }

  async getAllGuildActive(): Promise<GuildModel[]> {
    return await new Promise((resolve) =>
      resolve([
        {
          id: '1',
          name: 'any_name',
          icon: 'any_icon',
          channel: '3',
          role: '3',
          created_at: new Date(),
          active: true
        }
      ])
    );
  }
}
