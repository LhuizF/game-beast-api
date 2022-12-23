import SignUpController from '../../../src/presentation/controllers/signup/signup';
import { ServerError } from '../../../src/presentation/erros';
import {
  EmailValidator,
  AddUser,
  AddUserModel,
  UserModel
} from '../../../src/presentation/controllers/signup/signup-protocols';
import { badRequest } from '../../../src/presentation/helpers';
import { HelperDb } from '../../../src/data/protocols';
import { HelperDbStub } from '../../helper';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addUserStub: AddUser;
  helperDbStub: HelperDb;
}

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  class AddUserStub implements AddUser {
    async add(user: AddUserModel): Promise<UserModel> {
      const fakeUser = {
        id: 'valid_id',
        name: 'valid_name',
        points: 100,
        id_guild: '123',
        id_discord: '312',
        avatar: 'valid_avatar',
        email: 'valid_email',
        password: 'valid_password',
        created_at: new Date()
      };

      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  const helperDbStub = new HelperDbStub();
  const addUserStub = new AddUserStub();
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub, addUserStub, helperDbStub);
  return {
    sut,
    emailValidatorStub,
    addUserStub,
    helperDbStub
  };
};

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_guild: 123,
        id_discord: 312
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest('name is required'));
  });

  test('should return 400 if no id_guild or email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest('id_guild or email is required'));
  });

  test('should return 400 if id_guild is provided and id_discord no provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        id_guild: '123'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('id_discord is required'));
  });

  test('should return 400 if email is provided and password no provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password_confirmation: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('password is required'));
  });

  test('should return 400 if email is provided and password_confirmation no provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('password_confirmation is required'));
  });

  test('should return 400 if Password confirmation does not match password', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        password_confirmation: 'other_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('password_confirmation not valid'));
  });

  test('should return 400 if invalide email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest('email not valid'));
  });

  test('should call emailValidator with correct email ', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email');
  });

  test('should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError('any'));
  });

  test('should call addUser with correct values if id_guild is provided', async () => {
    const { sut, addUserStub } = makeSut();
    const addSpy = jest.spyOn(addUserStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        id_guild: '123',
        id_discord: '312',
        avatar: 'any_url_avatar'
      }
    };

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'any_name',
        id_guild: '123',
        id_discord: '312',
        avatar: 'any_url_avatar'
      })
    );
  });

  test('should call addUser with correct values if email is provided', async () => {
    const { sut, addUserStub } = makeSut();
    const addSpy = jest.spyOn(addUserStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password',
        avatar: 'any_url_avatar'
      }
    };

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'any_name',
        email: 'email@email.com',
        password: 'any_password',
        avatar: 'any_url_avatar'
      })
    );
  });

  test('should return 500 if addUser throws', async () => {
    const { sut, addUserStub } = makeSut();
    jest.spyOn(addUserStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError('any'));
  });

  test('should return 200 if valid data is provided with id_guild', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        id_guild: '123',
        id_discord: '312',
        avatar: 'any_url_avatar'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      points: 100,
      id_guild: '123',
      id_discord: '312',
      email: 'valid_email',
      password: 'valid_password',
      avatar: 'valid_avatar',
      created_at: new Date()
    });
  });

  test('should return 200 if valid data is provided with email', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password',
        avatar: 'any_url_avatar'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      points: 100,
      id_guild: '123',
      id_discord: '312',
      email: 'valid_email',
      password: 'valid_password',
      avatar: 'valid_avatar',
      created_at: new Date()
    });
  });

  test('should call getGuild with correct id_guild ', async () => {
    const { sut, helperDbStub } = makeSut();
    const getBeastSpy = jest.spyOn(helperDbStub, 'getGuild');

    const httpRequest = {
      body: {
        name: 'any_name',
        id_guild: '123',
        id_discord: '312'
      }
    };

    await sut.handle(httpRequest);

    expect(getBeastSpy).toHaveBeenCalledWith('123');
  });

  test('should return 400 if guild not found', async () => {
    const { sut, helperDbStub } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        id_guild: '123',
        id_discord: '312'
      }
    };

    jest
      .spyOn(helperDbStub, 'getGuild')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest('guild not found'));
  });
});
