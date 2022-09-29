import { CurrentGameController } from '../../../src/presentation/controllers/game';
import { badRequest, ok, serverError } from '../../../src/presentation/helpers';
import { HelperDb } from '../../../src/data/protocols/helperDb';
import { HelperDbStub } from '../../helper';

jest.useFakeTimers().setSystemTime(new Date());

interface SutTypes {
  sut: CurrentGameController;
  helperDbStub: HelperDb;
}

const makeSut = (): SutTypes => {
  const helperDbStub = new HelperDbStub();
  const sut = new CurrentGameController(helperDbStub);
  return { sut, helperDbStub };
};

describe('CreateBet Controller', () => {
  test('should call getCurrentGame ', async () => {
    const { sut, helperDbStub } = makeSut();
    const getCurrentGameSpy = jest.spyOn(helperDbStub, 'getCurrentGame');

    await sut.handle();

    expect(getCurrentGameSpy).toHaveBeenCalled();
  });

  test('should return 400 if getCurrentGame return null', async () => {
    const { sut, helperDbStub } = makeSut();
    jest
      .spyOn(helperDbStub, 'getCurrentGame')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const response = await sut.handle();

    expect(response).toEqual(badRequest('game not found'));
  });

  test('should return 400 if getCurrentGame throws', async () => {
    const { sut, helperDbStub } = makeSut();
    jest.spyOn(helperDbStub, 'getCurrentGame').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const response = await sut.handle();

    expect(response).toEqual(serverError(''));
  });

  test('should return 200 if success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle();

    expect(response).toEqual(
      ok({ id: 1, time: 1, result: 0, created_at: new Date(), update_at: new Date() })
    );
  });
});
