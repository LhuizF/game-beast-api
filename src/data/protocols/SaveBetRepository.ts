import { Bet } from '../../domain/models/bet';

export interface BetModel {
  id_user: number;
  id_beast: number;
  points: number;
  platform: string;
  game_time: number;
}

export interface SaveBetRepository {
  save(userDate: BetModel): Promise<Bet>;
}
