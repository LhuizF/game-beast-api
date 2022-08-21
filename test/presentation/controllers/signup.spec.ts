import SignUpController from '../../../src/presentation/controllers/signup/signup';
import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from '../../../src/presentation/erros';
import {
  EmailValidator,
  AddUser,
  AddUserModel,
  UserModel
} from '../../../src/presentation/controllers/signup/signup-protocols';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addUserStub: AddUser;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  class AddUserStub implements AddUser {
    add(user: AddUserModel): UserModel {
      const fakeUser = {
        id: 'valid_id',
        name: 'valid_name',
        id_guild: 'valid_id_guild',
        id_discord: 'valid_id_discord',
        avatar: 'valid_avatar'
      };

      return fakeUser;
    }
  }
  const addUserStub = new AddUserStub();
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub, addUserStub);
  return {
    sut,
    emailValidatorStub,
    addUserStub
  };
};

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id_guild: 'any_id_guild',
        id_discord: 'any_id_discord'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('should return 400 if no id_guild or email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('id_guild or email'));
  });

  test('should return 400 if id_guild is provided and id_discord no provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        id_guild: 'any_id_guild'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('id_discord'));
  });

  test('should return 400 if email is provided and password no provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password_confirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 400 if email is provided and password_confirmation no provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password_confirmation'));
  });

  test('should return 400 if Password confirmation does not match password', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        password_confirmation: 'other_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('password_confirmation'));
  });

  test('should return 400 if invalide email is provided', () => {
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

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('should call emailValidator with correct email ', () => {
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

    sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email');
  });

  test('should return 500 if emailValidator throws', () => {
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

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('should call addUser with correct values if id_guild is provided', () => {
    const { sut, addUserStub } = makeSut();
    const addSpy = jest.spyOn(addUserStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        id_guild: 'any_id_guild',
        id_discord: 'any_id_discord',
        avatar: 'any_url_avatar'
      }
    };

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'any_name',
        id_guild: 'any_id_guild',
        id_discord: 'any_id_discord',
        avatar: 'any_url_avatar'
      })
    );
  });

  test('should call addUser with correct values if email is provided', () => {
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

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'any_name',
        email: 'email@email.com',
        password: 'any_password',
        avatar: 'any_url_avatar'
      })
    );
  });

  test('should return 500 if addUser throws', () => {
    const { sut, addUserStub } = makeSut();
    jest.spyOn(addUserStub, 'add').mockImplementationOnce(() => {
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

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
