import CreateBetController from '../../../src/presentation/controllers/bet/createBet';
import { MissingParamError, ServerError } from '../../../src/presentation/erros';
import { badRequest, ok } from '../../../src/presentation/helpers';
import { PlayBetModel, PlaceBet } from '../../../src/domain/usecases/place-bet';
import { Bet } from '../../../src/domain/models/Bet';

interface SutTypes {
  sut: CreateBetController;
  placeBetStub: PlaceBet;
}

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = (): SutTypes => {
  class PlaceBetStub implements PlaceBet {
    play(bet: PlayBetModel): Promise<Bet> {
      return new Promise((resolve) =>
        resolve({
          id: 1,
          id_user: 'any_id',
          id_beast: 1,
          game_time: 1,
          status: 'pending',
          platform: 'discord',
          points: 10,
          created_at: new Date()
        })
      );
    }
  }

  const placeBetStub = new PlaceBetStub();
  const sut = new CreateBetController(placeBetStub);
  return { sut, placeBetStub };
};

const makeBet = () => {
  return {
    body: {
      id_user: 1,
      id_beast: 1,
      points: 10,
      platform: 'any_platform'
    }
  };
};

describe('CreateBet Controller', () => {
  test('should return 400 if no id_user is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_beast: 1,
        points: 10,
        platform: 'any_platform'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('id_user')));
  });

  test('should return 400 if no id_beast is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_user: 1,
        points: 10,
        platform: 'any_platform'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('id_beast')));
  });

  test('should return 400 if no points is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_user: 1,
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
      body: {
        id_user: 1,
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
      id_user: 1,
      id_beast: 1,
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
        game_time: 1,
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
});
