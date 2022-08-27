import { SaveUserRepository } from '../../../data/protocols/saveUserRepository';
import { UserModel } from '../../../domain/models/user';
import { AddUserModel } from '../../../domain/usecases/add-user';
import { PrismaHelper } from './helpers';

export class SaveUserPrismaRepository implements SaveUserRepository {
  async save(userDate: AddUserModel): Promise<UserModel> {
    const newUser = await PrismaHelper.client.user.create({
      data: userDate
    });

    return newUser;
  }
}
