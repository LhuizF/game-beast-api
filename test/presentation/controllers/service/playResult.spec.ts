import { WinBeast } from '../../../../src/data/protocols/winBeast';
import { GameModel } from '../../../../src/domain/models';
import { CreateGame } from '../../../../src/domain/usecases/create-game';
import { BetsResult } from '../../../../src/presentation/protocols/play-result';
import PlayResultService from '../../../../src/presentation/service/playResult';
import { HelperDbStub } from '../../../helper';

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = () => {
  class WinBeastStub implements WinBeast {
    async addWin(idGame: number, idBeast: number): Promise<BetsResult> {
      return await new Promise((resolve) =>
        resolve({
          totalBets: 2,
          winners: [
            {
              id: 'any_id',
              name: 'any_name',
              avatar: 'any_avatar',
              pointsBet: 10,
              pointsReceived: 30
            }
          ],
          losers: 1
        })
      );
    }

    async getChannels(): Promise<string[]> {
      return await new Promise((resolve) => {
        resolve(['id']);
      });
    }
  }

  class CreateGameStub implements CreateGame {
    async nextGame(): Promise<GameModel> {
      return await new Promise((resolve) =>
        resolve({
          id: 100,
          time: 1,
          result: 0,
          created_at: new Date(),
          update_at: new Date()
        })
      );
    }
  }

  const helperDbStub = new HelperDbStub();
  const winBeastStub = new WinBeastStub();
  const crateGameStub = new CreateGameStub();
  const sut = new PlayResultService(helperDbStub, winBeastStub, crateGameStub);
  return { sut, helperDbStub, winBeastStub, crateGameStub };
};

describe('PlayResult Service', () => {
  test('should call getAllBeast', async () => {
    const { sut, helperDbStub } = makeSut();
    const getAllBeastSpy = jest.spyOn(helperDbStub, 'getAllBeast');
    await sut.play();

    expect(getAllBeastSpy).toHaveBeenCalled();
  });

  test('should call getCurrentGame', async () => {
    const { sut, helperDbStub } = makeSut();
    const getCurrentGameSpy = jest.spyOn(helperDbStub, 'getCurrentGame');
    await sut.play();

    expect(getCurrentGameSpy).toHaveBeenCalled();
  });

  test('should call beastSelected current values', async () => {
    const { sut, helperDbStub } = makeSut();
    const beasts = await helperDbStub.getAllBeast();
    const beastSelectedSpy = jest.spyOn(sut, 'beastSelected');

    await sut.play();

    expect(beastSelectedSpy).toHaveBeenCalledWith(beasts);
  });

  test('should call beastSelected current values', async () => {
    const { sut, helperDbStub } = makeSut();
    const beasts = await helperDbStub.getAllBeast();
    const beastSelectedSpy = jest.spyOn(sut, 'beastSelected');

    await sut.play();

    expect(beastSelectedSpy).toHaveBeenCalledWith(beasts);
  });

  test('should call addWin current values', async () => {
    const { sut, winBeastStub, helperDbStub } = makeSut();
    const addWinSpy = jest.spyOn(winBeastStub, 'addWin');
    jest.spyOn(helperDbStub, 'getCurrentGame').mockReturnValueOnce(
      new Promise((resolve) =>
        resolve({
          id: 1,
          result: 0,
          time: 1,
          created_at: new Date(),
          update_at: new Date()
        })
      )
    );

    jest
      .spyOn(sut, 'beastSelected')
      .mockReturnValueOnce({ id: 1, name: 'any', times_win: 0 });

    await sut.play();

    expect(addWinSpy).toHaveBeenCalledWith(1, 1);
  });

  test('return isSuccess false if beasts.length to equal 0', async () => {
    const { sut, helperDbStub } = makeSut();
    jest
      .spyOn(helperDbStub, 'getAllBeast')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));

    const result = await sut.play();

    expect(result).toEqual({
      isSuccess: false,
      data: {
        date: new Date(),
        body: {
          beasts: [],
          game: {
            id: 1,
            result: 0,
            time: 1,
            created_at: new Date(),
            update_at: new Date()
          }
        }
      },
      guilds: []
    });
  });

  test('should call crateGame', async () => {
    const { sut, crateGameStub } = makeSut();
    const nextGameSpy = jest.spyOn(crateGameStub, 'nextGame');

    await sut.play();

    expect(nextGameSpy).toHaveBeenCalled();
  });
});
