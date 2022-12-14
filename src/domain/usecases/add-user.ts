import { UserModel } from '../models';

export interface AddUserModel extends UserDiscordModel, UserEmailModel {
  name: string;
  avatar: string;
}

export interface UserDiscordModel {
  id_guild?: string;
  id_discord?: string;
}

export interface UserEmailModel {
  email?: string;
  password?: string;
}

export interface UserModelWithRoleId extends UserModel {
  roleId?: string;
}

export interface AddUser {
  add(user: AddUserModel): Promise<UserModelWithRoleId>;
}
