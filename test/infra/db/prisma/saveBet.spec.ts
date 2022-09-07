import { SaveBetPrismaRepository } from '../../../../src/infra/db/prisma/SaveBet';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Bet, PrismaClient } from '@prisma/client';
import { BetModel } from '../../../../src/data/protocols/SaveBetRepository';

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = () => {
  const mock = mockDeep<PrismaClient>();
  const prismaMock: DeepMockProxy<PrismaClient> =
    mock as unknown as DeepMockProxy<PrismaClient>;
  const sut = new SaveBetPrismaRepository(prismaMock);

  return {
    sut,
    prismaMock
  };
};

describe('SaveBetPrismaRepository', () => {
  test('Save bet db', async () => {
    const { sut, prismaMock } = makeSut();

    const betModel: BetModel = {
      points: 10,
      game_time: 1,
      id_beast: 1,
      id_user: 'any_id',
      platform: 'any'
    };

    const bet: Bet = {
      points: 10,
      game_time: 1,
      id_beast: 1,
      id_user: 'any_id',
      platform: 'any',
      created_at: new Date(),
      id: 1,
      status: 'any'
    };

    prismaMock.bet.create.mockResolvedValue(bet);

    const newBet = await sut.save(betModel);

    expect(newBet).toEqual(bet);
  });
});
