import { UserModel } from '../../domain/models/user';
import { AddUserModel } from '../../domain/usecases/add-user';

export interface SaveUserRepository {
  save(userDate: AddUserModel): Promise<UserModel>;
}
