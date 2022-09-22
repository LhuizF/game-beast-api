import { LastGamesController } from '../../../src/presentation/controllers/game';
import { ok, serverError } from '../../../src/presentation/helpers';
import { HelperDb } from '../../../src/data/protocols/helperDb';
import { HelperDbStub } from '../../helper';
import { GameResult } from '../../../src/presentation/protocols/play-result';

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
  test('should call getLastGames with 3 if query max is not provided', async () => {
    const { sut, helperDbStub } = makeSut();
    const getLastGamesSpy = jest.spyOn(helperDbStub, 'getLastGames');

    await sut.handle({});

    expect(getLastGamesSpy).toHaveBeenCalledWith(3);
  });

  test('should call getLastGames with max if query max is provided', async () => {
    const { sut, helperDbStub } = makeSut();
    const getLastGamesSpy = jest.spyOn(helperDbStub, 'getLastGames');

    await sut.handle({ query: { max: 10 } });

    expect(getLastGamesSpy).toHaveBeenCalledWith(10);
  });

  test('should call getBeast with games id', async () => {
    const { sut, helperDbStub } = makeSut();
    const getBeastSpy = jest.spyOn(helperDbStub, 'getBeast');

    await sut.handle({});

    expect(getBeastSpy).toHaveBeenCalledWith(1);
  });

  test('should return 400 if getLastGames throws', async () => {
    const { sut, helperDbStub } = makeSut();
    jest.spyOn(helperDbStub, 'getLastGames').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const response = await sut.handle({});

    expect(response).toEqual(serverError(''));
  });

  test('should return 200 if success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    const fakeResult: GameResult = {
      id_game: 1,
      losers: 1,
      totalBets: 1,
      beastWin: {
        id: 1,
        name: 'any',
        times_win: 1
      },
      winners: [
        {
          id: '1',
          avatar: 'any',
          name: 'any_name',
          pointsBet: 10,
          pointsReceived: 60
        }
      ]
    };

    expect(response).toEqual(ok([fakeResult]));
  });
});
