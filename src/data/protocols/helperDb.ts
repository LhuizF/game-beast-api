import { UserModel } from '../../domain/models/user';

export interface HelperDb {
  verifyGuild(id: number): Promise<void>;
  verifyUser(id: string): Promise<UserModel>;
  verifyBeast(id: number): Promise<void>;
}
