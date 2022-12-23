import DisableGuildController from '../../../src/presentation/controllers/guild/disableGuild';
import { DisableGuild } from '../../../src/data/protocols';
import { GuildModel } from '../../../src/domain/models';
import { badRequest, ok, serverError } from '../../../src/presentation/helpers';

jest.useFakeTimers().setSystemTime(new Date());

interface SutTypes {
  sut: DisableGuildController;
  disableGuild: DisableGuild;
}

const makeSut = (): SutTypes => {
  class DisableGuildStub implements DisableGuild {
    disable(guildId: string): Promise<GuildModel> {
      return new Promise((resolve) =>
        resolve({
          id: 'any_id',
          name: 'guild',
          channel: '2112',
          created_at: new Date(),
          icon: 'any',
          role: 'any_role',
          active: false
        })
      );
    }
  }

  const disableGuild = new DisableGuildStub();
  const sut = new DisableGuildController(disableGuild);

  return { sut, disableGuild };
};

describe('DisableGuild Controller', () => {
  test('should return 400 if guildId is not provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response).toEqual(badRequest('id_guild is required'));
  });

  test('should call disable with correct value', async () => {
    const { sut, disableGuild } = makeSut();

    const disableSpy = jest.spyOn(disableGuild, 'disable');

    await sut.handle({ params: { guild: 'any' } });

    expect(disableSpy).toHaveBeenCalledWith('any');
  });

  test('should return 200', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({ params: { guild: 'any' } });

    expect(response).toEqual(
      ok({
        id: 'any_id',
        name: 'guild',
        channel: '2112',
        role: 'any_role',
        created_at: new Date(),
        icon: 'any',
        active: false
      })
    );
  });

  test('should return 500 if getRank throws', async () => {
    const { sut, disableGuild } = makeSut();

    jest.spyOn(disableGuild, 'disable').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const response = await sut.handle({ params: { guild: 'any' } });

    expect(response).toEqual(serverError(''));
  });
});
