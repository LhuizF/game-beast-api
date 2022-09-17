import { LastGamesController } from '../../../src/presentation/controllers/game';
import { ok, serverError } from '../../../src/presentation/helpers';
import { HelperDb } from '../../../src/data/protocols/helperDb';
import { HelperDbStub } from '../../helper';

jest.useFakeTimers().setSystemTime(new Date());

interface SutTypes {
  sut: LastGamesController;
  helperDbStub: HelperDb;
}

const makeSut = (): SutTypes => {
  const helperDbStub = new HelperDbStub();
  const sut = new LastGamesController(helperDbStub);
  return { sut, helperDbStub };
};

describe('CreateBet Controller', () => {
  test('should call getLastThreeGames ', async () => {
    const { sut, helperDbStub } = makeSut();
    const getLastThreeGamesSpy = jest.spyOn(helperDbStub, 'getLastThreeGames');

    await sut.handle();

    expect(getLastThreeGamesSpy).toHaveBeenCalled();
  });

  test('should return 400 if getLastThreeGames throws', async () => {
    const { sut, helperDbStub } = makeSut();
    jest.spyOn(helperDbStub, 'getLastThreeGames').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const response = await sut.handle();

    expect(response).toEqual(serverError(''));
  });

  test('should return 200 if success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle();

    expect(response).toEqual(
      ok([{ id: 1, time: 1, result: 0, created_at: new Date(), update_at: new Date() }])
    );
  });
});
