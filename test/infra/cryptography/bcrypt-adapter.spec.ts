import bcrypt from 'bcrypt';
import { BcryptAdapter } from '../../../src/infra/cryptography/bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  }
}));

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash');
  });

  // test('Should throw if Bcrypt throw', async () => {
  //   const salt = 12;
  //   const sut = new BcryptAdapter(salt);
  //   jest
  //     .spyOn(bcrypt, 'hash')
  //     .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
  //   const promise = sut.encrypt('any_value');

  //   await expect(promise).rejects.toThrow();
  // });
});
