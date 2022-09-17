import { UserInfos } from '../../../src/data/protocols/userInfos';
import { UserModel, BetModel } from '../../../src/domain/models';
import { UserBetsController } from '../../../src/presentation/controllers/user';
import { MissingParamError } from '../../../src/presentation/erros';

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
          id_guild: 123,
          id_discord: 312,
          email: null,
          password: null,
          avatar: 'any_avatar',
          created_at: new Date()
        })
      );
    }
    getLastThreeBets(id: string): Promise<BetModel[] | []> {
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
  test('should return 400 if no id_user is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { id_user: '' } });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(new MissingParamError('id_user'));
  });

  test('should call getLastThreeBetsSpy', async () => {
    const { sut, userInfosStub } = makeSut();

    const getLastThreeBetsSpy = jest.spyOn(userInfosStub, 'getLastThreeBets');

    await sut.handle({ params: { id_user: 'id' } });

    expect(getLastThreeBetsSpy).toHaveBeenCalled();
  });

  test('should return 200 if id_user is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { id_user: 'id' } });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  test('should return 500 if userInfosStub throws', async () => {
    const { sut, userInfosStub } = makeSut();

    jest.spyOn(userInfosStub, 'getLastThreeBets').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const response = await sut.handle({ params: { id_user: 'id' } });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeTruthy();
  });
});
