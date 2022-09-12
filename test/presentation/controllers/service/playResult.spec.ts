import { WinBeast } from '../../../../src/data/protocols/winBeast';
import { BetsResult } from '../../../../src/presentation/protocols/play-result';
import PlayResultService from '../../../../src/presentation/service/playResult';
import { HelperDbStub } from '../../../helper';

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
  }

  const helperDbStub = new HelperDbStub();
  const winBeastStub = new WinBeastStub();
  const sut = new PlayResultService(helperDbStub, winBeastStub);
  return { sut, helperDbStub, winBeastStub };
};

describe('PlayResult Service', () => {
  test('should call getAllBeast', async () => {
    const { sut, helperDbStub } = makeSut();
    const getAllBeastSpy = jest.spyOn(helperDbStub, 'getAllBeast');
    await sut.play();

    expect(getAllBeastSpy).toHaveBeenCalled();
  });

  test('should call getCurrentGameId', async () => {
    const { sut, helperDbStub } = makeSut();
    const getCurrentGameIdSpy = jest.spyOn(helperDbStub, 'getCurrentGameId');
    await sut.play();

    expect(getCurrentGameIdSpy).toHaveBeenCalled();
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
    jest
      .spyOn(helperDbStub, 'getCurrentGameId')
      .mockReturnValueOnce(new Promise((resolve) => resolve(1)));

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
          game: 1
        }
      }
    });
  });
});
