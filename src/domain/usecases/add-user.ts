import { UserModel } from '../models/user';

export interface AddUserModel extends UserDiscordModel, UserEmailModel {
  name: string;
  avatar: string;
}

export interface UserDiscordModel {
  id_guild?: number;
  id_discord?: number;
}

export interface UserEmailModel {
  email?: string;
  password?: string;
}

export interface AddUser {
  add(user: AddUserModel): Promise<UserModel>;
}
