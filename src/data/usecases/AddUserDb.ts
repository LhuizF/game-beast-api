import { AddUser, AddUserModel } from '../../domain/usecases/add-user';
import { UserModel } from '../../domain/models/user';
import { Encrypter, SaveUserRepository } from '../protocols';
import { HelperDb } from '../protocols/helperDb';

export class AddUserDb implements AddUser {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly saveUserRepository: SaveUserRepository,
    private readonly helperDb: HelperDb
  ) {}

  async add(userDate: AddUserModel): Promise<UserModel> {
    if (userDate.email && userDate.password) {
      userDate.password = await this.encrypter.encrypt(userDate.password);
    }

    if (userDate.id_guild) {
      await this.helperDb.verifyGuild(userDate.id_guild);
    }

    const user = await this.saveUserRepository.save(userDate);
    return user;
  }
}
