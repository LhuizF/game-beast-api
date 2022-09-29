import { HelperDb } from '../../../src/data/protocols/helperDb';
import { UserController } from '../../../src/presentation/controllers/user';
import { badRequest } from '../../../src/presentation/helpers';
import { HelperDbStub } from '../../helper';

interface SutTypes {
  sut: UserController;
  helperDbStub: HelperDb;
}

const makeSut = (): SutTypes => {
  const helperDbStub = new HelperDbStub();

  const sut = new UserController(helperDbStub);
  return { sut, helperDbStub };
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

  test('should call getUserDiscord with correct id', async () => {
    const { sut, helperDbStub } = makeSut();

    const getUserDiscordSpy = jest.spyOn(helperDbStub, 'getUserDiscord');

    await sut.handle({ params: { id_guild: 'any', id_discord: 'any' } });

    expect(getUserDiscordSpy).toHaveBeenCalledWith('any', 'any');
  });

  test('should return 400 if no id_user valid', async () => {
    const { sut, helperDbStub } = makeSut();

    jest
      .spyOn(helperDbStub, 'getUserDiscord')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const response = await sut.handle({ params: { id_guild: 'any', id_discord: 'any' } });

    expect(response).toEqual(badRequest('user not found'));
  });

  test('should return 200 if id_user is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { id_guild: 'any', id_discord: 'any' } });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  test('should return 500 if getUser throws', async () => {
    const { sut, helperDbStub } = makeSut();

    jest.spyOn(helperDbStub, 'getUserDiscord').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const response = await sut.handle({ params: { id_guild: 'any', id_discord: 'any' } });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeTruthy();
  });
});
