import { SaveUserPrismaRepository } from '../../../../src/infra/db/prisma/saveUser';

describe('SaveUserPrismaRepository prisma', () => {
  test('Save user db', async () => {
    // const inMemoryLessonsRepository = new newinMemoryLessonsRepository();
    const sut = new SaveUserPrismaRepository();
    const user = await sut.save({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    });

    expect(user.id).toBeTruthy();
    expect(user.name).toBe('any_name');
    expect(user.email).toBe('any_email');
    expect(user.password).toBe('any_password');
  });
});
