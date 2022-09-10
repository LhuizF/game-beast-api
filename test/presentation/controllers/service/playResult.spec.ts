import { WinBeast } from '../../../../src/data/protocols/winBeast';
import PlayResultService from '../../../../src/presentation/service/playResult';
import { HelperDbStub } from '../../../helper';

const makeSut = () => {
  class WinBeastStub implements WinBeast {
    async addWin(id: number): Promise<void> {
      await new Promise((resolve) => resolve(null));
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

  test('should call addWin', async () => {
    const { sut, winBeastStub } = makeSut();
    const addWinSpy = jest.spyOn(winBeastStub, 'addWin');

    await sut.play();

    expect(addWinSpy).toHaveBeenCalled();
  });
});
