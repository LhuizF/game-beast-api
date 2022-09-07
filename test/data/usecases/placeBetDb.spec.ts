import { PlaceBetDb } from '../../../src/data/usecases/placeBetDb';
import { HelperDb } from '../../../src/data/protocols/helperDb';
import { SaveBetRepository } from '../../../src/data/protocols/saveBetRepository';
import { Bet } from '../../../src/domain/models/Bet';
import { PlayBetModel } from '../../../src/domain/usecases/place-bet';
import { GameTime } from '../../../src/presentation/protocols/game-time';
import { UserModel } from '../../../src/domain/models/user';
import { UpdatePoints } from '../../../src/data/protocols/updatePoints';

interface SutTypes {
  sut: PlaceBetDb;
  saveBetRepositoryStub: SaveBetRepository;
  helperDbStub: HelperDb;
  updatePointsStub: UpdatePoints;
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
    async verifyUser(id: string): Promise<UserModel> {
      return await new Promise((resolve) =>
        resolve({
          id: 'any_id',
          name: 'any_name',
          points: 100,
          id_guild: 123,
          id_discord: 312,
          email: 'any_email',
          password: 'hashed_password',
          avatar: 'any_avatar',
          created_at: new Date()
        })
      );
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

  class UpdatePointsStub implements UpdatePoints {
    async discount(userID: string, points: number): Promise<void> {
      await new Promise((resolve) => resolve(null));
    }
  }

  const gameTimeAdapterStub = new GameTimeAdapterStub();
  const helperDbStub = new HelperDbStub();
  const saveBetRepositoryStub = new SaveBetRepositoryStub();
  const updatePointsStub = new UpdatePointsStub();

  const sut = new PlaceBetDb(
    saveBetRepositoryStub,
    helperDbStub,
    gameTimeAdapterStub,
    updatePointsStub
  );

  return {
    sut,
    saveBetRepositoryStub,
    helperDbStub,
    updatePointsStub
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

  test('should call updatePoint with correct values', async () => {
    const { sut, updatePointsStub } = makeSut();
    const discountStub = jest.spyOn(updatePointsStub, 'discount');

    await sut.play(makeBet());

    expect(discountStub).toHaveBeenCalledWith('any_id', 10);
  });

  test('should not call updatePoint if saveBetRepository throw', async () => {
    const { sut, updatePointsStub, saveBetRepositoryStub } = makeSut();
    const discountStub = jest.spyOn(updatePointsStub, 'discount');
    jest
      .spyOn(saveBetRepositoryStub, 'save')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promise = sut.play(makeBet());

    await expect(promise).rejects.toThrow();
  });
});
