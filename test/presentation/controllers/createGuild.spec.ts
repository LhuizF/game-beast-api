import CreateGuildController from '../../../src/presentation/controllers/guild/createGuild';
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../../src/presentation/erros';
import { AddGuild, AddGuildModel } from '../../../src/domain/usecases/add-guild';
import { GuildModel } from '../../../src/domain/models/guild';
import { badRequest } from '../../../src/presentation/helpers';

interface SutTypes {
  sut: CreateGuildController;
  addGuildStub: AddGuild;
}

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = (): SutTypes => {
  class AddGuildStub implements AddGuild {
    async add(guild: AddGuildModel): Promise<GuildModel> {
      const fakeUser: GuildModel = {
        id: 1,
        channel: 123,
        name: 'valid_name',
        icon: 'valid_icon',
        created_at: new Date()
      };

      return new Promise((resolve) => resolve(fakeUser));
    }
  }
  const addGuildStub = new AddGuildStub();
  const sut = new CreateGuildController(addGuildStub);
  return { sut, addGuildStub };
};

describe('CreateGuild Controller', () => {
  test('should return 400 if no id is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        channel: 123,
        name: 'any_name',
        icon: 'any_icon'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('id'));
  });

  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id: 1,
        channel: 123,
        icon: 'any_name'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('should return 400 if no channel no provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id: 1,
        name: 'any_name',
        icon: 'any_icon'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('channel'));
  });

  test('should call addGuild with correct values', async () => {
    const { sut, addGuildStub } = makeSut();
    const addSpy = jest.spyOn(addGuildStub, 'add');

    const httpRequest = {
      body: {
        id: 1,
        channel: 123,
        name: 'any_name',
        icon: 'any_icon'
      }
    };

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      id: 1,
      channel: 123,
      name: 'any_name',
      icon: 'any_icon'
    });
  });

  test('should return 500 if addUser throws', async () => {
    const { sut, addGuildStub } = makeSut();
    jest.spyOn(addGuildStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = {
      body: {
        id: 1,
        channel: 123,
        name: 'any_name',
        icon: 'any_icon'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError('null'));
  });

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id: 1,
        channel: 123,
        name: 'any_name',
        icon: 'any_icon'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 1,
      channel: 123,
      name: 'valid_name',
      icon: 'valid_icon',
      created_at: new Date()
    });
  });

  test('should return 400 if id not number', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id: 'any',
        channel: 123,
        name: 'any_name',
        icon: 'any_icon'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('id')));
  });

  test('should return 400 if channel not number', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        id: 1,
        channel: '123',
        name: 'any_name',
        icon: 'any_icon'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('channel')));
  });
});
