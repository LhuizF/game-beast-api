import { HelperDb } from '../../../src/data/protocols/helperDb';
import { UserController } from '../../../src/presentation/controllers/user';
import { InvalidParamError, MissingParamError } from '../../../src/presentation/erros';
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
  test('should return 400 if no id_user is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { id_user: '' } });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(new MissingParamError('id_user'));
  });

  test('should call getUser with correct id', async () => {
    const { sut, helperDbStub } = makeSut();

    const getUserSpy = jest.spyOn(helperDbStub, 'getUser');

    await sut.handle({ params: { id_user: 'id_any' } });

    expect(getUserSpy).toHaveBeenCalledWith('id_any');
  });

  test('should return 400 if no id_user valid', async () => {
    const { sut, helperDbStub } = makeSut();

    jest
      .spyOn(helperDbStub, 'getUser')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const response = await sut.handle({ params: { id_user: 'id_any' } });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(new InvalidParamError('id_user'));
  });

  test('should return 200 if id_user is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { id_user: 'id' } });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  test('should return 500 if getUser throws', async () => {
    const { sut, helperDbStub } = makeSut();

    jest.spyOn(helperDbStub, 'getUser').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const response = await sut.handle({ params: { id_user: 'id' } });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeTruthy();
  });
});
