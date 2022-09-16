import { UserModel, BetModel } from '../../domain/models';

export interface UserInfos {
  getAllInfos(id: string): Promise<UserModel | null>;
  getLastThreeBets(id: string): Promise<BetModel[] | []>;
}
