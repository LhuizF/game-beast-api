import SignUpController from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator';
import { AddUserDb } from '../../data/usecases/addUserDb';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { SaveUserPrismaRepository, prisma } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../Decorator/logsError';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(12);
  const saveUserPrismaRepository = new SaveUserPrismaRepository(prisma);
  const addUser = new AddUserDb(bcryptAdapter, saveUserPrismaRepository);
  const signUpController = new SignUpController(emailValidatorAdapter, addUser);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);
  return new LogControllerDecorator(signUpController, logErrorPrismaRepository);
};
