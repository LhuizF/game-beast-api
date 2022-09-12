import { CrateGameDb } from '../../../src/data/usecases/createGameDb';
import { GameTime } from '../../../src/presentation/protocols/game-time';
import { SaveGameRepository } from '../../../src/data/protocols/saveGameRepository';
import { GameModel } from '../../../src/domain/models';

jest.useFakeTimers().setSystemTime(new Date());

interface SutTypes {
  sut: CrateGameDb;
  gameTimeStub: GameTime;
  saveGameRepositoryStub: SaveGameRepository;
}

const makeSut = (): SutTypes => {
  class GameTimeStub implements GameTime {
    getNext(): number {
      return 1;
    }
  }

  class SaveGameRepositoryStub implements SaveGameRepository {
    async save(time: number): Promise<GameModel> {
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

  const gameTimeStub = new GameTimeStub();
  const saveGameRepositoryStub = new SaveGameRepositoryStub();
  const sut = new CrateGameDb(gameTimeStub, saveGameRepositoryStub);
  return { sut, gameTimeStub, saveGameRepositoryStub };
};

describe('CreateGame Usecase', () => {
  test('Should call gameTimeStub', async () => {
    const { sut, gameTimeStub } = makeSut();
    const getNextSpy = jest.spyOn(gameTimeStub, 'getNext');

    await sut.nextGame();

    expect(getNextSpy).toHaveBeenCalled();
  });

  test('Should call saveGameRepositoryStub witch correct  value', async () => {
    const { sut, saveGameRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveGameRepositoryStub, 'save');

    await sut.nextGame();

    expect(saveSpy).toHaveBeenCalledWith(1);
  });

  test('Should return new game', async () => {
    const { sut } = makeSut();

    const game = await sut.nextGame();

    expect(game).toEqual({
      id: 100,
      time: 1,
      result: 0,
      created_at: new Date(),
      update_at: new Date()
    });
  });
});
