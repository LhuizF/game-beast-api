import { PlaceBetDb } from '../../../src/data/usecases/placeBetDb';
import { HelperDb } from '../../../src/data/protocols/helperDb';
import { SaveBetRepository } from '../../../src/data/protocols/SaveBetRepository';
import { Bet } from '../../../src/domain/models/Bet';
import { PlayBetModel } from '../../../src/domain/usecases/place-bet';
import { GameTime } from '../../../src/presentation/protocols/game-time';

interface SutTypes {
  sut: PlaceBetDb;
  saveBetRepositoryStub: SaveBetRepository;
  helperDbStub: HelperDb;
}

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = (): SutTypes => {
  class SaveBetRepositoryStub implements SaveBetRepository {
    save(userDate: PlayBetModel): Promise<Bet> {
      const bet: Bet = {
        id: 1,
        points: 1,
        game_time: 1,
        status: 'pending',
        platform: 'discord',
        id_beast: 1,
        id_user: 'any_id',
        created_at: new Date()
      };

      return new Promise((resolve) => resolve(bet));
    }
  }

  class HelperDbStub implements HelperDb {
    async verifyUser(id: string): Promise<void> {
      await new Promise((resolve) => resolve(null));
    }
    async verifyBeast(id: number): Promise<void> {
      await new Promise((resolve) => resolve(null));
    }
    async verifyGuild(id: number): Promise<void> {
      await new Promise((resolve) => resolve(null));
    }
  }

  class GameTimeAdapterStub implements GameTime {
    get(): number {
      return 1;
    }
  }

  const gameTimeAdapterStub = new GameTimeAdapterStub();
  const helperDbStub = new HelperDbStub();
  const saveBetRepositoryStub = new SaveBetRepositoryStub();
  const sut = new PlaceBetDb(saveBetRepositoryStub, helperDbStub, gameTimeAdapterStub);

  return {
    sut,
    saveBetRepositoryStub,
    helperDbStub
  };
};

const makeBet = () => ({
  id_user: 'any_id',
  id_beast: 1,
  points: 10,
  platform: 'any_platform'
});

describe('PlaceBetDb Usecase', () => {
  test('should call verifyUser with correct id_user', async () => {
    const { sut, helperDbStub } = makeSut();
    const verifyUserStub = jest.spyOn(helperDbStub, 'verifyUser');
    await sut.play(makeBet());

    expect(verifyUserStub).toHaveBeenCalledWith('any_id');
  });

  test('should call verifyBeast with correct id_user', async () => {
    const { sut, helperDbStub } = makeSut();
    const verifyBeastStub = jest.spyOn(helperDbStub, 'verifyBeast');
    await sut.play(makeBet());

    expect(verifyBeastStub).toHaveBeenCalledWith(1);
  });

  test('should call SaveBetRepository with correct values', async () => {
    const { sut, saveBetRepositoryStub } = makeSut();
    const saveStub = jest.spyOn(saveBetRepositoryStub, 'save');
    await sut.play(makeBet());

    expect(saveStub).toHaveBeenCalledWith({
      id_user: 'any_id',
      id_beast: 1,
      points: 10,
      platform: 'any_platform',
      game_time: 1
    });
  });

  test('should return an bet on success', async () => {
    const { sut } = makeSut();
    const bet = await sut.play(makeBet());

    expect(bet).toEqual({
      id: 1,
      points: 1,
      game_time: 1,
      status: 'pending',
      platform: 'discord',
      id_beast: 1,
      id_user: 'any_id',
      created_at: new Date()
    });
  });
});
