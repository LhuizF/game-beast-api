import CreateBetController from '../../../src/presentation/controllers/bet/createBet';
import { ServerError } from '../../../src/presentation/erros';
import { badRequest, ok } from '../../../src/presentation/helpers';
import { PlayBetModel, PlaceBet } from '../../../src/domain/usecases/place-bet';
import { BetModel } from '../../../src/domain/models';
import { HelperDb } from '../../../src/data/protocols';
import { HelperDbStub } from '../../helper';

jest.useFakeTimers().setSystemTime(new Date());

interface SutTypes {
  sut: CreateBetController;
  placeBetStub: PlaceBet;
  helperDbStub: HelperDb;
}

const makeSut = (): SutTypes => {
  class PlaceBetStub implements PlaceBet {
    play(bet: PlayBetModel): Promise<BetModel> {
      return new Promise((resolve) =>
        resolve({
          id: 1,
          id_user: 'any_id',
          id_beast: 1,
          id_game: 1,
          status: 'pending',
          platform: 'discord',
          points: 10,
          created_at: new Date()
        })
      );
    }
  }

  const helperDbStub = new HelperDbStub();
  const placeBetStub = new PlaceBetStub();
  const sut = new CreateBetController(placeBetStub, helperDbStub);
  return { sut, placeBetStub, helperDbStub };
};

const makeBet = () => {
  return {
    body: {
      id_guild: 'any_id',
      id_discord: 'any_id',
      id_beast: 1,
      points: 10,
      platform: 'any_platform'
    }
  };
};

describe('CreateBet Controller', () => {
  test('should return 400 if no id_guild is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_discord: 'any_id',
        id_beast: 1,
        points: 10,
        platform: 'any_platform'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('id_guild is required'));
  });

  test('should return 400 if no id_discord is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_guild: 'any_id',
        id_beast: 1,
        points: 10,
        platform: 'any_platform'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('id_discord is required'));
  });

  test('should return 400 if no id_beast is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_guild: 'any_id',
        id_discord: 'any_id',
        points: 10,
        platform: 'any_platform'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('id_beast is required'));
  });

  test('should return 500 if no current game', async () => {
    const { sut, helperDbStub } = makeSut();

    jest
      .spyOn(helperDbStub, 'getCurrentGameId')
      .mockResolvedValueOnce(new Promise((resolve) => resolve(0)));

    const httpResponse = await sut.handle(makeBet());
    expect(httpResponse).toEqual(badRequest('game not found'));
  });

  test('should return 400 if no points is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_guild: 'any_id',
        id_discord: 'any_id',
        id_beast: 1,
        points: 0,
        platform: 'any_platform'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('points is required'));
  });

  test('should return 400 if no platform is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_guild: 'any_id',
        id_discord: 'any_id',
        id_beast: 1,
        points: 10
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('platform is required'));
  });

  test('should call placeBetStub with correct values', async () => {
    const { sut, placeBetStub } = makeSut();
    const play = jest.spyOn(placeBetStub, 'play');

    await sut.handle(makeBet());

    expect(play).toHaveBeenCalledWith({
      id_user: 'any_id',
      id_beast: 1,
      id_game: 1,
      points: 10,
      platform: 'any_platform'
    });
  });

  test('should return 200 if valid data is provided', async () => {
    const { sut, helperDbStub } = makeSut();

    const bet = await sut.handle(makeBet());

    expect(bet).toEqual(
      ok({
        id: 1,
        id_user: 'any_id',
        beast: 'any',
        id_game: 1,
        status: 'pending',
        points: 10
      })
    );
  });

  test('should return 500 if addUser throws', async () => {
    const { sut, placeBetStub } = makeSut();
    jest.spyOn(placeBetStub, 'play').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(makeBet());
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError('null'));
  });

  test('should call getUserDiscord with correct id_guild and id_discord', async () => {
    const { sut, helperDbStub } = makeSut();
    const getUserDiscordStub = jest.spyOn(helperDbStub, 'getUserDiscord');
    await sut.handle(makeBet());

    expect(getUserDiscordStub).toHaveBeenCalledWith('any_id', 'any_id');
  });

  test('should call getBeast with correct id_beast', async () => {
    const { sut, helperDbStub } = makeSut();
    const getBeastStub = jest.spyOn(helperDbStub, 'getBeast');
    await sut.handle(makeBet());

    expect(getBeastStub).toHaveBeenCalledWith(1);
  });

  test('should return 400 if points is insufficient', async () => {
    const { sut, helperDbStub } = makeSut();
    jest.spyOn(helperDbStub, 'getUserDiscord').mockReturnValueOnce(
      new Promise((resolve) =>
        resolve({
          id: 'any_id',
          name: 'any_name',
          points: 9,
          id_guild: '123',
          id_discord: '312',
          email: 'any_email',
          password: 'hashed_password',
          avatar: 'any_avatar',
          created_at: new Date()
        })
      )
    );

    const httpResponse = await sut.handle(makeBet());

    expect(httpResponse).toEqual(badRequest('insufficient points', { userPoints: 9 }));
  });

  test('should return 400 if beast not found', async () => {
    const { sut, helperDbStub } = makeSut();
    jest
      .spyOn(helperDbStub, 'getBeast')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeBet());

    expect(httpResponse).toEqual(badRequest('beast not found'));
  });

  test('should return 400 if user not found', async () => {
    const { sut, helperDbStub } = makeSut();
    jest
      .spyOn(helperDbStub, 'getUserDiscord')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeBet());

    expect(httpResponse).toEqual(badRequest('user not found'));
  });
});
