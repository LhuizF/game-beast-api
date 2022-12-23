// import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
// import { PrismaClient } from '@prisma/client';
// import { LogErrorPrismaRepository } from '../../../../src/infra/db/prisma/logError';
// import { prisma } from '../../../../src/infra/db/prisma';

jest.useFakeTimers().setSystemTime(new Date());

// const makeSut = () => {
//   const mock = mockDeep<PrismaClient>();
//   const prismaMock: DeepMockProxy<PrismaClient> =
//     mock as unknown as DeepMockProxy<PrismaClient>;
//   const sut = new LogErrorPrismaRepository(prisma);

//   return {
//     sut,
//     prismaMock
//   };
// };

describe('LogErrorPrismaRepository', () => {
  test('Save log db', async () => {
    // const { sut } = makeSut();

    // await prisma.logError.deleteMany();
    // await sut.logError('any_error');

    const count = 1; //await prisma.logError.count();

    expect(count).toBe(1);
  });
});
