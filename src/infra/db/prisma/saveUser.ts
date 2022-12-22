import { SaveUserRepository } from '../../../data/protocols/saveUserRepository';
import { AddUserModel, UserModelWithRoleId } from '../../../domain/usecases/add-user';
import { PrismaClient } from '@prisma/client';

export class SaveUserPrismaRepository implements SaveUserRepository {
  constructor(private readonly cxt: PrismaClient) {}

  async save(userDate: AddUserModel): Promise<UserModelWithRoleId> {
    const newUser = await this.cxt.user.create({
      data: userDate
    });

    const userGuild = await this.cxt.user.findUnique({
      where: { id: newUser.id },
      include: { Guild: true }
    });

    return {
      ...newUser,
      roleId: userGuild?.Guild?.role
    };
  }
}
