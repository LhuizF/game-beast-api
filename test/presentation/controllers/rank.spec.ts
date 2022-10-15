import { HelperDb } from '../../../src/data/protocols/helperDb';
import { RankController } from '../../../src/presentation/controllers/rank';
import { badRequest, ok } from '../../../src/presentation/helpers';
import { HelperDbStub } from '../../helper';

interface SutTypes {
  sut: RankController;
  helperDbStub: HelperDb;
}

const makeSut = (): SutTypes => {
  const helperDbStub = new HelperDbStub();

  const sut = new RankController(helperDbStub);
  return { sut, helperDbStub };
};

describe('Rank Controller', () => {
  test('should call getRank with correct value', async () => {
    const { sut, helperDbStub } = makeSut();

    const getRankSpy = jest.spyOn(helperDbStub, 'getRank');

    await sut.handle({ query: { server: '10' } });

    expect(getRankSpy).toHaveBeenCalledWith('10');
  });

  test('should call getRank with null if server no provided', async () => {
    const { sut, helperDbStub } = makeSut();

    const getRankSpy = jest.spyOn(helperDbStub, 'getRank');

    await sut.handle({});

    expect(getRankSpy).toHaveBeenCalledWith(undefined);
  });

  test('should return 200', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response).toEqual(
      ok([
        {
          id: 'any_id',
          name: 'any_name',
          points: 100,
          id_guild: '123',
          id_discord: '312',
          email: 'any_email',
          password: 'hashed_password',
          avatar: 'any_avatar',
          created_at: new Date()
        }
      ])
    );
  });
});
