import { SaveUserRepository } from '../../../data/protocols/saveUserRepository';
import { UserModel } from '../../../domain/models/user';
import { AddUserModel } from '../../../domain/usecases/add-user';
import { PrismaClient } from '@prisma/client';

export class SaveUserPrismaRepository implements SaveUserRepository {
  constructor(private readonly cxt: PrismaClient) {}

  async save(userDate: AddUserModel): Promise<UserModel> {
    const newUser = await this.cxt.user.create({
      data: userDate
    });

    return newUser;
  }
}
