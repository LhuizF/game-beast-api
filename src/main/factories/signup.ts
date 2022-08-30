import SignUpController from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator';
import { AddUserDb } from '../../data/usecases/addUserDb';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { SaveUserPrismaRepository, prisma } from '../../infra/db/prisma';

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(12);
  const saveUserPrismaRepository = new SaveUserPrismaRepository(prisma);
  const addUser = new AddUserDb(bcryptAdapter, saveUserPrismaRepository);
  return new SignUpController(emailValidatorAdapter, addUser);
};
