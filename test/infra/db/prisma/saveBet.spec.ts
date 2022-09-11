import { SaveBetPrismaRepository } from '../../../../src/infra/db/prisma/saveBet';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Bet } from '../../../../src/data/protocols/saveBetRepository';
import { BetModel } from '../../../../src/domain/models';

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

    const bet: Bet = {
      points: 10,
      id_game: 1,
      id_beast: 1,
      id_user: 'any_id',
      platform: 'any'
    };

    const betModel: BetModel = {
      points: 10,
      id_game: 1,
      id_beast: 1,
      id_user: 'any_id',
      platform: 'any',
      created_at: new Date(),
      id: 1,
      status: 'any'
    };

    prismaMock.bet.create.mockResolvedValue(betModel);

    const newBet = await sut.save(bet);

    expect(newBet).toEqual(betModel);
  });
});
