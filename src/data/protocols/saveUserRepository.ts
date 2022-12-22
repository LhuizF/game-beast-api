import { AddUserModel, UserModelWithRoleId } from '../../domain/usecases/add-user';

export interface SaveUserRepository {
  save(userDate: AddUserModel): Promise<UserModelWithRoleId>;
}
