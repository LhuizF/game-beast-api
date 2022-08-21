import { UserModel } from '../models/user';

export type AddUserModel = UserDiscordModel | UserEmailModel;

export interface UserDiscordModel {
  name: string;
  id_guild: string;
  id_discord: string;
  avatar?: string;
}

export interface UserEmailModel {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AddUser {
  add(user: AddUserModel): UserModel;
}
