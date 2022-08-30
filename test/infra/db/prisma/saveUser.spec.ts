import { SaveUserPrismaRepository } from '../../../../src/infra/db/prisma/saveUser';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = () => {
  const mock = mockDeep<PrismaClient>();
  const prismaMock: DeepMockProxy<PrismaClient> =
    mock as unknown as DeepMockProxy<PrismaClient>;
  const sut = new SaveUserPrismaRepository(prismaMock);

  return {
    sut,
    prismaMock
  };
};

describe('SaveUserPrismaRepository prisma', () => {
  test('Save user db with email', async () => {
    const { sut, prismaMock } = makeSut();

    const user = {
      id: 'any_id',
      name: 'any_name',
      id_guild: null,
      id_discord: null,
      email: 'any_email',
      password: 'any_password',
      points: 100,
      avatar: 'any_url',
      created_at: new Date()
    };

    prismaMock.user.create.mockResolvedValue(user);

    const newUser = await sut.save({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      avatar: 'any_url'
    });

    expect(newUser).toEqual(
      expect.objectContaining({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        avatar: 'any_url',
        created_at: new Date(Date.now())
      })
    );
  });

  test('Save user db with id_guild', async () => {
    const { sut, prismaMock } = makeSut();

    const user = {
      id: 'any_id',
      name: 'any_name',
      id_guild: 123,
      id_discord: 312,
      email: null,
      password: null,
      points: 100,
      avatar: 'any_url',
      created_at: new Date()
    };

    prismaMock.user.create.mockResolvedValue(user);

    const newUser = await sut.save({
      name: 'any_name',
      id_guild: 123,
      id_discord: 312,
      avatar: 'any_url'
    });

    expect(newUser).toEqual(
      expect.objectContaining({
        id: 'any_id',
        name: 'any_name',
        id_guild: 123,
        id_discord: 312,
        avatar: 'any_url',
        points: 100,
        created_at: new Date(Date.now())
      })
    );
  });
});
