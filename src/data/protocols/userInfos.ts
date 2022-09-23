import { UserModel, BetModel } from '../../domain/models';

export interface UserInfos {
  getAllInfos(id: string): Promise<UserModel | null>;
  getLastBets(
    id_guild: string,
    id_discord: string,
    max: number
  ): Promise<BetModel[] | []>;
}
