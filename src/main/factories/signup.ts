import SignUpController from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator';
import { AddUserDb } from '../../data/usecases';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { SaveUserPrismaRepository, prisma } from '../../infra/db/prisma';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/logsError';
import { LogErrorPrismaRepository } from '../../infra/db/prisma/logError';
import { PrismaHelper } from '../../infra/db/prisma/utils/helper';

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(12);
  const saveUserPrismaRepository = new SaveUserPrismaRepository(prisma);
  const helperDb = new PrismaHelper();
  const addUser = new AddUserDb(bcryptAdapter, saveUserPrismaRepository);
  const signUpController = new SignUpController(emailValidatorAdapter, addUser, helperDb);
  const logErrorPrismaRepository = new LogErrorPrismaRepository(prisma);
  return new LogControllerDecorator(signUpController, logErrorPrismaRepository);
};
