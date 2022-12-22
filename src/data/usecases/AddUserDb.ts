import {
  AddUser,
  AddUserModel,
  UserModelWithRoleId
} from '../../domain/usecases/add-user';

import { Encrypter, SaveUserRepository } from '../protocols';

export class AddUserDb implements AddUser {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly saveUserRepository: SaveUserRepository
  ) {}

  async add(userDate: AddUserModel): Promise<UserModelWithRoleId> {
    if (userDate.email && userDate.password) {
      userDate.password = await this.encrypter.encrypt(userDate.password);
    }

    const user = await this.saveUserRepository.save(userDate);
    return user;
  }
}
