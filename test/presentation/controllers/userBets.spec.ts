import { UserInfos } from '../../../src/data/protocols';
import { UserModel, BetModel } from '../../../src/domain/models';
import { UserBetsController } from '../../../src/presentation/controllers/user';
import { badRequest } from '../../../src/presentation/helpers';

interface SutTypes {
  sut: UserBetsController;
  userInfosStub: UserInfos;
}

const makeSut = (): SutTypes => {
  class UserInfosStub implements UserInfos {
    getAllInfos(id: string): Promise<UserModel | null> {
      return new Promise((resolve) =>
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
    getLastBets(id: string): Promise<BetModel[] | []> {
      const bet: BetModel = {
        id: 1,
        status: 'any',
        id_beast: 1,
        id_game: 9,
        id_user: 'any_id',
        platform: 'any',
        points: 10,
        created_at: new Date()
      };

      return new Promise((resolve) => resolve([bet]));
    }
  }

  const userInfosStub = new UserInfosStub();
  const sut = new UserBetsController(userInfosStub);
  return { sut, userInfosStub };
};

describe('UserBets Controller', () => {
  test('should return 400 if no id_guild is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { id_guild: '', id_discord: 'any' } });

    expect(response).toEqual(badRequest('id_guild is required'));
  });

  test('should return 400 if no id_discord is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { id_guild: 'any', id_discord: '' } });

    expect(response).toEqual(badRequest('id_discord is required'));
  });

  test('should call getLastBets with max if query max is provided', async () => {
    const { sut, userInfosStub } = makeSut();
    const getLastGamesSpy = jest.spyOn(userInfosStub, 'getLastBets');

    await sut.handle({
      params: { id_guild: 'any', id_discord: 'any' },
      query: { max: 5 }
    });

    expect(getLastGamesSpy).toHaveBeenCalledWith('any', 'any', 5);
  });

  test('should call getLastBetsSpy with correct values', async () => {
    const { sut, userInfosStub } = makeSut();

    const getLastBetsSpy = jest.spyOn(userInfosStub, 'getLastBets');

    await sut.handle({ params: { id_guild: 'any', id_discord: 'any' } });

    expect(getLastBetsSpy).toHaveBeenCalledWith('any', 'any', 3);
  });

  test('should return 200 if id_user is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { id_guild: 'any', id_discord: 'any' } });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  test('should return 500 if userInfosStub throws', async () => {
    const { sut, userInfosStub } = makeSut();

    jest.spyOn(userInfosStub, 'getLastBets').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const response = await sut.handle({ params: { id_guild: 'any', id_discord: 'any' } });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeTruthy();
  });
});
