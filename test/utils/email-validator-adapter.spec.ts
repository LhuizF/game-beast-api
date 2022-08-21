import { EmailValidatorAdapter } from '../../src/utils/email-validator';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  test('Should return false if validator return false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalidEmail');
    expect(isValid).toBe(false);
  });

  test('Should return true if validator return true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('validEmail');
    expect(isValid).toBe(true);
  });
});
