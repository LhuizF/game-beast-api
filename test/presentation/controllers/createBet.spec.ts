import CreateBetController from '../../../src/presentation/controllers/bet/createBet';
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../../src/presentation/erros';
import { badRequest, ok } from '../../../src/presentation/helpers';
import { PlayBetModel, PlaceBet } from '../../../src/domain/usecases/place-bet';
import { BetModel } from '../../../src/domain/models/Bet';
import { HelperDb } from '../../../src/data/protocols/helperDb';
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
    params: {
      guild_id: 'any_id',
      id_discord: 'any_id'
    },
    body: {
      id_beast: 1,
      points: 10,
      platform: 'any_platform'
    }
  };
};

describe('CreateBet Controller', () => {
  test('should return 400 if no id_beast is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      params: {
        guild_id: 'any_id',
        id_discord: 'any_id'
      },
      body: {
        points: 10,
        platform: 'any_platform'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('id_beast')));
  });

  test('should return 500 if no current game', async () => {
    const { sut, helperDbStub } = makeSut();

    jest
      .spyOn(helperDbStub, 'getCurrentGameId')
      .mockResolvedValueOnce(new Promise((resolve) => resolve(0)));

    const httpResponse = await sut.handle(makeBet());
    expect(httpResponse).toEqual(badRequest(new ServerError('id_game')));
  });

  test('should return 400 if no points is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      params: {
        guild_id: 'any_id',
        id_discord: 'any_id'
      },
      body: {
        id_beast: 1,
        points: 0,
        platform: 'any_platform'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('points')));
  });

  test('should return 400 if no platform is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      params: {
        guild_id: 'any_id',
        id_discord: 'any_id'
      },
      body: {
        id_beast: 1,
        points: 10
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('platform')));
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
    const { sut } = makeSut();

    const bet = await sut.handle(makeBet());

    expect(bet).toEqual(
      ok({
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

  test('should call getUserDiscord with correct guild_id and id_discord', async () => {
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

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('insufficient points'))
    );
  });

  test('should return 400 if beast not found', async () => {
    const { sut, helperDbStub } = makeSut();
    jest
      .spyOn(helperDbStub, 'getBeast')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeBet());

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('beast not found')));
  });

  test('should return 400 if user not found', async () => {
    const { sut, helperDbStub } = makeSut();
    jest
      .spyOn(helperDbStub, 'getUserDiscord')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeBet());

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('user not found')));
  });
});
