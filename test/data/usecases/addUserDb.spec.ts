import { AddUserDb } from '../../../src/data/usecases/addUserDb';
import { Encrypter, SaveUserRepository } from '../../../src/data/protocols';
import { AddUserModel } from '../../../src/domain/usecases/add-user';
import { UserModel } from '../../../src/domain/models/user';

interface SutTypes {
  sut: AddUserDb;
  encrypterStub: Encrypter;
  saveUserRepositoryStub: SaveUserRepository;
}

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'));
    }
  }

  class SaveUserRepositoryStub implements SaveUserRepository {
    save(userDate: AddUserModel): Promise<UserModel> {
      const fakeUser = {
        id: 'any_id',
        name: 'any_name',
        id_guild: 123,
        id_discord: 312,
        email: 'any_email',
        password: 'hashed_password',
        avatar: 'any_avatar',
        created_at: new Date()
      };
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  const saveUserRepositoryStub = new SaveUserRepositoryStub();
  const encrypterStub = new EncrypterStub();
  const sut = new AddUserDb(encrypterStub, saveUserRepositoryStub);
  return {
    sut,
    encrypterStub,
    saveUserRepositoryStub
  };
};

describe('AddUser Usecase', () => {
  test('should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const fakeUser = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      avatar: 'any_avatar'
    };

    await sut.add(fakeUser);

    expect(encryptSpy).toHaveBeenCalledWith('any_password');
  });

  test('should throw if encrypter throw', async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const fakeUser = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      avatar: 'any_avatar'
    };

    const promise = sut.add(fakeUser);

    await expect(promise).rejects.toThrow();
  });

  test('Should call SaveUserRepository with correct values when email', async () => {
    const { sut, saveUserRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveUserRepositoryStub, 'save');

    const fakeUser = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      avatar: 'any_avatar'
    };

    await sut.add(fakeUser);

    expect(saveSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password',
      avatar: 'any_avatar'
    });
  });

  test('Should call SaveUserRepository with correct values when id_guild', async () => {
    const { sut, saveUserRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveUserRepositoryStub, 'save');

    const fakeUser = {
      name: 'any_name',
      id_guild: 123,
      id_discord: 312,
      avatar: 'any_avatar'
    };

    await sut.add(fakeUser);

    expect(saveSpy).toHaveBeenCalledWith({
      name: 'any_name',
      id_guild: 123,
      id_discord: 312,
      avatar: 'any_avatar'
    });
  });

  test('should not call encryption if id_guild is provided ', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const fakeUser = {
      name: 'any_name',
      id_guild: 123,
      id_discord: 312,
      avatar: 'any_avatar'
    };

    await sut.add(fakeUser);

    expect(encryptSpy).not.toHaveBeenCalled();
  });

  test('should throw if SaveUserRepository throw', async () => {
    const { sut, saveUserRepositoryStub } = makeSut();
    jest
      .spyOn(saveUserRepositoryStub, 'save')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const fakeUser = {
      name: 'any_name',
      id_guild: 123,
      id_discord: 312,
      avatar: 'any_avatar'
    };

    const promise = sut.add(fakeUser);

    await expect(promise).rejects.toThrow();
  });

  test('should return an user on success', async () => {
    const { sut } = makeSut();

    const fakeUser = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      avatar: 'any_avatar'
    };

    const user = await sut.add(fakeUser);

    expect(user).toEqual({
      id: 'any_id',
      name: 'any_name',
      id_guild: 123,
      id_discord: 312,
      email: 'any_email',
      password: 'hashed_password',
      avatar: 'any_avatar',
      created_at: new Date(Date.now())
    });
  });
});
