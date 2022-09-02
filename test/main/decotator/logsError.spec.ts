import { LogErrorRepository } from '../../../src/data/protocols/logErrorRepository';
import { LogControllerDecorator } from '../../../src/main/Decorator/logsError';
import { serverError } from '../../../src/presentation/helpers';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../../src/presentation/protocols';

const makeSut = () => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const HttpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          any: 'any'
        }
      };

      return new Promise((resolve) => resolve(HttpResponse));
    }
  }

  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  const logErrorRepositoryStub = new LogErrorRepositoryStub();

  const controllerStub = new ControllerStub();

  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  };
};

describe('LogControllerDecorator', () => {
  test('Call logs controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const request = {
      body: {
        name: 'any',
        id_guild: 'any',
        id_discord: 'any'
      }
    };

    await sut.handle(request);

    expect(handleSpy).toHaveBeenCalledWith(request);
  });

  test('Return result of the controller', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: 'any',
        id_guild: 'any',
        id_discord: 'any'
      }
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 200,
      body: {
        any: 'any'
      }
    });
  });

  test('Call logErrorRepository', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeError = new Error();
    fakeError.stack = 'any_error';
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(serverError(fakeError))));

    const request = {
      body: {
        name: 'any',
        id_guild: 'any',
        id_discord: 'any'
      }
    };

    const response = await sut.handle(request);

    expect(logSpy).toHaveBeenCalledWith('any_error');
  });
});
