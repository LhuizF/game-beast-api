import { CreateGuildPrismaRepository } from '../../../../src/infra/db/prisma/saveGuild';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = () => {
  const mock = mockDeep<PrismaClient>();
  const prismaMock: DeepMockProxy<PrismaClient> =
    mock as unknown as DeepMockProxy<PrismaClient>;
  const sut = new CreateGuildPrismaRepository(prismaMock);

  return {
    sut,
    prismaMock
  };
};

describe('CreateGuildPrismaRepository', () => {
  test('Save guild db', async () => {
    const { sut, prismaMock } = makeSut();

    const guild = {
      id: '1',
      channel: '1',
      name: 'any_name',
      icon: 'any_icon',
      created_at: new Date(Date.now())
    };

    prismaMock.guild.create.mockResolvedValue(guild);

    const newGuild = await sut.save({
      id: '1',
      channel: '1',
      name: 'any_name',
      icon: 'any_icon'
    });

    expect(newGuild).toEqual({
      id: '1',
      channel: '1',
      name: 'any_name',
      icon: 'any_icon',
      created_at: new Date(Date.now())
    });
  });
});
