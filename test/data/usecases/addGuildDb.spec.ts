import { AddGuildDb } from '../../../src/data/usecases/addGuildDb';
import { CreateGuildRepository } from '../../../src/data/protocols';
import { AddGuildModel } from '../../../src/domain/usecases/add-guild';
import { GuildModel } from '../../../src/domain/models';

interface SutTypes {
  sut: AddGuildDb;
  createGuildRepository: CreateGuildRepository;
}

jest.useFakeTimers().setSystemTime(new Date());

const makeSut = (): SutTypes => {
  class CreateGuildRepositoryStub implements CreateGuildRepository {
    save(GuildDate: AddGuildModel): Promise<GuildModel> {
      const fakeGuild: GuildModel = {
        id: '1',
        channel: '1',
        name: 'any_name',
        icon: 'any_icon',
        role: 'any_role',
        created_at: new Date(),
        active: true
      };
      return new Promise((resolve) => resolve(fakeGuild));
    }
  }

  const createGuildRepository = new CreateGuildRepositoryStub();
  const sut = new AddGuildDb(createGuildRepository);
  return { sut, createGuildRepository };
};

describe('CreateGuild Usecase', () => {
  test('Should call createGuildRepository with correct values', async () => {
    const { sut, createGuildRepository } = makeSut();
    const saveSpy = jest.spyOn(createGuildRepository, 'save');

    await sut.add({
      id: '1',
      channel: '1',
      name: 'any_name',
      icon: 'any_icon',
      role: 'any_role'
    });

    expect(saveSpy).toHaveBeenCalledWith({
      id: '1',
      channel: '1',
      name: 'any_name',
      icon: 'any_icon',
      role: 'any_role'
    });
  });

  test('should throw if CreateGuildRepository throw', async () => {
    const { sut, createGuildRepository } = makeSut();
    jest
      .spyOn(createGuildRepository, 'save')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const fakeGuild = {
      id: '1',
      channel: '1',
      name: 'any_name',
      icon: 'any_icon',
      role: 'any_role'
    };

    const promise = sut.add(fakeGuild);

    await expect(promise).rejects.toThrow();
  });

  test('should return an guild on success', async () => {
    const { sut } = makeSut();

    const fakeGuild = {
      id: '1',
      channel: '1',
      name: 'any_name',
      icon: 'any_icon',
      role: 'any_role'
    };

    const guild = await sut.add(fakeGuild);

    expect(guild).toEqual({
      id: '1',
      channel: '1',
      name: 'any_name',
      icon: 'any_icon',
      role: 'any_role',
      created_at: new Date(Date.now()),
      active: true
    });
  });
});
